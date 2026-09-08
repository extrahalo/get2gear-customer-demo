export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://get2gear.com";
const configuredBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.PAGES_BASE_PATH ?? "";
const normalizedBasePath = configuredBasePath.replace(/\/$/, "");

/**
 * Prefixes public assets when the customer demo is exported under GitHub
 * Pages' repository subpath. It is intentionally a no-op for the main site.
 */
export function assetPath(path: string) {
  if (!path.startsWith("/")) return path;
  return `${normalizedBasePath}${path}`;
}

export const CONTACT_EMAIL = "info@get2gear.com";
export const CONTACT_PHONE = "+7 (727) 313 2527";
export const CONTACT_PHONE_HREF = "+77273132527";
export const CONTACT_PHONE_ALT = "+7 (707) 324 1009";
export const CONTACT_PHONE_ALT_HREF = "+77073241009";
export const WHATSAPP_HREF = "https://wa.me/77710616148";
export const INSTAGRAM_HREF = "https://www.instagram.com/get2gear/";

export type Locale = "ru" | "kk" | "en";
