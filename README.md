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

Shared email addresses, phones and social links live in `src/content/contacts.json`.
Office addresses are localized in `messages/{ru,kk,en}.json` under `home.contact.locations`.
The additional projects email is displayed in the contact section and every page footer;
the general enquiry form still prepares a message to the main email address.

## Customer demo publication

Pushing `main` triggers the existing GitHub Pages workflow. It runs lint, creates
a static export for the repository subpath, adds a root entry page, and checks
18 localized routes plus their internal links, assets and contact details.
This workflow publishes only the website; it does not install the PHP CMS or
change PS.kz, DNS or email accounts. Local CMS changes do not automatically
reach GitHub Pages; approved content must first be reflected in these source files.

```sh
GITHUB_ACTIONS=true PAGES_BASE_PATH=/get2gear-customer-demo NEXT_PUBLIC_BASE_PATH=/get2gear-customer-demo npm run build -- --webpack
node scripts/finalize-static-export.mjs
PAGES_BASE_PATH=/get2gear-customer-demo node scripts/check-static-export.mjs
```

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
