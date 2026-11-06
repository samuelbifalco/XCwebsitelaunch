"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref, useIsDesktop } from "@/lib/motion";
import SplitHeadline from "./SplitHeadline";
import LazyVideo from "./LazyVideo";

const BEATS = [
  {
    t: "For the adjuster",
    d: "Claim details, documents, photos and saved summaries in one place before every conversation.",
    src: "/media/ui_screen.webp",
    zoom: "none",
    tag: "Claim workspace",
  },
  {
    t: "For the homeowner",
    d: "A secure portal to upload documents and photos, and tracked updates when messaging is configured.",
    src: "/media/ui_screen.webp",
    zoom: "scale(1.6) translate(-18.75%, 18.75%)",
    tag: "Activity timeline",
  },
  {
    t: "For the team",
    d: "A shared timeline and work queue, with seats for growing teams on Pro and Pro+.",
    src: "/media/ui_estimate.webp",
    zoom: "none",
    tag: "Follow-up tasks",
  },
];
const SPLITS = [0.62, 0.56, 0.5];

export default function People() {
  const root = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState(0);
  const beatRef = useRef(0);
  const { reduced, ready } = useMotionPref();
  const desktop = useIsDesktop();
  const pinned = ready && !reduced && desktop;

  useGSAP(
    () => {
      if (!ready || reduced) return;
      if (!pinned) {
        gsap.utils.toArray<HTMLElement>(".pp-m-reveal").forEach((el) =>
          gsap.fromTo(el, { clipPath: "inset(8% 8% 8% 8% round 24px)", y: 30 }, { clipPath: "inset(0% 0% 0% 0% round 24px)", y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 92%", end: "top 50%", scrub: 1 } })
        );
        return;
      }
      const stage = root.current!.querySelector<HTMLElement>(".pp-stage")!;
      const state = { split: 1 };
      const apply = () => stage.style.setProperty("--split", String(state.split));
      apply();
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=230%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate(self) {
            const p = self.progress;
            const b = p < 0.42 ? 0 : p < 0.7 ? 1 : 2;
            if (b !== beatRef.current) {
              beatRef.current = b;
              setBeat(b);
            }
          },
        },
      });
      tl.fromTo(".pp-real-media", { scale: 1.15 }, { scale: 1, duration: 1 }, 0)
        .to(state, { split: SPLITS[0], duration: 0.16, ease: "power2.out", onUpdate: apply }, 0.02)
        .fromTo(".pp-head", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.08 }, 0)
        .fromTo(".pp-device", { opacity: 0, x: 80, rotateY: -18 }, { opacity: 1, x: 0, rotateY: 0, duration: 0.14, ease: "power2.out" }, 0.08)
        .fromTo(".pp-beam", { scaleX: 0 }, { scaleX: 1, duration: 0.1, ease: "power2.out" }, 0.2)
        .fromTo(".pp-node", { scale: 0 }, { scale: 1, stagger: 0.05, duration: 0.04, ease: "back.out(3)" }, 0.2)
        .fromTo(".pp-list", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.08 }, 0.22)
        .to(state, { split: SPLITS[1], duration: 0.12, ease: "power2.inOut", onUpdate: apply }, 0.42)
        .to(state, { split: SPLITS[2], duration: 0.12, ease: "power2.inOut", onUpdate: apply }, 0.7)
        .to({}, { duration: 0.1 }, 0.9);
    },
    { scope: root, dependencies: [reduced, ready, pinned], revertOnUpdate: true }
  );

  const heading = (
    <SplitHeadline
      className="max-w-4xl text-[clamp(2.2rem,5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
      lines={[{ text: "Better Tools." }, { text: "More Confidence.", className: "text-cyan" }]}
    />
  );

  if (!pinned) {
    return (
      <section ref={root} id="people" aria-labelledby="pp-title" className="relative overflow-hidden bg-ink py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 05 — Technology that supports people</p>
          <div id="pp-title">{heading}</div>
          <figure className="pp-m-reveal relative mt-10 overflow-hidden rounded-3xl">
            <LazyVideo src="/media/tablet_loop_m.mp4" poster="/media/tablet_loop_poster.webp" label="The homeowner points at the claim on the adjuster's tablet and smiles." className="aspect-[4/5] w-full object-cover sm:aspect-video" />
            <figcaption className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/85">The real world</figcaption>
          </figure>
          <div aria-hidden className="mx-auto h-14 w-[2px] bg-gradient-to-b from-cyan to-electric shadow-[0_0_14px_#7fd8ff]" />
          <figure className="pp-m-reveal relative overflow-hidden rounded-3xl border border-cyan/30 bg-[#081427]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/ui_screen.webp" alt="XactaClaim claim workspace with documents, photos, policy and activity." loading="lazy" className="aspect-[16/10] w-full object-cover" />
            <figcaption className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/75">The organized file · real XactaClaim screen</figcaption>
          </figure>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {BEATS.map((b) => (
              <div key={b.t} className="border-t border-white/10 pt-5">
                <p className="font-medium">{b.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={root} id="people" aria-labelledby="pp-title" className="relative bg-ink">
      <div className="pp-stage relative h-[100svh] overflow-hidden" style={{ ["--split" as string]: 1 }}>
        {/* the real world */}
        <div className="pp-real absolute inset-0" style={{ clipPath: "inset(0 calc((1 - var(--split)) * 100%) 0 0)" }}>
          <div className="pp-real-media absolute inset-y-0 left-0 overflow-hidden" style={{ width: "calc(var(--split) * 100%)" }}>
            <LazyVideo src="/media/tablet_loop.mp4" poster="/media/tablet_loop_poster.webp" label="The homeowner points at the claim on the adjuster's tablet and smiles." className="h-full w-full object-cover" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,15,.7)_0%,transparent_30%,transparent_55%,rgba(3,6,15,.9)_100%)]" />
          <p className="absolute bottom-6 left-[4vw] font-mono text-[11px] uppercase tracking-[0.25em] text-white/80">The real world</p>
        </div>

        {/* the organized workspace */}
        <div className="pp-digital absolute inset-0 bg-[radial-gradient(90%_80%_at_80%_50%,#0b2347_0%,#06101f_60%,#03060f_100%)]" style={{ clipPath: "inset(0 0 0 calc(var(--split) * 100%))" }}>
          <div aria-hidden className="grid-lines absolute inset-0 opacity-50" />
          <p className="absolute bottom-6 right-[4vw] font-mono text-[11px] uppercase tracking-[0.25em] text-white/80">The organized file</p>
        </div>
        <div className="pp-device absolute top-1/2 [perspective:1400px]" style={{ left: "calc(var(--split) * 100% + 4vw)", width: "calc((1 - var(--split)) * 100% - 8vw)", translate: "0 -50%" }}>
          <div className="overflow-hidden rounded-2xl border border-cyan/30 bg-[#081427] shadow-[0_0_0_1px_rgba(36,160,237,.25),0_40px_100px_-20px_rgba(36,160,237,.5)]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-white/45">XactaClaim · {BEATS[beat].tag}</span>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden">
              {BEATS.map((b, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={b.t}
                  src={b.src}
                  alt={i === beat ? `Real XactaClaim screen: ${b.tag}` : ""}
                  aria-hidden={i !== beat}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(.16,1,.3,1)]"
                  style={{ opacity: i === beat ? 1 : 0, transform: i === beat ? b.zoom : "scale(1.05)" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* the connection: tablet ⇄ claim file */}
        <div aria-hidden className="pointer-events-none absolute" style={{ top: "58%", left: "calc(var(--split) * 50% + 3.5svh)", width: "calc(var(--split) * 50% + 4vw - 3.5svh)" }}>
          <div className="pp-beam h-[2px] origin-left rounded-full shadow-[0_0_12px_#7fd8ff,0_0_30px_#24a0ed] [background:repeating-linear-gradient(90deg,#7fd8ff_0_18px,rgba(127,216,255,.25)_18px_40px)] [background-size:160px_2px]" style={{ animation: "beam 1.6s linear infinite" }} />
          <span className="pp-node absolute -left-2 -top-[7px] h-4 w-4 rounded-full border-2 border-cyan bg-ink shadow-[0_0_14px_#7fd8ff]" />
          <span className="pp-node absolute -right-2 -top-[7px] h-4 w-4 rounded-full bg-cyan shadow-[0_0_14px_#7fd8ff]" />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-cyan/80 shadow-[0_0_20px_#7fd8ff,0_0_60px_#24a0ed]" style={{ left: "calc(var(--split) * 100%)" }} />

        {/* narrative */}
        <div className="pp-head absolute left-[4vw] top-24 max-w-[44vw]">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/90">Chapter 05 — Technology that supports people</p>
          <div id="pp-title">{heading}</div>
        </div>
        <ol className="pp-list glass absolute bottom-16 left-[4vw] w-[min(420px,34vw)] space-y-1 rounded-2xl p-3">
          {BEATS.map((b, i) => {
            const on = i === beat;
            return (
              <li key={b.t} className={`rounded-xl px-4 py-3 transition-all duration-500 ${on ? "bg-white/[0.07]" : "opacity-55"}`}>
                <p className="flex items-center gap-3 font-medium">
                  <span className={`h-2 w-2 rounded-full transition-colors ${on ? "bg-cyan shadow-[0_0_10px_#7fd8ff]" : "bg-white/30"}`} />
                  {b.t}
                </p>
                <div className={`grid transition-all duration-500 ${on ? "mt-1 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden pl-5 text-sm leading-relaxed text-white/70">{b.d}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
