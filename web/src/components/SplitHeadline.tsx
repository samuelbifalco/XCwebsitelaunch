"use client";

import { motion, type Variants } from "motion/react";
import { useMotionPref } from "@/lib/motion";

type Line = { text: string; className?: string };

const word: Variants = {
  hidden: { y: "110%", rotate: 4, opacity: 0, filter: "blur(10px)" },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: i * 0.075 },
  }),
};

/**
 * Word-by-word masked headline reveal. The heading itself is observed (the words
 * start clipped), and line classes are applied per word so gradient text paints.
 */
export default function SplitHeadline({
  lines,
  as = "h2",
  className = "",
  delay = 0,
  immediate = false,
}: {
  lines: Line[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const { reduced } = useMotionPref();
  const label = lines.map((l) => l.text).join(" ");
  const Tag = motion[as];
  let i = 0;

  return (
    <Tag
      className={className}
      aria-label={label}
      initial={reduced ? false : "hidden"}
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.3 } })}
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.text.split(" ").map((w, wi, arr) => {
            const idx = i++;
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                <motion.span custom={idx + delay / 0.075} variants={word} className={`inline-block will-change-transform ${line.className ?? ""}`}>
                  {w}
                  {wi < arr.length - 1 ? " " : ""}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
