"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { LINKS, withUtm } from "@/lib/links";
import { track } from "@/lib/analytics";
import { useMotionPref } from "@/lib/motion";
import CtaLink from "./CtaLink";
import { openTrailer } from "./Trailer";

const chapters = [
  { id: "chaos", label: "The chaos" },
  { id: "adjuster", label: "The adjuster" },
  { id: "workspace", label: "The workspace" },
  { id: "journey", label: "The journey" },
  { id: "clarity", label: "Clarity" },
];

export default function Nav() {
  const { reduced, toggle } = useMotionPref();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-electric focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div
        className={`mx-auto flex h-16 items-center justify-between gap-4 px-4 transition-all duration-500 sm:h-[72px] sm:px-8 ${
          solid ? "bg-ink/70 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"
        }`}
      >
        <a href="#top" className="flex shrink-0 items-center" aria-label="XactaClaim — back to top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/xactaclaim-logo-light.png" alt="XactaClaim" width={150} height={32} className="h-7 w-auto sm:h-8" />
        </a>
        <nav aria-label="Story chapters" className="hidden items-center gap-7 text-[13px] text-white/65 lg:flex">
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="transition-colors hover:text-white">
              {c.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              toggle();
              track("motion_toggle", { reduced: !reduced });
            }}
            aria-pressed={reduced}
            className="hidden rounded-full border border-white/15 px-3 py-2 text-[12px] text-white/70 transition hover:border-cyan/50 hover:text-white sm:inline-flex"
          >
            {reduced ? "Motion: reduced" : "Reduce motion"}
          </button>
          <button
            type="button"
            onClick={() => openTrailer("nav")}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] text-white/80 transition hover:text-white md:inline-flex"
          >
            <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><path d="M4 2.5v11l9-5.5z" /></svg>
            Trailer
          </button>
          <a
            href={withUtm(LINKS.login, "nav-login")}
            target="_blank"
            rel="noopener"
            onClick={() => track("cta_click", { cta: "login", location: "nav" })}
            className="hidden px-2 text-[13px] text-white/70 hover:text-white md:inline"
          >
            Log in
          </a>
          <CtaLink href={withUtm(LINKS.register, "nav-start-free")} event="cta_click" location="nav" className="!px-4 !py-2 !text-[13px]">
            Start free
          </CtaLink>
        </div>
      </div>
      <motion.div aria-hidden className="h-px origin-left bg-gradient-to-r from-electric via-cyan to-electric" style={{ scaleX: progress }} />

    </header>
  );
}
