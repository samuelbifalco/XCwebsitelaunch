"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/lib/motion";
import { ITEMS, ClaimCard } from "./ClaimItems";
import Rain from "./Rain";

const NOTIFS = [
  "New text from homeowner",
  "Voicemail received",
  "Carrier requests documentation",
  "Photo upload — 14 files",
  "Estimate revision attached",
  "Reminder: inspection Thursday",
];

export default function Chaos() {
  const root = useRef<HTMLElement>(null);
  const { reduced, ready } = useMotionPref();

  useGSAP(
    () => {
      if (!ready || reduced) return;
      const cards = gsap.utils.toArray<HTMLElement>(".chaos-card");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=220%", scrub: 1, pin: true, anticipatePin: 1 },
      });
      // Camera keeps approaching the house.
      tl.fromTo(".chaos-bg", { scale: 1.15 }, { scale: 1.75, yPercent: 8, duration: 1 }, 0);
      tl.fromTo(".chaos-shade", { opacity: 0.35 }, { opacity: 0.8, duration: 1 }, 0);
      // Items fly in from beyond the frame, staggered.
      cards.forEach((el, i) => {
        const d = Number(el.dataset.depth || 1);
        const ang = (i / cards.length) * Math.PI * 2 + 0.6;
        tl.fromTo(
          el,
          { xPercent: -50 + Math.cos(ang) * 260, yPercent: -50 + Math.sin(ang) * 260, opacity: 0, scale: 0.4 + d * 0.3, rotate: (i % 2 ? 1 : -1) * 40 },
          { xPercent: -50, yPercent: -50, opacity: 1, scale: 1, rotate: Number(el.dataset.r), duration: 0.32, ease: "power2.out" },
          0.04 + i * 0.045
        );
        // keep drifting — depth parallax
        tl.to(el, { y: -60 * d, x: (i % 2 ? 1 : -1) * 18 * d, duration: 0.6 }, 0.4);
      });
      tl.fromTo(".chaos-head", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.18 }, 0.22);
      tl.fromTo(".chaos-notif", { opacity: 0, x: 40 }, { opacity: 1, x: 0, stagger: 0.06, duration: 0.1 }, 0.35);
      // overwhelm: subtle shake + vignette
      tl.to(".chaos-stage", { x: 6, duration: 0.02, repeat: 9, yoyo: true }, 0.78);
      tl.fromTo(".chaos-vignette", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.72);
    },
    { scope: root, dependencies: [reduced, ready], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="chaos" aria-labelledby="chaos-title" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink">
      <div aria-hidden className="chaos-bg absolute inset-0 origin-[50%_55%]">
        <picture>
          <source media="(max-aspect-ratio: 4/5)" srcSet="/media/house_storm_m.webp" />
          { }
          <img src="/media/house_storm.webp" alt="" loading="lazy" className="h-full w-full object-cover" />
        </picture>
      </div>
      <div aria-hidden className="chaos-shade absolute inset-0 bg-ink/60" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink to-transparent" />
      <Rain density={90} className="opacity-50" />

      <div className="chaos-stage absolute inset-0">
        {ITEMS.map((it) => (
          <div
            key={it.id}
            data-depth={it.depth}
            data-r={it.r}
            aria-hidden
            className={`chaos-card absolute will-change-transform ${it.mobile ? "" : "hidden md:block"}`}
            style={{ left: `${it.x}%`, top: `${it.y}%`, transform: `translate(-50%,-50%) rotate(${it.r}deg)` }}
          >
            <ClaimCard item={it} />
          </div>
        ))}
      </div>

      <div aria-hidden className="chaos-vignette pointer-events-none absolute inset-0 opacity-0 [background:radial-gradient(80%_70%_at_50%_50%,transparent_40%,rgba(80,10,20,.35)_80%,rgba(3,6,15,.9)_100%)]" />

      <div className="pointer-events-none relative z-10 flex h-full items-center justify-center px-5">
        <div className="chaos-head max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 01 — The chaos</p>
          <h2 id="chaos-title" className="text-[clamp(2.2rem,6vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] [text-shadow:0_4px_40px_rgba(0,0,0,.9)]">
            Every Claim Has a <span className="font-[family-name:var(--font-instrument-serif)] font-normal italic text-cyan">Thousand</span> Moving Parts.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/75 [text-shadow:0_2px_20px_rgba(0,0,0,.9)]">
            Photos arrive by text. Voicemails sit in a shared inbox. Document requests get buried in email. And a homeowner is waiting for answers.
          </p>
        </div>
      </div>

      <ul aria-label="Incoming claim activity" className="absolute right-4 top-24 z-20 hidden w-64 space-y-2 lg:block">
        {NOTIFS.map((n) => (
          <li key={n} className="chaos-notif glass flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] text-white/80">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" /> {n}
          </li>
        ))}
      </ul>
    </section>
  );
}
