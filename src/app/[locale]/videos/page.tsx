import type {Metadata} from "next";
import Image from "next/image";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import SiteHeader from "@/components/SiteHeader";
import FooterContacts from "@/components/FooterContacts";
import StudioCredit from "@/components/StudioCredit";
import VideoSlot from "@/components/VideoSlot";
import {videoDemonstrations, videoStories, type VideoStoryId} from "@/content/industrial";
import {assetPath} from "@/lib/site";

const copy = {
  ru: {title: "Get2Gear в действии", intro: "Все десять видео Get2Gear: семь коротких фильмов о компании и технологиях и три демонстрации оборудования.", back: "На главную", download: "Скачать видео"},
  en: {title: "Get2Gear in action", intro: "All ten Get2Gear videos: seven short films about the company and its technology, plus three equipment demonstrations.", back: "Back to home", download: "Download video"},
  kk: {title: "Get2Gear жұмыс үстінде", intro: "Get2Gear компаниясының он бейнесі: компания мен технологиялар туралы жеті қысқа бейне және жабдықтың үш көрсетілімі. Қазақша дубляж әзірге жоқ.", back: "Басты бетке", download: "Бейнені жүктеу"},
};
export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const c = copy[locale as keyof typeof copy] ?? copy.ru;
  return {title: c.title, description: c.intro, alternates: {canonical: `/${locale}/videos/`, languages: {ru: "/ru/videos/", en: "/en/videos/", kk: "/kk/videos/"}}};
}
export default async function VideosPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const c = copy[locale as keyof typeof copy] ?? copy.ru;
  const t = await getTranslations({locale, namespace: "home"});
  const videos = t.raw("videos.items") as Record<VideoStoryId, {title: string; summary: string}>;
  const demonstrations = t.raw("videos.demonstrations") as Record<string, {title: string; summary: string}>;
  const mediaBase = "/videos/20260929-final-delivery";
  return <main className="video-library">
    <SiteHeader />
    <div className="shell descase-page__intro">
      <Link className="text-link" href="/">{c.back} ↗</Link>
      <h1>{c.title}</h1><p className="video-library__intro">{c.intro}</p>
    </div>
    <div className="shell video-library__films">
      {videoStories.map(story => <section key={story.id} id={`v${Number(story.number)}`}>
        <p className="section-label">{story.number} / GET2GEAR</p>
        <VideoSlot number={story.number} title={videos[story.id].title} summary={videos[story.id].summary} status={t("videos.status")} />
      </section>)}
      {videoDemonstrations.map(item => {
        const source = assetPath(`${mediaBase}/${item.file}`);
        const poster = assetPath(`${mediaBase}/${item.file.replace(/_1080p\.mp4$/, "_poster.jpg")}`);
        return <section key={item.id} id={item.id} className="video-library__demo">
          <p className="section-label">{item.number} / {item.brand} · {item.duration}</p><h2>{demonstrations[item.id].title}</h2><p>{demonstrations[item.id].summary}</p>
          <video controls playsInline preload="none" width={1920} height={1080} poster={poster} aria-label={demonstrations[item.id].title}><source src={source} type="video/mp4" /></video>
          <a className="text-link" href={source} download>{c.download} ↓</a>
        </section>;
      })}
    </div>
    <footer className="site-footer" data-dark>
      <div className="shell site-footer__top"><div className="site-footer__brand"><span className="site-footer__logo"><Image src={assetPath("/images/get2gear-logo-horizontal.png")} alt="Get2Gear" width={1002} height={135} /></span><p>{t("footer.tagline")}</p></div><FooterContacts /></div>
      <div className="shell site-footer__bottom"><span>© 2026 Get2Gear. {t("footer.rights")}.</span><span>{t("footer.locations")}</span><StudioCredit /></div>
    </footer>
  </main>;
}
