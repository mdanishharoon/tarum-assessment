# Forge

Responsive AI content-generation prototype, built as a frontend technical assessment.

A single-page app that simulates image + video generation: type a prompt, pick a count / aspect ratio / model, hit Generate, and watch four (or however many) skeleton cells resolve into media. Past generations live in a per-mode history dropdown that opens from the top icon navbar.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **CSS Modules**
- **Bun** for install / dev / build, **Turbopack** for `next dev`
- **Motion** (Framer Motion's successor) for the animated sparkles icon
- Deployed on **Vercel**

The dummy API lives at `src/app/api/generate/route.ts` and returns `image` or `video` items with a synthetic per-item delay so the UI can animate skeletons → loaded media progressively.

## Features

- Per-mode history dropdown from the top nav (Home / Image / Video / Enhance / Library) with direction-aware slide animations between modes
- Prompt panel: Count, Ratio, and Model as chips with popovers; Advance + Styles accordions as disabled placeholders
- Stacked canvases that scroll smoothly into view on every Generate
- Light + dark mode using a small set of theme-aware OKLCH tokens
- Live progress counters per cell that re-render only when the rounded percent changes
- Responsive from 320px → 1920px+, with the workspace stacking below 960px and a fixed scroll-to-top button appearing once the user has scrolled past the prompt box

See [`docs/design-decisions.md`](docs/design-decisions.md) and [`docs/technical-decisions.md`](docs/technical-decisions.md) for the longer-form rationale.

## Getting started

### With Nix (recommended)

```bash
cp .env.example .env.local
nix develop          # drops you into a shell with bun, node, treefmt, lefthook
bun install
bun run dev
```

### Without Nix

Ensure you have [bun](https://bun.sh) and [lefthook](https://github.com/evilmartians/lefthook) installed.

```bash
cp .env.example .env.local
bun install
lefthook install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Public app URL |

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with Turbopack |
| `bun run build` | Production build |
| `bun run start` | Run production server locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format with treefmt (prettier + nixfmt) |
| `bun run type-check` | TypeScript type checking |

## Project structure

```
src/
  app/
    api/generate/route.ts    # dummy API: returns image/video items with synthetic delays
    page.tsx                 # owns canvases, history tab state, generation flow
    layout.tsx               # root layout
    globals.css              # OKLCH tokens, slab + inset surface vocabulary
  components/                # PromptPanel, HistoryStrip, ResultsCanvas, etc.
  lib/
    history-store.ts         # localStorage-backed history with subscriber pattern
    history.ts               # seed thumbnails for first-run fill
    ratios.ts                # MODELS, ASPECT_RATIOS, IMAGE_COUNTS
    types.ts                 # GenerationMode / AspectRatio / GenerationItem
docs/
  design-decisions.md
  technical-decisions.md
  screenshots/               # phone / tablet / desktop reference shots
```

## Responsiveness

| Range | Layout |
|-------|--------|
| ≥1025px | Three-column header. Sidebar (PromptPanel) + canvas side-by-side. |
| 541–1024px (tablet) | Single-row header with IconNav absolutely centered; Gallery / Support pills contract to icon-only. Sidebar stacks above the canvas below 960px. |
| ≤540px (small phone) | Header drops to two rows (Logo + actions on top, IconNav below). PromptPanel tightens; history strip caps at 160–175px and drops "View All". |

Reference screenshots for each breakpoint live in [`docs/screenshots/`](docs/screenshots/).

## Deployment

Deployed on [Vercel](https://vercel.com). Connect the GitHub repo via the Vercel dashboard. Production deploys on push to `main`; every PR gets a preview URL. No workflow file required.
