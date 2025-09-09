"use client";
import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function BangHeader({ curator, subject }: { curator?: string | null; subject?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.2 });
  return (
    <div className="relative">
      <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 h-1 origin-left z-40" aria-hidden>
        <div className="h-full" style={{ background: "linear-gradient(90deg, var(--color-hot), var(--color-cold))" }} />
      </motion.div>
      <div className="paper rounded-3xl p-5 md:p-6 border">
        <div className="text-xs tracking-wide uppercase text-[color:var(--color-hot)] mb-1">🔥 I looped you in!</div>
        <div className="text-sm text-[color:var(--color-muted)]">From: {curator ?? "Anonymous"}</div>
        {subject && <h1 className="mt-2 text-2xl md:text-3xl font-semibold leading-tight">{subject}</h1>}
      </div>
    </div>
  );
}
