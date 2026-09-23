import fs from 'node:fs/promises';
import path from 'node:path';

// This script operates only on the generated Next.js export, never source data.
const out = path.resolve('out');
await fs.access(path.join(out, 'ru/index.html'));
for (const locale of ['ru', 'kk', 'en']) {
  // The empty-news sentinel is a Next export workaround, not a real page.
  await fs.rm(path.join(out, locale, 'news/__empty__'), {recursive: true, force: true});
}
await fs.writeFile(path.join(out, 'index.html'), '<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=./ru/"><title>Get2Gear</title><body><a href="./ru/">Открыть Get2Gear</a></body></html>');
await fs.writeFile(path.join(out, '.nojekyll'), '');
console.log('Static export ready: root entry and empty-news cleanup.');
