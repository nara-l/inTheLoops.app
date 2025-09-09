"use client";
import * as React from "react";
import styles from "./ComboReaction.module.css";
import { spawnParticles } from "@/lib/particles";

type ReactionLabel = "FIRE" | "DEAD" | "FACTS" | "BOOM" | "CRYING" | "BLOWN";

const EMOJI: Record<ReactionLabel, string> = {
  FIRE: "🔥",
  DEAD: "💀",
  FACTS: "🎯",
  BOOM: "💥",
  CRYING: "😭",
  BLOWN: "🤯",
};

const ORDER: ReactionLabel[] = ["BOOM", "FIRE", "FACTS", "CRYING", "BLOWN", "DEAD"];

function heatDelta(label: ReactionLabel) {
  switch (label) {
    case "FIRE": return 2;
    case "DEAD": return 3;
    case "FACTS": return 1;
    case "BOOM": return 4;
    case "CRYING": return 2;
    case "BLOWN": return 2;
  }
}

export function ComboReaction({ cardId, bangId, onHeat }: { cardId: string; bangId?: string | null; onHeat?: (delta: number) => void; }) {
  const storageKey = (label: string) => `bang_reactions:${bangId ?? 'local'}:${cardId}:${label}`;
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [active, setActive] = React.useState<Record<string, boolean>>({});
  const [open, setOpen] = React.useState(false);
  const defaultLabel: ReactionLabel = "BOOM";
  const pillRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const nextCounts: Record<string, number> = {};
    const nextActive: Record<string, boolean> = {};
    ORDER.forEach((label) => {
      const key = storageKey(label);
      const n = Number(localStorage.getItem(key) || "0");
      nextCounts[label] = isFinite(n) ? n : 0;
      nextActive[label] = n > 0;
    });
    setCounts(nextCounts);
    setActive(nextActive);
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

  const selected: ReactionLabel | null = (ORDER.find((l) => active[l]) as ReactionLabel | undefined) ?? null;

  const postDelta = async (label: ReactionLabel, delta: 1 | -1) => {
    if (!bangId) return;
    try {
      const res = await fetch(`/api/bangs/${bangId}/reactions`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cardId, label, delta })
      });
      if (res.ok) {
        const totals = await res.json();
        setCounts((prev) => ({ ...prev, ...totals }));
      }
    } catch {}
  };

  const triggerBurst = (origin?: HTMLElement | null, label?: ReactionLabel) => {
    try {
      const el = origin || pillRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      spawnParticles(x, y, (label || defaultLabel) as ReactionLabel);
    } catch {}
    const p = pillRef.current;
    if (p) { p.classList.remove(styles.burst); void p.offsetWidth; p.classList.add(styles.burst); }
  };

  const toggleLabel = (label: ReactionLabel, origin?: HTMLElement | null) => {
    const key = storageKey(label);
    const wasActive = !!active[label];
    let next = (counts[label] || 0);
    const delta = (wasActive ? -1 : 1) as 1 | -1;
    next = Math.max(0, next + delta);
    localStorage.setItem(key, String(next));
    setCounts((prev) => ({ ...prev, [label]: next }));
    setActive((prev) => ({ ...Object.fromEntries(Object.keys(prev).map(k => [k, k === label ? !wasActive : false])) }));
    if (onHeat) onHeat(wasActive ? -heatDelta(label) : heatDelta(label));
    void postDelta(label, delta);
    if (!wasActive) triggerBurst(origin, label);
  };

  const onPillClick = (e: React.MouseEvent) => {
    // Quick toggle default when tray closed; otherwise close tray
    if (!open) {
      toggleLabel(defaultLabel, pillRef.current);
    } else {
      setOpen(false);
    }
  };

  const onCaretClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (ev: MouseEvent) => { setOpen(false); };
    const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const shownLabel: ReactionLabel = selected || defaultLabel;
  const shownCount = counts[shownLabel] || 0;

  return (
    <div className={styles.combo}>
      <button ref={pillRef} className={`${styles.pill} ${active[shownLabel] ? styles.active : ''}`} onClick={onPillClick} aria-expanded={open} aria-haspopup="menu">
        <span className={styles.emoji} aria-hidden>{EMOJI[shownLabel]}</span>
        <span className={styles.count}>{shownCount}</span>
        <span role="button" tabIndex={0} className={styles.caret} aria-label={open ? "Close reactions" : "More reactions"} onClick={(e) => { e.stopPropagation(); setOpen((v)=>!v); }}>{open ? "▲" : "▼"}</span>
        <span className={styles.srOnly}>Toggle default reaction or open all reactions</span>
      </button>
      {open && (
        <div role="menu" className={styles.tray} onClick={(e) => e.stopPropagation()}>
          {ORDER.map((label) => (
            <button key={label} role="menuitemradio" aria-checked={!!active[label]} className={`${styles.option} ${active[label] ? styles.active : ''}`} onClick={(ev) => { toggleLabel(label, ev.currentTarget as HTMLElement); setOpen(false); }}>
              <span className={styles.emoji} aria-hidden>{EMOJI[label]}</span>
              <span className={styles.count}>{counts[label] || 0}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
