import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Missing BLOB_READ_WRITE_TOKEN" }, { status: 500 });
    }
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const size = file.size ?? 0;
    const type = (file.type || "").toLowerCase();
    const origName = (file.name as string) || "upload.mp4";
    const name = typeof origName === "string" ? origName : "upload.mp4";

    // Validate type and size
    const isMp4 = type === "video/mp4" || name.toLowerCase().endsWith(".mp4");
    if (!isMp4) {
      return NextResponse.json({ error: "Only MP4 (H.264/AAC) allowed" }, { status: 415 });
    }
    if (size > MAX_BYTES) {
      return NextResponse.json({ error: "File exceeds 100 MB limit" }, { status: 413 });
    }

    const safeBase = sanitizeFilename(name.replace(/\.[^.]+$/i, "")) || "video";
    const pathname = `media/${safeBase}.mp4`;

    // Convert to Buffer for robust Node uploads
    const ab = await file.arrayBuffer();
    const buf = Buffer.from(ab);

    const { url } = await put(pathname, buf, {
      access: "public",
      addRandomSuffix: true,
      contentType: "video/mp4",
      token,
    });

    return NextResponse.json({ url, contentType: "video/mp4", size });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    console.error("/api/upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
