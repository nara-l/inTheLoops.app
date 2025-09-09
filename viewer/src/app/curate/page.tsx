"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CuratePage() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "saving" | "ok" | "err">("idle");
  const [msg, setMsg] = React.useState("");
  const router = useRouter();
  const [from, setFrom] = React.useState<string | null>(null);

  React.useEffect(() => {
    const el = document.documentElement;
    const hadRetro = el.classList.contains('theme-retro');
    if (!hadRetro) el.classList.add('theme-retro');
    try {
      const usp = new URLSearchParams(window.location.search);
      const f = usp.get('from');
      if (f) setFrom(f);
    } catch {}
    return () => { if (!hadRetro) el.classList.remove('theme-retro'); };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMsg("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, referrer: typeof window !== 'undefined' ? window.location.href : undefined }),
      });
      if (res.ok) {
        setStatus("ok");
        setMsg("Thanks! We’ll email you when creator access opens.");
        setEmail("");
      } else {
        const j = await res.json().catch(() => ({}));
        setStatus("err");
        setMsg(j?.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("err");
      setMsg("Network error. Try again.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      <div className="pt-2 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/loop-rings.svg" alt="InTheLoops" className="h-9 w-auto" />
          <span className="font-bold text-2xl">InTheLoops</span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (from && typeof from === 'string') {
              router.push(from);
            } else if (document.referrer && new URL(document.referrer).origin === location.origin) {
              router.back();
            } else {
              router.push('/');
            }
          }}
          className="underline text-sm"
        >
          Back
        </button>
      </div>
      <div className="card">
        <h1 className="text-2xl font-semibold">Curate Your Loop</h1>
        <p className="mt-2 text-[color:var(--muted)]">Loops are lightweight, shareable pages with the best bits from a thread. Private by default. No algorithm, just what you picked.</p>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="pill">How it works</div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Use our Chrome extension to pick posts and replies or upload screenshots or supply a link.</li>
              <li>We save your selection as a Loop you can share.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="pill">Coming soon</div>
            <div className="text-sm text-[color:var(--muted)]">Instagram · YouTube · TikTok · Reddit</div>
          </div>
        </div>
        <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 rounded-lg px-3 py-2 border outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button disabled={status === "saving"} className="button primary">
            {status === "saving" ? "Requesting…" : "Request Creator Access"}
          </button>
        </form>
        {msg && (
          <div className={`mt-2 text-sm ${status === 'ok' ? 'text-[color:var(--think)]' : 'text-[color:var(--hot)]'}`}>{msg}</div>
        )}
        <div className="mt-6 text-xs text-[color:var(--muted)]">
          We’re inviting a small set of curators. No extension needed for most flows; we’ll guide you after you’re in.
        </div>
      </div>
    </div>
  );
}
