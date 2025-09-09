/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { headers } from "next/headers";
import { list } from "@vercel/blob";

export const dynamic = 'force-dynamic';

async function getIp(): Promise<string | null> {
  try {
    const h = await headers();
    const xf = (h as any).get ? (h as any).get('x-forwarded-for') : undefined;
    const xr = (h as any).get ? (h as any).get('x-real-ip') : undefined;
    const raw = String(xf || xr || '').trim();
    if (!raw) return null;
    return raw.split(',')[0]?.trim() || null;
  } catch {
    return null;
  }
}

async function getMine(ip: string): Promise<Array<{ id: string; createdAt?: string }>> {
  const prefix = `creators/${ip}/`;
  const { blobs } = await list({ prefix });
  const items = blobs.filter((b) => b.pathname.startsWith(prefix));
  items.sort((a: any, b: any) => {
    const at = new Date(a?.uploadedAt || 0).getTime();
    const bt = new Date(b?.uploadedAt || 0).getTime();
    return bt - at;
  });
  return items.map((b) => {
    const id = b.pathname.replace(prefix, '').replace(/\.json$/, '');
    return { id, createdAt: (b as any).uploadedAt };
  });
}

export default async function MinePage() {
  const ip = await getIp();
  let items: Array<{ id: string; createdAt?: string }> = [];
  if (ip) items = await getMine(ip);
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <h1 className="text-2xl font-semibold mb-4">My Loops</h1>
        {!ip && (
          <div className="soft-card rounded-xl p-4 text-sm">Couldn&apos;t detect your IP. Try creating a Loop first, then check back here.</div>
        )}
        {ip && items.length === 0 && (
          <div className="soft-card rounded-xl p-4 text-sm">No loops found for your device yet.</div>
        )}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((it) => (
              <Link key={it.id} href={`/view/${it.id}`} className="flex items-center justify-between soft-card rounded-xl px-4 py-3">
                <span className="font-mono text-sm">{it.id}</span>
                <span className="text-xs text-[color:var(--color-muted)]">{it.createdAt ? new Date(it.createdAt).toLocaleString() : ''}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

