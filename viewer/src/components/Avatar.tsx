"use client";
import * as React from "react";

function hashToHsl(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return `hsl(${h % 360} 70% 55%)`;
}

export function Avatar({ name, handle, size = 36 }: { name: string; handle?: string; size?: number }) {
  const initials = React.useMemo(() => {
    const parts = (name || handle || "?").split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "?";
    const second = parts.length > 1 ? parts[1][0] : (handle?.[0] ?? "");
    return (first + second).toUpperCase();
  }, [name, handle]);
  const color = React.useMemo(() => hashToHsl((handle || name || "").toLowerCase()), [handle, name]);
  return (
    <div
      aria-hidden
      style={{ width: size, height: size, background: color }}
      className="rounded-full flex items-center justify-center text-white font-semibold select-none shadow-sm"
    >
      <span className="text-[0.7rem]">{initials}</span>
    </div>
  );
}

