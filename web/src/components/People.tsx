"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/lib/motion";
import SplitHeadline from "./SplitHeadline";

const POINTS = [
  { t: "For the adjuster", d: "Claim details, documents, photos and saved summaries in one place before every conversation." },
  { t: "For the homeowner", d: "A secure portal to upload documents and photos, and tracked updates when messaging is configured." },
  { t: "For the team", d: "A shared timeline and work queue, with seats for growing teams on Pro and Pro+." },
];

export default function People() {
  const root = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const { reduced, ready } = useMotionPref();
  const [load, setLoad] = useState(false);

  // Lazy-load the product film only when near the viewport.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setLoad(true);
        const v = vid.current;
        if (!v) return;
        if (e.isIntersecting && !reduced) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useGSAP(
    () => {
      if (!ready || reduced) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".pp-split", start: "top 80%", end: "center 45%", scrub: 1 },
      });
      tl.fromTo(".pp-left", { clipPath: "inset(0 100% 0 0 round 24px)" }, { clipPath: "inset(0 0% 0 0 round 24px)" }, 0)
        .fromTo(".pp-right", { clipPath: "inset(0 0 0 100% round 24px)" }, { clipPath: "inset(0 0 0 0% round 24px)" }, 0.1)
        .fromTo(".pp-seam", { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1 }, 0.3)
        .fromTo(".pp-left img", { scale: 1.25 }, { scale: 1 }, 0)
        .fromTo(".pp-right video", { scale: 1.25 }, { scale: 1 }, 0.1);
    },
    { scope: root, dependencies: [reduced, ready], revertOnUpdate: true }
  );

  return (
    <section ref={root} id="people" aria-labelledby="pp-title" className="relative overflow-hidden bg-ink py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 05 — Technology that supports people</p>
        <SplitHeadline
          className="max-w-4xl text-[clamp(2.2rem,5.6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
          lines={[{ text: "Better Tools." }, { text: "More Confidence.", className: "text-cyan" }]}
        />

        <div className="pp-split relative mt-14 grid gap-4 md:grid-cols-2 md:gap-0">
          <figure className="pp-left relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-auto md:h-[min(72vh,680px)] md:rounded-r-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/duo_reassured.webp"
              alt="The adjuster shows the homeowner his tablet on the walkway; she looks relieved as the clouds break."
              loading="lazy"
              className="h-full w-full object-cover object-[38%_center]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <figcaption className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/80">The real world</figcaption>
          </figure>
          <figure className="pp-right relative aspect-video overflow-hidden rounded-3xl bg-[#081427] md:aspect-auto md:h-[min(72vh,680px)] md:rounded-l-none">
            {load ? (
              <video
                ref={vid}
                src="/media/product_reveal.mp4"
                poster="/media/product_reveal_poster.webp"
                muted
                playsInline
                loop
                preload="none"
                aria-label="XactaClaim product film: claim documents and photos move onto the claim workspace, followed by Policy Review and Estimate Comparison screens."
                className="h-full w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/media/product_reveal_poster.webp" alt="" loading="lazy" className="h-full w-full object-cover" />
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <figcaption className="absolute bottom-5 right-5 text-right font-mono text-[11px] uppercase tracking-[0.25em] text-white/80">
              The organized file
              <span className="mt-1 block normal-case tracking-normal text-white/45">Footage: XactaClaim product film</span>
            </figcaption>
          </figure>
          <div aria-hidden className="pp-seam pointer-events-none absolute inset-y-6 left-1/2 hidden w-[2px] -translate-x-1/2 origin-center bg-cyan shadow-[0_0_20px_#7fd8ff,0_0_60px_#24a0ed] md:block" />
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.t} className="border-t border-white/10 pt-5">
              <p className="font-medium">{p.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
