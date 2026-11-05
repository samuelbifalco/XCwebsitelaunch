"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useMotionPref } from "@/lib/motion";
import { scrollToTarget } from "./SmoothScroll";

const CHAPTERS = [
  { id: "top", label: "The storm" },
  { id: "chaos", label: "The chaos" },
  { id: "adjuster", label: "The adjuster" },
  { id: "workspace", label: "The workspace" },
  { id: "journey", label: "The journey" },
  { id: "people", label: "The people" },
  { id: "clarity", label: "Clarity" },
];

/** Desktop chapter indicator — shows where you are in the film and jumps between chapters. */
export default function ChapterRail() {
  const [active, setActive] = useState(0);
  const { reduced, ready } = useMotionPref();

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      const triggers = CHAPTERS.map((c, i) => {
        const el = document.getElementById(c.id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      ScrollTrigger.refresh();
      cleanup = () => triggers.forEach((tr) => tr?.kill());
    }, 400);
    let cleanup = () => {};
    return () => {
      clearTimeout(t);
      cleanup();
    };
  }, [ready, reduced]);

  return (
    <nav aria-label="Chapters" className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <ol className="flex flex-col items-end gap-3">
        {CHAPTERS.map((c, i) => {
          const on = i === active;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={on ? "step" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(`#${c.id}`);
                }}
                className="group flex items-center gap-3"
              >
                <span className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${on ? "translate-x-2 text-white opacity-0 group-hover:translate-x-0 group-hover:opacity-100" : "translate-x-2 text-white/60 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>
                  {c.label}
                </span>
                <span className={`block rounded-full transition-all duration-500 ${on ? "h-6 w-[3px] bg-cyan shadow-[0_0_10px_#7fd8ff]" : "h-[6px] w-[6px] bg-white/30 group-hover:bg-white/70"}`} />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
