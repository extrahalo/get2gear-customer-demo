// Run only from the trusted production source ref, with a narrowly scoped HMAC key.
// No customer content is logged, committed or uploaded as a CI artifact.
import assert from 'node:assert/strict';
import { createHash, createHmac, randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { applySnapshot, locales, validateSnapshot, verifyMedia } from './adapter.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const endpoint = process.env.JEL_PUBLISH_ENDPOINT;
const key = process.env.JEL_PUBLISH_KEY;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
assert.ok(endpoint?.startsWith('https://cms.get2gear.com/') || (process.env.JEL_WORKER_TEST === '1' && endpoint?.startsWith('http://127.0.0.1:')), 'Configured endpoint required');
assert.match(key ?? '', /^[a-f0-9]{64}$/);

async function request(payload, binary = false) {
  const body = JSON.stringify(payload);
  const time = String(Math.floor(Date.now() / 1000));
  const nonce = randomBytes(16).toString('hex');
  const signature = createHmac('sha256', key).update(`${time}\n${nonce}\n${sha(body)}`).digest('hex');
  const response = await fetch(endpoint, {method: 'POST', redirect: 'error', signal: AbortSignal.timeout(120000),
    headers: {'Content-Type': 'application/json', 'X-Jel-Time': time, 'X-Jel-Nonce': nonce, 'X-Jel-Signature': signature}, body});
  if (!response.ok) throw new Error(`Publisher request failed (${response.status}, action ${payload.action})`);
  return binary ? Buffer.from(await response.arrayBuffer()) : response.json();
}

async function run(args, cwd) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {cwd, env: {...process.env, GITHUB_ACTIONS: 'true',
      PAGES_BASE_PATH: '', NEXT_PUBLIC_BASE_PATH: '', NEXT_TELEMETRY_DISABLED: '1',
      // The build and dependencies must not inherit the publisher credential.
      JEL_PUBLISH_KEY: '', JEL_PUBLISH_ENDPOINT: ''}, stdio: ['ignore', 'pipe', 'pipe']});
    // Retain bounded build diagnostics locally; never publish snapshot/content logs.
    let log = '';
    const keep = chunk => { log = (log + chunk.toString()).slice(-150000); };
    child.stdout.on('data', keep); child.stderr.on('data', keep);
    child.on('error', reject);
    child.on('close', async code => {
      await fs.writeFile(path.join(cwd, 'build.log'), log, {mode: 0o600});
      if (code === 0) resolve(); else reject(new Error(`Build/check failed with exit code ${code}; source diagnostics retained privately`));
    });
  });
}

async function inspect(out, snapshot) {
  const escape = v => v.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  const routes = locales.flatMap(locale => ['', 'engineering', 'equipment', 'automation', 'descase', 'videos', 'news',
    ...snapshot.data.news.map(n => `news/${n.slug}`)].map(route => `${locale}/${route ? `${route}/` : ''}`));
  const sitemap = await fs.readFile(path.join(out, 'sitemap.xml'), 'utf8');
  for (const route of routes) {
    const html = await fs.readFile(path.join(out, route, 'index.html'), 'utf8');
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, 'One H1 per published page');
    assert.ok(html.includes(`<html lang="${route.split('/')[0]}"`));
    assert.ok(sitemap.includes(`<loc>https://get2gear.com/${route}</loc>`));
    for (const email of [snapshot.data.contacts?.email, snapshot.data.contacts?.projectsEmail].filter(Boolean)) assert.ok(html.includes(`mailto:${email}`));
    for (const match of html.matchAll(/<(a|img|script|link)\b[^>]*?\b(?:href|src)="([^"]+)"[^>]*>/g)) {
      if (match[1] === 'link' && !/rel="(?:stylesheet|preload|icon)"/.test(match[0])) continue;
      const url = new URL(match[2].replaceAll('&amp;', '&'), `https://get2gear.com/${route}`);
      if (url.origin !== 'https://get2gear.com') continue;
      const file = path.resolve(out, `.${decodeURIComponent(url.pathname)}`);
      assert.ok(file.startsWith(`${out}/`));
      const stat = await fs.stat(file);
      const target = stat.isDirectory() ? path.join(file, 'index.html') : file;
      await fs.access(target);
      if (match[1] === 'a' && url.hash) assert.ok((await fs.readFile(target, 'utf8')).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`));
    }
  }
  for (const locale of locales) {
    const html = await fs.readFile(path.join(out, locale, 'index.html'), 'utf8');
    assert.ok(html.includes(escape(snapshot.data.home[locale].title)));
    assert.equal((html.match(/class="video-index__link"/g) ?? []).length, 10);
  }
  for (const news of snapshot.data.news) for (const locale of locales) {
    assert.ok((await fs.readFile(path.join(out, locale, 'news', news.slug, 'index.html'), 'utf8')).includes(escape(news.copy[locale].title)));
  }
  assert.equal((sitemap.match(/<video:video>/g) ?? []).length, 30);
  return routes.length;
}

async function publish(job) {
  const identity = {id: job.id, lease: job.lease};
  assert.match(job.id, /^\d{8}T\d{6}-[a-f0-9]{12}$/);
  assert.equal(sha(job.snapshotJson), job.sha256);
  const snapshot = validateSnapshot(JSON.parse(job.snapshotJson));
  assert.equal(snapshot.id, job.id);
  const scratch = await fs.mkdtemp(path.join(process.env.RUNNER_TEMP || path.join(root, 'tmp'), 'jel-ci-'));
  const stage = path.join(scratch, 'site');
  await fs.mkdir(stage);
  let renewing = false; let leaseFailed = false;
  const timer = setInterval(async () => {
    if (renewing) return; renewing = true;
    try { await request({action: 'renew', ...identity}); } catch { leaseFailed = true; }
    finally { renewing = false; }
  }, 45000);
  try {
    for (const entry of ['src', 'public', 'messages', 'package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'postcss.config.mjs']) {
      await fs.cp(path.join(root, entry), path.join(stage, entry), {recursive: true});
    }
    await fs.symlink(path.join(root, 'node_modules'), path.join(stage, 'node_modules'), 'dir');
    for (const locale of locales) {
      const file = path.join(stage, 'messages', `${locale}.json`);
      await fs.writeFile(file, JSON.stringify(applySnapshot(JSON.parse(await fs.readFile(file, 'utf8')), snapshot, locale)));
    }
    await fs.writeFile(path.join(stage, 'src/content/news.json'), JSON.stringify(snapshot.data.news));
    if (snapshot.data.contacts) await fs.writeFile(path.join(stage, 'src/content/contacts.json'), JSON.stringify({projectsEmail: '', ...snapshot.data.contacts}));
    const images = path.join(stage, 'public/images/cms'); await fs.mkdir(images, {recursive: true});
    for (const name of job.media) {
      assert.match(name, /^[a-f0-9]{64}\.(png|jpg|webp)$/);
      const bytes = await request({action: 'media', ...identity, name}, true);
      verifyMedia(name, bytes); await fs.writeFile(path.join(images, name), bytes);
    }
    // Only small poster files are needed by the build. MP4s remain on PS.kz.
    const videoFiles = JSON.parse(await fs.readFile(path.join(root, 'cms/production/video-files.json'), 'utf8'));
    for (const record of videoFiles.filter(f => !f.path.endsWith('.mp4'))) {
      assert.match(record.path, /^videos\/[a-zA-Z0-9_/-]+\.(?:jpg|png|webp)$/);
      const response = await fetch(`https://get2gear.com/${record.path}`, {redirect: 'error', signal: AbortSignal.timeout(60000)});
      assert.equal(response.status, 200);
      const bytes = Buffer.from(await response.arrayBuffer()); assert.equal(sha(bytes), record.sha256);
      const file = path.join(stage, 'public', record.path); await fs.mkdir(path.dirname(file), {recursive: true}); await fs.writeFile(file, bytes);
    }
    await run([path.join(root, 'node_modules/next/dist/bin/next'), 'build', '--webpack'], stage);
    await run([path.join(root, 'scripts/finalize-static-export.mjs')], stage);
    const out = path.join(stage, 'out');
    const routeCount = await inspect(out, snapshot);
    const files = {};
    async function collect(directory) {
      for (const item of await fs.readdir(directory, {withFileTypes: true})) {
        const file = path.join(directory, item.name); const relative = path.relative(out, file).split(path.sep).join('/');
        if (relative === 'videos' || relative.startsWith('.') || relative === '.htaccess') continue;
        assert.ok(!item.isSymbolicLink(), 'Only static files may enter archive');
        if (item.isDirectory()) await collect(file);
        else {
          assert.match(relative, /\.(html|js|css|json|txt|xml|png|jpe?g|webp|svg|ico|woff2?|ttf)$/i);
          const bytes = await fs.readFile(file); files[relative] = {bytes: bytes.length, sha256: sha(bytes)};
        }
      }
    }
    await collect(out);
    const names = Object.keys(files).sort();
    const archive = path.join(scratch, 'release.zip');
    // Input paths are generated from a validated static tree; no shell is involved.
    execFileSync('zip', ['-q', archive, '-@'], {cwd: out, input: `${names.join('\n')}\n`, maxBuffer: 1024 * 1024});
    const bytes = await fs.readFile(archive);
    if (leaseFailed) throw new Error('Lease renewal failed; refusing deployment');
    await request({action: 'renew', ...identity});
    await request({action: 'prepare', ...identity, manifest: {files, bytes: bytes.length, sha256: sha(bytes)}});
    for (let offset = 0; offset < bytes.length; offset += 2 * 1024 * 1024) {
      const chunk = bytes.subarray(offset, offset + 2 * 1024 * 1024);
      const uploaded = await request({action: 'upload', ...identity, offset, data: chunk.toString('base64')});
      assert.equal(uploaded.offset, offset + chunk.length);
    }
    const activated = await request({action: 'finish', ...identity, commit: process.env.GITHUB_SHA || 'local-verification'});
    assert.equal(activated.activated, job.id);
    // Verify actual live HTML, not just callback success. IDs/logs contain no content.
    for (const locale of locales) {
      const expected = await fs.readFile(path.join(out, locale, 'index.html'));
      const response = await fetch(`https://get2gear.com/${locale}/?release=${job.id}`, {signal: AbortSignal.timeout(60000), redirect: 'error'});
      assert.equal(response.status, 200); assert.equal(sha(Buffer.from(await response.arrayBuffer())), sha(expected), 'Live HTML differs from release');
    }
    const published = await request({action: 'confirm', ...identity});
    assert.equal(published.published, job.id);
    console.log(`Published and verified ${job.id}: ${routeCount} routes.`);
  } catch (error) {
    try { await request({action: 'fail', ...identity}); } catch { /* Published/expired jobs cannot be overwritten. */ }
    throw error;
  } finally { clearInterval(timer); }
}

const jobFile = path.join(process.env.RUNNER_TEMP || path.join(root, 'tmp'), 'jel-publish-job.json');
if (process.argv.includes('--claim')) {
  const {job} = await request({action: 'claim'});
  if (job) await fs.writeFile(jobFile, JSON.stringify(job), {mode: 0o600});
  if (process.env.GITHUB_OUTPUT) await fs.appendFile(process.env.GITHUB_OUTPUT, `has_job=${job ? 'true' : 'false'}\n`);
  console.log(job ? 'Queued release claimed.' : 'No queued release.');
} else if (process.argv.includes('--run')) {
  await publish(JSON.parse(await fs.readFile(jobFile, 'utf8')));
} else if (process.argv.includes('--probe')) console.log(JSON.stringify(await request({action: 'probe'})));
else {
  if (process.argv.includes('--enqueue')) await request({action: 'enqueue'});
  const {job} = await request({action: 'claim'});
  if (!job) console.log('No queued release.');
  else await publish(job);
}
