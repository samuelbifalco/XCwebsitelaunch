"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref, useIsDesktop } from "@/lib/motion";
import SplitHeadline from "./SplitHeadline";

const ROLES = [
  { t: "Inspects the property", d: "On the roof, in the attic, at the gutter line — seeing what the photos alone can't show." },
  { t: "Documents the damage", d: "Photographs, measurements and notes captured while the evidence is fresh." },
  { t: "Guides the homeowner", d: "A steady, experienced voice for someone who has never been through a claim before." },
];

export default function Adjuster() {
  const root = useRef<HTMLElement>(null);
  const { reduced, ready } = useMotionPref();
  const desktop = useIsDesktop();

  useGSAP(
    () => {
      if (!ready || reduced) return;
      if (!desktop) {
        // Phones: lighter, unpinned reveal so the stacked layout stays readable.
        gsap.fromTo(".adj-media", { clipPath: "inset(12% 12% 12% 12% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: ".adj-media", start: "top 90%", end: "top 25%", scrub: 1 } });
        gsap.fromTo(".adj-img", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".adj-media", start: "top bottom", end: "bottom top", scrub: 1 } });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=160%", scrub: 1, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(".adj-media", { clipPath: "inset(18% 30% 18% 30% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.45 }, 0)
        .fromTo(".adj-img", { scale: 1.35 }, { scale: 1.05, duration: 1 }, 0)
        .fromTo(".adj-grid", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.35)
        .fromTo(".adj-bracket", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, stagger: 0.08, duration: 0.15, ease: "power2.out" }, 0.4)
        .fromTo(".adj-panel", { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.2 }, 0.5)
        .fromTo(".adj-role", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.12 }, 0.62);
    },
    { scope: root, dependencies: [reduced, ready, desktop], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="adjuster" aria-labelledby="adj-title" className="relative min-h-[100svh] overflow-hidden bg-ink lg:h-[100svh]">
      <div className="adj-media relative h-[72svh] overflow-hidden lg:absolute lg:inset-0 lg:h-auto">
        <picture>
          <source media="(max-aspect-ratio: 4/5)" srcSet="/media/duo_concerned_m.webp" />
          { }
          <img
            src="/media/duo_concerned.webp"
            alt="A public adjuster holding a tablet points toward the damaged roof while a worried homeowner listens with her arms crossed."
            loading="lazy"
            className="adj-img h-full w-full object-cover object-[35%_center]"
          />
        </picture>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink/10 lg:via-ink/20 lg:to-ink/90" />
        <div aria-hidden className="adj-grid grid-lines absolute inset-0 opacity-60 [mask-image:linear-gradient(90deg,transparent,black_60%)]" />
        {/* viewfinder brackets */}
        <div aria-hidden className="absolute inset-0 hidden md:block">
          <Bracket className="adj-bracket left-[17%] top-[16%] h-[34%] w-[16%]" label="Homeowner" />
          <Bracket className="adj-bracket left-[35%] top-[12%] h-[38%] w-[17%]" label="Adjuster" />
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-24 flex max-w-7xl px-5 pb-16 sm:px-8 lg:mt-0 lg:min-h-[100svh] lg:items-center lg:justify-end lg:pb-0">
        <div className="adj-panel glass w-full max-w-lg rounded-3xl p-6 sm:p-9">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 02 — The adjuster arrives</p>
          <SplitHeadline
            className="text-[clamp(2rem,4.4vw,3.6rem)] font-semibold leading-[1] tracking-[-0.04em]"
            lines={[{ text: "Expertise Makes" }, { text: "the Difference.", className: "text-cyan" }]}
          />
          <p className="mt-4 text-white/70">
            A professional public adjuster brings experience, judgment and guidance. That part of the job belongs to people.
          </p>
          <ul className="mt-6 space-y-4">
            {ROLES.map((r, i) => (
              <li key={r.t} className="adj-role flex gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan/40 font-mono text-[11px] text-cyan">
                  0{i + 1}
                </span>
                <div>
                  <p className="font-medium">{r.t}</p>
                  <p className="text-sm text-white/60">{r.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-white/10 pt-5 text-sm text-white/80">
            XactaClaim is built to <em className="font-[family-name:var(--font-instrument-serif)] text-lg text-cyan">support</em> that expertise — not replace it.
          </p>
        </div>
      </div>
    </section>
  );
}

function Bracket({ className, label }: { className: string; label: string }) {
  const c = "absolute h-5 w-5 border-cyan";
  return (
    <div className={`absolute ${className}`}>
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
      <span className="absolute -top-6 left-0 rounded bg-electric/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">{label}</span>
    </div>
  );
}
