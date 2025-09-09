InTheLoops – Handover & TODOs

Date: 2025-09-07

Summary
- Viewer aligned to LoopsDS look-and-feel with Minimal/Retro tokens.
- Reactions upgraded to private-loop UX: persistent top-right cluster, dim+dot in bar, no numbers.
- API extended to support HEART; UI alias replaces skull with eyes (key remains DEAD).
 - Lightweight video support added: server upload to Vercel Blob (MP4 only), client upload UI with progress, and HTML5 playback in viewer.

Checklist
- [x] Fix logo whitespace and alignment
  - Cropped `viewer/public/loop-rings.svg` viewBox and aligned header group with content column.
- [x] Heat widget: float bottom-left on all devices
  - Added `heat-dock` in `Viewer.tsx` with fixed bottom-left placement.
- [x] Add favicon
  - `viewer/src/app/icon.svg` (loop rings) auto-picked by Next App Router.
- [x] Retro background uses DS tokens
  - `html.theme-retro body { background: var(--bg); color: var(--text); }`.
- [x] Persistent reactions cluster (top-right)
  - Implemented in `ReactionBar.tsx` with `rx-*` animations; both-selected scales 1.2x.
- [x] Bottom bar without numbers + selected dim + pulsing dot
  - Removed counts; added `.is-selected` state and dot keyframes.
- [x] Preserve click burst animation
  - Kept `spawnParticles(...)` for the same on-click feel.
- [x] DEAD → Eyes (UI alias)
  - Render 👀 for key `DEAD`; server/storage keys unchanged.
- [x] Add HEART reaction end-to-end
  - API: allow 'HEART', totals include HEART, GET always returns all keys.
  - UI: HEART added to catalog; heartbeat animation; particles palette.
- [x] Persist selections after refresh
  - On GET, merge counts with `max(local, server)` so local selections aren’t wiped by zeros.

Open Items / Next Up
- [ ] DS docs: tighten spacing under “Reactions” section (small caption text looks detached on some viewports).
- [ ] App: optional — move cluster to a shared component for TweetCard + ReplyCard (today it renders via ReactionBar in each card).
- [ ] App: consider feature-flag for HEART if you want quicker rollback (`NEXT_PUBLIC_FEATURE_HEART=0`).
- [ ] Group loop UX (3+ participants): counts/badges + tooltips — backlog.
- [ ] QA pass on mobile: cluster overlap with long author names; adjust `top/right` offsets if needed.
 - [ ] Email: set up Resend and provide `RESEND_API_KEY`, `LEADS_NOTIFY_TO`, `LEADS_FROM` so `/api/leads` can send notifications. Currently stores to Blob either way.
 - [ ] Curator onboarding: decide copy for /curate and whether to expose extension link publicly. For now, no store link; invite-only via email.
 - [ ] My Loops: verify creator IP indexing on Vercel (headers). Add signed cookie ID fallback if IP not present.

Post‑MVP Backlog (approved)
- IG Export (image presets, manual post)
  - Presets: 1080x1080 and 1080x1920 PNGs using DS tokens (Minimal/Retro).
  - Share flow: generate image → save → user posts manually to Instagram. No deep share.
  - Renderer: prefer Satori+Resvg on server for consistent output; cache by bangId+preset.
  - Caption helper: copy suggested caption to clipboard.

- New Sources: Instagram and TikTok capture (same flow as Twitter)
  - Extension reads content from instagram.com or tiktok.com, builds the same payload shape, opens viewer with ?data=.
  - MVP scope: captions + top N comments; no auth, no private content.
  - Output channel remains WhatsApp link share.

- Video ingest (tweets/reels) — defer
  - Start with image‑only; later allow short MP4 clips (muted autoplay), rehosted to Blob if size is reasonable.
  - HLS and transcode are out of scope for now.

Leading Media (current MVP decisions)
- Placement: inside the Original Post card (TweetCard), directly under the author header and above the text; keeps the “tweet” feel in both Minimal and Retro. Not above the banner.
- Capture: extension detects first image; toggle “Include media” (default ON if media exists).
- Store: attach to original post object as `media` with fields `{ type, sourceUrl, url, width, height, aspectRatio?, alt?, provider }`.
- Rehost: upload to Blob on save for reliability; fallback to sourceUrl if upload fails.
- Safeguards: accept only JPEG/PNG/WebP; max size ~1.5MB (fallback to hotlink if larger); dedupe by content hash to avoid re‑uploading.
- Space management: periodic cleanup for orphaned blobs; option to set a soft TTL (e.g., 90 days) later.

Environment
- Local needs `viewer/.env.local` with `BLOB_READ_WRITE_TOKEN=…` for reaction writes.
- Confirm production/staging envs already have the token; GET now tolerates missing HEART.
 - For video upload, the same `BLOB_READ_WRITE_TOKEN` is required; route runs in Node runtime.

Validation
- Dev: `cd viewer && npm run dev`
- Click any emoji → burst anim, bottom dim+dot, top-right cluster.
- Refresh → selections persist; cluster remains.
- API quick test (requires token):
  - `curl -s -X POST 'http://localhost:3002/api/bangs/demo1/reactions' -H 'content-type: application/json' --data '{"cardId":"original-123","label":"HEART","delta":1}'`
 - Video:
   - Upload a ≤10 MB MP4 via Import page file picker; confirm progress and success message.
   - Submit JSON with/without `original.media`; uploaded video URL is attached to `original.media`.
   - Viewer renders a `<video>` with controls; scrub/seek works (range requests).
   - Try >100 MB file to see a validation error.

Lightweight Video Support
- Storage: Vercel Blob, public, `media/{name}.mp4` with random suffix.
- Limits: 100 MB max; `video/mp4` only (H.264/AAC assumed).
- TTL: soft policy 30 days (documented here; cleanup job later).
- Playback: `<video controls preload="metadata" playsInline>`; poster optional for future.
- No embeds or external free file hosts. If buffering grows, consider Cloudflare Stream/Bunny/Mux for adaptive.

Files Touched (Video)
- `viewer/src/app/api/upload/route.ts` – POST multipart handler; validates size/type; streams to Blob via `put` and returns `{ url, contentType, size }`.
- `viewer/src/components/ImportForm.tsx` – file picker (MP4), client validation, XHR progress, attaches `{ type: 'video', url }` to `original.media` on submit.
- `viewer/src/components/TweetCard.tsx` – renders `<video>` when `media.type === 'video'`.
- `viewer/src/components/Viewer.tsx` – copy: “Highlight Level” label.

Scale/Cost Notes
- Keep: Vercel Blob at small scale; egress remains low for a small audience.
- Upgrade: Cloudflare Stream/Bunny/Mux for HLS + thumbnails if complaints or >~100 GB/mo egress.
- Rejected: free file hosts (expiring links, range/CORS issues, reliability).

Risks & Mitigations
- Large files: enforced 100 MB cap client- and server-side.
- Formats: only MP4 initially; expand later if needed.
- Cleanup: document 30-day retention now; add scheduled deletion later.

Key Files Touched
- `viewer/src/components/Viewer.tsx` – heat dock, header logo alignment.
- `viewer/public/loop-rings.svg` – cropped viewBox.
- `viewer/src/app/icon.svg` – favicon.
- `viewer/src/app/globals.css` – rx-* animations, selected-state dot, retro bg override.
- `viewer/src/components/ReactionBar.tsx` – cluster render, UI alias, numbers removed, HEART in catalog, merge-on-hydrate.
- `viewer/src/app/api/bangs/[id]/reactions/route.ts` – HEART support and GET defaults.
- `viewer/src/lib/particles.ts` – HEART palette and emoji set.
- `design-systems/design-system/index.html` + `src/styles/components.css` – demo parity and click-burst in DS.

Notes
- We did not modify data model beyond adding HEART to reactions totals; existing blobs remain compatible.
- No unrelated refactors; all changes are minimal and reversible.
