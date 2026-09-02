import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const pagesBasePath = process.env.PAGES_BASE_PATH;
const developmentScriptPolicy =
  process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' mailto:",
  `script-src 'self' 'unsafe-inline'${developmentScriptPolicy}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // GitHub Pages serves static files only. The normal production target
  // remains the Docker/Hetzner deployment described in the project README.
  output: isGitHubPages ? "export" : "standalone",
  ...(isGitHubPages && pagesBasePath ? { basePath: pagesBasePath } : {}),
  ...(isGitHubPages ? { trailingSlash: true, images: { unoptimized: true } } : {}),
  poweredByHeader: false,
  ...(isGitHubPages
    ? {}
    : {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
      }),
};

export default withNextIntl(nextConfig);
