import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SiteHeader from "@/components/SiteHeader";
import StudioCredit from "@/components/StudioCredit";
import { Link } from "@/i18n/navigation";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  assetPath,
  SITE_URL,
} from "@/lib/site";

const serviceSlugs = ["engineering", "equipment", "automation"] as const;
type ServiceSlug = (typeof serviceSlugs)[number];

type FocusItem = { title: string; body: string };
type DivisionLink = { num: string; title: string; slug: ServiceSlug };
type ServiceCopy = {
  number: string;
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  focus: FocusItem[];
  detailLabel: string;
  detailTitle: string;
  detailItems: FocusItem[];
  steps: FocusItem[];
  offerTitle: string;
  offerBody: string;
  offerItems: string[];
};

function isServiceSlug(value: string): value is ServiceSlug {
  return serviceSlugs.includes(value as ServiceSlug);
}

export function generateStaticParams() {
  return serviceSlugs.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}): Promise<Metadata> {
  const { locale, service } = await params;
  if (!isServiceSlug(service)) return {};

  const t = await getTranslations({ locale, namespace: "home.services" });
  const copy = t.raw(`items.${service}`) as ServiceCopy;

  return {
    title: `${copy.eyebrow} | Get2Gear`,
    description: copy.lead,
    alternates: {
      canonical: `/${locale}/${service}`,
      languages: {
        ru: `/ru/${service}`,
        kk: `/kk/${service}`,
        en: `/en/${service}`,
      },
    },
    openGraph: {
      title: `${copy.eyebrow} | Get2Gear`,
      description: copy.lead,
      type: "website",
      url: `${SITE_URL}/${locale}/${service}`,
      images: [{ url: copy.image, alt: copy.imageAlt }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale, service } = await params;
  if (!isServiceSlug(service)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home.services" });
  const divisions = await getTranslations({ locale, namespace: "home.divisions" });
  const footer = await getTranslations({ locale, namespace: "home.footer" });
  const copy = t.raw(`items.${service}`) as ServiceCopy;
  const divisionLinks = divisions.raw("items") as DivisionLink[];

  return (
    <main className="service-page">
      <SiteHeader />

      <section className="service-hero" data-dark>
        <Image
          className="service-hero__image"
          src={assetPath(copy.image)}
          alt={copy.imageAlt}
          fill
          priority
          sizes="100vw"
        />
        <div className="service-hero__veil" />
        <div className="service-hero__frame shell" aria-hidden="true" />
        <div className="service-hero__content shell">
          <Link className="service-hero__back" href="/#divisions">
            <span aria-hidden="true">←</span> {t("back")}
          </Link>
          <div className="service-hero__copy">
            <p className="section-label section-label--light">
              <i /> {copy.number} / {copy.eyebrow}
            </p>
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
          </div>
        </div>
      </section>

      <section className="service-route" aria-label={t("navigationLabel")}>
        <div className="shell service-route__inner">
          <p className="section-label"><i /> {t("navigationLabel")}</p>
          <nav>
            {divisionLinks.map((item) => {
              const current = item.slug === service;
              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  aria-current={current ? "page" : undefined}
                >
                  <span>{item.num}</span>
                  <strong>{item.title}</strong>
                  <i aria-hidden="true">{current ? "●" : "↗"}</i>
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="service-focus section-pad">
        <div className="shell service-focus__heading">
          <p className="section-label"><i /> {t("offerLabel")}</p>
          <p>{copy.lead}</p>
        </div>
        <div className="shell service-focus__grid">
          {copy.focus.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-details section-pad">
        <div className="shell service-details__heading">
          <p className="section-label"><i /> {copy.detailLabel}</p>
          <h2>{copy.detailTitle}</h2>
        </div>
        <ol className="shell service-details__list">
          {copy.detailItems.map((item, index) => (
            <li key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="service-method section-pad" data-dark>
        <div className="shell service-method__heading">
          <p className="section-label section-label--light"><i /> {t("approachLabel")}</p>
          <h2>{t("approachTitle")}</h2>
        </div>
        <ol className="shell service-method__list">
          {copy.steps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="service-offer">
        <div className="service-offer__media">
          <Image src={assetPath(copy.image)} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <div className="service-offer__content section-pad">
          <p className="section-label"><i /> {copy.number} / Get2Gear</p>
          <h2>{copy.offerTitle}</h2>
          <p>{copy.offerBody}</p>
          <ul>
            {copy.offerItems.map((item) => <li key={item}><span>+</span>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="service-contact section-pad" data-dark>
        <div className="shell service-contact__grid">
          <p className="section-label section-label--light"><i /> {t("ctaLabel")}</p>
          <div>
            <h2>{t("ctaTitle")}</h2>
            <p>{t("ctaBody")}</p>
            <a className="button button--primary" href={`mailto:${CONTACT_EMAIL}`}>
              {t("cta")} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer" data-dark>
        <div className="shell site-footer__top">
          <div className="site-footer__brand"><span className="site-footer__logo"><Image src={assetPath("/images/get2gear-logo-horizontal.png")} alt="Get2Gear" width={1002} height={135} /></span><p>{footer("tagline")}</p></div>
          <div className="site-footer__contacts"><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><a href={`tel:${CONTACT_PHONE_HREF}`}>{CONTACT_PHONE}</a></div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Get2Gear. {footer("rights")}.</span><span>{footer("locations")}</span><StudioCredit /></div>
      </footer>
    </main>
  );
}
