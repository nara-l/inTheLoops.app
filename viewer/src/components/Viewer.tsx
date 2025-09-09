/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Conversation } from "@/lib/types";
import { TweetCard } from "./TweetCard";
import { ReplyCard } from "./ReplyCard";
// import { ViewToggle } from "./ViewToggle";
import { FAB } from "./FAB";
import { readingTime } from "@/lib/readingTime";
// import { BangHeader } from "./BangHeader";
import { ModeToggle } from "./ModeToggle";
import { Suspense } from "react";
// Heat meter removed per product direction

export function Viewer({ data }: { data: Conversation }) {
  const words = [data.original?.text ?? "", ...data.replies.map((r) => r.text)].join(" ");
  const { minutes } = readingTime(words);

  const subject = data.subject ?? (data.original?.text ? data.original.text.slice(0, 96) + (data.original.text.length > 96 ? "..." : "") : undefined);

  const replyRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const scrollToIndex = (idx: number) => {
    const el = replyRefs.current[idx] as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "j") {
        const idx = replyRefs.current.findIndex((el) => el && el.getBoundingClientRect().top > 10);
        const next = Math.max(0, idx === -1 ? 0 : idx);
        scrollToIndex(next);
      } else if (key === "k") {
        const arr = replyRefs.current;
        for (let i = arr.length - 1; i >= 0; i--) {
          const el = arr[i];
          if (!el) continue;
          if (el.getBoundingClientRect().top < 0) {
            scrollToIndex(i);
            break;
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  const sp = useSearchParams();
  const mode = sp.get("mode");
  const isRetro = (mode === "retro");
  const pathname = typeof window === 'undefined' ? '' : window.location.pathname + (window.location.search || '');

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6">
      {/* Header bar: logo left, toggle right, heat widget left aligned */}
      <div className="pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/loop-rings.svg" alt="InTheLoops" className="h-9 w-auto" />
          <span className="font-bold text-2xl">InTheLoops</span>
        </div>
        <div className="mode-toggle">
          <Suspense fallback={<div />}> 
            <ModeToggle />
          </Suspense>
        </div>
      </div>
      
      <div className="pb-4 with-float-offset text-center">
        {isRetro ? (
          <div className="retro-banner">I looped you in!</div>
        ) : (
          <div className="wordmark">I looped you in!</div>
        )}
        <p className="mt-1 text-sm text-[color:var(--muted)]">I saved you the best bits, so you don&apos;t scroll forever.</p>
        <p className="mt-1 text-sm text-[color:var(--muted)]">Curated by {data.curator ?? '@Unknown'}</p>
      </div>

      <TweetCard tweet={data.original} bangId={data.id ?? null} />

      <div className="grid md:grid-cols-[48px_1fr] gap-4 mt-6">
        <div className="hidden md:flex flex-col items-center gap-2 sticky top-24 h-[70vh]">
          <div className="w-1 rounded-full bg-black/10 flex-1 relative">
            {data.replies.map((_, i) => (
              <button
                key={i}
                className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-black/30 hover:bg-black"
                style={{ top: `${(i / Math.max(1, data.replies.length - 1)) * 100}%` }}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>
        </div>
        <div className={`relative connector`}>
          <div className="space-y-4">
            {data.replies.map((r, i) => (
              <div key={(r.id ?? i).toString()} ref={(el) => { replyRefs.current[i] = el; }}>
                <ReplyCard reply={r} index={i} bangId={data.id ?? null} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heat meter moved into header via HeatWidget */}

      <div className="mt-10 text-xs text-[color:var(--color-muted)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Source: {data.platform ?? "twitter"}</span>
          {data.url && (
            <a className="underline" href={data.url} target="_blank" rel="noopener noreferrer">(source link)</a>
          )}
          <span>• Curated {data.createdAt ? new Date(data.createdAt).toLocaleString() : "recently"}</span>
        </div>
        <div className="flex items-center gap-3 text-right">
          <Link className="underline" href={`/curate?from=${encodeURIComponent(pathname)}`}>Curate Your Loop</Link>
          <Link className="underline" href="/mine">My Loops</Link>
        </div>
      </div>

      <FAB payload={data} />
    </div>
  );
}
