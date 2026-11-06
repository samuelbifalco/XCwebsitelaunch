"use client";

import { useEffect, useState } from "react";
import { LINKS, withUtm } from "@/lib/links";
import { track } from "@/lib/analytics";
import { useMotionPref } from "@/lib/motion";
import { openTrailer } from "./Trailer";

/** Phone-only bottom bar: always one tap from signing up. */
export default function StickyCta() {
  const [show, setShow] = useState(false);
  const { reduced, toggle } = useMotionPref();

  useEffect(() => {
    const on = () => {
      const past = window.scrollY > window.innerHeight * 0.8;
      const nearEnd = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 700;
      setShow(past && !nearEnd);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-50 flex items-center gap-2 rounded-2xl border border-white/10 bg-ink/85 p-2 shadow-[0_20px_60px_-10px_rgba(0,0,0,.9)] backdrop-blur-xl transition-all duration-500 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <a
        href={withUtm(LINKS.register, "sticky-start-free")}
        target="_blank"
        rel="noopener"
        onClick={() => track("cta_click", { location: "sticky_mobile" })}
        className="flex-1 rounded-xl bg-electric px-4 py-3 text-center text-[15px] font-medium text-white shadow-[0_8px_30px_-6px_rgba(36,160,237,.8)]"
      >
        Start free · no credit card
      </a>
      <button type="button" onClick={() => openTrailer("sticky_mobile")} aria-label="Watch the trailer" className="rounded-xl border border-white/15 px-3 py-3">
        <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor"><path d="M4 2.5v11l9-5.5z" /></svg>
      </button>
      <button type="button" onClick={toggle} aria-pressed={reduced} className="rounded-xl border border-white/15 px-2.5 py-3 text-[10px] uppercase tracking-wider text-white/70">
        {reduced ? "Motion off" : "Motion"}
      </button>
    </div>
  );
}
