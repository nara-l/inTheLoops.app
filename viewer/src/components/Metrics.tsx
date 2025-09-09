import type { Metrics as MetricsType } from "@/lib/types";
import { Heart, MessageCircle, Repeat, Bookmark } from "lucide-react";

export function Metrics({ metrics }: { metrics?: MetricsType }) {
  if (!metrics) return null;
  const fmt = (n?: number) => (typeof n === "number" ? new Intl.NumberFormat().format(n) : undefined);
  return (
    <div className="flex items-center gap-4 text-xs text-[color:var(--color-muted)]">
      {fmt(metrics.likes) && (
        <span className="inline-flex items-center gap-1"><Heart size={14} />{fmt(metrics.likes)}</span>
      )}
      {fmt(metrics.replies) && (
        <span className="inline-flex items-center gap-1"><MessageCircle size={14} />{fmt(metrics.replies)}</span>
      )}
      {fmt(metrics.reposts) && (
        <span className="inline-flex items-center gap-1"><Repeat size={14} />{fmt(metrics.reposts)}</span>
      )}
      {fmt(metrics.bookmarks) && (
        <span className="inline-flex items-center gap-1"><Bookmark size={14} />{fmt(metrics.bookmarks)}</span>
      )}
    </div>
  );
}

