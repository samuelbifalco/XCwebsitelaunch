"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useMotionPref } from "@/lib/motion";

type Props = {
  src: string;
  mobileSrc?: string;
  poster: string;
  /** Image shown instead of the video in reduced-motion mode (defaults to poster). */
  reducedPoster?: string;
  className?: string;
  /** "autoplay": loops while visible. "scrub": never plays; a parent sets currentTime from scroll. */
  mode?: "autoplay" | "scrub";
  label?: string;
  style?: React.CSSProperties;
};

/**
 * Muted, lazy-loaded video. Loads only when near the viewport, pauses off-screen,
 * and shows its poster image in reduced-motion mode or if the video fails.
 */
const LazyVideo = forwardRef<HTMLVideoElement | null, Props>(function LazyVideo(
  { src, mobileSrc, poster, reducedPoster, className = "", mode = "autoplay", label, style },
  ref
) {
  const v = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => v.current as HTMLVideoElement);
  const { reduced, ready } = useMotionPref();
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = v.current;
    if (!el || !ready || reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setUrl((u) => u ?? (mobileSrc && window.matchMedia("(max-aspect-ratio: 4/5)").matches ? mobileSrc : src));
          if (mode === "autoplay") el.play().catch(() => {});
        } else if (mode === "autoplay") {
          el.pause();
        }
      },
      { rootMargin: mode === "scrub" ? "150% 0px" : "25% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready, reduced, src, mobileSrc, mode]);

  useEffect(() => {
    const el = v.current;
    if (el && url && mode === "autoplay") el.play().catch(() => {});
  }, [url, mode]);

  if (reduced || failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={reduced ? (reducedPoster ?? poster) : poster} alt={label ?? ""} aria-hidden={!label} className={className} style={style} loading="lazy" />;
  }
  return (
    <video
      ref={v}
      src={url ?? undefined}
      poster={poster}
      muted
      playsInline
      loop={mode === "autoplay"}
      preload={mode === "scrub" ? "auto" : "metadata"}
      aria-label={label}
      aria-hidden={!label}
      onError={() => url && setFailed(true)}
      className={className}
      style={style}
    />
  );
});

export default LazyVideo;

/** Maps 0–1 progress onto a video's timeline, throttled to animation frames. */
export function scrubTo(video: HTMLVideoElement | null, progress: number) {
  if (!video || !video.duration || Number.isNaN(video.duration)) return;
  const t = Math.min(video.duration - 0.05, Math.max(0, progress * video.duration));
  const s = video as HTMLVideoElement & { __raf?: number; __t?: number };
  s.__t = t;
  if (s.__raf) return;
  s.__raf = requestAnimationFrame(() => {
    s.__raf = 0;
    if (s.__t !== undefined && Math.abs(video.currentTime - s.__t) > 0.02) video.currentTime = s.__t;
  });
}
