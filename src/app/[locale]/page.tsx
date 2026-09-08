import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import ContactRequestForm from "@/components/ContactRequestForm";
import VideoSlot from "@/components/VideoSlot";
import {
  productSystems,
  proofGallery,
  videoStories,
  type ProductSystemId,
  type VideoStoryId,
} from "@/content/industrial";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_ALT,
  CONTACT_PHONE_HREF,
  CONTACT_PHONE_ALT_HREF,
  assetPath,
  INSTAGRAM_HREF,
  WHATSAPP_HREF,
} from "@/lib/site";

type Division = {
  num: string;
  title: string;
  desc: string;
  cta: string;
  slug: string;
  image: string;
};

type Capability = { title: string; desc: string };
type Article = { tag: string; title: string; status: string };
type SystemCopy = {
  title: string;
  body: string;
  imageAlt: string;
  products: Record<string, string>;
};
type VideoCopy = { title: string; summary: string };
type ResultStat = { value: string; label: string };
type Industry = { number: string; title: string; body: string };
type Policy = { number: string; title: string; body: string };
type ContactCopy = {
  label: string; title: string; body: string; email: string; whatsapp: string;
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
  const capabilities = t.raw("capabilities.items") as Capability[];
  const equipmentMeta = t.raw("equipment.meta") as string[];
  const brands = t.raw("brands.items") as string[];
  const articles = t.raw("news.items") as Article[];
  const systems = t.raw("systems.items") as Record<ProductSystemId, SystemCopy>;
  const videos = t.raw("videos.items") as Record<VideoStoryId, VideoCopy>;
  const resultStats = t.raw("results.stats") as ResultStat[];
  const industries = t.raw("industries.items") as Industry[];
  const policies = t.raw("policies.items") as Policy[];
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
          src={assetPath("/images/hero-mine.jpg")}
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
            <a className="button button--ghost" href="#solutions">
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
            <article className="division-card" key={division.num} data-reveal>
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

      <section id="solutions" className="contamination section-pad">
        <div className="shell contamination__top">
          <div className="contamination__intro">
            <p className="section-label" data-reveal>
              <i /> {t("contamination.label")}
            </p>
            <p className="contamination__code" data-reveal>
              ISO 4406 / 4 — 6 — 14 μm
            </p>
            <h2 data-reveal>{t("contamination.title")}</h2>
            <p className="contamination__lead" data-reveal>
              {t("contamination.body")}
            </p>
            <a className="text-link" href="#products" data-reveal>
              {t("contamination.cta")} <span aria-hidden="true">↓</span>
            </a>
          </div>
          <figure className="contamination__visual" data-reveal>
            <div className="contamination__image-grid" aria-hidden="true" />
            <Image
              src={assetPath("/images/products/descase-dc-rs.webp")}
              alt={t("contamination.imageAlt")}
              width={1200}
              height={1200}
              sizes="(max-width: 900px) 100vw, 48vw"
            />
            <figcaption>
              <span>DES-CASE</span>
              <strong>DC-RS / Rebuildable steel</strong>
            </figcaption>
          </figure>
        </div>
        <div className="shell contamination__film">{video("contamination", false, true)}</div>
      </section>

      <section id="products" className="systems section-pad" data-dark>
        <div className="shell section-heading section-heading--light">
          <p className="section-label" data-reveal>
            <i /> {t("systems.label")}
          </p>
          <div>
            <h2 data-reveal>{t("systems.title")}</h2>
            <p className="section-heading__note" data-reveal>
              {t("systems.note")}
            </p>
          </div>
        </div>

        <div className="shell system-list">
          {productSystems.map((system) => {
            const copy = systems[system.id];
            return (
              <article className={`system-card system-card--${system.id}`} key={system.id}>
                <div className="system-card__visual" data-reveal>
                  <Image
                    src={assetPath(system.image)}
                    alt={copy.imageAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                  <span>{system.partner}</span>
                </div>
                <div className="system-card__content">
                  <div className="system-card__index" data-reveal>
                    <span>{system.number}</span>
                    <span>G2G / SYSTEM</span>
                  </div>
                  <h3 data-reveal>{copy.title}</h3>
                  <p data-reveal>{copy.body}</p>
                  <ul data-reveal>
                    {system.productKeys.map((key) => (
                      <li key={key}>
                        <span>+</span>
                        {copy.products[key]}
                      </li>
                    ))}
                  </ul>
                  {system.videoId ? video(system.videoId, true, true) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="results" className="results section-pad">
        <div className="shell results__grid">
          <div className="results__story">
            <p className="section-label" data-reveal>
              <i /> {t("results.label")}
            </p>
            <p className="results__kicker" data-reveal>
              {t("results.kicker")}
            </p>
            <h2 data-reveal>{t("results.title")}</h2>
            <p data-reveal>{t("results.body")}</p>
            <p className="results__disclaimer" data-reveal>
              {t("results.disclaimer")}
            </p>
            <div className="results__stats">
              {resultStats.map((stat) => (
                <div key={stat.value} data-reveal>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="results__media">
            <figure data-reveal>
              <Image
                src={assetPath(proofGallery[0].image)}
                alt={t("results.imageAlt")}
                width={proofGallery[0].width}
                height={proofGallery[0].height}
                sizes="(max-width: 900px) 100vw, 48vw"
              />
              <figcaption>{t("results.caption")}</figcaption>
            </figure>
            {video("case")}
          </div>
        </div>
      </section>

      <section className="economics" data-dark>
        <div className="shell economics__grid">
          <div className="economics__copy section-pad">
            <p className="section-label section-label--light" data-reveal>
              <i /> {t("economics.label")}
            </p>
            <h2 data-reveal>{t("economics.title")}</h2>
            <p data-reveal>{t("economics.body")}</p>
            <a className="button button--primary" href="#contacts" data-reveal>
              {t("economics.cta")} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="economics__film">{video("economics", false, true)}</div>
        </div>
      </section>

      <section id="industries" className="industries section-pad">
        <div className="shell section-heading">
          <p className="section-label" data-reveal>
            <i /> {t("industries.label")}
          </p>
          <h2 data-reveal>{t("industries.title")}</h2>
        </div>
        <div className="shell industries__grid">
          <ol className="industry-list">
            {industries.map((industry) => (
              <li key={industry.number} data-reveal>
                <span>{industry.number}</span>
                <div>
                  <h3>{industry.title}</h3>
                  <p>{industry.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="industries__film">{video("industries")}</div>
        </div>
      </section>

      <section id="capabilities" className="capabilities section-pad">
        <div className="shell capabilities__grid">
          <div className="capabilities__intro">
            <p className="section-label" data-reveal>
              <i /> {t("capabilities.label")}
            </p>
            <h2 data-reveal>{t("capabilities.title")}</h2>
            <div className="capabilities__metric" data-reveal>
              <strong>{t("capabilities.metric")}</strong>
              <span>{t("capabilities.metricText")}</span>
            </div>
          </div>

          <ol className="capability-list">
            {capabilities.map((capability, index) => (
              <li key={capability.title} data-reveal>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{capability.title}</h3>
                  <p>{capability.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="policies section-pad" data-dark>
        <div className="shell policies__heading">
          <p className="section-label section-label--light"><i /> {t("policies.label")}</p>
          <div><h2>{t("policies.title")}</h2><p>{t("policies.body")}</p></div>
        </div>
        <ol className="shell policies__list">
          {policies.map((policy) => (
            <li key={policy.number}>
              <span>{policy.number}</span><div><h3>{policy.title}</h3><p>{policy.body}</p></div>
            </li>
          ))}
        </ol>
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

      <section id="videos" className="video-index section-pad" data-dark>
        <div className="shell video-index__heading">
          <p className="section-label section-label--light" data-reveal>
            <i /> {t("videos.label")}
          </p>
          <div>
            <h2 data-reveal>{t("videos.title")}</h2>
            <p data-reveal>{t("videos.note")}</p>
          </div>
        </div>
        <ol className="shell video-index__list">
          {videoStories.map((story) => (
            <li key={story.id} data-reveal>
              <span>{story.number}</span>
              <strong>{videos[story.id].title}</strong>
              <em>{t(`videos.placements.${story.placement}`)}</em>
              <i>{t("videos.statusShort")}</i>
            </li>
          ))}
        </ol>
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
            {[...brands, ...brands].map((brand, index) => (
              <span key={`${brand}-${index}`}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="news section-pad">
        <div className="shell section-heading">
          <p className="section-label" data-reveal>
            <i /> {t("news.label")}
          </p>
          <div className="section-heading__row">
            <h2 data-reveal>{t("news.title")}</h2>
            <span className="news__archive" data-reveal>
              {t("news.archive")}
            </span>
          </div>
        </div>
        <div className="shell news-grid">
          {articles.map((article, index) => (
            <article className="news-card" key={article.title} data-reveal>
              <div className="news-card__visual">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i />
              </div>
              <div className="news-card__body">
                <p>{article.tag}</p>
                <h3>{article.title}</h3>
                <span>{article.status}</span>
              </div>
            </article>
          ))}
        </div>
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
              <a
                className="contact-link"
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noreferrer"
              >
                <span>{contact.whatsapp}</span>
                <strong>{CONTACT_PHONE}</strong>
                <i aria-hidden="true">↗</i>
              </a>
            </div>
            <div className="contact-details" data-reveal>
              <div><span>{contact.phoneLabel}</span><a href={`tel:${CONTACT_PHONE_HREF}`}>{CONTACT_PHONE}</a><a href={`tel:${CONTACT_PHONE_ALT_HREF}`}>{CONTACT_PHONE_ALT}</a></div>
              <div><span>{contact.locationsLabel}</span>{contact.locations.map((location) => <p key={location}>{location}</p>)}</div>
              <div><span>{contact.socialLabel}</span><a href={INSTAGRAM_HREF} target="_blank" rel="noreferrer">Instagram ↗</a></div>
            </div>
            <ContactRequestForm email={CONTACT_EMAIL} copy={contact} />
          </div>
        </div>
      </section>

      <footer className="site-footer" data-dark>
        <div className="shell site-footer__top">
          <div className="site-footer__brand">
            <span className="site-footer__logo">
              <Image src={assetPath("/images/get2gear-logo-horizontal.png")} alt="Get2Gear" width={1002} height={135} />
            </span>
            <p>{t("footer.tagline")}</p>
          </div>
          <div className="site-footer__contacts">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href={`tel:${CONTACT_PHONE_HREF}`}>{CONTACT_PHONE}</a>
          </div>
        </div>
        <div className="shell site-footer__bottom">
          <span>© {new Date().getFullYear()} Get2Gear. {t("footer.rights")}.</span>
          <span>{t("footer.locations")}</span>
        </div>
      </footer>
    </main>
  );
}
