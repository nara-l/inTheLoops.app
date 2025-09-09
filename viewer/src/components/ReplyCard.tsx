"use client";
import { motion } from "framer-motion";
import type { TweetLike } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Metrics } from "./Metrics";
import { replyCardId } from "@/lib/stableId";
import { useSearchParams } from "next/navigation";
import { ReactionBar } from "./ReactionBar";
import * as React from "react";

export function ReplyCard({ reply, index, depth = 0, bangId, onHeat }:
  { reply: TweetLike; index: number; depth?: number; bangId?: string | null; onHeat?: (delta: number) => void }) {
  
  const sp = useSearchParams();
  const mode = sp.get("mode");
  const isRetro = mode === "retro";
  const ring = reply.category === "hot" ? "ring-[color:var(--color-hot)]/40"
    : reply.category === "cold" ? "ring-[color:var(--color-cold)]/40"
    : reply.category === "comic" ? "ring-[color:var(--color-comic)]/40"
    : reply.category === "think" ? "ring-[color:var(--color-think)]/40"
    : "ring-slate-300/40";


  const highlightRef = React.useRef<HTMLDivElement>(null);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={`card relative p-4 pl-14 ring-1 ${ring} ${reply.featured ? "md:scale-[1.01]" : ""}`}
      style={{ marginLeft: depth ? depth * 12 : 0 }}
      ref={highlightRef}
      onMouseEnter={() => { highlightRef.current?.classList.add("outline", "outline-1", "outline-black/5"); }}
      onMouseLeave={() => { highlightRef.current?.classList.remove("outline", "outline-1", "outline-black/5"); }}
    >
      <div className="absolute left-3 top-4">
        <Avatar name={reply.author.name} handle={reply.author.handle} size={36} />
      </div>
      <div className="flex items-center gap-2 text-sm mb-1">
        <span className="font-medium">{reply.author.name}</span>
        <span className="text-[var(--muted)]">@{reply.author.handle}</span>
        {reply.timestamp && (
          <span className="text-[var(--muted)]">• {new Date(reply.timestamp).toLocaleString()}</span>
        )}
      </div>
      <div className="font-serif text-[1.05rem] leading-6">
        {reply.text}
      </div>
      {reply.reason && (
        <div className="mt-2 text-xs text-[var(--muted)]">Why picked: {reply.reason}</div>
      )}
      <div className="mt-3">
        <Metrics metrics={reply.metrics} />
      </div>
      <ReactionBar
        cardId={(reply.id ?? replyCardId(reply.author?.name, reply.author?.handle, reply.text)).toString()}
        bangId={bangId}
        onHeat={onHeat}
      />
    </motion.article>
  );
}
