"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type MotionCtx = { reduced: boolean; toggle: () => void; ready: boolean };
const Ctx = createContext<MotionCtx>({ reduced: false, toggle: () => {}, ready: false });

const KEY = "xc-motion";

/** Reduced motion = OS preference, overridable by the visitor's toggle. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    setReduced(saved ? saved === "reduced" : mq.matches);
    setReady(true);
    const onChange = (e: MediaQueryListEvent) => {
      let s: string | null = null;
      try {
        s = localStorage.getItem(KEY);
      } catch {}
      if (!s) setReduced(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  const toggle = useCallback(() => {
    setReduced((r) => {
      const next = !r;
      try {
        localStorage.setItem(KEY, next ? "reduced" : "full");
      } catch {}
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ reduced, toggle, ready }}>{children}</Ctx.Provider>;
}

export const useMotionPref = () => useContext(Ctx);

/** True at ≥1024px wide — the long pinned scenes only run here. */
export function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setD(mq.matches);
    const on = (e: MediaQueryListEvent) => setD(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}
