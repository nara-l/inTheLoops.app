import { Viewer } from "@/components/Viewer";
import { conversationsById } from "@/lib/sample";
import type { Conversation } from "@/lib/types";
import { mapBangToConversation } from "@/lib/mapBang";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers";

export default async function ViewPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await (searchParams || ({} as Record<string, string | string[] | undefined>));
  
  const id = resolvedParams.id;
  let data: Conversation | null = null;

  const sp = (resolvedSearchParams ?? {}) as Record<string, string | string[] | undefined>;
  const raw = typeof sp.data === "string" ? sp.data : undefined;
  const mode = typeof sp.mode === "string" ? sp.mode : undefined;
  if (raw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(raw));
      data = mapBangToConversation(parsed);
    } catch {
      data = null;
    }
  }
  if (!data) {
    // Try fetching from live API by id
    try {
      const h = await headers();
      const host = (h as any).get ? (h as any).get("host") : undefined;
      const proto = host && host.includes("localhost") ? "http" : "https";
      const res = await fetch(`${proto}://${host}/api/bangs/${id}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        data = mapBangToConversation(json);
      }
    } catch {}
    // Fallback to sample if still empty
    if (!data) data = conversationsById[id] ?? null;
  }

  // Ensure the conversation carries the route id so reactions hydrate/post for this id
  if (data && data.id !== id) {
    data = { ...data, id };
  }


  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-10">
        {data ? (
          <Viewer data={data} />
        ) : (
          <div className="soft-card rounded-2xl p-6">No data found for id: {id}</div>
        )}
      </div>
    </div>
  );
}
