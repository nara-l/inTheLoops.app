"use client";
import type { TweetLike } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Metrics } from "./Metrics";
import { ReactionBar } from "./ReactionBar";
import { useSearchParams } from "next/navigation";

export function TweetCard({ tweet, bangId, onHeat }: { tweet: TweetLike | null; bangId?: string | null; onHeat?: (delta: number) => void }) {
  const sp = useSearchParams();
  if (!tweet) return null;
  
  const mode = sp.get("mode");
  const isRetro = mode === "retro";
  
  const computeAspect = () => {
    const m = tweet.media;
    if (!m) return undefined;
    if (m.aspectRatio && typeof m.aspectRatio === 'string') {
      if (m.aspectRatio.includes('/')) return m.aspectRatio as string;
      if (m.aspectRatio.includes(':')) return (m.aspectRatio as string).replace(':', ' / ');
    }
    if (m.width && m.height) return `${m.width} / ${m.height}`;
    return '16 / 9';
  };
  
  return (
    <section className="card relative">
      <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">
        THE ORIGINAL POST
      </div>
      <div className="flex items-center gap-3">
        <Avatar name={tweet.author.name} handle={tweet.author.handle} size={44} />
        <div className="leading-tight">
          <div className="font-medium">{tweet.author.name}</div>
          <div className="text-[var(--muted)]">@{tweet.author.handle}</div>
        </div>
      </div>
      {tweet.media?.type === 'image' && (tweet.media.url || tweet.media.sourceUrl) && (
        <div className="mt-4">
          <img
            src={(tweet.media.url || tweet.media.sourceUrl) as string}
            alt={tweet.media.alt || ''}
            className="w-full rounded-xl"
            loading="lazy"
          />
        </div>
      )}
      {tweet.media?.type === 'video' && (tweet.media.url || tweet.media.sourceUrl) && (
        <div className="mt-4 rounded-xl overflow-hidden" style={{ aspectRatio: computeAspect() }}>
          <video
            src={(tweet.media.url || tweet.media.sourceUrl) as string}
            controls
            preload="metadata"
            playsInline
            className="w-full h-full"
          />
        </div>
      )}
      <div className="mt-4 font-serif text-[1.25rem] leading-7">{tweet.text}</div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-[var(--muted)]">
          {tweet.timestamp ? new Date(tweet.timestamp).toLocaleString() : null}
        </div>
        <Metrics metrics={tweet.metrics} />
      </div>
      <ReactionBar
        cardId={`original-${tweet.id ?? tweet.author.handle}`}
        bangId={bangId}
        onHeat={onHeat}
      />
    </section>
  );
}
