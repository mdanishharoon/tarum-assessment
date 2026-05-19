# Design decisions

Short notes on the visual and interaction choices that shaped this build.

## Visual language

- **Palette.** Cream + coral, OKLCH only, low chroma at the extremes. The coral and the warm surfaces were toned down ~15% mid-build because cards were reading "loud" against the cream page; the warmth stays without the plastic.
- **Two surface vocabularies.** Static cards (PromptPanel, PromptCard, chips, mode pill, segmented active state) read as raised slabs with a faint top-left inset highlight and a hard bottom-right edge. The history dropdown reads as a recessed well using `--bg-inset` + an inner top shadow + a faint bottom rim. The two treatments share theme-aware tokens (`--slab-edge / --slab-highlight / --bg-inset / --inset-shadow`) so dark mode never gets the shiny plastic edge that 40% white highlights produce.
- **Dark mode is not the default.** Cream is the resting state. Dark mode mirrors the same vocabulary with the highlight at 6% and the slab edge at 40% so the slab effect survives on a dark page.
- **Canvas is bare on purpose.** No outline around the results region, no dashed border on the empty state. The chrome around the canvas (history strip, prompt panel) is doing all the framing work already.

## History as the navbar

The original layout had a permanent history strip eating vertical room on every screen. That got collapsed into the top icon navbar: each icon opens a per-mode dropdown over the workspace.

- **Home** shows everything (with seed fill for first-run polish).
- **Image / Video** filter by `GenerationMode`.
- **Enhance / Library** keep the navbar believable as a real product surface but only show the filter label, no special placeholder card.

The strip drops in below the header, not as an overlay on the canvas, because the user kept the sidebar prompt panel reachable while picking a thumbnail.

## Motion

- **One easing across the app.** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint) for openings, lifts, and progress slides. Faster ease-in for the strip's close so dismissal feels intentional.
- **Direction-aware mode switches.** Going Home → Image → Video slides content in from the right with a 2px blur that resolves to 0; reversing the path slides from the left. The IconNav's progress bar carries the same direction read.
- **Thumb stagger.** Cells inside the strip and inside the results canvas both animate in with `cellEnter`-style stagger keyed off `--cell-index`. Capped at ~8–12 to keep the tail snappy.
- **Reduced-motion** trims everything to opacity-only.

## Information architecture in the prompt panel

- **Settings as chips.** Count, ratio, and model collapsed from full segmented controls into small chips with popovers, freeing room for the textarea.
- **Real model names** so the picker reads like a product (Flux 1.1 Pro, Stable Diffusion 3.5, DALL·E 3).
- **Advance and Styles** stay as visible accordions but are explicitly disabled. The placeholders advertise intent without lying about coverage.
- **9:16 ratio** was dropped because it didn't add visual variety beyond 3:4 and crowded the popover grid.

## Accessibility

- All interactive icons have `aria-label`s; popovers have proper `role`/`aria-expanded`/`aria-controls`.
- Slide direction is derived during render so the keyboard path through the IconNav always animates correctly (and focus returns to the trigger button on close).
- Color contrast is anchored by the OKLCH ramps (`--fg-default` at 22% L on a 99% L page in light mode, 95% on 18% in dark).
