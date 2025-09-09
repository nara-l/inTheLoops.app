/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

export const runtime = "nodejs";

type Totals = { FIRE: number; DEAD: number; FACTS: number; BOOM: number; CRYING: number; BLOWN: number; HEART: number };
const empty: Totals = { FIRE: 0, DEAD: 0, FACTS: 0, BOOM: 0, CRYING: 0, BLOWN: 0, HEART: 0 };

// Store per-card totals under reactions/<id>.json as a map: { [cardId]: Totals }
async function loadTotalsMap(id: string): Promise<{ map: Record<string, Totals>; url?: string }> {
  const pathname = `reactions/${id}.json`;
  const { blobs } = await list({ prefix: pathname });
  const blob = blobs.find((b) => b.pathname === pathname) || blobs[0];
  if (!blob) return { map: {} };
  const r = await fetch(blob.url);
  if (!r.ok) return { map: {} };
  const json = await r.json();
  // Back-compat: if old global shape detected, ignore and start fresh per-card map
  if (json && typeof json === 'object' && ("FIRE" in json || "DEAD" in json)) {
    return { map: {} };
  }
  return { map: json as Record<string, Totals>, url: blob.url };
}

export async function GET(req: NextRequest, ctx: any) {
  try {
    const id = (await ctx.params)?.id ?? ctx.params?.id;
    const cardId = req.nextUrl.searchParams.get('card') || '';
    const { map } = await loadTotalsMap(id);
    const totals = (cardId && map[cardId]) ? map[cardId] : {};
    // Always ensure all keys exist (back-compat for older blobs missing HEART)
    return NextResponse.json({ ...empty, ...(totals as object) });
  } catch {
    return NextResponse.json(empty);
  }
}

export async function POST(req: NextRequest, ctx: any) {
  try {
    const id = (await ctx.params)?.id ?? ctx.params?.id;
    const body = await req.json();
    const label = String(body?.label || "");
    const delta = Number(body?.delta || 0);
    const cardId = String(body?.cardId || "").trim();
    if (!cardId || !["FIRE","DEAD","FACTS","BOOM","CRYING","BLOWN","HEART"].includes(label) || ![-1,1].includes(delta)) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const { map } = await loadTotalsMap(id);
    const currentTotals = { ...empty, ...(map[cardId] || {}) } as Totals;
    const nextTotals = { ...currentTotals, [label]: Math.max(0, (currentTotals as any)[label] + delta) } as Totals;
    const nextMap = { ...map, [cardId]: nextTotals };
    const pathname = `reactions/${id}.json`;
    await put(pathname, JSON.stringify(nextMap), { access: "public", addRandomSuffix: false, contentType: "application/json", token: process.env.BLOB_READ_WRITE_TOKEN });
    return NextResponse.json(nextTotals);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
