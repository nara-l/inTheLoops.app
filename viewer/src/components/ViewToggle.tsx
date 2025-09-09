"use client";
import { ToggleLeft, ToggleRight } from "lucide-react";

export function ViewToggle({ mode, onChange }: { mode: "thread" | "card"; onChange: (m: "thread" | "card") => void }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-2 py-1 text-sm">
      <button
        type="button"
        onClick={() => onChange("thread")}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${mode === "thread" ? "bg-[color:var(--color-accent-1)]" : "opacity-70"}`}
        aria-pressed={mode === "thread"}
      >
        <ToggleLeft size={16} /> Thread
      </button>
      <button
        type="button"
        onClick={() => onChange("card")}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${mode === "card" ? "bg-[color:var(--color-accent-1)]" : "opacity-70"}`}
        aria-pressed={mode === "card"}
      >
        <ToggleRight size={16} /> Card
      </button>
    </div>
  );
}

