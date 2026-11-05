"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/lib/motion";
import { LINKS, withUtm } from "@/lib/links";
import { track } from "@/lib/analytics";
import CtaLink, { Arrow } from "./CtaLink";
import Rain from "./Rain";

// Pricing as published on xactaclaim.com/pricing (plus applicable tax).
const PLANS = [
  { n: "Solo", p: "$0", d: "1 trial claim · 1 live AI action", href: LINKS.register, cta: "Try free" },
  { n: "Pro", p: "$19.99/mo", d: "5 claim credits per cycle · AI review & communications", href: LINKS.pricing, cta: "View Pro" },
  { n: "Pro+", p: "$34.99/mo", d: "7 claim credits per cycle · estimate comparison & demand drafting", href: LINKS.pricing, cta: "View Pro+" },
];

export default function Finale() {
  const root = useRef<HTMLElement>(null);
  const { reduced, ready } = useMotionPref();

  useGSAP(
    () => {
      if (!ready || reduced) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".fn-stage", start: "top top", end: "+=170%", scrub: 1, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(".fn-media", { scale: 1.3 }, { scale: 1.02, duration: 1 }, 0)
        .fromTo(".fn-day", { clipPath: "circle(0% at 22% 48%)" }, { clipPath: "circle(150% at 22% 48%)", duration: 0.6, ease: "power1.inOut" }, 0.1)
        .to(".fn-rain", { opacity: 0, duration: 0.3 }, 0.15)
        .fromTo(".fn-shade", { opacity: 0.6 }, { opacity: 0.2, duration: 0.5 }, 0.2)
        .fromTo(".fn-head", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.2 }, 0.45)
        .fromTo(".fn-tag span", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.1 }, 0.58)
        .fromTo(".fn-cta", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.15 }, 0.72)
        .to({}, { duration: 0.15 });
    },
    { scope: root, dependencies: [reduced, ready], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="clarity" aria-labelledby="fn-title" className="relative bg-ink">
      <div className="fn-stage relative h-[100svh] min-h-[620px] overflow-hidden">
        <div className="fn-media absolute inset-0">
          <picture>
            <source media="(max-aspect-ratio: 4/5)" srcSet="/media/house_storm_m.webp" />
            { }
            <img src="/media/house_storm.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </picture>
          <div className="fn-day absolute inset-0">
            <picture>
              <source media="(max-aspect-ratio: 4/5)" srcSet="/media/house_day_m.webp" />
              { }
              <img
                src="/media/house_day.webp"
                alt="The same house in soft morning light. The roof is tarped and branches are stacked at the curb — still damaged, but the storm has passed."
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
          </div>
        </div>
        <div className="fn-rain absolute inset-0">
          <Rain density={70} className="opacity-50" />
        </div>
        <div aria-hidden className="fn-shade absolute inset-0 bg-ink opacity-20" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,15,.75)_0%,rgba(3,6,15,.1)_40%,rgba(3,6,15,.2)_65%,rgba(3,6,15,.95)_100%)]" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 text-center">
          <p className="fn-head mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/80 [text-shadow:0_2px_12px_rgba(0,0,0,.6)]">Chapter 06 — The same house. A clearer path.</p>
          <h2 id="fn-title" className="fn-head text-[clamp(2.6rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] [text-shadow:0_6px_60px_rgba(0,0,0,.55)]">
            Clarity in <span className="font-[family-name:var(--font-instrument-serif)] font-normal italic">Every</span> Claim.
          </h2>
          <p className="fn-tag mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-lg font-medium tracking-tight text-white/90 sm:text-2xl [text-shadow:0_2px_20px_rgba(0,0,0,.7)]">
            <span>Precise.</span>
            <span>Efficient.</span>
            <span className="text-cyan">Resolved.</span>
          </p>
          <div className="fn-cta mt-10">
            <CtaLink href={withUtm(LINKS.home, "finale-discover")} event="cta_click" location="finale_primary" variant="giant">
              Discover XactaClaim <Arrow className="!h-6 !w-6" />
            </CtaLink>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <a
              key={p.n}
              href={withUtm(p.href, `plan-${p.n.toLowerCase().replace("+", "plus")}`)}
              target="_blank"
              rel="noopener"
              onClick={() => track("plan_click", { plan: p.n })}
              className="glass group rounded-2xl p-6 transition hover:-translate-y-1 hover:border-cyan/40"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan/80">{p.n}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{p.p}</p>
              <p className="mt-2 text-sm text-white/60">{p.d}</p>
              <p className="mt-5 inline-flex items-center gap-1 text-sm text-white/85 group-hover:text-white">
                {p.cta} <Arrow />
              </p>
            </a>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-white/40">
          Prices as listed on xactaclaim.com, plus applicable tax. See{" "}
          <a href={withUtm(LINKS.pricing, "finale-compare")} target="_blank" rel="noopener" className="underline decoration-white/30 hover:text-white">
            full plan comparison
          </a>
          .
        </p>
      </div>
    </section>
  );
}
