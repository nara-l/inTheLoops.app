"use client";
import * as React from "react";
import { useRouter } from "next/navigation";

export function PasteButton() {
  const router = useRouter();
  const onClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return alert('Clipboard is empty');
      const json = JSON.parse(text);
      const data = encodeURIComponent(JSON.stringify(json));
      router.push(`/view/pasted?data=${data}`);
    } catch {
      alert('Failed to read JSON from clipboard');
    }
  };
  return (
    <button onClick={onClick} className="fixed bottom-5 right-5 z-50 px-4 py-2 rounded-full text-white shadow" style={{ background: '#222' }}>
      Paste Loop Data
    </button>
  );
}


