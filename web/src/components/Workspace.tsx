"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotionPref, useIsDesktop } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { ITEMS, ClaimCard } from "./ClaimItems";
import { scrollToTarget } from "./SmoothScroll";

type Cap = {
  key: string;
  title: string;
  body: string;
  plan: string;
  src: string;
  /** zoom focus inside the screenshot (0–1) and scale */
  fx?: number;
  fy?: number;
  s?: number;
  alt: string;
};

// Feature copy and plan availability follow xactaclaim.com/features and /pricing.
const CAPS: Cap[] = [
  {
    key: "organize",
    title: "Claim organization",
    body: "One claim file, one timeline — client, property, carrier, phases, documents, photos and activity together, so anyone on the team can see what happened last.",
    plan: "All plans",
    src: "/media/ui_screen.webp",
    alt: "XactaClaim claim workspace for Claim #C-4412 showing documents, photos, policy and an activity timeline.",
  },
  {
    key: "documents",
    title: "Documents & evidence",
    body: "Staff uploads plus a secure client portal for homeowner uploads. When messaging is configured, matched inbound SMS/MMS can land on the claim file.",
    plan: "All plans · limits vary",
    src: "/media/ui_screen.webp",
    fx: 0.5,
    fy: 0.34,
    s: 1.75,
    alt: "The Documents panel of an XactaClaim claim listing estimate, police report and invoice files.",
  },
  {
    key: "photos",
    title: "Property photographs",
    body: "Damage photos live on the claim next to the documents they support. Pro and Pro+ add AI-assisted photo review for the adjuster to verify.",
    plan: "All plans · AI photo review on Pro / Pro+",
    src: "/media/ui_screen.webp",
    fx: 0.38,
    fy: 0.68,
    s: 1.8,
    alt: "The Photos panel of an XactaClaim claim with exterior, window and water damage thumbnails.",
  },
  {
    key: "collab",
    title: "Client collaboration",
    body: "A secure client portal, tracked SMS/email updates and verified voicemail intake when configured — with uploads and delivery status on the timeline.",
    plan: "Portal on all plans · messaging on Pro / Pro+",
    src: "/media/ui_screen.webp",
    fx: 0.86,
    fy: 0.5,
    s: 1.7,
    alt: "The Activity timeline of an XactaClaim claim showing uploads and status changes.",
  },
  {
    key: "ai",
    title: "AI-assisted review",
    body: "Policy and photo review, Claim Copilot, Morning Brief and AI Claim Brief (beta). You review and approve — AI does not make coverage determinations.",
    plan: "Pro / Pro+ · Solo includes 1 trial action",
    src: "/media/ui_policy.webp",
    alt: "XactaClaim Policy Review with Claim Copilot notes awaiting the adjuster's approval.",
  },
  {
    key: "workflow",
    title: "Workflow tracking",
    body: "A work queue for outstanding client requests and follow-ups, plus a human review queue when automation shouldn't guess. Pro+ adds estimate comparison and demand drafts.",
    plan: "Pro / Pro+ · estimate comparison on Pro+",
    src: "/media/ui_estimate.webp",
    s: 1.28,
    alt: "XactaClaim Estimate Comparison showing carrier and contractor estimates with a Create follow-up task button.",
  },
];

const ASSEMBLE_END = 0.42;

function zoom(c: Cap) {
  const s = c.s ?? 1;
  if (s === 1) return "none";
  const half = 0.5 / s;
  const cx = Math.min(1 - half, Math.max(half, c.fx ?? 0.5));
  const cy = Math.min(1 - half, Math.max(half, c.fy ?? 0.5));
  return `scale(${s}) translate(${(0.5 - cx) * 100}%, ${(0.5 - cy) * 100}%)`;
}

export default function Workspace() {
  const root = useRef<HTMLElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const { reduced, ready } = useMotionPref();
  const desktop = useIsDesktop();
  const pinned = !reduced && desktop;
  const activeRef = useRef(0);

  useGSAP(
    () => {
      if (!ready || !pinned) return;
      const frame = root.current!.querySelector<HTMLElement>(".ws-frame")!;
      const centerX = () => {
        const r = frame.getBoundingClientRect();
        const cur = Number(gsap.getProperty(frame, "x")) || 0;
        return window.innerWidth / 2 - (r.left - cur + r.width / 2);
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=360%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress;
            const idx = p < ASSEMBLE_END + 0.04 ? 0 : Math.min(CAPS.length - 1, Math.floor(((p - ASSEMBLE_END - 0.04) / (1 - ASSEMBLE_END - 0.04)) * CAPS.length));
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
          },
        },
      });
      st.current = tl.scrollTrigger ?? null;

      // Phase 1 — the physical world: scattered claim items, frame lying flat in 3D.
      tl.set(".ws-copy", { opacity: 0, x: -40 }, 0);
      tl.fromTo(
        frame,
        { x: centerX, rotateX: 62, scale: 0.62, yPercent: 18, opacity: 0.0 },
        { x: centerX, rotateX: 62, scale: 0.62, yPercent: 18, opacity: 1, duration: 0.06 },
        0
      );
      tl.fromTo(".ws-intro", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.06 }, 0);

      // Phase 2 — items fly into the workspace as the screen rises.
      const cards = gsap.utils.toArray<HTMLElement>(".ws-card");
      cards.forEach((el, i) => {
        tl.to(
          el,
          {
            left: "50%",
            top: "56%",
            scale: 0.15,
            rotate: 0,
            opacity: 0,
            filter: "blur(2px)",
            duration: 0.16,
            ease: "power2.in",
          },
          0.1 + i * 0.012
        );
      });
      tl.to(".ws-intro", { opacity: 0, y: -30, duration: 0.06 }, 0.14);
      tl.to(frame, { rotateX: 0, scale: 1, yPercent: 0, duration: 0.2, ease: "power2.out" }, 0.18);
      tl.fromTo(".ws-flash", { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0.3).to(".ws-flash", { opacity: 0, duration: 0.08 }, 0.33);
      tl.fromTo(".ws-sweep", { xPercent: -120 }, { xPercent: 120, duration: 0.12 }, 0.3);

      // Phase 3 — the frame settles beside the story, capabilities unfold.
      tl.to(frame, { x: 0, duration: 0.1, ease: "power2.inOut" }, 0.36);
      tl.to(".ws-copy", { opacity: 1, x: 0, duration: 0.08 }, 0.4);
      tl.to({}, { duration: 0.58 }, 0.42); // hold for capability scrubbing
    },
    { scope: root, dependencies: [pinned, ready], revertOnUpdate: true }
  );

  const select = (i: number) => {
    track("capability_select", { capability: CAPS[i].key });
    const s = st.current;
    if (pinned && s) {
      const local = ASSEMBLE_END + 0.04 + ((i + 0.5) / CAPS.length) * (1 - ASSEMBLE_END - 0.04);
      scrollToTarget(s.start + (s.end - s.start) * local);
    } else {
      activeRef.current = i;
      setActive(i);
    }
  };

  const cap = CAPS[active];

  return (
    <section
      ref={root}
      id="workspace"
      aria-labelledby="ws-title"
      className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_70%_40%,#0b2347_0%,#06101f_45%,#03060f_100%)] lg:h-[100svh]"
    >
      <div aria-hidden className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_60%_at_60%_50%,black,transparent)]" />
      <div aria-hidden className="ws-flash pointer-events-none absolute inset-0 z-30 bg-cyan/20 opacity-0 mix-blend-screen" />

      {/* scattered physical items (continuity from the chaos) */}
      {pinned && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
          {ITEMS.slice(0, 10).map((it) => (
            <div
              key={it.id}
              className={`ws-card absolute ${it.mobile ? "" : "hidden md:block"}`}
              style={{ left: `${it.x}%`, top: `${it.y}%`, transform: `translate(-50%,-50%) rotate(${it.r}deg)` }}
            >
              <ClaimCard item={it} />
            </div>
          ))}
        </div>
      )}

      {pinned && (
        <div className="ws-intro pointer-events-none absolute inset-x-0 top-[14%] z-10 px-5 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 03 — Enter XactaClaim</p>
          <p className="mt-3 text-[clamp(1.6rem,3.6vw,3rem)] font-semibold tracking-[-0.03em]">Everything finds its place.</p>
        </div>
      )}

      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-8 px-5 py-24 sm:px-8 lg:h-full lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:py-0">
        <div className="ws-copy order-2 lg:order-1">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan/80">Chapter 03 — Enter XactaClaim</p>
          <h2 id="ws-title" className="text-[clamp(2.2rem,4.6vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            One Workspace.
            <br />
            <span className="text-glow bg-gradient-to-r from-cyan to-electric bg-clip-text text-transparent">Every Claim.</span>
          </h2>
          <div role="tablist" aria-label="XactaClaim capabilities" className="mt-7 space-y-1.5">
            {CAPS.map((c, i) => {
              const on = i === active;
              return (
                <button
                  key={c.key}
                  role="tab"
                  id={`cap-tab-${c.key}`}
                  aria-selected={on}
                  aria-controls="cap-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                      e.preventDefault();
                      const n = (i + 1) % CAPS.length;
                      select(n);
                      document.getElementById(`cap-tab-${CAPS[n].key}`)?.focus();
                    }
                    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const n = (i - 1 + CAPS.length) % CAPS.length;
                      select(n);
                      document.getElementById(`cap-tab-${CAPS[n].key}`)?.focus();
                    }
                  }}
                  className={`group relative w-full rounded-xl px-4 py-3 text-left transition-all duration-500 ${
                    on ? "bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(127,216,255,.25)]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <span className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-full transition-all duration-500 ${on ? "bg-electric shadow-[0_0_12px_#24a0ed]" : "bg-white/10"}`} />
                  <span className="flex items-baseline justify-between gap-3">
                    <span className={`font-medium transition-colors ${on ? "text-white" : "text-white/55 group-hover:text-white/80"}`}>
                      <span className="mr-3 font-mono text-[11px] text-cyan/70">0{i + 1}</span>
                      {c.title}
                    </span>
                  </span>
                  <span
                    className={`grid transition-all duration-500 ${on ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <span className="overflow-hidden">
                      <span className="block text-sm leading-relaxed text-white/65">{c.body}</span>
                      <span className="mt-2 inline-block rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan">
                        {c.plan}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="order-1 [perspective:1600px] lg:order-2">
          <div className="ws-frame relative origin-[50%_80%] will-change-transform [transform-style:preserve-3d]">
            <div aria-hidden className="absolute -inset-8 rounded-[40px] bg-electric/25 blur-3xl" />
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
              </div>
              <div className="relative aspect-[16/10] overflow-hidden">
                {CAPS.map((c, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={c.key}
                    src={c.src}
                    alt={i === active ? c.alt : ""}
                    aria-hidden={i !== active}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]"
                    style={{ opacity: i === active ? 1 : 0, transform: zoom(c) }}
                  />
                ))}
                <div aria-hidden className="ws-sweep pointer-events-none absolute inset-y-0 w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-cyan/25 to-transparent" />
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-white/40">Real XactaClaim interface, from the official XactaClaim product film.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
