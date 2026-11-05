"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/lib/motion";
import { LINKS, withUtm } from "@/lib/links";
import CtaLink, { Arrow } from "./CtaLink";
import SplitHeadline from "./SplitHeadline";
import Rain from "./Rain";
import { scrollToTarget } from "./SmoothScroll";

/** Camera focus: the front of the house. Shared with Chaos so the push-in continues. */
export const HOUSE_ORIGIN = "46% 64%";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
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
      // Scroll: the camera pushes toward the front door and passes into darkness.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=120%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          onLeave: () => video.current?.pause(),
          onEnterBack: () => video.current?.play().catch(() => {}),
        },
      });
      tl.to(".hero-cam", { scale: 2.1, duration: 1, ease: "power1.in" }, 0)
        .to(".hero-eyebrow", { y: -60, opacity: 0, filter: "blur(6px)", duration: 0.25 }, 0.02)
        .to(".hero-title", { y: -110, opacity: 0, filter: "blur(10px)", scale: 0.96, duration: 0.35 }, 0.05)
        .to(".hero-sub", { y: -80, opacity: 0, filter: "blur(6px)", duration: 0.3 }, 0.1)
        .to(".hero-ctas", { y: -60, opacity: 0, duration: 0.25 }, 0.14)
        .to(".hero-rain-near", { opacity: 0.9, scale: 1.3, duration: 0.8 }, 0)
        .to(".hero-shade", { opacity: 1, duration: 0.45, ease: "power2.in" }, 0.55)
        .to(".hero-cue", { opacity: 0, duration: 0.1 }, 0);

      // Depth parallax: each layer drifts a different distance with the pointer.
      const layers: [string, number][] = [
        [".hero-drift", 14],
        [".hero-rain-far", 24],
        [".hero-rain-near", 44],
        [".hero-copy-inner", -10],
      ];
      const movers = layers.map(([sel, amt]) => ({
        amt,
        x: gsap.quickTo(sel, "x", { duration: 1.4, ease: "power3" }),
        y: gsap.quickTo(sel, "y", { duration: 1.4, ease: "power3" }),
      }));
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(-nx * m.amt);
          m.y(-ny * m.amt * 0.6);
        });
      };
      window.addEventListener("pointermove", onMove);

      // Scroll cue reacts to scroll velocity.
      const dotY = gsap.quickTo(".hero-cue-dot", "y", { duration: 0.4, ease: "power3" });
      const lineS = gsap.quickTo(".hero-cue-line", "scaleY", { duration: 0.4, ease: "power3" });
      const vel = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-1, 1, self.getVelocity() / 2500);
          dotY(v * 14);
          lineS(1 + Math.abs(v) * 0.8);
        },
      });
      return () => {
        window.removeEventListener("pointermove", onMove);
        vel.kill();
      };
    },
    { scope: root, dependencies: [reduced, ready], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="top" aria-label="When disaster strikes" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
      <div className="hero-cam absolute inset-0 will-change-transform" style={{ transformOrigin: HOUSE_ORIGIN }}>
        <div className="hero-drift absolute -inset-8">
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
              poster="/media/house_storm.webp"
              aria-hidden
              onCanPlay={() => setVideoReady(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${videoReady ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </div>
      </div>

      {/* atmosphere: far rain, sky flash, near rain */}
      <div className="hero-rain-far absolute -inset-8">
        <Rain density={80} speed={0.7} weight={0.6} className="opacity-60" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 animate-[lightning_9s_infinite] bg-[radial-gradient(60%_50%_at_70%_10%,rgba(190,225,255,.5),transparent_70%)] opacity-0 mix-blend-screen" />
      <div className="hero-rain-near absolute -inset-10 opacity-50">
        <Rain density={28} speed={1.6} weight={1.7} className="blur-[0.6px]" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,15,.55)_0%,rgba(3,6,15,.15)_35%,rgba(3,6,15,.35)_65%,#03060f_100%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_46%_60%,transparent_45%,rgba(3,6,15,.65)_100%)]" />
      <div aria-hidden className="hero-shade absolute inset-0 bg-ink opacity-0" />
      <div aria-hidden className="grain absolute inset-0 overflow-hidden" />

      <div className="hero-copy relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-[14svh] sm:px-8 md:justify-center md:pb-0">
        <div className="hero-copy-inner">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-eyebrow mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
            AI-assisted claim workspace for public adjusters
          </motion.p>
          <div className="hero-title origin-left">
            <SplitHeadline
              as="h1"
              immediate
              delay={0.35}
              className="max-w-5xl text-[clamp(2.6rem,7.6vw,7rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
              lines={[{ text: "When Disaster Strikes," }, { text: "Clarity Matters.", className: "shine-text" }]}
            />
          </div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.2 }}
            className="hero-sub mt-6 max-w-xl text-[17px] leading-relaxed text-white/75 sm:text-lg"
          >
            One powerful workspace for the adjusters helping homeowners navigate property claims.
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.45 }}
            className="hero-ctas mt-9 flex flex-wrap items-center gap-3"
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
      </div>

      <div aria-hidden className="hero-cue absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/30">
          <span className="hero-cue-dot mt-2 h-2 w-1 rounded-full bg-cyan shadow-[0_0_10px_#7fd8ff]" />
        </span>
        <span className="hero-cue-line block h-8 w-px origin-top bg-gradient-to-b from-cyan/70 to-transparent" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll to enter</span>
      </div>
    </section>
  );
}
