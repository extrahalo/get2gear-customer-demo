"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { CONTACT_EMAIL } from "@/lib/site";

const NAV_ITEMS = ["directions", "about", "solutions", "products", "results", "videos", "contacts"] as const;
const SERVICE_ITEMS = ["engineering", "equipment", "automation"] as const;

export default function SiteHeader() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hrefFor = (item: (typeof NAV_ITEMS)[number]) => item === "directions" ? "/#divisions" : `/#${item}`;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => document.documentElement.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="site-header__inner">
          <Link href="/" className="brand-lockup" aria-label="Get2Gear">
            <Image
              src="/images/get2gear-logo.png"
              alt="Get2Gear"
              width={300}
              height={110}
              priority
            />
          </Link>

          <nav className="site-nav" aria-label={t("navLabel")}>
            {NAV_ITEMS.map((item) => (
              <Link key={item} href={hrefFor(item)}>
                {t(`nav.${item}`)}
              </Link>
            ))}
          </nav>

          <div className="site-header__tools">
            <LocaleSwitcher />
            <a className="header-cta" href={`mailto:${CONTACT_EMAIL}`}>
              {t("request")}
              <span aria-hidden="true">↗</span>
            </a>
            <button
              className="menu-toggle"
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("close") : t("menu")}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`}>
        <nav aria-label={t("navLabel")}>
          {NAV_ITEMS.map((item, index) => (
            <Link key={item} href={hrefFor(item)} onClick={() => setOpen(false)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {t(`nav.${item}`)}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__services">
          <p>{t("serviceLabel")}</p>
          {SERVICE_ITEMS.map((item, index) => (
            <Link key={item} href={`/${item}`} onClick={() => setOpen(false)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {t(`services.${item}`)}
              <i aria-hidden="true">↗</i>
            </Link>
          ))}
        </div>
        <div className="mobile-menu__footer">
          <LocaleSwitcher />
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </div>
    </>
  );
}
