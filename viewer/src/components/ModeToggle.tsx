"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function ModeToggle() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const raw = sp.get("mode");
  const mode: "minimal" | "retro" = raw === "retro" ? "retro" : "minimal";

  const buildHref = (target: "minimal" | "retro") => {
    const params = new URLSearchParams(sp?.toString() || "");
    if (target === "minimal") params.delete("mode");
    else params.set("mode", target);
    const q = params.toString();
    return q ? `${pathname}?${q}` : pathname;
  };

  React.useEffect(() => {
    try { localStorage.setItem("tc-mode", mode); } catch {}
  }, [mode]);

  const base = "pill";
  const active = "bg-[var(--highlight)] text-[#1C1C1E] font-semibold";
  const inactive = "text-[var(--muted)] hover:text-[var(--text)]";

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[var(--card)] px-1 py-1 shadow-sm border border-[var(--stroke)]">
      <Link href={buildHref("minimal")} className={`${base} ${mode === "minimal" ? active : inactive}`}>
        Minimal
      </Link>
      <Link href={buildHref("retro")} className={`${base} ${mode === "retro" ? active : inactive}`}>
        Retro
      </Link>
    </div>
  );
}

