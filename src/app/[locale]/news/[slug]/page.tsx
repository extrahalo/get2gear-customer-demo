import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import NewsFooter from "@/components/NewsFooter";
import { news, newsDate, newsLabels } from "@/lib/news";
import { assetPath } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  // Next 16.3 export requires at least one param. This non-editor slug renders
  // notFound(), never a placeholder article, and is excluded from the sitemap.
  return news.length ? news.map(({ slug }) => ({ slug })) : [{ slug: "__empty__" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const item = news.find(item => item.slug === slug);
  if (!item) notFound();
  const copy = item.copy[locale];
  return { title: `${copy.title} | Get2Gear`, description: copy.body.slice(0, 160),
    alternates: { canonical: `/${locale}/news/${slug}/`, languages: Object.fromEntries(routing.locales.map(l => [l, `/${l}/news/${slug}/`])) },
    openGraph: { title: copy.title, description: copy.body.slice(0, 160), type: "article", publishedTime: `${item.date}T12:00:00Z`, url: `/${locale}/news/${slug}/`, images: item.image ? [{ url: item.image, alt: copy.title }] : [] },
    twitter: { card: item.image ? "summary_large_image" : "summary", title: copy.title, description: copy.body.slice(0, 160), images: item.image ? [item.image] : [] },
  };
}

export default async function NewsArticle({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const item = news.find(item => item.slug === slug);
  if (!item) notFound();
  setRequestLocale(locale);
  const copy = item.copy[locale];
  return <main>
    <SiteHeader />
    <article>
      <header className="journal-heading journal-heading--article" data-dark><div className="shell">
        <Link href="/news" className="journal-back">← {newsLabels[locale].back}</Link>
        <div className="journal-kicker"><span>{copy.tag}</span><time dateTime={item.date}>{newsDate(item.date, locale)}</time></div>
        <h1>{copy.title}</h1>
      </div></header>
      <div className="shell journal-article">
        {item.image && <div className="journal-article__image"><Image src={assetPath(item.image)} alt={copy.title} fill priority sizes="(max-width: 900px) 100vw, 900px" /></div>}
        <div className="journal-prose">{copy.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          <Link href="/news" className="journal-return">← {newsLabels[locale].back}</Link>
        </div>
      </div>
    </article>
    <NewsFooter locale={locale} />
  </main>;
}
