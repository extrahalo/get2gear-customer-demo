import records from "@/content/news.json";
import type { Locale } from "@/lib/site";

export type NewsItem = {
  slug: string;
  date: string;
  image: string | null;
  copy: Record<Locale, { title: string; tag: string; body: string }>;
};

// Only the release worker writes this file in its isolated build directory.
export const news = (records as NewsItem[]).toSorted((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
export const newsLabels = {
  ru: { title: "Новости", back: "Все новости", home: "На главную", read: "Читать материал", all: "Все новости", empty: "Публикаций пока нет.", description: "Новости, проекты и технические материалы Get2Gear." },
  kk: { title: "Жаңалықтар", back: "Барлық жаңалықтар", home: "Басты бетке", read: "Материалды оқу", all: "Барлық жаңалықтар", empty: "Әзірге жарияланымдар жоқ.", description: "Get2Gear жаңалықтары, жобалары және техникалық материалдары." },
  en: { title: "News", back: "All news", home: "Back to home", read: "Read article", all: "All news", empty: "No publications yet.", description: "News, projects and technical insights from Get2Gear." },
};

export function newsDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}
