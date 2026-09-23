import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import contacts from '../src/content/contacts.json' with {type: 'json'};

const out = path.resolve('out');
const prefix = (process.env.PAGES_BASE_PATH || '').replace(/\/$/, '');
const origin = 'https://export.invalid';
const pages = ['ru', 'kk', 'en'].flatMap(locale => ['', 'engineering/', 'equipment/', 'automation/', 'descase/', 'news/'].map(route => `${locale}/${route}`));
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
const cache = new Map();
async function read(file) {
  if (!cache.has(file)) cache.set(file, await fs.readFile(file, 'utf8'));
  return cache.get(file);
}
let checked = 0;
for (const route of pages) {
  const html = await read(path.join(out, route, 'index.html'));
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${route}: heading`);
  for (const email of [contacts.email, contacts.projectsEmail].filter(Boolean)) assert.ok(html.includes(`href="mailto:${email}"`), `${route}: ${email}`);
  if (contacts.phone) assert.ok(html.includes(`href="tel:${contacts.phone.replace(/[^+\d]/g, '')}"`), `${route}: phone`);
  if (!contacts.phone && !contacts.phoneAlt) assert.ok(!html.includes('href="tel:'), `${route}: no retired phones`);
  if (!contacts.whatsapp) assert.ok(!html.includes('https://wa.me/'), `${route}: no retired WhatsApp`);
  assert.ok(!/Тимирязев|Timiryazev|Бараева|Бараев 14|Baraeva|Айтеке би 153|Әйтеке би 153|Aiteke bi 153|77273132527|77073241009|77710616148/.test(html), `${route}: no retired contacts`);
  if (route.split('/').length === 2) {
    if (contacts.phoneAlt) assert.ok(html.includes(`href="tel:${contacts.phoneAlt.replace(/[^+\d]/g, '')}"`), `${route}: alternate phone`);
    if (contacts.whatsapp) assert.ok(html.includes(`href="${contacts.whatsapp}"`), `${route}: WhatsApp`);
    assert.ok(html.includes('A15M5X0'), `${route}: new Almaty address`);
    assert.ok(html.includes(`href="${contacts.instagram}"`), `${route}: Instagram`);
    assert.ok(!html.includes('id="solutions"') && !html.includes('id="products"'), `${route}: Des-Case stays separate`);
  }
  for (const match of html.matchAll(/<(a|img|script|link)\b[^>]*?\b(href|src)="([^"]+)"[^>]*>/g)) {
    const tag = match[1];
    if (tag === 'link' && !/rel="(?:stylesheet|preload|icon)"/.test(match[0])) continue;
    const url = new URL(decode(match[3]), `${origin}${prefix}/${route}`);
    if (url.origin !== origin) continue;
    assert.ok(url.pathname.startsWith(`${prefix}/`), `${route}: missing base path ${url.pathname}`);
    const relative = decodeURIComponent(url.pathname.slice(prefix.length));
    let file = path.resolve(out, `.${relative}`);
    assert.ok(file.startsWith(`${out}/`) || file === out);
    const stat = await fs.stat(file).catch(() => null);
    assert.ok(stat, `${route}: missing ${relative}`);
    if (stat.isDirectory()) file = path.join(file, 'index.html');
    await fs.access(file);
    if (tag === 'a' && url.hash) {
      const target = await read(file);
      assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route}: missing anchor ${url.href}`);
    }
    checked++;
  }
}
await fs.access(path.join(out, 'index.html'));
console.log(`PASS: ${pages.length} pages; ${checked} local links/assets; contact emails, phones, WhatsApp, anchors and Des-Case separation.`);
