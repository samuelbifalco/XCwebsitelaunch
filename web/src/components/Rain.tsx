"use client";

import { useEffect, useRef } from "react";
import { useMotionPref } from "@/lib/motion";

/** Lightweight canvas rain. Pauses off-screen and in reduced motion. */
export default function Rain({ density = 110, speed = 1, weight = 1, className = "" }: { density?: number; speed?: number; weight?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reduced } = useMotionPref();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, raf = 0, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const count = window.innerWidth < 768 ? Math.round(density * 0.5) : density;
    const drops = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), l: 0.5 + Math.random(), v: 0.6 + Math.random() * 0.8, a: 0.08 + Math.random() * 0.22 }));
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); });
    io.observe(canvas);
    const loop = () => {
      cancelAnimationFrame(raf);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const d of drops) {
        d.y += d.v * 0.018 * speed; d.x -= d.v * 0.0035 * speed;
        if (d.y > 1.05) { d.y = -0.05; d.x = Math.random() * 1.1; }
        const x = d.x * w, y = d.y * h, len = (14 * d.l + 8) * (0.6 + speed * 0.4);
        ctx.strokeStyle = `rgba(190,225,255,${d.a})`;
        ctx.lineWidth = d.l * 0.9 * weight;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len * 0.22, y - len); ctx.stroke();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [reduced, density, speed, weight]);

  if (reduced) return null;
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
