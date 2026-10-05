import { createHash } from 'node:crypto';
import sections from './scripts/sections.json' with { type: 'json' };
import services from './scripts/services.json' with { type: 'json' };

export const locales = ['ru', 'kk', 'en'];
const imagePath = /^\/images\/cms\/[a-f0-9]{64}\.(?:png|jpg|webp)$/;
const text = (value, label, required = true) => {
  if (typeof value !== 'string' || (required && !value.trim()) || value.length > 40000) throw new Error(`Invalid ${label}`);
  return value;
};

export function validateSnapshot(snapshot) {
  if (snapshot?.schema !== 1 || !/^\d{8}T\d{6}-[a-f0-9]{12}$/.test(snapshot.id)) throw new Error('Invalid snapshot envelope');
  const data = snapshot.data;
  for (const locale of locales) {
    for (const field of ['title', 'lead', 'eyebrow', 'imageAlt']) text(data?.home?.[locale]?.[field], `${locale}.${field}`);
  }
  const image = value => { if (value != null && !imagePath.test(value)) throw new Error('Invalid image path'); };
  image(data.heroImage);
  if (!Array.isArray(data.brands) || data.brands.length > 100 || !Array.isArray(data.news)) throw new Error('Invalid collections');
  for (const brand of data.brands) {
    text(brand.name, 'brand.name'); image(brand.logo);
    if (brand.url) {
      const url = new URL(brand.url);
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid brand URL');
    }
  }
  // Older frozen releases remain reproducible; new releases include all three directions.
  if (data.services !== undefined) {
    if (!data.services || Array.isArray(data.services) || Object.keys(data.services).length !== Object.keys(services).length ||
      Object.keys(data.services).some(slug => !Object.hasOwn(services, slug))) throw new Error('Invalid services');
    for (const slug of Object.keys(services)) {
      const service = data.services[slug];
      if (!service || typeof service !== 'object' || Array.isArray(service)) throw new Error('Invalid service');
      image(service.image);
      for (const locale of locales) for (const field of ['cardTitle', 'cardDescription', 'cardCta', 'pageTitle', 'pageLead', 'imageAlt']) {
        text(service.copy?.[locale]?.[field], `${slug}.${locale}.${field}`);
      }
    }
  }
  if (data.contacts) {
    const c = data.contacts;
    if (!/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(c.email)) throw new Error('Invalid email');
    if (c.projectsEmail !== undefined && (typeof c.projectsEmail !== 'string' || (c.projectsEmail !== '' && !/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(c.projectsEmail)))) throw new Error('Invalid projects email');
    for (const key of ['phone', 'phoneAlt']) {
      if (c[key] === '') continue;
      if (typeof c[key] !== 'string' || !/^\+[0-9 ()-]{7,30}$/.test(c[key]) || !/^\+[1-9][0-9]{6,14}$/.test(c[key].replace(/[ ()-]/g, ''))) throw new Error('Invalid phone');
    }
    if ((c.whatsapp !== '' && !/^https:\/\/wa\.me\/[1-9][0-9]{6,14}$/.test(c.whatsapp)) || !/^https:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9._]+\/?$/.test(c.instagram)) throw new Error('Invalid contact link');
  }
  // Optional additions keep earlier schema-1 snapshots reproducible with source defaults.
  if (data.sections) {
    if (Object.keys(data.sections).some(key => !Object.hasOwn(sections, key))) throw new Error('Unknown section');
    for (const [model, section] of Object.entries(sections)) for (const locale of locales) {
      const copy = data.sections[model]?.[locale];
      if (!copy || Object.keys(copy).some(key => !Object.hasOwn(section.fields, key))) throw new Error('Invalid section fields');
      for (const key of Object.keys(section.fields)) text(copy[key], `${model}.${locale}.${key}`, !section.optional?.includes(key));
    }
  }
  if (data.news.length > 500) throw new Error('Too many news items');
  const slugs = new Set();
  for (const item of data.news) {
    if (typeof item.slug !== 'string' || item.slug.length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || slugs.has(item.slug)) throw new Error('Invalid/duplicate news slug');
    slugs.add(item.slug); image(item.image);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date) || new Date(item.date).toISOString().slice(0, 10) !== item.date) throw new Error('Invalid date');
    for (const locale of locales) for (const field of ['title', 'tag', 'body']) text(item.copy?.[locale]?.[field], `${locale}.${field}`);
  }
  return snapshot;
}

export function applySnapshot(base, snapshot, locale) {
  validateSnapshot(snapshot);
  if (!locales.includes(locale)) throw new Error('Invalid locale');
  const messages = structuredClone(base);
  Object.assign(messages.home.hero, snapshot.data.home[locale]);
  if (snapshot.data.heroImage) messages.home.hero.image = snapshot.data.heroImage;
  messages.home.brands.items = snapshot.data.brands;
  if (snapshot.data.services) for (const [slug, service] of Object.entries(snapshot.data.services)) {
    const card = messages.home.divisions.items.find(item => item.slug === slug);
    const page = messages.home.services.items[slug];
    if (!card || !page) throw new Error(`Unknown service target: ${slug}`);
    const copy = service.copy[locale];
    Object.assign(card, {title: copy.cardTitle, desc: copy.cardDescription, cta: copy.cardCta});
    Object.assign(page, {title: copy.pageTitle, lead: copy.pageLead, imageAlt: copy.imageAlt});
    if (service.image) {
      card.image = service.image;
      page.image = service.image;
    }
  }
  for (const [model, section] of Object.entries(sections)) {
    if (!snapshot.data.sections) break;
    for (const [key, [target]] of Object.entries(section.fields)) {
      const path = target.split('.');
      const last = path.pop();
      let destination = messages;
      for (const part of path) destination = destination[part];
      destination[last] = snapshot.data.sections[model][locale][key];
    }
  }
  if (messages.home.contact) messages.home.contact.locations = messages.home.contact.locations.filter(value => value.trim());
  return messages;
}

export function verifyMedia(filename, bytes) {
  if (!/^[a-f0-9]{64}\.(png|jpg|webp)$/.test(filename)) throw new Error('Invalid media filename');
  if (createHash('sha256').update(bytes).digest('hex') !== filename.split('.')[0]) throw new Error('Media hash mismatch');
}
