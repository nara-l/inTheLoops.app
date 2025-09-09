"use client";
import { ThumbsUp, Star, Laugh, ThumbsDown } from "lucide-react";
import * as React from "react";

export function Reactions() {
  const [counts, setCounts] = React.useState({ like: 0, insightful: 0, funny: 0, disagree: 0 });
  const bump = (k: keyof typeof counts) => setCounts((c) => ({ ...c, [k]: c[k] + 1 }));
  return (
    <div className="flex gap-3 text-sm">
      <button className="rounded-full border px-3 py-1 inline-flex items-center gap-1" onClick={() => bump("like")}>
        <ThumbsUp size={16} /> {counts.like}
      </button>
      <button className="rounded-full border px-3 py-1 inline-flex items-center gap-1" onClick={() => bump("insightful")}>
        <Star size={16} /> {counts.insightful}
      </button>
      <button className="rounded-full border px-3 py-1 inline-flex items-center gap-1" onClick={() => bump("funny")}>
        <Laugh size={16} /> {counts.funny}
      </button>
      <button className="rounded-full border px-3 py-1 inline-flex items-center gap-1" onClick={() => bump("disagree")}>
        <ThumbsDown size={16} /> {counts.disagree}
      </button>
    </div>
  );
}

