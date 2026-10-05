import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { news } from "@/lib/news";
import { videoDemonstrations, videoStories } from "@/content/industrial";
import ru from "../../messages/ru.json";
import kk from "../../messages/kk.json";
import en from "../../messages/en.json";

// GitHub Pages is a static host, so this route must be generated at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const services = ["engineering", "equipment", "automation", "descase"];
  const translations = { ru, kk, en };
  const localized = (path = "") => routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}/${path}`,
    changeFrequency: "monthly" as const,
    priority: path ? 0.8 : locale === "ru" ? 1 : 0.9,
    alternates: {
      languages: {
        ...Object.fromEntries(routing.locales.map((language) => [language, `${SITE_URL}/${language}/${path}`])),
        "x-default": `${SITE_URL}/ru/${path}`,
      },
    },
  }));

  const videoPages: MetadataRoute.Sitemap = localized("videos/").map((page, index) => {
    const locale = routing.locales[index];
    const copy = translations[locale].home.videos;
    const language = locale === "en" ? "EN" : "RU";
    return {
      ...page,
      videos: [
        ...videoStories.map((story) => ({
          title: copy.items[story.id].title,
          description: copy.items[story.id].summary,
          thumbnail_loc: `${SITE_URL}/videos/20260929-final-delivery/Get2Gear_V${Number(story.number)}_${language}_poster.jpg`,
          content_loc: `${SITE_URL}/videos/20260929-final-delivery/Get2Gear_V${Number(story.number)}_${language}_1080p.mp4`,
        })),
        ...videoDemonstrations.map((demo) => ({
          title: copy.demonstrations[demo.id].title,
          description: copy.demonstrations[demo.id].summary,
          thumbnail_loc: `${SITE_URL}/videos/20260929-final-delivery/${demo.file.replace(/_1080p\.mp4$/, "_poster.jpg")}`,
          content_loc: `${SITE_URL}/videos/20260929-final-delivery/${demo.file}`,
        })),
      ],
    };
  });

  return [
    ...localized(),
    ...services.flatMap((service) => localized(`${service}/`)),
    ...videoPages,
    ...localized("news/"),
    ...news.flatMap((item) => localized(`news/${item.slug}/`)),
  ];
}
