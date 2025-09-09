"use client";
import { useSearchParams } from "next/navigation";

export function HeatWidget({ heat }: { heat: number }) {
  const label = heat < 20 ? 'ICE COLD' : heat < 40 ? 'MILD' : heat < 60 ? 'SPICY' : heat < 80 ? 'HOT' : 'NUCLEAR';
  
  const sp = useSearchParams();
  const mode = sp.get("mode");
  const isRetro = mode === "retro";
  
  // Design system gradient
  const gradient = 'linear-gradient(90deg, var(--highlight), var(--accent))';
  
  return (
    <div className="bg-[var(--card)] text-[var(--text)] px-3 py-2 rounded-[var(--radius)] border border-[var(--stroke)] shadow-sm">
      <div className="text-[10px] tracking-wider text-[var(--primary)] font-semibold">
        HEAT LEVEL
      </div>
      <div className="mt-1">
        <div className="meter">
          <i style={{ width: `${heat}%` }}></i>
        </div>
      </div>
      <div className="text-[11px] mt-1 font-medium">{label}</div>
    </div>
  );
}

