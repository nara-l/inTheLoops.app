/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import * as React from "react";
import { spawnParticles } from "@/lib/particles";

type Reaction = {
  emoji: string;
  label: "FIRE" | "DEAD" | "FACTS" | "BOOM" | "CRYING" | "BLOWN" | "HEART";
  description: string;
};

const REACTIONS: Reaction[] = [
  { emoji: "🔥", label: "FIRE", description: "This is hot/true" },
  // UI-only swap: keep key 'DEAD' for compatibility, render as Eyes
  { emoji: "👀", label: "DEAD", description: "Eyes on this" },
  { emoji: "🎯", label: "FACTS", description: "Accurate/bulls-eye" },
  { emoji: "💥", label: "BOOM", description: "Explosive moment" },
  { emoji: "😭", label: "CRYING", description: "Too funny/too real" },
  { emoji: "🤯", label: "BLOWN", description: "Didn't think of that" },
  { emoji: "❤️", label: "HEART", description: "Love this" },
];

const ANIM: Record<Reaction["label"], string> = {
  FIRE: "rx-anim-fire",
  DEAD: "rx-anim-eyes",
  FACTS: "rx-anim-target",
  BOOM: "rx-anim-boom",
  CRYING: "rx-anim-crying",
  BLOWN: "rx-anim-mind",
  HEART: "rx-anim-heart",
};

function heatDelta(label: Reaction["label"]) {
  switch (label) {
    case "FIRE": return 2;
    case "DEAD": return 3;
    case "FACTS": return 1;
    case "BOOM": return 4;
    case "CRYING": return 2;
    case "BLOWN": return 2;
    case "HEART": return 3;
  }
}

export function ReactionBar({ cardId, bangId, onHeat }: { cardId: string; bangId?: string | null; onHeat?: (delta: number) => void; }) {
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
          const totals = (await res.json()) as Record<string, number>;
          // Merge server totals conservatively: never wipe out local > 0 selections.
          setCounts((prev) => {
            const merged: Record<string, number> = { ...prev };
            Object.keys(totals || {}).forEach((k) => {
              const pv = Number(prev[k] || 0);
              const tv = Number(totals[k] || 0);
              merged[k] = Math.max(pv, tv);
            });
            return merged;
          });
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

    // retrigger pop animation and spawn particles on activation
    if (!wasActive) {
      const btn = e.currentTarget;
      btn.classList.remove('active');
      void btn.offsetWidth;
      btn.classList.add('active');
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

  return (
    <>
      {/* Persistent cluster in the card's top-right */}
      <div className="rx-active">
        {REACTIONS.map(r => {
          const total = counts[r.label] || 0;
          if (total <= 0) return null;
          const both = total >= 2;
          return (
            <span
              key={`cluster-${r.label}`}
              className={`rx-badge ${ANIM[r.label]} ${both ? 'rx-both' : ''}`}
              aria-hidden
            >{r.emoji}</span>
          );
        })}
      </div>

      {/* Existing bar with click burst preserved */}
      <div className="ig-reactions">
        {REACTIONS.map(r => (
          <button
            key={r.label}
            className={`ig-reaction ${active[r.label] ? 'is-selected' : ''}`}
            title={r.description}
            onClick={(e) => onClick(e, r)}
            aria-pressed={active[r.label]}
          >
            <span className="emoji" aria-hidden>{r.emoji}</span>
          </button>
        ))}
      </div>
    </>
  );
}
