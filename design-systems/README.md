# LoopsDS — Personal Design System

Your plug-and-play design system starter for all projects.

## What’s inside
- **design-system/index.html** — browsable, living docs (Minimal + Retro themes)
- **src/styles/tokens.css** — color/typography tokens
- **src/styles/components.css** — cards, buttons, badges, meters
- **public/og/base.svg** — share preview template
- **tools/og/generate.mjs** — tiny OG generator

## Use in an app
```html
<link rel="stylesheet" href="/src/styles/tokens.css">
<link rel="stylesheet" href="/src/styles/components.css">
<html class="theme-minimal"> <!-- or add .theme-retro -->
```

## Copy updates for InTheLoops
- "YOU GOT BANG’D!" → "YOU’RE IN THE LOOPS!" (Retro) / "InTheLoops" (Minimal)
- "THE SPARK" → "THE ORIGINAL POST"
- "SHARE THE BANG!" → "SHARE THE LOOP"
- "Heat Level" → "Highlight Level"

## AI guardrail prompt (Claude/Copilot/Codex)
```
You are styling only. Use tokens from /src/styles/tokens.css and components from /src/styles/components.css.
Do NOT change JS logic or component structure. Do NOT invent new colors or spacings.
If you need a new variant, extend using CSS variables; never hardcode.
Minimal view uses <html class="theme-minimal">; Retro toggles theme-retro.
Keep strings updated per README "Copy updates".
```

## Commands
- `node tools/og/generate.mjs "Custom subtitle here"` → writes `public/og/out.svg`
- Serve `design-system/index.html` statically to browse docs.
