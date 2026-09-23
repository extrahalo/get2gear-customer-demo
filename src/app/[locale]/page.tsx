import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import StudioCredit from "@/components/StudioCredit";
import FooterContacts from "@/components/FooterContacts";
import ContactRequestForm from "@/components/ContactRequestForm";
import VideoSlot from "@/components/VideoSlot";
import NewsCards from "@/components/NewsCards";
import { news, newsLabels } from "@/lib/news";
import type { Locale } from "@/lib/site";
import {
  videoStories,
  type VideoStoryId,
} from "@/content/industrial";
import {
  CONTACT_EMAIL,
  PROJECTS_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_ALT,
  CONTACT_PHONE_HREF,
  CONTACT_PHONE_ALT_HREF,
  assetPath,
  INSTAGRAM_HREF,
  WHATSAPP_HREF,
  WHATSAPP_PHONE,
} from "@/lib/site";

type Division = {
  num: string;
  title: string;
  desc: string;
  cta: string;
  slug: string;
  image: string;
};

type VideoCopy = { title: string; summary: string };
type Brand = string | { name: string; logo?: string | null; url?: string };
type ContactCopy = {
  label: string; title: string; body: string; email: string; projectsEmail: string; whatsapp: string;
  phoneLabel: string; locationsLabel: string; socialLabel: string;
  locations: string[];
  formLabel: string; formTitle: string; requestType: string; name: string; phone: string;
  message: string; submit: string; submitted: string;
  options: { value: string; label: string }[];
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  const divisions = t.raw("divisions.items") as Division[];
  const equipmentMeta = t.raw("equipment.meta") as string[];
  const brands = t.raw("brands.items") as Brand[];
  const videos = t.raw("videos.items") as Record<VideoStoryId, VideoCopy>;
  const contact = t.raw("contact") as ContactCopy;

  const video = (id: VideoStoryId, compact = false, inverse = false) => {
    const record = videoStories.find((item) => item.id === id);
    if (!record) return null;

    return (
      <VideoSlot
        number={record.number}
        title={videos[id].title}
        summary={videos[id].summary}
        status={t("videos.status")}
        duration={t("videos.duration")}
        compact={compact}
        inverse={inverse}
      />
    );
  };

  return (
    <main>
      <SiteHeader />

      <section className="hero" data-dark>
        <Image
          className="hero__image"
          src={assetPath(t.has("hero.image") ? t("hero.image") : "/images/hero-mine.jpg")}
          alt={t("hero.imageAlt")}
          fill
          priority
          sizes="100vw"
        />
        <div className="hero__veil" />
        <div className="hero__grid" aria-hidden="true" />

        <div className="hero__content shell">
          <p className="hero__eyebrow">{t("hero.eyebrow")}</p>
          <h1 className="hero__title">{t("hero.title")}</h1>
          <p className="hero__lead">{t("hero.lead")}</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#contacts">
              {t("hero.primary")}
              <span aria-hidden="true">↗</span>
            </a>
            <a className="button button--ghost" href="#divisions">
              {t("hero.secondary")}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero__meta shell">
          <div>
            <span>01 / {t("hero.sectorLabel")}</span>
            <strong>{t("hero.sector")}</strong>
          </div>
          <div>
            <span>02 / {t("hero.regionLabel")}</span>
            <strong>{t("hero.region")}</strong>
          </div>
          <a href="#about">
            {t("hero.scroll")}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section id="about" className="statement section-pad">
        <div className="shell statement__grid">
          <p className="section-label" data-reveal>
            <i /> {t("statement.label")}
          </p>
          <div>
            <h2 className="statement__title" data-reveal>
              {t("statement.title")}
            </h2>
            <p className="statement__body" data-reveal>
              {t("statement.body")}
            </p>
            <div className="statement__film">{video("company")}</div>
          </div>
        </div>
      </section>

      <section id="divisions" className="divisions section-pad" data-dark>
        <div className="shell section-heading section-heading--light">
          <p className="section-label" data-reveal>
            <i /> {t("divisions.label")}
          </p>
          <h2 data-reveal>{t("divisions.title")}</h2>
        </div>

        <div className="shell division-list">
          {divisions.map((division) => (
            <article className={`division-card division-card--${division.slug}`} key={division.num} data-reveal>
              <Image
                src={assetPath(division.image)}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
              />
              <div className="division-card__shade" />
              <div className="division-card__top">
                <span>{division.num}</span>
                <span>G2G / {new Date().getFullYear()}</span>
              </div>
              <div className="division-card__body">
                <h3>{division.title}</h3>
                <p>{division.desc}</p>
                <Link href={`/${division.slug}`}>
                  {division.cta}
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="brands section-pad">
        <div className="shell brands__head">
          <p className="section-label" data-reveal>
            <i /> {t("brands.label")}
          </p>
          <div>
            <h2 data-reveal>{t("brands.title")}</h2>
            <p data-reveal>{t("brands.note")}</p>
          </div>
        </div>
        <div className="brand-rail" aria-label={t("brands.title")}>
          <div className="brand-rail__track">
            {[...brands, ...brands].map((brand, index) => {
              const item = typeof brand === "string" ? { name: brand } : brand;
              const duplicate = index >= brands.length;
              const label = item.logo ? (
                <Image src={assetPath(item.logo)} alt={item.name} width={160} height={64} className="brand-rail__logo" />
              ) : item.name;
              return (
                <span key={`${item.name}-${index}`} aria-hidden={duplicate || undefined}>
                  {item.url ? <a href={item.url} tabIndex={duplicate ? -1 : undefined} rel="noopener noreferrer">{label}</a> : label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section id="descase" className="descase-teaser section-pad">
        <div className="shell descase-teaser__inner">
          <p className="section-label"><i /> Des-Case / RMF Systems</p>
          <div>
            <h2>{t("descase.teaserTitle")}</h2>
            <p>{t("descase.teaserBody")}</p>
          </div>
          <Link className="button button--ink" href="/descase">
            {t("descase.cta")} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section id="videos" className="video-index section-pad" data-dark>
        <div className="shell video-index__heading">
          <p className="section-label section-label--light" data-reveal>
            <i /> {t("descase.generalVideoLabel")}
          </p>
          <div>
            <h2 data-reveal>{t("descase.generalVideoTitle")}</h2>
            <p data-reveal>{t("descase.generalVideoNote")}</p>
          </div>
        </div>
        <ol className="shell video-index__list">
          {videoStories.filter((story) => story.id === "company" || story.id === "industries").map((story) => (
            <li key={story.id} data-reveal>
              <span>{story.number}</span>
              <strong>{videos[story.id].title}</strong>
              <em>{t(`videos.placements.${story.placement}`)}</em>
              <i>{t("videos.statusShort")}</i>
            </li>
          ))}
        </ol>
      </section>

      <section id="contacts" className="contact-panel">
        <div className="shell contact-panel__grid">
          <p className="section-label" data-reveal>
            <i /> {t("contact.label")}
          </p>
          <div>
            <h2 data-reveal>{contact.title}</h2>
            <p data-reveal>{contact.body}</p>
            <div className="contact-panel__actions" data-reveal>
              <a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>
                <span>{contact.email}</span>
                <strong>{CONTACT_EMAIL}</strong>
                <i aria-hidden="true">↗</i>
              </a>
              {PROJECTS_EMAIL && <a className="contact-link" href={`mailto:${PROJECTS_EMAIL}`}>
                <span>{contact.projectsEmail}</span>
                <strong>{PROJECTS_EMAIL}</strong>
                <i aria-hidden="true">↗</i>
              </a>}
              {WHATSAPP_HREF && <a
                className="contact-link"
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noreferrer"
              >
                <span>{contact.whatsapp}</span>
                <strong>{WHATSAPP_PHONE}</strong>
                <i aria-hidden="true">↗</i>
              </a>}
            </div>
            <div className="contact-details" data-reveal>
              {(CONTACT_PHONE || CONTACT_PHONE_ALT) && <div><span>{contact.phoneLabel}</span>{CONTACT_PHONE && <a href={`tel:${CONTACT_PHONE_HREF}`}>{CONTACT_PHONE}</a>}{CONTACT_PHONE_ALT && <a href={`tel:${CONTACT_PHONE_ALT_HREF}`}>{CONTACT_PHONE_ALT}</a>}</div>}
              <div><span>{contact.locationsLabel}</span>{contact.locations.filter(Boolean).map((location) => <p key={location}>{location}</p>)}</div>
              <div><span>{contact.socialLabel}</span><a href={INSTAGRAM_HREF} target="_blank" rel="noreferrer">Instagram ↗</a></div>
            </div>
            <ContactRequestForm email={CONTACT_EMAIL} copy={contact} />
          </div>
        </div>
      </section>

      <section className="equipment-band section-pad" data-dark>
        <div className="equipment-band__glow" aria-hidden="true" />
        <div className="shell equipment-band__grid">
          <div>
            <p className="section-label section-label--light" data-reveal>
              <i /> {t("equipment.label")}
            </p>
            <h2 data-reveal>{t("equipment.title")}</h2>
          </div>
          <div className="equipment-band__copy">
            <p data-reveal>{t("equipment.body")}</p>
            <a className="button button--primary" href={`mailto:${CONTACT_EMAIL}`}>
              {t("equipment.cta")}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="shell equipment-meta" data-reveal>
          {equipmentMeta.map((item, index) => (
            <span key={item}>
              <i>{String(index + 1).padStart(2, "0")}</i>
              {item}
            </span>
          ))}
        </div>
      </section>

      {news.length > 0 && <section className="journal-home section-pad">
        <div className="shell">
          <div className="journal-home__head"><div><p className="section-label"><i />{t("news.label")}</p><h2>{t("news.title")}</h2></div><Link href="/news">{newsLabels[locale as Locale].all} ↗</Link></div>
          <NewsCards items={news.slice(0, 3)} locale={locale as Locale} />
        </div>
      </section>}

      <footer className="site-footer" data-dark>
        <div className="shell site-footer__top">
          <div className="site-footer__brand">
            <span className="site-footer__logo">
              <Image src={assetPath("/images/get2gear-logo-horizontal.png")} alt="Get2Gear" width={1002} height={135} />
            </span>
            <p>{t("footer.tagline")}</p>
          </div>
          <FooterContacts />
        </div>
        <div className="shell site-footer__bottom">
          <span>© {new Date().getFullYear()} Get2Gear. {t("footer.rights")}.</span>
          <span>{t("footer.locations")}</span>
          <StudioCredit />
        </div>
      </footer>
    </main>
  );
}
