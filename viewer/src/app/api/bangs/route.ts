/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export const runtime = "nodejs";

function makeId() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)).slice(0, 12);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.original || !Array.isArray(body.replies)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Optionally rehost leading media (image) for stability
    async function rehostLeadingImageIfAny(payload: any, idHint: string) {
      try {
        const media = payload?.original?.media;
        const src = media?.url || media?.sourceUrl;
        if (!media || media?.type !== 'image' || !src) return payload;
        // Fetch image
        const res = await fetch(src);
        if (!res.ok) return payload; // leave as-is on failure
        const ct = res.headers.get('content-type') || '';
        if (!/^image\/(png|jpe?g|webp|gif|svg\+xml)$/i.test(ct)) return payload; // whitelist
        const ab = await res.arrayBuffer();
        const ext = (ct.includes('png') ? 'png' : ct.includes('svg') ? 'svg' : ct.includes('webp') ? 'webp' : 'jpg');
        const mediaPath = `media/${idHint}.${ext}`;
        const putRes = await put(mediaPath, Buffer.from(ab), {
          access: 'public',
          addRandomSuffix: true,
          contentType: ct,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        const next = { ...payload };
        next.original = next.original || {};
        next.original.media = { ...(next.original.media || {}), url: putRes.url, sourceUrl: src, type: 'image' };
        return next;
      } catch {
        return payload; // non-fatal
      }
    }
    let id = makeId();
    // Avoid collisions
    const existing = await list({ prefix: `bangs/${id}.json` });
    if (existing.blobs.length > 0) id = makeId();

    // Rehost media if possible
    // Capture creator ip/user hint (best-effort)
    const ipHeader = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const creatorIp = ipHeader.split(',')[0]?.trim() || undefined;

    const withMediaBase = await rehostLeadingImageIfAny(body, id);
    const withMedia = { 
      ...withMediaBase,
      createdAt: withMediaBase?.createdAt || new Date().toISOString(),
      creatorIp: withMediaBase?.creatorIp || creatorIp,
    };

    const pathname = `bangs/${id}.json`;
    const { url } = await put(pathname, JSON.stringify(withMedia), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    // Write lightweight creator index for quick "My Loops" listing
    if (creatorIp) {
      try {
        const indexPath = `creators/${creatorIp}/${id}.json`;
        await put(indexPath, JSON.stringify({ id, createdAt: withMedia.createdAt }), {
          access: "public",
          addRandomSuffix: false,
          contentType: "application/json",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch {}
    }
    return NextResponse.json({ id, url: `/view/${id}`, blobUrl: url });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
