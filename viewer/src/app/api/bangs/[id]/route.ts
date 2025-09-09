/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, ctx: any) {
  try {
    const id = (await ctx.params)?.id ?? ctx.params?.id;
    const pathname = `bangs/${id}.json`;
    const { blobs } = await list({ prefix: pathname });
    const blob = blobs.find((b) => b.pathname === pathname) || blobs[0];
    if (!blob) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const r = await fetch(blob.url);
    if (!r.ok) return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
    const data = await r.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
