import { getTranslations } from "next-intl/server";
import VideoSlot from "@/components/VideoSlot";

export default async function CompanyApproach({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const industries = t.raw("industries.items") as { number: string; title: string; body: string }[];
  const capabilities = t.raw("capabilities.items") as { title: string; desc: string }[];
  const policies = t.raw("policies.items") as { number: string; title: string; body: string }[];
  const video = () => <VideoSlot number="07" title={t("videos.items.industries.title")} summary={t("videos.items.industries.summary")} status={t("videos.status")} />;
  return <>      <section id="industries" className="industries section-pad">
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
          <div className="industries__film">{video()}</div>
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
      </section></>;
}
