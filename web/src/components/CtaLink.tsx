"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { track } from "@/lib/analytics";
import { useMotionPref } from "@/lib/motion";

type Props = {
  href: string;
  children: React.ReactNode;
  event: string;
  location: string;
  variant?: "primary" | "ghost" | "giant";
  external?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  ariaLabel?: string;
};

const styles = {
  primary:
    "bg-electric text-white shadow-[0_0_0_1px_rgba(127,216,255,.35),0_10px_40px_-8px_rgba(36,160,237,.75)] hover:bg-[#3aaef3] px-6 py-3.5 text-[15px]",
  ghost:
    "text-white border border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan/50 backdrop-blur px-6 py-3.5 text-[15px]",
  giant:
    "bg-electric text-white px-9 py-6 sm:px-14 sm:py-8 text-xl sm:text-3xl shadow-[0_0_0_1px_rgba(127,216,255,.45),0_20px_80px_-10px_rgba(36,160,237,.9)] hover:bg-[#3aaef3]",
};

/** Magnetic call-to-action link with analytics. */
export default function CtaLink({
  href,
  children,
  event,
  location,
  variant = "primary",
  external = true,
  onClick,
  className = "",
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { reduced } = useMotionPref();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const strength = variant === "giant" ? 0.28 : 0.35;

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onClick={(e) => {
        track(event, { location, href });
        onClick?.(e);
      }}
      style={{ x: sx, y: sy }}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {variant !== "ghost" && (
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 animate-[sheen_4.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        </span>
      )}
      {variant !== "ghost" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,.35), transparent 60%)" }}
        />
      )}
    </motion.a>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${className}`} fill="none">
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
