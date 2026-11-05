"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionPref } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Scrolls to an element or y-position, smoothly when allowed. */
export function scrollToTarget(target: string | number) {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target as never, { duration: 1.6 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target });
  } else {
    document.querySelector(target)?.scrollIntoView();
  }
}

export default function SmoothScroll() {
  const { reduced, ready } = useMotionPref();

  useEffect(() => {
    if (!ready || reduced) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduced, ready]);

  return null;
}
