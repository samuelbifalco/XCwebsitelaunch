"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref, useIsDesktop } from "@/lib/motion";
import SplitHeadline from "./SplitHeadline";

const SCENES = [
  {
    step: "Arrive",
    t: "Inspects the property",
    d: "The adjuster walks the property with the homeowner — on the roof, at the gutter line, seeing what the photos alone can't show.",
  },
  {
    step: "Document",
    t: "Documents the damage",
    d: "Photographs, measurements and notes captured while the evidence is fresh.",
  },
  {
    step: "Guide",
    t: "Guides the homeowner",
    d: "A steady, experienced voice for someone who has never been through a claim before.",
  },
];

const SHOTS = [
  { src: "/media/dmg_roof.webp", label: "Roof — missing shingles" },
  { src: "/media/dmg_gutter.webp", label: "Gutter — detached" },
  { src: "/media/dmg_branch.webp", label: "Driveway — fallen branch" },
];

export default function Adjuster() {
  const root = useRef<HTMLElement>(null);
  const { reduced, ready } = useMotionPref();
  const desktop = useIsDesktop();
  const pinned = ready && !reduced && desktop;

  useGSAP(
    () => {
      if (!ready || reduced) return;
      if (!pinned) {
        // Phones: unpinned reveals per scene card.
        gsap.utils.toArray<HTMLElement>(".adj-m-card").forEach((el) => {
          gsap.fromTo(el.querySelector(".adj-m-media"), { clipPath: "inset(10% 10% 10% 10% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: el, start: "top 90%", end: "top 40%", scrub: 1 } });
          gsap.fromTo(el.querySelectorAll(".adj-m-img"), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } });
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=340%", scrub: 1, pin: true, anticipatePin: 1 },
      });

      // Scene 1 — the adjuster arrives (opens from the chaos' point of light).
      tl.fromTo(".adj-s1", { clipPath: "circle(3% at 50% 50%)" }, { clipPath: "circle(80% at 50% 50%)", duration: 0.08, ease: "power2.inOut" }, 0)
        .fromTo(".adj-s1 img", { scale: 1.45 }, { scale: 1.12, duration: 0.12 }, 0)
        .fromTo(".adj-panel", { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.06 }, 0.05)
        .fromTo(".adj-bracket", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, stagger: 0.03, duration: 0.05, ease: "power2.out" }, 0.1)
        .to(".adj-s1 img", { scale: 1.3, xPercent: -3, duration: 0.2 }, 0.12)
        .fromTo(".adj-bar-0", { scaleX: 0 }, { scaleX: 1, duration: 0.3 }, 0)
        .fromTo(".adj-copy-0", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.04 }, 0.08);

      // → Scene 2 — documenting: a diagonal wipe into the viewfinder.
      tl.fromTo(".adj-s2", { clipPath: "polygon(100% 0,100% 0,100% 100%,100% 100%)" }, { clipPath: "polygon(0% 0,100% 0,100% 100%,-30% 100%)", duration: 0.08, ease: "power2.inOut" }, 0.3)
        .to(".adj-s1", { scale: 1.08, filter: "brightness(.4)", duration: 0.08 }, 0.3)
        .to(".adj-copy-0", { opacity: 0, y: -16, duration: 0.03 }, 0.3)
        .fromTo(".adj-copy-1", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.04 }, 0.35)
        .fromTo(".adj-bar-1", { scaleX: 0 }, { scaleX: 1, duration: 0.33 }, 0.32);

      SHOTS.forEach((_, i) => {
        const t = 0.38 + i * 0.09;
        if (i > 0) tl.fromTo(`.adj-shot-${i}`, { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1.02, duration: 0.03 }, t - 0.01);
        tl.fromTo(`.adj-shot-${i} img`, { scale: 1.1, xPercent: i % 2 ? 2 : -2 }, { scale: 1, xPercent: 0, duration: 0.09 }, t)
          .fromTo(".adj-focus", { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.03, ease: "power3.out" }, t + 0.01)
          .to(".adj-focus", { borderColor: "#7fd8ff", duration: 0.005 }, t + 0.04)
          .fromTo(".adj-flash", { opacity: 0 }, { opacity: 0.85, duration: 0.004 }, t + 0.05)
          .to(".adj-flash", { opacity: 0, duration: 0.02 }, t + 0.054)
          .fromTo(`.adj-thumb-${i}`, { opacity: 0, y: 20, scale: 1.4 }, { opacity: 1, y: 0, scale: 1, duration: 0.025, ease: "back.out(2)" }, t + 0.055)
          .fromTo(`.adj-label-${i}`, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t)
          .to(`.adj-label-${i}`, { opacity: i === SHOTS.length - 1 ? 1 : 0, duration: 0.01 }, t + 0.085)
          .to(".adj-focus", { borderColor: "rgba(255,255,255,.7)", duration: 0.005 }, t + 0.085);
      });

      // → Scene 3 — guiding: a vertical reveal and a slow push toward the tablet.
      tl.fromTo(".adj-s3", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.07, ease: "power2.inOut" }, 0.66)
        .fromTo(".adj-s3 img", { scale: 1.25 }, { scale: 1, duration: 0.08 }, 0.66)
        .to(".adj-s2", { scale: 0.92, filter: "brightness(.4)", duration: 0.07 }, 0.66)
        .to(".adj-copy-1", { opacity: 0, y: -16, duration: 0.03 }, 0.66)
        .fromTo(".adj-copy-2", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.04 }, 0.7)
        .fromTo(".adj-bar-2", { scaleX: 0 }, { scaleX: 1, duration: 0.26 }, 0.67)
        .to(".adj-s3 img", { scale: 1.5, duration: 0.24, ease: "power1.in" }, 0.74)
        .fromTo(".adj-glow", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.74)
        .fromTo(".adj-support", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.04 }, 0.78)
        // Hand-off: through the tablet into the workspace.
        .to(".adj-panel", { opacity: 0, x: 40, duration: 0.05 }, 0.92)
        .fromTo(".adj-out", { opacity: 0 }, { opacity: 1, duration: 0.07 }, 0.93);
    },
    { scope: root, dependencies: [reduced, ready, pinned], revertOnUpdate: true }
  );

  const heading = (
    <SplitHeadline
      className="text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1] tracking-[-0.04em]"
      lines={[{ text: "Expertise Makes" }, { text: "the Difference.", className: "text-cyan" }]}
    />
  );
  const support = (
    <>
      XactaClaim is built to <em className="font-[family-name:var(--font-instrument-serif)] text-lg text-cyan">support</em> that expertise — not replace it.
    </>
  );

  if (!pinned) {
    return (
      <section ref={root} id="adjuster" aria-labelledby="adj-title" className="relative bg-ink px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 02 — The adjuster arrives</p>
          <div id="adj-title">{heading}</div>
          <p className="mt-4 text-white/70">A professional public adjuster brings experience, judgment and guidance. That part of the job belongs to people.</p>
          <ol className="mt-10 space-y-12">
            {SCENES.map((s, i) => (
              <li key={s.step} className="adj-m-card">
                <div className="adj-m-media relative overflow-hidden rounded-3xl">
                  {i === 1 ? (
                    <div className="grid grid-cols-3 gap-1 bg-black">
                      {SHOTS.map((sh) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={sh.src} src={sh.src} alt={sh.label} loading="lazy" className="adj-m-img aspect-[3/4] w-full object-cover" />
                      ))}
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={i === 0 ? "/media/duo_concerned_m.webp" : "/media/duo_reassured_m.webp"}
                      alt={i === 0 ? "The adjuster points out roof damage while the worried homeowner listens." : "The adjuster shows the homeowner his tablet; she looks relieved."}
                      loading="lazy"
                      className="adj-m-img aspect-[4/5] w-full object-cover"
                    />
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan backdrop-blur">
                    0{i + 1} · {s.step}
                  </span>
                </div>
                <p className="mt-5 text-xl font-medium">{s.t}</p>
                <p className="mt-1 text-white/65">{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 border-t border-white/10 pt-6 text-white/80">{support}</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={root} id="adjuster" aria-labelledby="adj-title" className="relative h-[100svh] overflow-hidden bg-ink">
      {/* Scene 1 */}
      <div className="adj-s1 absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/duo_concerned.webp" alt="A public adjuster holding a tablet points toward the damaged roof while a worried homeowner listens with her arms crossed." className="h-full w-full object-cover object-[35%_center]" style={{ transformOrigin: "40% 35%" }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/10 via-ink/20 to-ink/90" />
        <div aria-hidden className="grid-lines absolute inset-0 opacity-50 [mask-image:linear-gradient(90deg,transparent,black_60%)]" />
        <div aria-hidden className="absolute inset-0">
          <Bracket className="adj-bracket left-[17%] top-[16%] h-[34%] w-[16%]" label="Homeowner" />
          <Bracket className="adj-bracket left-[35%] top-[12%] h-[38%] w-[17%]" label="Adjuster" />
        </div>
      </div>

      {/* Scene 2 — field documentation viewfinder */}
      <div className="adj-s2 absolute inset-0 overflow-hidden bg-black" style={{ clipPath: "polygon(100% 0,100% 0,100% 100%,100% 100%)" }}>
        {SHOTS.map((sh, i) => (
          <div key={sh.src} className={`adj-shot-${i} absolute inset-0 overflow-hidden`} style={{ opacity: i === 0 ? 1 : 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sh.src} alt={sh.label} loading="lazy" className="h-full w-full object-cover" />
          </div>
        ))}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,15,.6),transparent_40%,transparent_60%,rgba(3,6,15,.85))]" />
          <div className="absolute inset-[8%] [background:linear-gradient(90deg,transparent_33.1%,rgba(255,255,255,.18)_33.3%,transparent_33.5%,transparent_66.4%,rgba(255,255,255,.18)_66.6%,transparent_66.8%),linear-gradient(180deg,transparent_33.1%,rgba(255,255,255,.18)_33.3%,transparent_33.5%,transparent_66.4%,rgba(255,255,255,.18)_66.6%,transparent_66.8%)]" />
          <Corners className="inset-[6%]" />
          <div className="adj-focus absolute left-[34%] top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-white/70" />
          <div className="absolute left-[7%] top-[8%] flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/90">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Field documentation
          </div>
          <div className="absolute left-[7%] top-[12%] font-mono text-[11px] text-cyan">
            {SHOTS.map((sh, i) => (
              <span key={sh.src} className={`adj-label-${i} absolute whitespace-nowrap opacity-0`}>
                {String(i + 1).padStart(2, "0")} / 03 · {sh.label}
              </span>
            ))}
          </div>
          <div className="absolute bottom-[8%] left-[7%] flex gap-2">
            {SHOTS.map((sh, i) => (
              <div key={sh.src} className="h-14 w-20 overflow-hidden rounded-md border border-white/30 bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sh.src} alt="" loading="lazy" className={`adj-thumb-${i} h-full w-full object-cover opacity-0`} />
              </div>
            ))}
          </div>
          <div className="adj-flash absolute inset-0 bg-white opacity-0" />
        </div>
      </div>

      {/* Scene 3 */}
      <div className="adj-s3 absolute inset-0 overflow-hidden" style={{ clipPath: "inset(100% 0 0 0)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/duo_reassured.webp" alt="The adjuster shows the homeowner his tablet on the walkway; she looks relieved as the clouds break." loading="lazy" className="h-full w-full object-cover object-[38%_center]" style={{ transformOrigin: "47% 62%" }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-transparent via-ink/10 to-ink/85" />
        <div aria-hidden className="adj-glow absolute inset-0 opacity-0 [background:radial-gradient(30%_30%_at_45%_62%,rgba(36,160,237,.55),transparent_70%)] mix-blend-screen" />
      </div>

      <div aria-hidden className="adj-out pointer-events-none absolute inset-0 z-20 bg-[#06101f] opacity-0" />

      {/* Narrative panel */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-end px-8">
        <div className="adj-panel glass w-full max-w-md rounded-3xl p-8">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 02 — The adjuster arrives</p>
          <div id="adj-title">{heading}</div>
          <ol aria-label="Scene progress" className="mt-6 grid grid-cols-3 gap-2">
            {SCENES.map((s, i) => (
              <li key={s.step}>
                <span className="block h-[3px] overflow-hidden rounded-full bg-white/10">
                  <span className={`adj-bar-${i} block h-full origin-left scale-x-0 bg-gradient-to-r from-electric to-cyan shadow-[0_0_10px_#24a0ed]`} />
                </span>
                <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                  0{i + 1} {s.step}
                </span>
              </li>
            ))}
          </ol>
          <div className="relative mt-6 min-h-[120px]">
            {SCENES.map((s, i) => (
              <div key={s.t} className={`adj-copy-${i} absolute inset-0 opacity-0`}>
                <p className="text-xl font-medium">{s.t}</p>
                <p className="mt-2 text-white/65">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="adj-support mt-4 border-t border-white/10 pt-5 text-sm text-white/80 opacity-0">{support}</p>
        </div>
      </div>
    </section>
  );
}

function Corners({ className }: { className: string }) {
  const c = "absolute h-8 w-8 border-white/80";
  return (
    <div className={`absolute ${className}`}>
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
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
