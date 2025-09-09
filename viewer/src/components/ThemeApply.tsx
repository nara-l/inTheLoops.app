"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ThemeApply() {
  const sp = useSearchParams();
  const mode = sp.get("mode");

  useEffect(() => {
    const html = document.documentElement;
    const set = new Set(html.className.split(/\s+/).filter(Boolean));
    
    // Clear theme classes
    set.delete("theme-minimal");
    set.delete("theme-retro");

    // Apply current theme
    if (mode === "retro") {
      set.add("theme-retro");
    } else {
      set.add("theme-minimal");
    }

    html.className = Array.from(set).join(" ");
  }, [mode]);

  return null;
}

