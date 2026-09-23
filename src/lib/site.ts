import contacts from "@/content/contacts.json";

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

export const CONTACT_EMAIL = contacts.email;
export const PROJECTS_EMAIL = contacts.projectsEmail;
export const CONTACT_PHONE = contacts.phone;
export const CONTACT_PHONE_HREF = contacts.phone.replace(/[^+\d]/g, "");
export const CONTACT_PHONE_ALT = contacts.phoneAlt;
export const CONTACT_PHONE_ALT_HREF = contacts.phoneAlt.replace(/[^+\d]/g, "");
export const WHATSAPP_HREF = contacts.whatsapp;
export const WHATSAPP_PHONE = `+${contacts.whatsapp.split("/").pop()}`;
export const INSTAGRAM_HREF = contacts.instagram;

export type Locale = "ru" | "kk" | "en";
