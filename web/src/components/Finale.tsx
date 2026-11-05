"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/lib/motion";
import { LINKS, withUtm } from "@/lib/links";
import { track } from "@/lib/analytics";
import CtaLink, { Arrow } from "./CtaLink";
import Rain from "./Rain";
import { HOUSE_ORIGIN } from "./Hero";

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
      const stage = root.current!.querySelector<HTMLElement>(".fn-stage")!;
      const sky = { clear: -10 };
      const apply = () => stage.style.setProperty("--clear", `${sky.clear}%`);
      apply();
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: stage, start: "top top", end: "+=220%", scrub: 1, pin: true, anticipatePin: 1 },
      });
      // The camera pulls back to the hero's framing while the storm breaks from the sky down.
      tl.fromTo(".fn-cam", { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
        .fromTo(".fn-storm", { xPercent: 0 }, { xPercent: 2.5, duration: 0.6 }, 0)
        .to(sky, { clear: 150, duration: 0.55, ease: "power1.inOut", onUpdate: apply }, 0.08)
        .to(".fn-rain", { opacity: 0, duration: 0.25 }, 0.1)
        .fromTo(".fn-warm", { opacity: 0 }, { opacity: 0.32, duration: 0.45 }, 0.25)
        .fromTo(".fn-sun", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45 }, 0.3)
        .fromTo(".fn-rays", { opacity: 0 }, { opacity: 0.45, duration: 0.4 }, 0.35)
        .fromTo(".fn-shade", { opacity: 0.55 }, { opacity: 0.15, duration: 0.5 }, 0.2)
        .fromTo(".fn-kicker", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08 }, 0.5)
        .fromTo(".fn-word", { yPercent: 110, opacity: 0, filter: "blur(10px)" }, { yPercent: 0, opacity: 1, filter: "blur(0px)", stagger: 0.035, duration: 0.12, ease: "power3.out" }, 0.55)
        .fromTo(".fn-tag span", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.07 }, 0.72)
        .fromTo(".fn-cta", { opacity: 0, scale: 0.85, filter: "blur(8px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.1, ease: "back.out(1.6)" }, 0.82)
        .to({}, { duration: 0.1 });
    },
    { scope: root, dependencies: [reduced, ready], revertOnUpdate: true }
  );

  const words = ["Clarity", "in", "Every", "Claim."];

  return (
    <section ref={root} id="clarity" aria-labelledby="fn-title" className="relative bg-ink">
      <div className="fn-stage relative h-[100svh] min-h-[620px] overflow-hidden" style={{ ["--clear" as string]: reduced ? "150%" : "-10%" }}>
        <div className="fn-cam absolute inset-0" style={{ transformOrigin: HOUSE_ORIGIN }}>
          <div className="fn-storm absolute -inset-x-8 inset-y-0">
            <picture>
              <source media="(max-aspect-ratio: 4/5)" srcSet="/media/house_storm_m.webp" />
              { }
              <img src="/media/house_storm.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </picture>
          </div>
          <div
            className="fn-day absolute inset-0"
            style={{
              maskImage: "linear-gradient(180deg, #000 calc(var(--clear) - 35%), transparent var(--clear))",
              WebkitMaskImage: "linear-gradient(180deg, #000 calc(var(--clear) - 35%), transparent var(--clear))",
            }}
          >
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
          <div aria-hidden className="fn-sun absolute inset-0 opacity-0 mix-blend-screen [background:radial-gradient(35%_45%_at_14%_50%,rgba(255,196,120,.75),rgba(255,160,80,.2)_45%,transparent_70%)]" />
          <div aria-hidden className="fn-rays absolute inset-0 overflow-hidden opacity-0 mix-blend-screen [mask-image:radial-gradient(60%_70%_at_14%_50%,black,transparent_75%)]">
            <div className="absolute left-[14%] top-1/2 h-[220vmax] w-[220vmax] -translate-x-1/2 -translate-y-1/2 animate-[rays_90s_linear_infinite] [background:repeating-conic-gradient(from_0deg,rgba(255,220,170,.35)_0deg_3deg,transparent_3deg_14deg)]" />
          </div>
        </div>
        <div aria-hidden className="fn-warm absolute inset-0 bg-[#ff9a4a] opacity-0 mix-blend-soft-light" />
        <div className="fn-rain absolute inset-0">
          <Rain density={70} className="opacity-50" />
        </div>
        <div aria-hidden className="fn-shade absolute inset-0 bg-ink opacity-20" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,15,.7)_0%,rgba(3,6,15,.05)_40%,rgba(3,6,15,.2)_65%,rgba(3,6,15,.95)_100%)]" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 text-center">
          <p className="fn-kicker mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/85 [text-shadow:0_2px_12px_rgba(0,0,0,.6)]">Chapter 06 — The same house. A clearer path.</p>
          <h2 id="fn-title" aria-label="Clarity in Every Claim." className="text-[clamp(2.6rem,8vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] [text-shadow:0_6px_60px_rgba(0,0,0,.55)]">
            {words.map((w, i) => (
              <span key={w} aria-hidden className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <span className={`fn-word inline-block ${w === "Every" ? "font-[family-name:var(--font-instrument-serif)] font-normal italic" : ""}`}>
                  {w}
                  {i < words.length - 1 ? "\u00a0" : ""}
                </span>
              </span>
            ))}
          </h2>
          <p className="fn-tag mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-lg font-medium tracking-tight text-white/90 sm:text-2xl [text-shadow:0_2px_20px_rgba(0,0,0,.7)]">
            <span>Precise.</span>
            <span>Efficient.</span>
            <span className="text-cyan">Resolved.</span>
          </p>
          <div className="fn-cta relative mt-10">
            <span aria-hidden className="pointer-events-none absolute -inset-6 animate-[halo_3.2s_ease-in-out_infinite] rounded-full bg-electric/40 blur-2xl" />
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
