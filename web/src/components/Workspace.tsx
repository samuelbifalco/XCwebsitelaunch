"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotionPref, useIsDesktop } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { ITEMS, ClaimCard, type Item } from "./ClaimItems";
import { scrollToTarget } from "./SmoothScroll";

/* ---------- Real product screens (frames from the official XactaClaim product film) ---------- */

type Hotspot = { id: string; x: number; y: number; title: string; body: string };
type ScreenKey = "screen" | "policy" | "estimate";

const SCREENS: Record<ScreenKey, { src: string; ar: number; alt: string; fit?: "contain"; hotspots: Hotspot[] }> = {
  screen: {
    src: "/media/ui_screen.webp",
    ar: 900 / 612,
    alt: "XactaClaim claim workspace for Claim #C-4412 showing documents, photos, policy and an activity timeline.",
    hotspots: [
      { id: "claim", x: 0.4, y: 0.11, title: "One claim file", body: "Client, property, carrier, phases and a single timeline — opened with one claim credit." },
      { id: "docs", x: 0.3, y: 0.25, title: "Documents", body: "Staff uploads and client-portal uploads stay together on the claim." },
      { id: "photos", x: 0.28, y: 0.54, title: "Photos", body: "Damage photos live next to the documents they support." },
      { id: "policy", x: 0.6, y: 0.55, title: "Policy", body: "Policy documents on the file. AI-assisted policy review is available on Pro and Pro+." },
      { id: "activity", x: 0.83, y: 0.24, title: "Activity timeline", body: "Uploads and status changes — plus SMS delivery status when callbacks are configured." },
      { id: "portal", x: 0.07, y: 0.44, title: "Client portal", body: "A secure portal for homeowner uploads. Portal-link texts include the URL only." },
    ],
  },
  policy: {
    src: "/media/ui_policy.webp",
    ar: 1605 / 1080,
    alt: "XactaClaim Policy Review with Claim Copilot notes awaiting the adjuster's approval.",
    hotspots: [
      { id: "summary", x: 0.283, y: 0.18, title: "AI-assisted summary", body: "Professional review required — AI does not make coverage determinations." },
      { id: "copilot", x: 0.797, y: 0.17, title: "Claim Copilot", body: "Works from saved claim details and saved policy or estimate summaries." },
      { id: "approve", x: 0.845, y: 0.905, title: "You approve", body: "Nothing goes to the client or carrier until the adjuster reviews and approves." },
    ],
  },
  estimate: {
    src: "/media/ui_estimate.webp",
    ar: 1460 / 760,
    fit: "contain",
    alt: "XactaClaim Estimate Comparison showing carrier and contractor estimates with a Create follow-up task button.",
    hotspots: [
      { id: "compare", x: 0.316, y: 0.253, title: "Estimate comparison", body: "Carrier and contractor line items side by side — a Pro+ feature." },
      { id: "variance", x: 0.894, y: 0.41, title: "Variance", body: "Differences surface per line item for the adjuster to review." },
      { id: "task", x: 0.592, y: 0.892, title: "Follow-up task", body: "Turn a finding into a task in the work queue." },
    ],
  },
};

type Cap = { key: string; title: string; body: string; plan: string; screen: ScreenKey; fx?: number; fy?: number; s?: number; spots: string[] };

// Feature copy and plan availability follow xactaclaim.com/features and /pricing.
const CAPS: Cap[] = [
  { key: "organize", title: "Claim organization", body: "One claim file, one timeline — client, property, carrier, phases, documents, photos and activity together, so anyone on the team can see what happened last.", plan: "All plans", screen: "screen", spots: ["claim", "activity"] },
  { key: "documents", title: "Documents & evidence", body: "Staff uploads plus a secure client portal for homeowner uploads. When messaging is configured, matched inbound SMS/MMS can land on the claim file.", plan: "All plans · limits vary", screen: "screen", fx: 0.5, fy: 0.3, s: 1.75, spots: ["docs"] },
  { key: "photos", title: "Property photographs", body: "Damage photos live on the claim next to the documents they support. Pro and Pro+ add AI-assisted photo review for the adjuster to verify.", plan: "All plans · AI photo review on Pro / Pro+", screen: "screen", fx: 0.4, fy: 0.66, s: 1.7, spots: ["photos", "policy"] },
  { key: "collab", title: "Client collaboration", body: "A secure client portal, tracked SMS/email updates and verified voicemail intake when configured — with uploads and delivery status on the timeline.", plan: "Portal on all plans · messaging on Pro / Pro+", screen: "screen", fx: 0.45, fy: 0.42, s: 1.15, spots: ["portal", "activity"] },
  { key: "ai", title: "AI-assisted review", body: "Policy and photo review, Claim Copilot, Morning Brief and AI Claim Brief (beta). You review and approve — AI does not make coverage determinations.", plan: "Pro / Pro+ · Solo includes 1 trial action", screen: "policy", spots: ["summary", "copilot", "approve"] },
  { key: "workflow", title: "Workflow tracking", body: "A work queue for outstanding client requests and follow-ups, plus a human review queue when automation shouldn't guess. Pro+ adds estimate comparison and demand drafts.", plan: "Pro / Pro+ · estimate comparison on Pro+", screen: "estimate", spots: ["compare", "variance", "task"] },
];

const SHOWCASE_START = 0.44;

function zoom(c: Cap) {
  const s = c.s ?? 1;
  if (s === 1) return "none";
  const half = 0.5 / s;
  const cx = Math.min(1 - half, Math.max(half, c.fx ?? 0.5));
  const cy = Math.min(1 - half, Math.max(half, c.fy ?? 0.5));
  return `scale(${s}) translate(${(0.5 - cx) * 100}%, ${(0.5 - cy) * 100}%)`;
}

/* ---------- Sorted grid targets for the "organize" beat ---------- */

const CLOUD = ITEMS.slice(0, 10);
const GROUP: Record<Item["kind"], 0 | 1 | 2> = { photo: 0, doc: 1, estimate: 1, note: 1, email: 2, sms: 2, voicemail: 2 };
const GROUP_LABELS = ["Photos", "Documents", "Messages"];
const GRID_X = [27, 50, 73];
const slots = (() => {
  const count = [0, 0, 0];
  const per = [0, 0, 0];
  CLOUD.forEach((it) => per[GROUP[it.kind]]++);
  return CLOUD.map((it) => {
    const g = GROUP[it.kind];
    const row = count[g]++;
    const top = 50 - ((per[g] - 1) * 13) / 2 + row * 13;
    return { x: GRID_X[g], y: top + 4 };
  });
})();

export default function Workspace() {
  const root = useRef<HTMLElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [spot, setSpot] = useState<string | null>(null);
  const { reduced, ready } = useMotionPref();
  const desktop = useIsDesktop();
  const pinned = ready && !reduced && desktop;
  const activeRef = useRef(0);

  useEffect(() => setSpot(null), [active]);

  useGSAP(
    () => {
      if (!pinned) return;
      const stage = root.current!;
      const frame = stage.querySelector<HTMLElement>(".ws-frame")!;
      const W = () => stage.clientWidth;
      const H = () => stage.clientHeight;
      const centerX = () => {
        const r = frame.getBoundingClientRect();
        const cur = Number(gsap.getProperty(frame, "x")) || 0;
        return window.innerWidth / 2 - (r.left - cur + r.width / 2);
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=440%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress;
            const idx = p < SHOWCASE_START ? 0 : Math.min(CAPS.length - 1, Math.floor(((p - SHOWCASE_START) / (1 - SHOWCASE_START)) * CAPS.length));
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
          },
        },
      });
      st.current = tl.scrollTrigger ?? null;

      tl.set(".ws-copy", { opacity: 0, x: -40 }, 0)
        .set(".ws-ghost", { opacity: 0 }, 0)
        .fromTo(frame, { x: centerX, rotateX: 64, scale: 0.6, yPercent: 22, opacity: 0 }, { x: centerX, rotateX: 64, scale: 0.6, yPercent: 22, opacity: 0, duration: 0.01 }, 0);

      // 1 — Items float in 3D space while the camera orbits.
      tl.fromTo(".ws-cloud", { rotateY: -22, rotateX: 8 }, { rotateY: 14, rotateX: -4, duration: 0.26 }, 0)
        .set(".ws-card", { z: (i: number, el: HTMLElement) => Number(el.dataset.z) }, 0);

      // 2 — They align and organize themselves into a sorted grid.
      CLOUD.forEach((it, i) => {
        tl.to(
          `.ws-card-${it.id}`,
          {
            x: () => ((slots[i].x - it.x) / 100) * W(),
            y: () => ((slots[i].y - it.y) / 100) * H(),
            z: 0,
            rotate: -it.r,
            scale: 0.62,
            duration: 0.1,
            ease: "power3.inOut",
          },
          0.12 + (i % 5) * 0.006
        );
      });
      tl.to(".ws-cloud", { rotateY: 0, rotateX: 0, duration: 0.1, ease: "power2.inOut" }, 0.12)
        .to(".ws-intro", { opacity: 0, y: -24, duration: 0.04 }, 0.13)
        .fromTo(".ws-group", { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.01, duration: 0.04 }, 0.17)
        .to({}, { duration: 0.03 }, 0.22);

      // 3 — The grid compresses into the workspace as the screen rises.
      tl.to(".ws-group", { opacity: 0, duration: 0.03 }, 0.25)
        .to(".ws-card", { x: (i) => ((50 - CLOUD[i].x) / 100) * W(), y: (i) => ((58 - CLOUD[i].y) / 100) * H(), scale: 0.1, opacity: 0, filter: "blur(3px)", stagger: 0.004, duration: 0.07, ease: "power2.in" }, 0.25)
        .to(frame, { opacity: 1, duration: 0.03 }, 0.25)
        .to(frame, { rotateX: 0, scale: 0.92, yPercent: 0, duration: 0.09, ease: "power2.out" }, 0.27)
        .fromTo(".ws-flash", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.335)
        .to(".ws-flash", { opacity: 0, duration: 0.04 }, 0.345)
        .fromTo(".ws-sweep", { xPercent: -120 }, { xPercent: 320, duration: 0.06 }, 0.335);

      // 4 — The interface expands into the showcase.
      tl.to(frame, { x: 0, scale: 1, duration: 0.06, ease: "power2.inOut" }, 0.37)
        .to(".ws-ghost", { opacity: 1, duration: 0.05 }, 0.39)
        .to(".ws-copy", { opacity: 1, x: 0, duration: 0.05 }, 0.4)
        .to({}, { duration: 1 - SHOWCASE_START }, SHOWCASE_START);

      // Pointer depth: the screen tilts gently toward the cursor.
      const rx = gsap.quickTo(".ws-tilt", "rotateX", { duration: 0.8, ease: "power3" });
      const ry = gsap.quickTo(".ws-tilt", "rotateY", { duration: 0.8, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        ry((e.clientX / window.innerWidth - 0.5) * 8);
        rx(-(e.clientY / window.innerHeight - 0.5) * 6);
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root, dependencies: [pinned], revertOnUpdate: true }
  );

  const select = (i: number) => {
    track("capability_select", { capability: CAPS[i].key });
    const s = st.current;
    if (pinned && s) {
      const local = SHOWCASE_START + ((i + 0.5) / CAPS.length) * (1 - SHOWCASE_START);
      scrollToTarget(s.start + (s.end - s.start) * local);
    } else {
      activeRef.current = i;
      setActive(i);
    }
  };

  const cap = CAPS[active];
  const scale = cap.s ?? 1;
  const order: ScreenKey[] = ["screen", "policy", "estimate"];
  const ghosts = order.filter((k) => k !== cap.screen);

  return (
    <section
      ref={root}
      id="workspace"
      aria-labelledby="ws-title"
      className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_70%_40%,#0b2347_0%,#06101f_45%,#03060f_100%)] lg:h-[100svh]"
    >
      <div aria-hidden className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_60%_at_60%_50%,black,transparent)]" />
      <div aria-hidden className="ws-flash pointer-events-none absolute inset-0 z-30 bg-cyan/20 opacity-0 mix-blend-screen" />

      {pinned && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 z-20 [perspective:1100px]">
            <div className="ws-cloud absolute inset-0 [transform-style:preserve-3d]">
              {CLOUD.map((it) => (
                <div
                  key={it.id}
                  data-z={Math.round((it.depth - 1) * 500)}
                  className={`ws-card ws-card-${it.id} absolute`}
                  style={{ left: `${it.x}%`, top: `${it.y}%`, rotate: `${it.r}deg`, translate: "-50% -50%" }}
                >
                  <ClaimCard item={it} />
                </div>
              ))}
            </div>
            {GROUP_LABELS.map((g, i) => (
              <p key={g} className="ws-group absolute top-[22%] -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan opacity-0" style={{ left: `${GRID_X[i]}%` }}>
                {g}
              </p>
            ))}
          </div>
          <div className="ws-intro pointer-events-none absolute inset-x-0 top-[12%] z-10 px-5 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 03 — Enter XactaClaim</p>
            <p className="mt-3 text-[clamp(1.6rem,3.6vw,3rem)] font-semibold tracking-[-0.03em]">Everything finds its place.</p>
          </div>
        </>
      )}

      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-8 px-5 py-24 sm:px-8 lg:h-full lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:py-0">
        <div className="ws-copy order-2 lg:order-1">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 03 — Enter XactaClaim</p>
          <h2 id="ws-title" className="text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            One Workspace.
            <br />
            <span className="text-glow bg-gradient-to-r from-cyan to-electric bg-clip-text text-transparent">Every Claim.</span>
          </h2>
          <div role="tablist" aria-label="XactaClaim capabilities" className="mt-7 space-y-1" onMouseLeave={() => setHover(null)}>
            {CAPS.map((c, i) => {
              const on = i === active;
              const open = on || hover === i;
              return (
                <button
                  key={c.key}
                  role="tab"
                  id={`cap-tab-${c.key}`}
                  aria-selected={on}
                  aria-controls="cap-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onMouseEnter={() => setHover(i)}
                  onKeyDown={(e) => {
                    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
                    if (!d) return;
                    e.preventDefault();
                    const n = (i + d + CAPS.length) % CAPS.length;
                    select(n);
                    document.getElementById(`cap-tab-${CAPS[n].key}`)?.focus();
                  }}
                  className={`group relative w-full rounded-xl px-4 py-2.5 text-left transition-all duration-500 ${
                    on ? "bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(127,216,255,.25),0_10px_40px_-20px_rgba(36,160,237,.8)]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <span className={`absolute bottom-3 left-0 top-3 w-[2px] rounded-full transition-all duration-500 ${on ? "bg-electric shadow-[0_0_12px_#24a0ed]" : "bg-white/10"}`} />
                  <span className={`font-medium transition-colors ${on ? "text-white" : "text-white/55 group-hover:text-white/85"}`}>
                    <span className="mr-3 font-mono text-[11px] text-cyan/70">0{i + 1}</span>
                    {c.title}
                  </span>
                  <span className={`grid transition-all duration-500 ${open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <span className="overflow-hidden">
                      <span className="block text-sm leading-relaxed text-white/65">{c.body}</span>
                      <span className="mt-2 inline-block rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan">{c.plan}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="order-1 [perspective:1600px] lg:order-2">
          <div className="ws-frame relative origin-[50%_80%] will-change-transform [transform-style:preserve-3d]">
            <div className="ws-tilt relative [transform-style:preserve-3d]">
              <div aria-hidden className="absolute -inset-10 rounded-[48px] bg-electric/25 blur-3xl" />
              {/* layered depth: the other real screens stacked behind */}
              {ghosts.map((k, gi) => (
                <div
                  key={k}
                  aria-hidden
                  className="ws-ghost absolute inset-0 hidden overflow-hidden rounded-2xl border border-cyan/20 bg-[#081427] transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] lg:block"
                  style={{ transform: `translate3d(${(gi + 1) * 28}px, ${-(gi + 1) * 26}px, ${-(gi + 1) * 80}px) scale(${1 - (gi + 1) * 0.04})`, opacity: 0.55 - gi * 0.2 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={SCREENS[k].src} alt="" loading="lazy" className="h-full w-full object-cover opacity-50 blur-[1px]" />
                </div>
              ))}
              <div
                id="cap-panel"
                role="tabpanel"
                aria-labelledby={`cap-tab-${cap.key}`}
                className="relative overflow-hidden rounded-2xl border border-cyan/30 bg-[#081427] shadow-[0_0_0_1px_rgba(36,160,237,.25),0_40px_120px_-20px_rgba(36,160,237,.45)]"
              >
                <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="ml-3 truncate font-mono text-[10px] uppercase tracking-wider text-white/45">XactaClaim · {cap.title}</span>
                  <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-wider text-cyan/70 sm:inline">Tap the hotspots</span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden [container-type:size]">
                  {order.map((k) => {
                    const S = SCREENS[k];
                    const on = k === cap.screen;
                    return (
                      <div
                        key={k}
                        aria-hidden={!on}
                        className="absolute left-1/2 top-1/2 transition-opacity duration-700"
                        style={{ width: S.fit === "contain" ? `min(100cqw, calc(100cqh * ${S.ar}))` : `max(100cqw, calc(100cqh * ${S.ar}))`, aspectRatio: String(S.ar), translate: "-50% -50%", opacity: on ? 1 : 0, pointerEvents: on ? "auto" : "none" }}
                      >
                        <div className="relative h-full w-full transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)]" style={{ transform: on ? zoom(cap) : "none" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={S.src} alt={on ? S.alt : ""} loading="lazy" className="h-full w-full" />
                          {on &&
                            S.hotspots
                              .filter((h) => cap.spots.includes(h.id))
                              .map((h) => {
                                const open = spot === h.id;
                                const right = h.x > 0.6;
                                return (
                                  <div key={h.id} className="absolute z-10" style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%`, transform: `translate(-50%,-50%) scale(${1 / scale})` }}>
                                    <button
                                      type="button"
                                      aria-expanded={open}
                                      aria-label={`${h.title}: ${h.body}`}
                                      onMouseEnter={() => setSpot(h.id)}
                                      onMouseLeave={() => setSpot((s) => (s === h.id ? null : s))}
                                      onFocus={() => setSpot(h.id)}
                                      onBlur={() => setSpot((s) => (s === h.id ? null : s))}
                                      onClick={() => {
                                        setSpot((s) => (s === h.id ? null : h.id));
                                        track("hotspot_open", { hotspot: h.id, capability: cap.key });
                                      }}
                                      className="hotspot-dot relative flex h-7 w-7 items-center justify-center rounded-full bg-electric/90 shadow-[0_0_0_4px_rgba(36,160,237,.25),0_0_24px_#24a0ed]"
                                    >
                                      <span className="h-2 w-2 rounded-full bg-white" />
                                    </button>
                                    <div
                                      role="tooltip"
                                      className={`glass pointer-events-none absolute top-1/2 w-56 -translate-y-1/2 rounded-xl p-3 text-left transition-all duration-300 ${right ? "right-10" : "left-10"} ${
                                        open ? "opacity-100" : "translate-x-2 opacity-0"
                                      }`}
                                    >
                                      <p className="text-[13px] font-medium text-white">{h.title}</p>
                                      <p className="mt-1 text-[12px] leading-snug text-white/70">{h.body}</p>
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                      </div>
                    );
                  })}
                  <div aria-hidden className="ws-sweep pointer-events-none absolute inset-y-0 w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-cyan/25 to-transparent" />
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/5">
                    <div className="h-full bg-gradient-to-r from-electric to-cyan transition-[width] duration-700" style={{ width: `${((active + 1) / CAPS.length) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-white/40">Real XactaClaim interface, from the official XactaClaim product film. Hotspot notes are explanatory.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
