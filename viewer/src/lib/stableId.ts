// Create a stable per-reply card id from content
// Simple FNV-1a 32-bit hash, returned as short hex
export function stableCardId(parts: Array<string | null | undefined>): string {
  const input = parts.filter(Boolean).join("|");
  let h = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    // FNV prime 16777619
    h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
  }
  return "s_" + ("00000000" + h.toString(16)).slice(-8);
}

export function replyCardId(authorName?: string | null, handle?: string | null, text?: string | null): string {
  return stableCardId([authorName || "", handle || "", text || ""]);
}

