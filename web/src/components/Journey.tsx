"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionPref } from "@/lib/motion";
import { track } from "@/lib/analytics";

type Stage = {
  key: string;
  label: string;
  who: string;
  body: string;
  rows: { t: string; s: "done" | "active" | "review" }[];
  tag: string;
};

// Simplified, illustrative journey. Feature references follow xactaclaim.com.
const STAGES: Stage[] = [
  {
    key: "inspect",
    label: "Inspect",
    who: "Adjuster · on site",
    body: "The adjuster walks the property with the homeowner and opens a claim file. One claim credit creates a workspace with client, property, carrier and phases.",
    rows: [
      { t: "Claim file opened", s: "done" },
      { t: "Client, property & carrier details", s: "done" },
      { t: "Phase: Inspection", s: "active" },
    ],
    tag: "Mobile companion for field work · Pro / Pro+",
  },
  {
    key: "document",
    label: "Document",
    who: "Adjuster + homeowner",
    body: "Damage photos, the policy, estimates and homeowner uploads land on one claim file — through staff uploads and the secure client portal.",
    rows: [
      { t: "Roof & gutter photos uploaded", s: "done" },
      { t: "Policy PDF attached", s: "done" },
      { t: "Client portal link sent", s: "active" },
    ],
    tag: "Secure client portal · all plans",
  },
  {
    key: "review",
    label: "Review",
    who: "Adjuster, AI-assisted",
    body: "AI-assisted policy and photo review surfaces notes for the adjuster to verify. Nothing goes to the client or carrier until the adjuster approves.",
    rows: [
      { t: "Policy review ready", s: "done" },
      { t: "Coverage notes flagged", s: "review" },
      { t: "Adjuster approval required", s: "active" },
    ],
    tag: "AI review · Pro / Pro+",
  },
  {
    key: "organize",
    label: "Organize",
    who: "The whole team",
    body: "Outstanding client requests, voicemail follow-ups and tasks sit in one work queue. Messages that can't be matched safely go to human review — not onto the wrong file.",
    rows: [
      { t: "Outstanding client items", s: "active" },
      { t: "Voicemail follow-up", s: "done" },
      { t: "Unmatched text → human review", s: "review" },
    ],
    tag: "Work queue & human review queue",
  },
  {
    key: "progress",
    label: "Progress",
    who: "Adjuster → homeowner",
    body: "Tracked updates keep the homeowner informed and the timeline shows what happened last. Pro+ adds estimate comparison and demand drafts you edit before save or send.",
    rows: [
      { t: "Client update sent · tracked", s: "done" },
      { t: "Timeline updated", s: "done" },
      { t: "Next step scheduled", s: "active" },
    ],
    tag: "Tracked SMS/email when configured · Pro / Pro+",
  },
];

const dot = { done: "bg-emerald-400", active: "bg-electric animate-pulse", review: "bg-amber-400" };
const label = { done: "Done", active: "In progress", review: "Needs review" };

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { reduced, ready } = useMotionPref();

  useGSAP(
    () => {
      if (!ready || reduced) return;
      gsap.fromTo(
        ".jr-line",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".jr-track", start: "top 85%", end: "top 35%", scrub: 1 } }
      );
      gsap.fromTo(
        ".jr-node",
        { scale: 0.6, opacity: 0.3 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.12,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".jr-track", start: "top 85%", end: "top 40%", scrub: 1 },
        }
      );
    },
    { scope: root, dependencies: [reduced, ready], revertOnUpdate: true }
  );

  const choose = (i: number, via: string) => {
    if (i === active) return;
    setActive(i);
    track("journey_stage", { stage: STAGES[i].key, via });
  };

  const s = STAGES[active];
  const pct = (active / (STAGES.length - 1)) * 100;

  return (
    <section ref={root} id="journey" aria-labelledby="jr-title" className="relative overflow-hidden bg-ink py-28 sm:py-36">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(36,160,237,.18),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 04 — Walk the claim</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="jr-title" className="max-w-2xl text-[clamp(2rem,4.6vw,3.8rem)] font-semibold leading-[1] tracking-[-0.04em]">
            From the first inspection <span className="font-[family-name:var(--font-instrument-serif)] font-normal italic text-cyan">to real progress.</span>
          </h2>
          <p className="max-w-sm text-sm text-white/55">Select a stage to explore a simplified claim journey. This is an interactive illustration — not a claim submission.</p>
        </div>

        {/* track */}
        <div className="jr-track relative mt-14 sm:mt-20">
          <div aria-hidden className="absolute left-[10%] right-[10%] top-6 h-px bg-white/10" />
          <div aria-hidden className="jr-line absolute left-[10%] right-[10%] top-6 h-px origin-left bg-gradient-to-r from-electric/40 via-cyan/60 to-electric/40" />
          <div aria-hidden className="absolute left-[10%] right-[10%] top-[23px] h-[3px]">
            <div
              className="h-full rounded-full bg-cyan shadow-[0_0_16px_#7fd8ff,0_0_40px_#24a0ed] transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div role="tablist" aria-label="Claim journey stages" className="relative grid grid-cols-5">
            {STAGES.map((st, i) => {
              const on = i === active;
              const passed = i <= active;
              return (
                <button
                  key={st.key}
                  role="tab"
                  id={`jr-tab-${st.key}`}
                  aria-selected={on}
                  aria-controls="jr-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => choose(i, "click")}
                  onMouseEnter={() => choose(i, "hover")}
                  onFocus={() => choose(i, "focus")}
                  onKeyDown={(e) => {
                    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                    if (!d) return;
                    e.preventDefault();
                    const n = (i + d + STAGES.length) % STAGES.length;
                    document.getElementById(`jr-tab-${STAGES[n].key}`)?.focus();
                  }}
                  className="group flex flex-col items-center gap-3 px-1"
                >
                  <span
                    className={`jr-node relative flex h-12 w-12 items-center justify-center rounded-full border font-mono text-xs transition-all duration-500 ${
                      on
                        ? "border-cyan bg-electric text-white shadow-[0_0_0_6px_rgba(36,160,237,.18),0_0_40px_rgba(36,160,237,.8)]"
                        : passed
                          ? "border-cyan/60 bg-[#0b2347] text-cyan"
                          : "border-white/15 bg-ink text-white/50 group-hover:border-cyan/50"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                    {on && <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-cyan/50" />}
                  </span>
                  <span className={`text-[13px] font-medium transition-colors sm:text-base ${on ? "text-white" : "text-white/50"}`}>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* panel */}
        <div id="jr-panel" role="tabpanel" aria-labelledby={`jr-tab-${s.key}`} aria-live="polite" className="mt-12 grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.key + "-copy"}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan/80">{s.who}</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{s.label}</h3>
              <p className="mt-4 text-white/70 sm:text-lg">{s.body}</p>
              <p className="mt-5 w-fit rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan">{s.tag}</p>
            </motion.div>
          </AnimatePresence>

          <div className="glass relative overflow-hidden rounded-2xl p-5 sm:p-7">
            <div aria-hidden className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-electric/25 blur-3xl" />
            <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Example claim · illustration</p>
                <p className="mt-1 font-medium">Storm damage — residential</p>
              </div>
              <span className="rounded-full bg-electric/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan">Phase: {s.label}</span>
            </div>
            <AnimatePresence mode="popLayout">
              <motion.ul key={s.key} className="relative mt-4 space-y-2.5">
                {s.rows.map((r, i) => (
                  <motion.li
                    key={r.t}
                    initial={reduced ? false : { opacity: 0, x: 24, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={reduced ? undefined : { opacity: 0, x: -16 }}
                    transition={{ duration: 0.5, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${dot[r.s]}`} />
                      {r.t}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/40">{label[r.s]}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
            <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-electric to-cyan transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
                style={{ width: `${((active + 1) / STAGES.length) * 100}%` }}
              />
            </div>
            <p className="relative mt-2 text-right font-mono text-[10px] uppercase tracking-wider text-white/35">Journey {active + 1} / {STAGES.length}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
