import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { newsDate, newsLabels, type NewsItem } from "@/lib/news";
import { assetPath, type Locale } from "@/lib/site";

export default function NewsCards({ items, locale }: { items: NewsItem[]; locale: Locale }) {
  return (
    <div className="journal-grid">
      {items.map((item) => (
        <article className="journal-card" key={item.slug}>
          <Link href={`/news/${item.slug}`} className="journal-card__link">
            {item.image && <div className="journal-card__image"><Image src={assetPath(item.image)} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /></div>}
            <div className="journal-card__meta"><span>{item.copy[locale].tag}</span><time dateTime={item.date}>{newsDate(item.date, locale)}</time></div>
            <h3>{item.copy[locale].title}</h3>
            <p>{item.copy[locale].body.slice(0, 180)}{item.copy[locale].body.length > 180 ? "…" : ""}</p>
            <span className="journal-card__cta">{newsLabels[locale].read}<span aria-hidden="true">↗</span></span>
          </Link>
        </article>
      ))}
    </div>
  );
}
