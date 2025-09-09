/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import * as React from "react";
import { spawnParticles } from "@/lib/particles";

type Reaction = {
  emoji: string;
  label: "FIRE" | "DEAD" | "FACTS" | "BOOM" | "CRYING" | "BLOWN";
  description: string;
};

const REACTIONS: Reaction[] = [
  { emoji: "🔥", label: "FIRE", description: "This is hot/true" },
  { emoji: "💀", label: "DEAD", description: "Someone got destroyed" },
  { emoji: "🎯", label: "FACTS", description: "Accurate/bulls-eye" },
  { emoji: "💥", label: "BOOM", description: "Explosive moment" },
  { emoji: "😭", label: "CRYING", description: "Too funny/too real" },
  { emoji: "🤯", label: "BLOWN", description: "Didn't think of that" },
];

function heatDelta(label: Reaction["label"]) {
  switch (label) {
    case "FIRE": return 2;
    case "DEAD": return 3;
    case "FACTS": return 1;
    case "BOOM": return 4;
    case "CRYING": return 2;
    case "BLOWN": return 2;
  }
}

// Predefined sticker positions around card edges
const STICKER_POSITIONS = [
  { top: "-15px", left: "20px", transform: "rotate(-12deg)" }, // top-left
  { top: "-15px", right: "20px", transform: "rotate(8deg)" }, // top-right
  { top: "50%", right: "-15px", transform: "translateY(-50%) rotate(15deg)" }, // middle-right
  { bottom: "-15px", right: "20px", transform: "rotate(-5deg)" }, // bottom-right
  { bottom: "-15px", left: "20px", transform: "rotate(10deg)" }, // bottom-left
  { top: "50%", left: "-15px", transform: "translateY(-50%) rotate(-8deg)" }, // middle-left
];

export function FloatingReactions({ cardId, bangId, onHeat }: { cardId: string; bangId?: string | null; onHeat?: (delta: number) => void; }) {
  const storageKey = (label: string) => `bang_reactions:${bangId ?? 'local'}:${cardId}:${label}`;
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [active, setActive] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const nextCounts: Record<string, number> = {};
    const nextActive: Record<string, boolean> = {};
    REACTIONS.forEach(r => {
      const key = storageKey(r.label);
      const n = Number(localStorage.getItem(key) || "0");
      nextCounts[r.label] = isFinite(n) ? n : 0;
      nextActive[r.label] = n > 0;
    });
    setCounts(nextCounts);
    setActive(nextActive);
    // hydrate server totals if an id is present
    (async () => {
      if (!bangId) return;
      try {
        const res = await fetch(`/api/bangs/${bangId}/reactions?card=${encodeURIComponent(cardId)}`, { cache: 'no-store' });
        if (res.ok) {
          const totals = await res.json();
          setCounts((prev) => ({ ...prev, ...totals }));
        }
      } catch {}
    })();
  }, [cardId, bangId]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>, r: Reaction) => {
    e.preventDefault();
    const key = storageKey(r.label);
    const wasActive = active[r.label];
    let next = (counts[r.label] || 0);
    if (wasActive) {
      next = Math.max(0, next - 1);
    } else {
      next = next + 1;
    }
    localStorage.setItem(key, String(next));
    setCounts(prev => ({ ...prev, [r.label]: next }));
    setActive(prev => ({ ...prev, [r.label]: next > 0 }));
    if (!wasActive && onHeat) onHeat(heatDelta(r.label));
    if (wasActive && onHeat) onHeat(-heatDelta(r.label));

    // retrigger sticker animation and spawn particles on activation
    if (!wasActive) {
      const btn = e.currentTarget;
      btn.classList.remove('sticker-active');
      void btn.offsetWidth;
      btn.classList.add('sticker-active');
      const rect = btn.getBoundingClientRect();
      // Particle layer is fixed to the viewport; use viewport coordinates.
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      spawnParticles(x, y, r.label);
    }

    // send server delta if id present
    if (bangId) {
      try {
        fetch(`/api/bangs/${bangId}/reactions`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ cardId, label: r.label, delta: wasActive ? -1 : 1 })
        }).then(async (res) => {
          if (res.ok) {
            const totals = await res.json();
            setCounts((prev) => ({ ...prev, ...totals }));
          }
        }).catch(() => {});
      } catch {}
    }
  };

  // Only show stickers that have been activated (count > 0)
  const activeReactions = REACTIONS.filter(r => (counts[r.label] || 0) > 0);

  return (
    <>
      {activeReactions.map((r, index) => {
        const position = STICKER_POSITIONS[index % STICKER_POSITIONS.length];
        const count = counts[r.label] || 0;
        
        return (
          <button
            key={r.label}
            className="sticker"
            title={`${r.description} (${count})`}
            onClick={(e) => onClick(e, r)}
            style={{
              position: 'absolute',
              ...position,
              zIndex: 60,
              fontSize: '2em',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              padding: '0',
            }}
          >
            {count > 1 ? count : r.emoji}
          </button>
        );
      })}
    </>
  );
}