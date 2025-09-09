"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import * as React from "react";

export function ParallaxHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 8]);

  React.useEffect(() => {
    const sub = blur.on("change", (v) => {
      if (ref.current) ref.current.style.setProperty("--blur-amount", `${v}px`);
    });
    return () => sub();
  }, [blur]);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-3xl gradient-hero blur-on-scroll">
      <motion.div style={{ y }} className="px-6 md:px-10 py-12 md:py-20">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-3 text-[color:var(--color-muted)] max-w-2xl">{subtitle}</p>}
      </motion.div>
    </div>
  );
}

