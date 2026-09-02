"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav className="locale-switcher" aria-label="Language">
      {routing.locales.map((item) => (
        <Link
          key={item}
          href={pathname}
          locale={item}
          className={item === locale ? "is-active" : undefined}
          aria-current={item === locale ? "page" : undefined}
        >
          {item}
        </Link>
      ))}
    </nav>
  );
}
