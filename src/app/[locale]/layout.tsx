import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Condensed,
} from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/i18n/routing";
import Experience from "@/components/Experience";
import { CONTACT_EMAIL, SITE_URL, type Locale } from "@/lib/site";
import "../globals.css";

const body = IBM_Plex_Sans({
  variable: "--font-body",
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
});

const display = IBM_Plex_Sans_Condensed({
  variable: "--font-display",
  weight: ["500", "600", "700"],
  subsets: ["latin", "latin-ext", "cyrillic-ext"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { ru: "/ru", kk: "/kk", en: "/en" },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale,
      siteName: "Get2Gear",
      images: [
        {
          url: "/images/hero-mine.jpg",
          width: 1920,
          height: 1280,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/images/hero-mine.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const clientMessages = { header: messages.header };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Get2Gear",
    url: SITE_URL,
    logo: `${SITE_URL}/images/get2gear-logo-horizontal.png`,
    email: CONTACT_EMAIL,
    areaServed: ["Kazakhstan", "CIS"],
    availableLanguage: ["Russian", "Kazakh", "English"],
  };

  return (
    <html
      lang={locale}
      className={`${body.variable} ${display.variable} ${mono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <NextIntlClientProvider
          locale={locale as Locale}
          messages={clientMessages}
        >
          <Experience>{children}</Experience>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
