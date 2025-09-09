# Agents Guide (Codex + Claude)

This repo is shared by two AI assistants. Use this doc as our ground rules and quick map so we can move fast together without stepping on each other.

## Repo Map
- design-systems: LoopsDS (new design system)
  - src/styles/tokens.css: color/typography/radius/space tokens; retro theme via `html.theme-retro`.
  - src/styles/components.css: base components (`.card`, `.button.primary`, `.badge`, `.pill`, `.meter`, `.wordmark`, `.retro-banner`).
  - design-system/index.html: living docs with Minimal/Retro toggle.
  - tailwind.config.js: minimal Tailwind v4 setup for docs.
  - tools/og/generate.mjs: tiny OG image generator; writes `public/og/out.svg`.
- viewer: Next.js 15 (App Router) + Tailwind v4
  - Styling: `src/app/globals.css` (theme vars + reaction styles), CSS modules under `src/components/*/*.module.css`.
  - Key components: `Viewer.tsx`, `ReactionBar.tsx`, `FAB.tsx`, `Playful.tsx`, etc.
  - API: Vercel Blob-backed `/api/bangs*` and `/api/bangs/[id]/reactions`.
- extension: Chrome MV3 content script (Twitter/X)
  - `content.js` injects checkboxes + floating `Export Selection` pill, opens viewer with `?data=`.
  - `styles.css` defines `.tc-fab`, checkbox styles.
- Docs worth skimming: `agent.md` (day summary), `codex_handover.md` (state/plan), `build_app.md` (original scope).

## LoopsDS Summary
- Tokens: `--bg`, `--text`, `--muted`, `--primary`, `--accent`, `--highlight`, `--card`, `--stroke`, `--shadow`, spacing/radius/fonts.
- Themes: Minimal by default; add `html.theme-retro` to switch Retro.
- Components: `.card`, `.badge`, `.pill`, `.button.primary`, `.meter`, `.wordmark`, `.retro-banner`.
- Copy guidance (updates for InTheLoops):
  - “YOU GOT BANG’d!” → “YOU’RE IN THE LOOPS!” (Retro) / “InTheLoops” (Minimal)
  - “THE SPARK” → “THE ORIGINAL POST”
  - “SHARE THE BANG!” → “SHARE THE LOOP”
  - “Heat Level” → “Highlight Level”

## Current Styling In Viewer
- Tailwind v4 via `@import "tailwindcss";` and `@theme inline` in `globals.css`.
- Custom CSS variables in `:root`: `--background`, `--foreground`, `--muted`, `--accent-1`, `--accent-2`, `--hot`, `--cold`, `--comic`, `--think`.
- Reactions and `.tc-fab` pill styled in `globals.css` (note: `.tc-fab` also exists in the extension—safe since they don’t co-load).

## Suggested Bridge (no code changed yet)
Goal: consume LoopsDS tokens/components without renaming existing viewer variables. When we integrate, add a small bridge layer so Tailwind and components continue to work:

- Import LoopsDS CSS early in `globals.css` (or package it):
  - Option A (local import): copy/symlink `design-systems/src/styles/{tokens.css,components.css}` into `viewer/public/ds/` and `@import url("/ds/tokens.css"); @import url("/ds/components.css");`
  - Option B (workspace package): turn `design-systems/` into a workspace package and import from `node_modules`.
- Define viewer vars from LoopsDS tokens (bridge snippet):
  - `--background` ← `--bg`
  - `--foreground` ← `--text`
  - `--muted` ← `--muted`
  - `--hot` ← `--accent`
  - `--cold` ← `--primary`
  - `--comic` ← `--highlight`
  - `--think` ← `--primary`
  - `--accent-1/2` ← derived from `--card` via `color-mix` for subtle paper layers
- Theme hook: toggle `html.classList.toggle('theme-retro', ...)` to switch Retro tokens; Minimal remains default.
- Components: prefer `.card`, `.badge`, `.pill`, `.button.primary`, `.meter` where possible; keep existing CSS modules where bespoke.

## Integration Notes & Risks
- Next.js import boundary: importing CSS from outside `viewer/` may fail; prefer copying into `viewer/public/ds/` or packaging `design-systems/` as a workspace dependency.
- Variable naming mismatch: avoid mass renames—bridge with custom properties as above.
- Fonts: LoopsDS expects Inter, JetBrains Mono, Bangers. Viewer already loads Inter + Crimson Pro; add Bangers only for `.retro-banner` usage.
- Copy consistency: update viewer titles/subtitles per LoopsDS “Copy updates”.
- Extension styles: MV3 can’t import external CSS; reuse LoopsDS tokens by duplicating the token block into `extension/styles.css` and switching values consistently (document provenance).

## Proposed Plan (when we implement)
1) Package DS CSS: add `viewer/public/ds/` and import `tokens.css` + `components.css`.
2) Add bridge vars: map LoopsDS tokens to viewer vars in `:root`.
3) Theme toggle: add `theme-retro` on `<html>` and verify parity.
4) Component sweep: apply `.card/.pill/.badge/.button.primary` to key UI blocks.
5) Copy sweep: apply DS wording across header, CTAs, labels.
6) Extension polish: align `styles.css` colors with tokens and ensure checkbox/CTA match.

## Guardrails For Both Agents
- Style-only changes when touching DS work unless explicitly asked; do not change data models or API semantics.
- Use tokens/components from `design-systems/src/styles/*`. Do not invent new hardcoded values. If a new variant is needed, use CSS variables and propose token additions in this doc first.
- Keep Tailwind class usage consistent; prefer variables for colors.
- Coordinate via small PR-sized patches; keep changes scoped and reversible.
- Update `codex_handover.md` after substantive changes (state, known issues, next steps).

## How We Work (Codex + Claude)
- Planning: create/maintain a short plan before multi-step changes; one step in progress at a time.
- Preambles: announce grouped actions before running commands; keep concise.
- Validation: run viewer locally (`cd viewer && npm i && npm run dev`). For prod, deploy via Vercel (Root Directory = `viewer`) with `BLOB_READ_WRITE_TOKEN` set.
- Coordination: reference files by path; avoid large diffs; no unrelated fixes.
- Safety: don’t remove features or change copy outside the DS guidelines without confirmation.

## Quick Commands
- Viewer dev: `cd viewer && npm i && npm run dev`
- Build: `cd viewer && npm run build`
- Vercel deploy: `vercel --prod` (Root Directory: `viewer/`)
- OG image from DS: `cd design-systems && node tools/og/generate.mjs "Your subtitle"`

## Open Questions
- Do we want LoopsDS as a published package (versioned), or keep it local and copy assets at build time?
- Which viewer components should adopt `.card/.button` first (hero, replies, FAB), and which remain bespoke?

--
This is a scan and plan only. No app code has been changed yet.
