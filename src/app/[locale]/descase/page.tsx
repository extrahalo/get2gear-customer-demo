import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import StudioCredit from "@/components/StudioCredit";
import VideoSlot from "@/components/VideoSlot";
import { productSystems, proofGallery, videoStories, type ProductSystemId, type VideoStoryId } from "@/content/industrial";
import { assetPath, SITE_URL } from "@/lib/site";
import FooterContacts from "@/components/FooterContacts";

type SystemCopy = { title: string; body: string; imageAlt: string; products: Record<string, string> };
type VideoCopy = { title: string; summary: string };
type ResultStat = { value: string; label: string };
type Article = { tag: string; title: string; status: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.descase" });
  return {
    title: t("pageTitle"), description: t("teaserBody"),
    alternates: { canonical: `/${locale}/descase/`, languages: { ru: "/ru/descase/", kk: "/kk/descase/", en: "/en/descase/" } },
    openGraph: { title: t("pageTitle"), description: t("teaserBody"), url: `${SITE_URL}/${locale}/descase/` },
  };
}

export default async function DescasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const systems = t.raw("systems.items") as Record<ProductSystemId, SystemCopy>;
  const videos = t.raw("videos.items") as Record<VideoStoryId, VideoCopy>;
  const resultStats = t.raw("results.stats") as ResultStat[];
  const articles = t.raw("news.items") as Article[];
  const video = (id: VideoStoryId, compact = false, inverse = false) => {
    const record = videoStories.find((item) => item.id === id);
    if (!record) return null;
    return <VideoSlot number={record.number} title={videos[id].title} summary={videos[id].summary}
      status={t("videos.status")} duration={t("videos.duration")} compact={compact} inverse={inverse} />;
  };
  return (
    <main className="descase-page">
      <SiteHeader />
      <div className="shell descase-page__intro">
        <Link className="text-link" href="/">{t("descase.back")} <span aria-hidden="true">↗</span></Link>
        <h1>{t("descase.pageTitle")}</h1>
        <nav className="descase-nav" aria-label="Des-Case">
          <a href="#solutions">{t("descase.solutionNav")}</a>
          <a href="#products">{t("systems.label")}</a>
          <a href="#results">{t("results.label")}</a>
          <a href="#videos">{t("descase.productVideoLabel")}</a>
        </nav>
      </div>
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
            <Link className="button button--primary" href="/#contacts" data-reveal>
              {t("economics.cta")} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="economics__film">{video("economics", false, true)}</div>
        </div>
      </section>

      <section id="videos" className="video-index section-pad" data-dark>
        <div className="shell video-index__heading">
          <p className="section-label section-label--light" data-reveal>
            <i /> {t("descase.productVideoLabel")}
          </p>
          <div>
            <h2 data-reveal>{t("descase.productVideoTitle")}</h2>
            <p data-reveal>{t("descase.productVideoNote")}</p>
          </div>
        </div>
        <ol className="shell video-index__list">
          {videoStories.filter((story) => story.id !== "company" && story.id !== "industries").map((story) => (
            <li key={story.id} data-reveal>
              <span>{story.number}</span>
              <strong>{videos[story.id].title}</strong>
              <em>{t(`videos.placements.${story.placement}`)}</em>
              <i>{t("videos.statusShort")}</i>
            </li>
          ))}
        </ol>
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
