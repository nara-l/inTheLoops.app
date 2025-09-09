"use client";
import { Share2, BookmarkPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import type { Conversation } from "@/lib/types";

function mapToBang(body: Conversation) {
  return {
    curator: body.curator || "@Unknown",
    original: body.original
      ? {
          author: body.original.author?.name || "Unknown",
          handle: body.original.author?.handle ? `@${body.original.author.handle}` : undefined,
          content: body.original.text || "",
          media: body.original.media ? {
            type: body.original.media.type,
            provider: body.original.media.provider || 'twitter',
            url: body.original.media.url || body.original.media.sourceUrl,
            sourceUrl: body.original.media.sourceUrl || body.original.media.url,
            width: body.original.media.width,
            height: body.original.media.height,
            aspectRatio: body.original.media.aspectRatio,
            alt: body.original.media.alt,
          } : undefined,
        }
      : null,
    replies: body.replies.map((r) => ({ author: r.author?.name || "Anon", content: r.text || "" })),
  };
}

export function FAB({ payload }: { payload: Conversation }) {
  const sp = useSearchParams();
  const mode = sp.get("mode");
  const isRetro = mode === "retro";
  const getShareUrl = async (): Promise<string> => {
    const url = new URL(window.location.href);
    const isPasted = url.pathname.includes("/view/pasted");
    const mode = url.searchParams.get("mode");

    if (!isPasted && url.pathname.startsWith("/view/")) {
      // Already has an id; share current link (preserve mode if any)
      return url.toString();
    }

    try {
      // Save to server to get a stable id
      const body = mapToBang(payload);
      const res = await fetch("/api/bangs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const j = await res.json();
        const share = new URL(j.url, window.location.origin);
        if (mode) share.searchParams.set("mode", mode);
        return share.toString();
      }
    } catch {}

    // Fallback to pasted URL if save fails
    return url.toString();
  };

  const onShare = async () => {
    const shareUrl = await getShareUrl();
    const text = "I looped you in! I saved you the best bits, so you don't scroll forever.";
    // Always prefer explicit WhatsApp share so message + link appear consistently
    const wa = `https://wa.me/?text=${encodeURIComponent(`${text}\n${shareUrl}`)}`;
    try {
      window.open(wa, "_blank", "noopener,noreferrer");
      return;
    } catch {}
    // Fallback: system share or clipboard
    try { if (navigator.share) await navigator.share({ title: text, text, url: shareUrl }); } catch {}
    try { await navigator.clipboard.writeText(`${text}\n${shareUrl}`); alert("Link copied to clipboard"); } catch {}
  };

  const onSave = async () => {
    try {
      const body = mapToBang(payload);
      const res = await fetch("/api/bangs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const j = await res.json();
        const link = new URL(j.url, window.location.origin).toString();
        await navigator.clipboard.writeText(link);
        alert("Saved and link copied");
        return;
      }
    } catch {}
    alert("Save failed");
  };

  return (
    <div className="fixed right-5 bottom-5">
      <button 
        onClick={onShare} 
        className="button primary inline-flex items-center gap-2" 
        aria-label="Share the Loop"
      >
        <Share2 size={18} /> SHARE THE LOOP
      </button>
    </div>
  );
}
