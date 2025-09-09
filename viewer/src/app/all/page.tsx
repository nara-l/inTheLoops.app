/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
export const dynamic = 'force-dynamic';
import { list } from "@vercel/blob";

type Totals = { FIRE: number; DEAD: number; FACTS: number; BOOM: number; CRYING: number; BLOWN: number };

async function getTrendingScore(id: string): Promise<number> {
  try {
    const pathname = `reactions/${id}.json`;
    const { blobs } = await list({ prefix: pathname });
    const blob = blobs.find((b) => b.pathname === pathname) || blobs[0];
    if (!blob) return 0;
    const r = await fetch(blob.url, { cache: "no-store" });
    if (!r.ok) return 0;
    const map = (await r.json()) as Record<string, Totals>;
    let sum = 0;
    for (const key of Object.keys(map)) {
      const t = map[key];
      sum += t.FIRE + t.DEAD + t.FACTS + t.BOOM + t.CRYING + t.BLOWN;
    }
    return sum;
  } catch {
    return 0;
  }
}

async function getRecent(): Promise<Array<{ id: string; uploadedAt?: string; score: number }>> {
  const { blobs } = await list({ prefix: "bangs/" });
  const items = blobs.filter((b) => b.pathname.endsWith(".json"));
  // Sort by uploadedAt desc if present
  items.sort((a: any, b: any) => {
    const at = new Date(a?.uploadedAt || 0).getTime();
    const bt = new Date(b?.uploadedAt || 0).getTime();
    return bt - at;
  });
  const top = items.slice(0, 20);
  const results: Array<{ id: string; uploadedAt?: string; score: number }> = [];
  for (const b of top) {
    const id = b.pathname.replace(/^bangs\//, "").replace(/\.json$/, "");
    const score = await getTrendingScore(id);
    results.push({ id, uploadedAt: (b as any).uploadedAt, score });
  }
  return results;
}

export default async function AllPage() {
  const items = await getRecent();
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <h1 className="text-2xl font-semibold mb-4">All Loops</h1>
        <div className="space-y-2">
          {items.map((it) => (
            <Link key={it.id} href={`/view/${it.id}`} className="flex items-center justify-between soft-card rounded-xl px-4 py-3">
              <span className="font-mono text-sm">{it.id}</span>
              <span className="text-xs text-[color:var(--color-muted)]">Trending score: {it.score}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
