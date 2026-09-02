import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const services = ["engineering", "equipment", "automation"];
  const localized = (path = "") => routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path ? 0.8 : locale === "ru" ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])),
    },
  }));

  return [
    ...localized(),
    ...services.flatMap((service) => localized(`/${service}`)),
  ];
}
