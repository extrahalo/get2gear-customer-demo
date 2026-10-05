import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { applySnapshot, validateSnapshot, verifyMedia } from '../adapter.mjs';
import sections from '../scripts/sections.json' with { type: 'json' };
import services from '../scripts/services.json' with { type: 'json' };
import contacts from '../../src/content/contacts.json' with { type: 'json' };
import ru from '../../messages/ru.json' with { type: 'json' };

const fixture = () => ({ schema: 1, id: '20260919T120000-abcdef012345', data: {
  home: Object.fromEntries(['ru', 'kk', 'en'].map(locale => [locale, {title: `Title ${locale}`, lead: 'Body', eyebrow: 'Intro', imageAlt: 'Photo'}])),
  heroImage: null, brands: [{name: 'Brand', url: 'https://example.com', logo: null}], news: [],
}});
test('all three translations are independent; base and untouched sections are preserved', () => {
  const base = {home: {hero: {primary: 'Keep CTA'}, brands: {items: ['Old']}, videos: {status: 'Placeholder'}}};
  for (const locale of ['ru', 'kk', 'en']) {
    const result = applySnapshot(base, fixture(), locale);
    assert.equal(result.home.hero.title, `Title ${locale}`);
    assert.equal(result.home.hero.primary, 'Keep CTA');
    assert.equal(result.home.videos.status, 'Placeholder');
  }
  assert.deepEqual(base.home.brands.items, ['Old']);
});
test('missing translations fail rather than silently copying Russian', () => {
  const data = fixture(); delete data.data.home.kk.title;
  assert.throws(() => validateSnapshot(data));
});
test('unsafe links and image paths fail', () => {
  for (const url of ['javascript:alert(1)', 'http://example.com', 'https://user:secret@example.com']) {
    const data = fixture(); data.data.brands[0].url = url;
    assert.throws(() => validateSnapshot(data));
  }
  const data = fixture(); data.data.heroImage = '../../config/config.php';
  assert.throws(() => validateSnapshot(data));
});
test('content-addressed media cannot silently change', () => {
  const bytes = Buffer.from('test');
  const filename = createHash('sha256').update(bytes).digest('hex') + '.png';
  verifyMedia(filename, bytes);
  assert.throws(() => verifyMedia(filename, Buffer.from('changed')));
});
test('section fields map only to approved text paths and retain arrays/structure', () => {
  const snapshot = fixture();
  snapshot.data.sections = Object.fromEntries(Object.entries(sections).map(([model, section]) => [model,
    Object.fromEntries(['ru', 'kk', 'en'].map(locale => [locale, Object.fromEntries(Object.keys(section.fields).map(key => [key, `${locale}:${key}`]))]))]));
  const result = applySnapshot(ru, snapshot, 'kk');
  assert.equal(result.home.statement.title, 'kk:statementTitle');
  assert.equal(result.home.contact.locations[1], 'kk:addressAstana');
  assert.ok(Array.isArray(result.home.contact.locations));
  assert.equal(result.home.divisions.items[0].slug, ru.home.divisions.items[0].slug);
  snapshot.data.sections.jelCompany.kk.injectedField = 'Rejected';
  assert.throws(() => validateSnapshot(snapshot));
});
test('service edits update both home cards and direction pages in each language', () => {
  const snapshot = fixture();
  snapshot.data.services = Object.fromEntries(Object.keys(services).map(slug => [slug, {
    image: `/images/cms/${'a'.repeat(64)}.webp`,
    copy: Object.fromEntries(['ru', 'kk', 'en'].map(locale => [locale, {
      cardTitle: `${slug} card ${locale}`, cardDescription: `${slug} description ${locale}`,
      cardCta: `${slug} CTA ${locale}`, pageTitle: `${slug} page ${locale}`,
      pageLead: `${slug} lead ${locale}`, imageAlt: `${slug} alt ${locale}`,
    }])),
  }]));
  for (const locale of ['ru', 'kk', 'en']) {
    const result = applySnapshot(ru, snapshot, locale);
    for (const slug of Object.keys(services)) {
      const card = result.home.divisions.items.find(item => item.slug === slug);
      const page = result.home.services.items[slug];
      assert.equal(card.title, `${slug} card ${locale}`);
      assert.equal(card.desc, `${slug} description ${locale}`);
      assert.equal(card.cta, `${slug} CTA ${locale}`);
      assert.equal(page.title, `${slug} page ${locale}`);
      assert.equal(page.lead, `${slug} lead ${locale}`);
      assert.equal(page.imageAlt, `${slug} alt ${locale}`);
      assert.equal(card.image, page.image);
      assert.equal(card.slug, slug);
    }
  }
  delete snapshot.data.services.engineering.copy.kk.pageLead;
  assert.throws(() => validateSnapshot(snapshot));
  snapshot.data.services.engineering.copy.kk.pageLead = 'Restored';
  snapshot.data.services.equipment.image = '../../unsafe';
  assert.throws(() => validateSnapshot(snapshot));
});
test('contact values reject mail header injection, malformed phones and offsite social links', () => {
  for (const change of [{email: 'a@example.com?bcc=x@example.com'}, {email: 'a@example.com\r\nBcc: x@example.com'},
    {projectsEmail: 'a@example.com?bcc=x@example.com'}, {projectsEmail: 'a@example.com\r\nBcc: x@example.com'}, {projectsEmail: null},
    {phone: '+7<script>'}, {phone: '+000000000'}, {phone: null}, {phoneAlt: ' '}, {whatsapp: null}, {whatsapp: 'https://wa.me.evil.test/123456789'}, {instagram: 'javascript:alert(1)'}]) {
    const snapshot = fixture(); snapshot.data.contacts = {...contacts, ...change};
    assert.throws(() => validateSnapshot(snapshot));
  }
  const snapshot = fixture(); snapshot.data.contacts = contacts;
  validateSnapshot(snapshot);
  snapshot.data.contacts = {...contacts, projectsEmail: ''}; validateSnapshot(snapshot);
  delete snapshot.data.contacts.projectsEmail; validateSnapshot(snapshot);
});
test('retired phones and branch addresses can be blank without restoring source addresses', () => {
  const snapshot = fixture();
  snapshot.data.contacts = {...contacts, phone: '', phoneAlt: '', whatsapp: ''};
  snapshot.data.sections = Object.fromEntries(Object.entries(sections).map(([model, section]) => [model,
    Object.fromEntries(['ru', 'kk', 'en'].map(locale => [locale, Object.fromEntries(Object.keys(section.fields).map(key => [key, section.optional?.includes(key) ? '' : `${locale}:${key}`]))]))]));
  for (const locale of ['ru', 'kk', 'en']) {
    const base = structuredClone(ru);
    base.home.contact.locations = ['Old Almaty', 'Old Astana', 'Old Shymkent'];
    assert.deepEqual(applySnapshot(base, snapshot, locale).home.contact.locations, [`${locale}:addressAlmaty`]);
  }
  snapshot.data.sections.jelContacts.kk.addressAlmaty = '';
  assert.throws(() => validateSnapshot(snapshot));
});
test('news rejects duplicate slugs, invalid dates and missing translations', () => {
  const item = {slug: 'cms-test', date: '2026-09-19', image: null,
    copy: Object.fromEntries(['ru','kk','en'].map(locale => [locale, {title: locale, tag: locale, body: '<script> is plain text'}]))};
  const snapshot = fixture(); snapshot.data.news = [item]; validateSnapshot(snapshot);
  snapshot.data.news.push(structuredClone(item)); assert.throws(() => validateSnapshot(snapshot));
  snapshot.data.news.pop(); item.date = '2026-02-30'; assert.throws(() => validateSnapshot(snapshot));
  item.date = '2026-09-19'; delete item.copy.kk.body; assert.throws(() => validateSnapshot(snapshot));
});
