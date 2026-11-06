"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { track } from "@/lib/analytics";
import { LINKS, withUtm } from "@/lib/links";
import CtaLink, { Arrow } from "./CtaLink";

const OPEN = "xc:open-trailer";

/** Opens the trailer from anywhere on the page. */
export function openTrailer(location: string) {
  track("trailer_open", { location });
  window.dispatchEvent(new Event(OPEN));
}

export function TrailerButton({ location, className = "", compact = false }: { location: string; className?: string; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => openTrailer(location)}
      className={`group inline-flex items-center gap-3 rounded-full text-[15px] font-medium text-white transition ${compact ? "" : "py-2 pl-2 pr-5 hover:bg-white/5"} ${className}`}
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition group-hover:scale-110 group-hover:border-cyan/70">
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-cyan/40 [animation-duration:2.4s]" />
        <svg aria-hidden viewBox="0 0 16 16" className="ml-0.5 h-3.5 w-3.5" fill="currentColor">
          <path d="M4 2.5v11l9-5.5z" />
        </svg>
      </span>
      {!compact && "Watch the trailer"}
      {compact && <span className="sr-only">Watch the trailer</span>}
    </button>
  );
}

/** Full-screen trailer player. Sound plays only because the visitor pressed play. */
export default function Trailer() {
  const [open, setOpen] = useState(false);
  const [ended, setEnded] = useState(false);
  const v = useRef<HTMLVideoElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    v.current?.pause();
    setOpen(false);
    window.__lenis?.start();
    lastFocus.current?.focus();
  }, []);

  useEffect(() => {
    const on = () => {
      lastFocus.current = document.activeElement as HTMLElement;
      setEnded(false);
      setOpen(true);
      window.__lenis?.stop();
    };
    window.addEventListener(OPEN, on);
    return () => window.removeEventListener(OPEN, on);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", key);
    v.current?.play().catch(() => {});
    return () => window.removeEventListener("keydown", key);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="XactaClaim trailer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 sm:p-8"
          onClick={(e) => e.target === e.currentTarget && close()}
          data-lenis-prevent
        >
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Close ✕
          </button>
          <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative w-full max-w-6xl">
            <video
              ref={v}
              src="/media/xactaclaim_trailer.mp4"
              poster="/media/xactaclaim_trailer_poster.webp"
              controls
              playsInline
              preload="auto"
              onPlay={() => setEnded(false)}
              onEnded={() => {
                setEnded(true);
                track("trailer_complete", {});
              }}
              className="aspect-video w-full rounded-xl bg-black shadow-[0_0_120px_-20px_rgba(36,160,237,.6)]"
            >
              <track kind="captions" src="/media/xactaclaim_trailer.vtt" srcLang="en" label="English" default />
            </video>
            <AnimatePresence>
              {ended && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-xl bg-ink/85 p-6 text-center backdrop-blur"
                >
                  <p className="text-2xl font-semibold tracking-tight sm:text-4xl">Bring clarity to your next claim.</p>
                  <p className="text-white/70">Start with 1 claim credit · 1 AI trial action · no credit card.</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <CtaLink href={withUtm(LINKS.register, "trailer-start-free")} event="cta_click" location="trailer_end">
                      Start free <Arrow />
                    </CtaLink>
                    <CtaLink href={withUtm(LINKS.home, "trailer-explore")} event="cta_click" location="trailer_end_secondary" variant="ghost">
                      Explore XactaClaim
                    </CtaLink>
                  </div>
                  <button type="button" onClick={() => v.current?.play()} className="text-sm text-white/60 underline decoration-white/30 hover:text-white">
                    Watch again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
