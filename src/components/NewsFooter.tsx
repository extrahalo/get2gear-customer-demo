import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import StudioCredit from "@/components/StudioCredit";
import { assetPath } from "@/lib/site";
import FooterContacts from "@/components/FooterContacts";

export default async function NewsFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.footer" });
  return <footer className="site-footer" data-dark>
    <div className="shell site-footer__top">
      <div className="site-footer__brand"><Link href="/" className="site-footer__logo"><Image src={assetPath("/images/get2gear-logo-horizontal.png")} alt="Get2Gear" width={1002} height={135} /></Link><p>{t("tagline")}</p></div>
      <FooterContacts />
    </div>
    <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Get2Gear. {t("rights")}.</span><span>{t("locations")}</span><StudioCredit /></div>
  </footer>;
}
