"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/lib/motion";
import { ITEMS, ClaimCard, type Item } from "./ClaimItems";
import Rain from "./Rain";
import LazyVideo from "./LazyVideo";
import { HOUSE_ORIGIN } from "./Hero";

const NOTIFS = [
  "New text from homeowner",
  "Voicemail received",
  "Carrier requests documentation",
  "Photo upload — 14 files",
  "Estimate revision attached",
  "Reminder: inspection Thursday",
  "Mortgage company letter",
];

const ORDER: Record<Item["kind"], number> = { photo: 0, doc: 1, estimate: 1, note: 2, email: 2, sms: 3, voicemail: 3 };
const layerOf = (d: number) => (d < 0.9 ? "far" : d > 1.2 ? "near" : "mid");
const LAYER_STYLE = {
  far: "scale-[.82] blur-[1.2px] brightness-75",
  mid: "",
  near: "scale-[1.08] drop-shadow-[0_30px_40px_rgba(0,0,0,.6)]",
};

export default function Chaos() {
  const root = useRef<HTMLElement>(null);
  const { reduced, ready } = useMotionPref();
  const items = [...ITEMS].sort((a, b) => ORDER[a.kind] - ORDER[b.kind]);

  useGSAP(
    () => {
      if (!ready || reduced) return;
      const stage = root.current!;
      const cards = gsap.utils.toArray<HTMLElement>(".chaos-card");
      const W = () => stage.clientWidth;
      const H = () => stage.clientHeight;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: stage, start: "top top", end: "+=300%", scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      });

      // Continue the hero's push-in: emerge from darkness already close to the house.
      tl.fromTo(".chaos-bg", { opacity: 0.6 }, { opacity: 1, duration: 0.07 }, 0)
        .fromTo(".chaos-bg", { scale: 2.1 }, { scale: 1.55, duration: 0.6, ease: "power1.out", immediateRender: false }, 0);
      tl.fromTo(".chaos-backdrop", { opacity: 0 }, { opacity: 0.45, duration: 0.2 }, 0.3);

      // Entry waves: photos, then paperwork, then notes, then messages — each from its nearest edge.
      cards.forEach((el, i) => {
        const x = Number(el.dataset.x), y = Number(el.dataset.y);
        const dx = x - 50, dy = y - 50;
        const horiz = Math.abs(dx) > Math.abs(dy);
        tl.fromTo(
          el,
          {
            x: () => (horiz ? Math.sign(dx) * W() * 0.7 : dx * 4),
            y: () => (horiz ? dy * 4 : Math.sign(dy || 1) * H() * 0.8),
            opacity: 0,
            rotate: i % 2 ? 25 : -25,
          },
          { x: 0, y: 0, opacity: 1, rotate: 0, duration: 0.16, ease: "power3.out" },
          0.03 + i * 0.022
        );
      });

      tl.fromTo(".chaos-head", { opacity: 0, y: 40, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.1 }, 0.2);

      // Messages keep arriving.
      const counter = { n: 0 };
      const badge = stage.querySelector<HTMLElement>(".chaos-count");
      tl.fromTo(".chaos-inbox", { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0.22);
      tl.fromTo(".chaos-notif", { opacity: 0, x: 60, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, stagger: 0.04, duration: 0.06, ease: "power2.out" }, 0.24);
      tl.to(counter, { n: 23, duration: 0.3, onUpdate: () => badge && (badge.textContent = String(Math.round(counter.n))) }, 0.24);

      // The pause: overload, then a held breath.
      tl.fromTo(".chaos-vignette", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.46);
      tl.to(".chaos-shake", { x: 5, duration: 0.008, repeat: 11, yoyo: true }, 0.5);
      tl.to({}, { duration: 0.08 }, 0.55);

      // Convergence: everything is pulled toward the center — and becomes a point of light.
      tl.to(".chaos-head", { opacity: 0, y: -30, filter: "blur(8px)", duration: 0.06 }, 0.63);
      cards.forEach((el, i) => {
        const x = Number(el.dataset.x), y = Number(el.dataset.y);
        tl.to(
          el,
          {
            x: () => ((50 - x) / 100) * W(),
            y: () => ((50 - y) / 100) * H(),
            rotate: (i % 2 ? 1 : -1) * (90 + i * 12),
            scale: 0.18,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          },
          0.64 + (i % 6) * 0.012
        );
      });
      tl.to(".chaos-inbox", { opacity: 0, duration: 0.05 }, 0.64);
      tl.to(".chaos-notif", { x: () => -W() * 0.35, y: () => H() * 0.25, scale: 0.3, opacity: 0, stagger: 0.01, duration: 0.15, ease: "power2.in" }, 0.64);
      tl.to(".chaos-bg, .chaos-backdrop", { opacity: 0, duration: 0.18 }, 0.72);
      tl.fromTo(".chaos-orb", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2)" }, 0.82);
      tl.to(".chaos-orb-label", { opacity: 1, y: 0, duration: 0.06 }, 0.9);

      // Pointer depth: layers drift by different amounts.
      const movers = (["far", "mid", "near"] as const).map((l, i) => ({
        amt: [10, 22, 40][i],
        x: gsap.quickTo(`.chaos-layer-${l}`, "x", { duration: 1.2, ease: "power3" }),
        y: gsap.quickTo(`.chaos-layer-${l}`, "y", { duration: 1.2, ease: "power3" }),
      }));
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(-nx * m.amt);
          m.y(-ny * m.amt);
        });
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root, dependencies: [reduced, ready], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="chaos" aria-labelledby="chaos-title" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink">
      <div aria-hidden className="chaos-bg absolute inset-0" style={{ transformOrigin: HOUSE_ORIGIN }}>
        <picture>
          <source media="(max-aspect-ratio: 4/5)" srcSet="/media/house_storm_m.webp" />
          { }
          <img src="/media/house_storm.webp" alt="" loading="lazy" className="h-full w-full object-cover" />
        </picture>
        <div className="absolute inset-0 bg-ink/55" />
      </div>
      {/* far backdrop: the paperwork, caught in the storm (Higgsfield video) */}
      <div aria-hidden className="chaos-backdrop absolute inset-0 opacity-0">
        <LazyVideo src="/media/docs_storm.mp4" mobileSrc="/media/docs_storm_m.mp4" poster="/media/docs_storm_poster.webp" className="h-full w-full scale-110 object-cover blur-[2px]" />
      </div>
      <Rain density={70} className="opacity-40" />

      <div className="chaos-shake absolute inset-0">
        {(["far", "mid", "near"] as const).map((layer) => (
          <div key={layer} className={`chaos-layer-${layer} absolute -inset-6`}>
            {items
              .filter((it) => layerOf(it.depth) === layer)
              .map((it) => (
                <div
                  key={it.id}
                  data-x={it.x}
                  data-y={it.y}
                  data-r={it.r}
                  aria-hidden
                  className={`chaos-card absolute will-change-transform ${it.mobile ? "" : "hidden md:block"} ${ITEMS.indexOf(it) >= 12 ? "!hidden lg:!block" : ""}`}
                  style={{ left: `${it.x}%`, top: `${it.y}%`, rotate: `${it.r}deg`, translate: "-50% -50%" }}
                >
                  <div className={`transition-transform duration-500 hover:scale-110 ${LAYER_STYLE[layer]}`}>
                    <ClaimCard item={it} />
                  </div>
                </div>
              ))}
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

      {!reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="chaos-orb relative h-24 w-24 opacity-0">
            <span className="absolute inset-0 rounded-full bg-cyan blur-2xl" />
            <span className="absolute inset-6 rounded-full bg-white shadow-[0_0_60px_20px_rgba(127,216,255,.8)]" />
          </div>
          <p className="chaos-orb-label absolute top-[calc(50%+80px)] translate-y-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan opacity-0">Someone has to make sense of it</p>
        </div>
      )}

      <div className="absolute right-4 top-24 z-20 hidden w-64 lg:block">
        <p className="chaos-inbox mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
          Inbox <span className="rounded-full bg-red-500/90 px-2 py-0.5 text-white"><span className="chaos-count">{reduced ? 23 : 0}</span> unread</span>
        </p>
        <ul aria-label="Incoming claim activity" className="space-y-2">
          {NOTIFS.map((n) => (
            <li key={n} className="chaos-notif glass flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] text-white/80">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" /> {n}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
