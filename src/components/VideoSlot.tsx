"use client";

import {useState} from "react";
import {useLocale} from "next-intl";
import {assetPath} from "@/lib/site";

type VideoSlotProps = {
  number: string;
  title: string;
  summary: string;
  status: string;
  compact?: boolean;
  inverse?: boolean;
};

export default function VideoSlot({
  number,
  title,
  summary,
  status,
  compact = false,
  inverse = false,
}: VideoSlotProps) {
  const locale = useLocale();
  const [variant, setVariant] = useState(locale === "en" ? "EN" : "RU");
  const videoNumber = Number(number);
  const base = `/videos/20260929-final-delivery/Get2Gear_V${videoNumber}`;
  const duration = ({2: "01:04", 3: "01:02", 4: "01:04", 7: "01:04"} as Record<number, string>)[videoNumber] ?? "01:00";
  const source = assetPath(`${base}_${variant}_1080p.mp4`);
  const labels = locale === "en"
    ? {version: "Video version", russian: "Russian", download: "Download video"}
    : locale === "kk"
      ? {version: "Бейне нұсқасы", russian: "Орысша", download: "Бейнені жүктеу"}
      : {version: "Версия ролика", russian: "Русский", download: "Скачать видео"};
  return (
    <article
      className={`video-slot ${compact ? "video-slot--compact" : ""} ${
        inverse ? "video-slot--inverse" : ""
      }`}
      data-video-number={number}
      data-reveal
    >
      <div className="video-slot__frame video-slot__frame--ready">
        <video key={source} controls playsInline preload="none" poster={assetPath(`${base}_${variant}_poster.jpg`)} aria-label={title} width={1920} height={1080}>
          <source src={source} type="video/mp4" />
          <a href={source}>{labels.download}</a>
        </video>
      </div>
      <div className="video-slot__versions" role="group" aria-label={labels.version}>
        {[["RU", labels.russian], ["EN", "English"]].map(([value, label]) => (
          <button key={value} type="button" aria-pressed={variant === value} onClick={() => setVariant(value)}>{label}</button>
        ))}
        <a href={source} download>{labels.download}</a>
      </div>
      <div className="video-slot__copy">
        <span>{status} / {duration}</span>
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>
    </article>
  );
}
