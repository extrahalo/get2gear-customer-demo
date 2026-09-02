type VideoSlotProps = {
  number: string;
  title: string;
  summary: string;
  status: string;
  duration: string;
  compact?: boolean;
  inverse?: boolean;
};

export default function VideoSlot({
  number,
  title,
  summary,
  status,
  duration,
  compact = false,
  inverse = false,
}: VideoSlotProps) {
  return (
    <article
      className={`video-slot ${compact ? "video-slot--compact" : ""} ${
        inverse ? "video-slot--inverse" : ""
      }`}
      data-video-number={number}
      data-reveal
    >
      <div className="video-slot__frame" aria-hidden="true">
        <span className="video-slot__index">FILM / {number}</span>
        <span className="video-slot__play">▶</span>
        <span className="video-slot__duration">{duration}</span>
        <i />
      </div>
      <div className="video-slot__copy">
        <span>{status}</span>
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>
    </article>
  );
}
