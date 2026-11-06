"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotionPref, useIsDesktop } from "@/lib/motion";
import { track } from "@/lib/analytics";
import LazyVideo from "./LazyVideo";
import { scrollToTarget } from "./SmoothScroll";

type Stage = {
  key: string;
  label: string;
  who: string;
  body: string;
  rows: { t: string; s: "done" | "active" | "review" }[];
  tag: string;
  img: string;
  video?: string;
  imgAlt: string;
  real?: boolean;
  pos?: string;
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
    img: "/media/ladder_loop_poster.webp", video: "/media/ladder_loop.mp4", imgAlt: "The adjuster photographs the damaged roof from a ladder.", pos: "40% center",
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
    img: "/media/dmg_roof.webp", imgAlt: "A documentation photo of torn roof shingles.",
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
    img: "/media/ui_policy.webp", imgAlt: "XactaClaim Policy Review and Claim Copilot screen.", real: true, pos: "100% 50%",
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
    img: "/media/ui_screen.webp", imgAlt: "XactaClaim claim workspace with documents, photos and activity.", real: true, pos: "100% 50%",
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
    img: "/media/tablet_loop_poster.webp", video: "/media/tablet_loop.mp4", imgAlt: "The homeowner, reassured, points at the claim on the adjuster's tablet.", pos: "60% center",
  },
];

const dot = { done: "bg-emerald-400", active: "bg-electric animate-pulse", review: "bg-amber-400" };
const label = { done: "Done", active: "In progress", review: "Needs review" };

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [peek, setPeek] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const { reduced, ready } = useMotionPref();
  const desktop = useIsDesktop();
  const pinned = ready && !reduced && desktop;
  const st = useRef<ScrollTrigger | null>(null);
  const fill = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const choose = useCallback((i: number, via: string) => {
    const cur = activeRef.current;
    if (i === cur) return;
    activeRef.current = i;
    setDir(i > cur ? 1 : -1);
    setActive(i);
    track("journey_stage", { stage: STAGES[i].key, via });
  }, []);

  useGSAP(
    () => {
      if (!ready || reduced) return;
      if (pinned) {
        // Desktop: the chapter pins and scrolling walks the claim, stage by stage.
        st.current = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "+=420%",
          pin: true,
          anticipatePin: 1,
          onUpdate(self) {
            const p = self.progress;
            if (fill.current) fill.current.style.width = `${Math.min(1, p * 1.12) * 100}%`;
            choose(Math.min(STAGES.length - 1, Math.floor(p * STAGES.length * 0.999)), "scroll");
          },
        });
        return () => {
          st.current = null;
        };
      }
      gsap.fromTo(".jr-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".jr-track", start: "top 85%", end: "top 45%", scrub: 1 } });
      gsap.fromTo(".jr-node", { scale: 0.6, opacity: 0.3 }, { scale: 1, opacity: 1, stagger: 0.12, ease: "back.out(2)", scrollTrigger: { trigger: ".jr-track", start: "top 85%", end: "top 50%", scrub: 1 } });
      gsap.fromTo(".jr-stage", { clipPath: "inset(12% 8% 12% 8% round 28px)", y: 60 }, { clipPath: "inset(0% 0% 0% 0% round 24px)", y: 0, ease: "none", scrollTrigger: { trigger: ".jr-stage", start: "top 95%", end: "top 45%", scrub: 1 } });
    },
    { scope: root, dependencies: [reduced, ready], revertOnUpdate: true }
  );


  // Optional auto-play — never in reduced motion; stops at the last stage.
  useEffect(() => {
    if (!playing || reduced) return;
    const t = setTimeout(() => {
      if (active >= STAGES.length - 1) setPlaying(false);
      else choose(active + 1, "autoplay");
    }, 3600);
    return () => clearTimeout(t);
  }, [playing, active, reduced, choose]);

  const s = STAGES[active];
  const pct = (active / (STAGES.length - 1)) * 100;
  /** In the pinned layout a stage is a scroll position; elsewhere it is just state. */
  const goTo = (i: number, via: string) => {
    const t = st.current;
    if (pinned && t) scrollToTarget(t.start + (t.end - t.start) * ((i + 0.5) / STAGES.length));
    else choose(i, via);
  };
  const go = (d: number) => goTo(Math.max(0, Math.min(STAGES.length - 1, active + d)), "stepper");

  return (
    <section ref={root} id="journey" aria-labelledby="jr-title" className={`relative overflow-hidden bg-ink ${pinned ? "h-[100svh]" : "py-28 sm:py-36"}`}>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(36,160,237,.18),transparent_70%)]" />
      <div className={`relative mx-auto max-w-6xl px-5 sm:px-8 ${pinned ? "flex h-full flex-col justify-center pb-6 pt-20" : ""}`}>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 04 — Walk the claim</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="jr-title" className={`font-semibold leading-[1] tracking-[-0.04em] ${pinned ? "max-w-4xl text-[clamp(2rem,3.4vw,3rem)]" : "max-w-2xl text-[clamp(2rem,4.6vw,3.8rem)]"}`}>
            From the first inspection <span className="font-[family-name:var(--font-instrument-serif)] font-normal italic text-cyan">to real progress.</span>
          </h2>
          <div className="flex max-w-sm flex-col items-start gap-3">
            <p className="text-sm text-white/55">
              {pinned ? "Scroll to walk the claim, or select a stage." : "Select a stage to explore a simplified claim journey."} This is an interactive illustration — not a claim submission.
            </p>
            {!reduced && !pinned && (
              <button
                type="button"
                aria-pressed={playing}
                onClick={() => {
                  if (!playing && active === STAGES.length - 1) choose(0, "autoplay");
                  setPlaying((p) => !p);
                  track("journey_autoplay", { on: !playing });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/80 transition hover:border-cyan/50 hover:text-white"
              >
                {playing ? (
                  <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></svg>
                ) : (
                  <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><path d="M4 2.5v11l9-5.5z" /></svg>
                )}
                {playing ? "Pause journey" : "Play the journey"}
              </button>
            )}
          </div>
        </div>

        {/* timeline */}
        <div className={`jr-track relative ${pinned ? "mt-8" : "mt-14 sm:mt-16"}`}>
          <svg aria-hidden className="absolute left-[10%] right-[10%] top-6 h-1 w-[80%] overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 2">
            <line className="jr-line origin-left" x1="0" y1="1" x2="100" y2="1" stroke="rgba(127,216,255,.35)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" strokeDasharray="6 8" style={{ animation: reduced ? undefined : "flow 1.2s linear infinite" }} />
          </svg>
          <div aria-hidden className="absolute left-[10%] right-[10%] top-[23px] h-[3px]">
            <div ref={fill} className={`relative h-full rounded-full bg-cyan shadow-[0_0_16px_#7fd8ff,0_0_40px_#24a0ed] ${pinned ? "" : "transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"}`} style={pinned ? { width: "0%" } : { width: `${pct}%` }}>
              <span className="absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_#fff]" />
            </div>
          </div>
          <div role="tablist" aria-label="Claim journey stages" className="relative grid grid-cols-5">
            {STAGES.map((st, i) => {
              const on = i === active;
              const passed = i <= active;
              return (
                <div key={st.key} className="relative flex flex-col items-center" onMouseEnter={() => setPeek(i)} onMouseLeave={() => setPeek(null)}>
                  <button
                    role="tab"
                    id={`jr-tab-${st.key}`}
                    aria-selected={on}
                    aria-controls="jr-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => {
                      setPlaying(false);
                      goTo(i, "click");
                    }}
                    onFocus={() => !pinned && choose(i, "focus")}
                    onKeyDown={(e) => {
                      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                      if (!d) return;
                      e.preventDefault();
                      const n = (i + d + STAGES.length) % STAGES.length;
                      if (pinned) goTo(n, "keyboard");
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
                      {passed && !on ? (
                        <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none"><path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                      {on && <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-cyan/50" />}
                    </span>
                    <span className={`text-[12px] font-medium transition-colors sm:text-base ${on ? "text-white" : "text-white/50"}`}>{st.label}</span>
                  </button>
                  {/* hover preview (pointer devices) */}
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute bottom-full mb-3 hidden w-44 overflow-hidden rounded-xl border border-cyan/25 bg-ink shadow-[0_20px_50px_-10px_rgba(0,0,0,.8)] transition-all duration-300 md:block ${
                      peek === i && !on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={st.img} alt="" loading="lazy" className="aspect-video w-full object-cover" style={{ objectPosition: st.pos }} />
                    <p className="px-3 py-2 text-left text-[11px] text-white/70">{st.who}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* stage */}
        <div id="jr-panel" role="tabpanel" aria-labelledby={`jr-tab-${s.key}`} className={`jr-stage relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#050b18] ${pinned ? "mt-7" : "mt-12"}`}>
          <motion.div
            className={`relative ${pinned ? "h-[min(56svh,600px)]" : "aspect-[4/5] sm:aspect-[16/9]"}`}
            drag={reduced ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
          >
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={s.key}
                custom={dir}
                className="absolute inset-0"
                initial={reduced ? false : { opacity: 0, x: `${dir * 8}%`, scale: 1.08 }}
                animate={{ opacity: 1, x: "0%", scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, x: `${-dir * 8}%`, scale: 0.98 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                { }
                {s.video ? (
                  <LazyVideo src={s.video} poster={s.img} label={s.imgAlt} className="h-full w-full object-cover" style={{ objectPosition: s.pos }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.img} alt={s.imgAlt} loading="lazy" draggable={false} className={`h-full w-full ${s.real ? "object-contain bg-[#081427]" : "object-cover"}`} style={{ objectPosition: s.pos }} />
                )}
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,15,.92)_0%,rgba(3,6,15,.55)_45%,rgba(3,6,15,.05)_75%)] max-sm:bg-[linear-gradient(180deg,rgba(3,6,15,.1)_20%,rgba(3,6,15,.95)_70%)]" />
            <span className="absolute right-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/70 backdrop-blur">
              {s.real ? "Real XactaClaim screen" : "Scene · AI-generated dramatization"}
            </span>

            {/* copy */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:inset-y-0 sm:left-0 sm:right-auto sm:flex sm:w-[46%] sm:flex-col sm:justify-center sm:p-10" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.key + "-copy"}
                  initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduced ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan/80">
                    {String(active + 1).padStart(2, "0")} / 05 · {s.who}
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">{s.label}</h3>
                  <p className="mt-3 text-sm text-white/75 sm:text-base">{s.body}</p>
                  <p className="mt-4 w-fit rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan">{s.tag}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* mini claim-status demo */}
            <div className="glass absolute bottom-6 right-6 hidden w-[min(360px,38%)] rounded-2xl p-5 md:block">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Example claim · illustration</p>
                  <p className="mt-0.5 text-sm font-medium">Storm damage — residential</p>
                </div>
                <motion.span key={s.key} initial={reduced ? false : { scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-full bg-electric/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan">
                  {s.label}
                </motion.span>
              </div>
              <ul className="mt-3 space-y-2">
                {s.rows.map((r, i) => (
                  <motion.li
                    key={s.key + r.t}
                    initial={reduced ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2"
                  >
                    <span className="flex items-center justify-between gap-3 text-[13px]">
                      <span className="flex items-center gap-2.5">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${dot[r.s]}`} />
                        {r.t}
                      </span>
                      <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-white/40">{label[r.s]}</span>
                    </span>
                    <motion.span
                      aria-hidden
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-electric to-cyan"
                      initial={reduced ? false : { width: "0%" }}
                      animate={{ width: r.s === "done" ? "100%" : r.s === "active" ? "60%" : "35%" }}
                      transition={{ duration: 0.9, delay: 0.35 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </motion.li>
                ))}
              </ul>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-electric to-cyan transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ width: `${((active + 1) / STAGES.length) * 100}%` }} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* mobile stepper + compact demo */}
        <div className="mt-5 flex items-center justify-between md:hidden">
          <button type="button" onClick={() => go(-1)} disabled={active === 0} className="rounded-full border border-white/15 px-4 py-2 text-sm disabled:opacity-30">
            ← Prev
          </button>
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">Swipe or tap</span>
          <button type="button" onClick={() => go(1)} disabled={active === STAGES.length - 1} className="rounded-full bg-electric px-4 py-2 text-sm disabled:opacity-30">
            Next →
          </button>
        </div>
        <ul className="mt-4 space-y-2 md:hidden">
          {s.rows.map((r) => (
            <li key={s.key + r.t} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm">
              <span className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full ${dot[r.s]}`} />
                {r.t}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">{label[r.s]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
