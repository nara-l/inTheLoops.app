# InTheLoops — DS + Reactions (Status)

Last Updated: 2025-09-07

Quick links
- Roadmap & TODOs: `codex_handover.md`
- Design System demo: `design-systems/design-system/index.html`

## What We Shipped Today

### ✅ Brand Migration: BANG! → InTheLoops
- **Complete rebrand** from "BANG! Viewer" to "InTheLoops" 
- **Updated wordmark** to "YOU'RE IN THE LOOPS!" across both modes
- **Logo integration** with loop-rings.svg from design system
- **Header layout redesign** with logo + text in top-left

### ✅ Design System Integration  
- **Dual-mode system** preserved: Minimal (clean) + Retro (comic-style)
- **Design system tokens** integrated from `/design-systems/` 
- **CSS architecture** unified with DS variables and components
- **Theme classes** applied via ThemeApply component (theme-minimal, theme-retro)

### ✅ UX Improvements
- **Removed gray category labels** ("HOT TAKE", "COLD FACTS", etc.) from reply cards - cleaner interface
- **Fixed double thread lines** - kept functional navigation dots, removed decorative connector line
- **Logo implementation** with proper SVG integration from design system assets

### ✅ Layout Restructure
- **Top-left**: Logo (loop-rings.svg) + "InTheLoops" text
- **Top-right**: Mode toggle (Minimal/Retro) - moved from top-left
- **Heat widget positioning** attempted (see Known Issues)

## Current Architecture

### Key Files
- **Viewer**: `src/components/Viewer.tsx` - main layout component
- **Heat Widget**: `src/components/HeatWidget.tsx` - heat level indicator  
- **Logo**: `public/loop-rings.svg` (cropped from design system)
- **Styles**: `src/app/globals.css` - unified CSS with DS integration
- **Theme**: `src/components/ThemeApply.tsx` - applies theme classes

### API Endpoints (Unchanged)
- `POST /api/bangs` → save conversation JSON
- `GET /api/bangs/[id]` → load saved conversation  
- `GET/POST /api/bangs/[id]/reactions` → reaction totals per card

## Highlights Since 2025-09-06
- Heat widget floats bottom-left (`.heat-dock`) across devices.
- Logo cropped and aligned with content column; header icon size tuned.
- Favicon added via `src/app/icon.svg`.
- Retro background now uses DS token `--bg`.
- Reactions upgrade for private loops:
  - Bottom bar: numbers removed; selected = dim + pulsing dot.
  - Top-right cluster: persistent animated badges; both-selected scales 1.2x.
  - Click burst preserved (same particles).
  - UI alias: DEAD → 👀 (key unchanged).
  - HEART added end-to-end (API, particles, UI).

## Known Issues/Follow-ups
- DS docs: caption under Reactions section needs spacing polish on some viewports.
- Optional: consolidate cluster into a shared component used by all cards.
## Working Components

### ✅ Mode Toggle System
- **Desktop**: Fixed position top-right
- **Mobile**: Floating top-right  
- **Functionality**: Seamless switching between Minimal/Retro modes

### ✅ Reaction System
- **Emoji reactions** with server persistence
- **Animation system** with particle bursts
- **Per-card totals** via API endpoints

### ✅ Share System  
- **FAB button** with WhatsApp integration
- **Stable URLs** via `/view/<id>` pattern
- **Cross-device persistence**

## Tech Stack
- **Frontend**: Next.js 15.5.2 + Turbopack
- **Styling**: Tailwind CSS + Design System tokens
- **Storage**: Vercel Blob for conversations + reactions
- **Deployment**: Vercel (currently on localhost:3001)

## For Next Engineer

### Immediate Fixes Needed
1. **Heat Widget**: Make it float bottom-left consistently across all devices
2. **Logo Gap**: Eliminate visual gap between icon and text (SVG or CSS solution)

### Context for Fixes
- Heat widget should behave like the mode toggle (which works correctly)
- Logo uses `loop-rings.svg` with three overlapping circles design
- Both issues are purely visual/positioning, no functionality changes needed

### Development
- **Dev server**: `npm run dev` in `/viewer` directory  
- **Current URL**: http://localhost:3001/view/demo1
- **Deploy**: `vercel --prod` from viewer directory

---
**Status**: Core rebrand and design system integration complete. Two positioning issues remain for resolution.
