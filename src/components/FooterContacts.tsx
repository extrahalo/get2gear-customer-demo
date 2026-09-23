import { CONTACT_EMAIL, PROJECTS_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/site";

export default function FooterContacts() {
  return <div className="site-footer__contacts">
    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
    {PROJECTS_EMAIL && <a href={`mailto:${PROJECTS_EMAIL}`}>{PROJECTS_EMAIL}</a>}
    <a href={`tel:${CONTACT_PHONE_HREF}`}>{CONTACT_PHONE}</a>
  </div>;
}
