import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

function isEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function makeId() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)).slice(0, 12);
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Missing BLOB_READ_WRITE_TOKEN" }, { status: 500 });
    }
    const body = await req.json().catch(() => null);
    const email = String(body?.email || "").trim().toLowerCase();
    const referrer = typeof body?.referrer === "string" ? body.referrer : undefined;
    if (!isEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const id = makeId();
    const pathname = `leads/${id}.json`;
    await put(pathname, JSON.stringify({ email, referrer, createdAt: new Date().toISOString() }), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      token,
    });
    // Optional: send notification via Resend if configured
    try {
      const apiKey = process.env.RESEND_API_KEY;
      const to = process.env.LEADS_NOTIFY_TO;
      const from = process.env.LEADS_FROM || "noreply@example.com";
      if (apiKey && to) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to,
            subject: 'New InTheLoops creator request',
            html: `<p>Email: ${email}</p><p>Referrer: ${referrer || ''}</p>`,
          }),
        }).catch(() => {});
      }
    } catch {}
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
