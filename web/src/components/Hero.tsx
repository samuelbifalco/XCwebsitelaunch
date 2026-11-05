"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/lib/motion";
import { LINKS, withUtm } from "@/lib/links";
import CtaLink, { Arrow } from "./CtaLink";
import SplitHeadline from "./SplitHeadline";
import Rain from "./Rain";
import { scrollToTarget } from "./SmoothScroll";
import { motion } from "motion/react";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { reduced, ready } = useMotionPref();
  const [src, setSrc] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Pick the right crop after mount; never autoplay in reduced motion.
  useEffect(() => {
    if (!ready || reduced) {
      setSrc(null);
      return;
    }
    const portrait = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
    setSrc(portrait ? "/media/hero_storm_m.mp4" : "/media/hero_storm.mp4");
  }, [ready, reduced]);

  useEffect(() => {
    const v = video.current;
    if (!v || !src) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [src]);

  useGSAP(
    () => {
      if (!ready || reduced) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=90%", scrub: true, pin: true, anticipatePin: 1 },
      });
      tl.to(media.current, { scale: 1.32, yPercent: 6, ease: "none" }, 0)
        .to(".hero-copy", { yPercent: -40, opacity: 0, ease: "power1.in" }, 0)
        .to(".hero-shade", { opacity: 0.85, ease: "none" }, 0)
        .to(".hero-cue", { opacity: 0, duration: 0.2 }, 0);

      // Mouse parallax — subtle camera drift.
      const xTo = gsap.quickTo(".hero-drift", "x", { duration: 1.4, ease: "power3" });
      const yTo = gsap.quickTo(".hero-drift", "y", { duration: 1.4, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        xTo((e.clientX / window.innerWidth - 0.5) * -24);
        yTo((e.clientY / window.innerHeight - 0.5) * -14);
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root, dependencies: [reduced, ready], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="top" aria-label="When disaster strikes" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
      <div ref={media} className="absolute inset-0 will-change-transform">
        <div className="hero-drift absolute -inset-6">
          <picture>
            <source media="(max-aspect-ratio: 4/5)" srcSet="/media/house_storm_m.webp" />
            { }
            <img
              src="/media/house_storm.webp"
              alt="A two-story suburban house the morning after a severe storm: missing shingles, a loose blue tarp, a hanging gutter and fallen branches on the lawn."
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
          </picture>
          {src && (
            <video
              ref={video}
              key={src}
              src={src}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
              aria-hidden
              onCanPlay={() => setVideoReady(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${videoReady ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </div>
      </div>

      <Rain density={130} className="opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0 animate-[lightning_9s_infinite] bg-[radial-gradient(60%_50%_at_70%_10%,rgba(190,225,255,.5),transparent_70%)] opacity-0 mix-blend-screen" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,15,.55)_0%,rgba(3,6,15,.15)_35%,rgba(3,6,15,.35)_65%,#03060f_100%)]" />
      <div aria-hidden className="hero-shade absolute inset-0 bg-ink opacity-0" />
      <div aria-hidden className="grain absolute inset-0 overflow-hidden" />

      <div className="hero-copy relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-[14svh] sm:px-8 md:justify-center md:pb-0">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan backdrop-blur"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
          AI-assisted claim workspace for public adjusters
        </motion.p>
        <SplitHeadline
          as="h1"
          immediate
          delay={0.35}
          className="max-w-5xl text-[clamp(2.6rem,7.6vw,7rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
          lines={[
            { text: "When Disaster Strikes," },
            { text: "Clarity Matters.", className: "bg-gradient-to-r from-white via-cyan to-electric bg-clip-text text-transparent" },
          ]}
        />
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.2 }}
          className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/75 sm:text-lg"
        >
          One powerful workspace for the adjusters helping homeowners navigate property claims.
        </motion.p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.45 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <CtaLink href={withUtm(LINKS.home, "hero-explore")} event="cta_click" location="hero_primary">
            Explore XactaClaim <Arrow />
          </CtaLink>
          <CtaLink
            href="#chaos"
            external={false}
            variant="ghost"
            event="experience_start"
            location="hero_secondary"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#chaos");
            }}
          >
            See the Experience
            <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none">
              <path d="M10 4v11m0 0 4.5-4.5M10 15l-4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </CtaLink>
        </motion.div>
      </div>

      <div aria-hidden className="hero-cue absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50 md:flex">
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_1.8s_ease-in-out_infinite] bg-cyan" />
        </span>
      </div>
    </section>
  );
}
