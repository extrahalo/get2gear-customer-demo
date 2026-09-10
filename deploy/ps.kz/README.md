# PS.kz deployment

Published 2026-09-10 to https://get2gear.com/ru/ using the existing Plesk subscription.

- Active document root: `get2gear-20260910`.
- Previous WordPress files remain untouched in `httpdocs`; its database remains in place.
- WordPress Toolkit backup: `wordpress-backups/get2gear.com__2026-09-10T15_53_07+0500.zip` (114.1 MB, creation confirmed by Plesk).
- DNS and email settings were not changed. Existing TLS certificate retained; HTTP-to-HTTPS redirect enabled.
- To roll back, change only get2gear.com's document root to `httpdocs` in Plesk Hosting Settings. Do not modify the other domains or mail settings.

Build the root-domain static export:

```sh
GITHUB_ACTIONS=true PAGES_BASE_PATH='' NEXT_PUBLIC_BASE_PATH='' npm run build -- --webpack
```

Copy `out/` into a new versioned release folder, then include this directory's `.htaccess` and `index.html` at its root. Upload/extract the release outside `httpdocs`, then switch the domain document root after verification. Never upload private source documents, environment files, or credentials.

Verified on the live domain: all 12 localized home/service routes, 45 referenced homepage assets, sitemap, robots, and JEL Labs footer credit. The deployed site is a static export: the inquiry form prepares an email; it is not a server-side form or CMS/admin application.
