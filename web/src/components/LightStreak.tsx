"use client";

import { useMotionPref } from "@/lib/motion";

/**
 * One line of light, fixed at the centre of the screen. Chaos draws it as the claim
 * items collapse; it holds still while the next chapter scrolls in, then the
 * Adjuster scene splits open from it.
 */
export default function LightStreak() {
  const { reduced } = useMotionPref();
  if (reduced) return null;
  return (
    <div id="xc-streak-wrap" aria-hidden className="pointer-events-none fixed inset-x-0 top-1/2 z-40 -translate-y-1/2">
      <div id="xc-streak-inner" style={{ transform: "scaleX(0)", opacity: 0 }}>
        <div className="absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 blur-3xl [background:linear-gradient(90deg,transparent,rgba(36,160,237,.55)_35%,rgba(127,216,255,.65)_50%,rgba(36,160,237,.55)_65%,transparent)]" />
        <div className="relative h-[2px] [background:linear-gradient(90deg,transparent,rgba(127,216,255,.85)_25%,#fff_50%,rgba(127,216,255,.85)_75%,transparent)] shadow-[0_0_18px_3px_rgba(127,216,255,.7)]" />
      </div>
    </div>
  );
}
