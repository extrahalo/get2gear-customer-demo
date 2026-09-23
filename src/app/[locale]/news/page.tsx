import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import NewsCards from "@/components/NewsCards";
import NewsFooter from "@/components/NewsFooter";
import { news, newsLabels } from "@/lib/news";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const labels = newsLabels[locale];
  return { title: `${labels.title} | Get2Gear`, description: labels.description,
    alternates: { canonical: `/${locale}/news/`, languages: Object.fromEntries(routing.locales.map(l => [l, `/${l}/news/`])) },
    openGraph: { title: `${labels.title} | Get2Gear`, description: labels.description, url: `/${locale}/news/`, type: "website" },
    twitter: { card: "summary", title: `${labels.title} | Get2Gear`, description: labels.description },
  };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const labels = newsLabels[locale];
  return <main>
    <SiteHeader />
    <header className="journal-heading" data-dark><div className="shell">
      <Link href="/" className="journal-back">← {labels.home}</Link>
      <p className="journal-kicker">Get2Gear / {labels.title}</p>
      <h1>{labels.title}<span aria-hidden="true">.</span></h1><p className="journal-description">{labels.description}</p>
    </div></header>
    <section className="shell journal-list" aria-label={labels.title}>
      {news.length ? <NewsCards items={news} locale={locale} /> : <p className="journal-empty">{labels.empty}</p>}
    </section>
    <NewsFooter locale={locale} />
  </main>;
}
