"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { upload } from '@vercel/blob/client';

export function ImportForm() {
  const [text, setText] = React.useState("");
  const [curator, setCurator] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [videoError, setVideoError] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const router = useRouter();

  const onPickFile = async (file: File | null) => {
    setVideoError(null);
    setProgress(0);
    if (!file) return;
    
    // Basic client validation
    const isMp4 = file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4');
    if (!isMp4) {
      setVideoError('Only MP4 files are allowed.');
      return;
    }
    const maxBytes = 100 * 1024 * 1024;
    if (file.size > maxBytes) {
      setVideoError('File exceeds 100 MB limit.');
      return;
    }
    
    // Client-side upload directly to Vercel Blob
    try {
      setUploading(true);
      setProgress(50); // Show progress since we can't track actual progress with client uploads
      
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-token',
        clientPayload: {
          type: file.type,
          size: file.size,
        },
      });
      
      setProgress(100);
      setVideoUrl(blob.url);
    } catch (err: unknown) {
      setVideoError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const json = JSON.parse(text);
      if (curator) json.curator = curator;
      if (videoUrl) {
        // Attach uploaded video as original media
        json.original = json.original || {
          id: null,
          author: { name: "Unknown", handle: "unknown" },
          text: json.original?.text || "",
        };
        json.original.media = { type: "video", url: videoUrl };
      }
      // Attempt save-first flow
      try {
        const res = await fetch('/api/bangs', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(json),
        });
        if (res.ok) {
          const out = await res.json();
          router.push(out.url || '/');
          return;
        }
      } catch {}
      // Fallback to pasted preview when save fails
      const data = encodeURIComponent(JSON.stringify(json));
      router.push(`/view/pasted?data=${data}`);
    } catch {
      alert("Invalid JSON");
    }
  };
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Upload Video (MP4 up to 100 MB)</label>
        <input
          type="file"
          accept=".mp4,video/mp4"
          onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          disabled={uploading}
        />
        {uploading && (
          <div className="text-sm text-[color:var(--muted)]">Uploading… {progress}%</div>
        )}
        {videoUrl && !uploading && (
          <div className="text-sm text-[color:var(--think)]">Uploaded. Will attach to the original post.</div>
        )}
        {videoError && (
          <div className="text-sm text-[color:var(--hot)]">{videoError}</div>
        )}
      </div>
      <textarea
        className="w-full h-48 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-[color:var(--color-brand-start)]"
        placeholder="Paste exported JSON here"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Curator name (optional)"
          className="flex-1 rounded-lg px-3 py-2 border outline-none"
          value={curator}
          onChange={(e) => setCurator(e.target.value)}
        />
        <button className="button brand">
          View
        </button>
      </div>
    </form>
  );
}
