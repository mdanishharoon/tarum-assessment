# Technical decisions

Short notes on architecture, libraries, and patterns.

## Stack

- **Next.js 15 (App Router)** + **React 19** + **TypeScript**.
- **Tailwind CSS v4** for utility classes alongside **CSS Modules** for per-component styles. CSS Modules carry the slab/inset shadow recipes since they're component-local; tokens live in `src/app/globals.css`.
- **Bun** as the package manager / dev runtime, **Turbopack** for `next dev`.
- **Motion** (formerly Framer Motion) is only used by the animated sparkles icon on the Generate button. Everything else animates with CSS transitions + keyframes.
- No external state library. `useState` + refs are sufficient.

## API

- A single Route Handler at `src/app/api/generate/route.ts` returns dummy `image` or `video` items based on the request body. Each item ships with a synthetic `delay` so the client can animate skeleton → loaded progressively without a real backend. Picsum and a small set of public sample videos provide media.
- Type schema lives in `src/lib/types.ts` (`GenerationRequest / GenerationResponse / GenerationItem / ScheduledItem`).

## State shape

`src/app/page.tsx` owns:

- `canvases: CanvasState[]` — each generation is its own canvas with stacked cells (`submitting | pending | done`). Stacking the canvases (instead of replacing) lets the user see history in-place.
- `historyTab: HistoryTab | null` — drives the IconNav active state and the dropdown filter.
- A pile of refs for cleanup: `timersRef`, `completionTimersRef`, `controllersRef`. All cleared on unmount.
- `prevTabRef` is read **during render** to compute slide direction synchronously. Setting it in a `useEffect` would mount the new content with stale direction on the first commit and the CSS keyframe would lock in the wrong slide. Writing the ref in a follow-up effect keeps the read consistent.

## History persistence

- `src/lib/history-store.ts` stores up to 8 entries in `localStorage` under `forge.history.v1`, with a subscriber pattern for live updates across components. No SSR mismatch risk because the store reads inside `useEffect`.
- The history strip falls back to seed thumbnails from `src/lib/history.ts` so the dropdown never looks empty on first run.

## Components

- **PromptPanel** (`forwardRef` + `useImperativeHandle`) exposes an `applyPreset` method so picking a history item can fill prompt + mode + ratio + model without prop drilling.
- **IconNav** is a controlled component; tab id and select callback are owned by the page. A button ref map is forwarded so close-from-keyboard can restore focus to the originating trigger.
- **HistoryStrip** is reused in two modes: legacy inline and `asDropdown`. The dropdown variant takes `contentKey` to force a remount on mode change so the slide keyframe replays.
- **Accordion** got a `disabled` prop so unfinished controls can stay visible without being interactive.

## Performance notes (the ones that actually moved the needle)

- **CellPercent** uses a functional `setPercent` that bails out when the rounded percent hasn't changed. Before this, four pending cells caused ~33 wasted commits per second. After, the component only re-renders when the displayed integer moves.
- **Slide direction is derived in render, not in a `useEffect`** (above). This also avoids one extra render per tab switch.
- All thumbnails go through `next/image` with explicit `sizes` so responsive variants are served.
- `motion/react` is loaded only by the sparkles icon to keep the bundle's animation cost concentrated.

## Code quality gates

- `bun run type-check` and `bun run lint` both clean on every commit.
- `treefmt` handles Prettier + nixfmt.
- `lefthook` runs lint, type-check, and format on pre-commit.
- Conventional Commits across the working branch.

## What I left alone on purpose

- `ModeTabs` uses `role="tablist"` / `role="tab"` without a matching `tabpanel`. It's a segmented control visually; switching to `radiogroup` would change semantics more than it would fix.
- The `IconNav` inline ref callback recreates on every render. Five buttons, not a hot path; the indirection of `useCallback`-per-id costs more than it saves.
- Per-cell `blobStyle()` runs in the `.map`. Pure and cheap, memoizing inside a map would need a sub-component for marginal gain.

## Outstanding

- No tests. The task scope didn't call for them and the surface area is small enough that visual review covers it.
- Mobile down to 320px wasn't browser-verified, only code-verified (media queries at 1100 / 1024 / 960 / 820 / 640 / 600 / 360 cover the major reflows).
