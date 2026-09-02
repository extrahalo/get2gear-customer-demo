# Get2Gear website

Initial multilingual rebuild of get2gear.com using the verified JEL stack and the Industrial Editorial Command design direction.

## Stack

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4 plus a custom editorial design system
- `next-intl` for RU, KK, and EN routes
- GSAP + Lenis for restrained motion and smooth scrolling
- Standalone Next.js output for Docker/Hetzner deployment

## Local development

```bash
npm install
npm run dev
```

Open:

- http://localhost:3000/ru
- http://localhost:3000/kk
- http://localhost:3000/en

## Verification

```bash
npm run lint
npm run build
npm audit --omit=dev
```

## Content

Homepage content currently lives in:

- `messages/ru.json`
- `messages/kk.json`
- `messages/en.json`

This structured boundary is temporary and intentionally maps to the future admin/CMS fields. Layout, components, motion, and design tokens remain code-controlled.

Source migration documents:

- `CONTENT_INVENTORY_RU.md`
- `MEDIA_INVENTORY.md`
- `DESIGN_DIRECTION.md`

## Current scope

- Responsive multilingual homepage
- Header, locale switcher, mobile navigation
- Hero, company statement, divisions, delivery model, procurement CTA
- Manufacturer rail, news-ready presentation, contact section, footer
- Metadata, JSON-LD, robots, sitemap, CSP and security headers

The admin/CMS, news detail routes, inner service pages, contact backend, and production deployment are the next phases.
