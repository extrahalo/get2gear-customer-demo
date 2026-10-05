import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
  number: string;
  title: string;
  placement: string;
  duration: string;
  poster: string;
  href: string;
  watchLabel: string;
};

export default function VideoIndexRow({
  number,
  title,
  placement,
  duration,
  poster,
  href,
  watchLabel,
}: Props) {
  return (
    <li data-reveal>
      <Link className="video-index__link" href={href} aria-label={`${watchLabel}: ${title}`}>
        <span className="video-index__number">{number}</span>
        <span className="video-index__thumb">
          <Image src={poster} alt="" fill sizes="(max-width: 640px) 112px, (max-width: 900px) 144px, 176px" />
          <span className="video-index__play" aria-hidden="true">▶</span>
          <span className="video-index__duration">{duration}</span>
        </span>
        <span className="video-index__details">
          <strong>{title}</strong>
          <small>{placement}</small>
        </span>
        <span className="video-index__action">{watchLabel} <span aria-hidden="true">↗</span></span>
      </Link>
    </li>
  );
}
