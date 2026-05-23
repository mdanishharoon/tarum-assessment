# Design — Neon Playroom

> Bold, precise, irreverent. Linear's rigor on a playground palette.

**Theme:** dark
**Register:** product
**Surface scope:** `/my-way` only. The legacy Forge build at `/` keeps its own peach/coral system.

Neon Playroom on a product surface means we keep the source DNA — Midnight Abyss canvas, Lime Squeeze CTAs, accents earned not sprinkled — and interpret the brand-flavored padding/radius scale down for app density. Specifically:

- **Display type** (165px / 117px / 108px) is reserved for empty states, hero moments, and a single landmark per screen. Working UI tops out at `heading-lg`.
- **Card padding** in brand land was 55.8 / 65.7 / 108. In product land we read those as a *generosity signal* — pick from the spacing scale (22 / 26 / 36 / 41) so chrome doesn't eat content.
- **Heavy radii** (43.2px+) belong to feature cards and decorative blocks, not every panel. Inputs and toolbar pills use the buttons radius (25.146px) or the smaller links radius (20.7px).

## Tokens — Colors

OKLCH equivalents are noted for any case we need transparency math; the canonical values are the hexes from the source guide.

| Name | Hex | OKLCH | Token | Role |
|------|-----|-------|-------|------|
| Midnight Abyss | `#141414` | `oklch(20% 0 0)` | `--color-midnight-abyss` | Page background, primary text on light, prominent borders, deep fills |
| Ghost White | `#fdf9f0` | `oklch(98% 0.012 90)` | `--color-ghost-white` | Inverted panels, text on dark, soft warm contrast |
| Lime Squeeze | `#c7ff69` | `oklch(95% 0.22 124)` | `--color-lime-squeeze` | Primary action, active nav, highlight links |
| Amethyst Glow | `#7a78ff` | `oklch(63% 0.22 280)` | `--color-amethyst-glow` | Decorative cards, abstract graphics, playful accent |
| Sunset Orange | `#ff6d38` | `oklch(70% 0.20 40)` | `--color-sunset-orange` | Decorative fills, warmth |
| Emerald Sprint | `#00a652` | `oklch(60% 0.18 150)` | `--color-emerald-sprint` | Decorative cards, abstract graphics |
| Skybound Blue | `#478bff` | `oklch(65% 0.20 260)` | `--color-skybound-blue` | Illustrative, cool counterweight |
| Golden Rod | `#ffc412` | `oklch(85% 0.17 90)` | `--color-golden-rod` | Illustrative highlight |
| Lavender Mist | `#ccccff` | `oklch(85% 0.06 280)` | `--color-lavender-mist` | Muted card variant |

### Color strategy

**Committed.** Midnight Abyss carries ~75% of the surface. Lime Squeeze is the singular primary action color and never gets diluted with siblings. The remaining accents (Amethyst, Sunset, Emerald, Sky, Golden, Lavender) are *decorative-only* — used on info cards, decorative shapes, and the occasional state indicator. Never on text, never on chrome.

### Forbidden pairings

- Accent on accent for text. Amethyst text on Sunset background never happens.
- More than two accents visible in the same viewport region. One per zone.
- Saturated accent for body copy of any size. Reserved for backgrounds and graphic fills.

## Tokens — Typography

### Aeonik (Inter as substitute) · `--font-aeonik`

Body, navigation, button labels. Precise and legible.

- **Weights:** 400, 500, 700
- **Sizes:** 11 / 12 / 13 / 14 / 16 / 18px
- **Letter spacing:** +0.015em at 11px → −0.020em at 18px (tightens as size grows)
- **Line height:** 0.85 (caption), 1.00 (body), 1.20 (subheading)

### OldschoolGrotesk (Bebas Neue as substitute) · `--font-oldschoolgrotesk`

Display and section headings only. Compressed, condensed, commanding.

- **Weights:** 800, 900
- **Sizes:** 22 / 32 / 36 / 54 / 83 / 108 / 117 / 135 / 165px
- **Letter spacing:** −0.020em at 22–36, −0.030em at 54–135, −0.040em at 165
- **Line height:** 0.80 (display), 0.90 (heading-lg), 1.10 (heading)

### Type scale

| Role | Family | Size | Line | Tracking | Token |
|------|--------|------|------|----------|-------|
| caption | Aeonik 500 | 11px | 0.85 | 0.165px | `--text-caption` |
| body | Aeonik 400 | 14px | 1.0 | 0.14px | `--text-body` |
| subheading | Aeonik 500 | 18px | 1.2 | −0.36px | `--text-subheading` |
| heading | OldschoolGrotesk 900 | 22px | 0.8 | −0.44px | `--text-heading` |
| heading-lg | OldschoolGrotesk 900 | 36px | 0.9 | −0.72px | `--text-heading-lg` |
| display | OldschoolGrotesk 900 | 165px | 0.8 | −6.6px | `--text-display` |

**Pairing rule.** Display/heading/heading-lg = OldschoolGrotesk. Everything else = Aeonik. Never use the display family for inline labels or for anything below 22px.

## Tokens — Spacing & Shape

**Density:** comfortable. The source guide uses an unconventional scale (6, 7, 9, 14, 18, 21–29, 36, 41, 66, 72). We keep those tokens exactly. Most product chrome lives in 14 / 18 / 22 / 26 / 36.

### Spacing scale

`6 7 9 14 18 21 22 23 26 27 28 29 36 41 66 72` (all px)

Layout defaults:
- **Section gap:** 27px
- **Card padding:** 26px
- **Element gap:** 18px

### Radius

| Token | Value | Used for |
|-------|-------|----------|
| `--radius-sm` | 2.7px | Hairline accents (rare) |
| `--radius-links` | 20.7px | Inline links, small chips |
| `--radius-buttons` | 25.146px | All buttons, prompt-bar pills, inputs |
| `--radius-cards` | 43.2px | Feature cards, thread bubbles |
| `--radius-3xl-2` | 28.8px | Mid surfaces (between buttons and cards) |
| `--radius-full-3` | 64.8px | FAQ-style oversized cards |
| `--radius-full-4` | 82.2857px | Asymmetric decorative blobs |
| `--radius-tags` | 1000px | Pills, tags, dot indicators |

**Concentric rule.** Outer radius = inner radius + padding. A 43.2px card with 26px pad demands child elements at ≤17.2px radius. Never match radii on nested surfaces.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Canvas | `#141414` | Page background. Default. |
| 1 | Ghost White Panel | `#fdf9f0` | Inverted regions: side panels, info cards, the prompt bar's compose surface (TBD by shape). |
| 2 | Accent Card Surface | accent color | Feature cards, hero blocks, decorative containers. Rare in product chrome. |

### Elevation

No shadows. Depth is established through color contrast, radius variation, and explicit borders. If something needs to feel raised, swap surface levels or add a 1.5px Midnight Abyss border, never a drop shadow.

## Components

### Primary Action Button — `--radius-buttons` 25.146px
- Background: Lime Squeeze (`#c7ff69`)
- Text: Midnight Abyss, Aeonik 500, 14px
- Padding: 8px vertical, 25.848px horizontal
- States: hover lifts brightness, active scales to 0.96, focus shows 2px Midnight Abyss outline-offset:2px
- One per screen region. Generate is the canonical use.

### Ghost Border Button — `--radius-buttons` 25.146px
- Background: transparent
- Text: contextual (Ghost White on Midnight, Midnight on Ghost)
- Border: 1.5px solid matching the text color
- Padding: 0 vertical, 25.848px horizontal (relies on text leading for height)
- Used for secondary actions. Never two filled buttons in one zone.

### Toolbar Pill (product-specific) — `--radius-buttons`
- Background: transparent or Ghost White at 6% opacity
- Border: 1.5px Ghost White at 18% opacity
- Padding: 7px 14px
- Holds inline settings (model, ratio, duration) inside the prompt bar
- Active state replaces border with full-opacity Ghost White

### Info Card (Solid Color) — `--radius-cards` 43.2px
- Solid accent background, Midnight Abyss text
- Padding: 26px (default) → 36–41px for hero
- One accent per card; cards in a row alternate accents intentionally, never randomly

### Thread Bubble (product-specific) — `--radius-cards`
- Background: Midnight Abyss with 1.5px Ghost White at 12% border
- Padding: 22px
- Contains a prompt + its generation grid
- The active/most recent bubble gets a 1.5px Lime Squeeze border instead

### FAQ Accordion Card (brand context only) — `--radius-full-3` 64.8px
- Ghost White background, Midnight Abyss text
- Padding: 55.8 / 65.7 / 108 (top / horizontal / bottom)
- For the marketing/empty-state landing region only

### Small Decorative Card
- Asymmetric radius (`82.2857px / 57.6px`) on an accent fill
- For visual punctuation around hero moments. Not chrome.

### Navigation Link
- No padding, no border. Aeonik 500.
- Active gets a 1.5px Lime Squeeze underline; hover gets a 1.5px Midnight Abyss underline.

## Motion

- Ease-out-quint `cubic-bezier(0.22, 1, 0.36, 1)` for everything that responds to user input.
- Ease-out-expo `cubic-bezier(0.16, 1, 0.3, 1)` for entrances longer than 240ms.
- Press feedback: `scale(0.96)` on `:active`. Always 0.96, never lower.
- Hover lifts: brightness or border-opacity changes; no `transform: translateY` on buttons.
- No bounce, no elastic, no spring overshoot.
- Respect `prefers-reduced-motion` for any animation over 220ms.

## Imagery

Abstract, geometric, playful illustration on accent fills. Filled monochrome icons (Midnight Abyss on light surfaces, Ghost White on dark). No outline-style icons mixed in.

For generated content (the actual point of the product), images render at their native aspect, on a Midnight Abyss bed, with a 1.5px Ghost White at 8% outer border. No drop shadows.

## Layout

Full-bleed Midnight Abyss canvas. Inverted Ghost White regions appear as discrete sections, not as the dominant surface. Section rhythm comes from alternating these two surfaces with occasional accent cards.

For `/my-way`:
- Thread occupies the central column, max-width ~720px on desktop.
- Prompt bar pins to the bottom of the viewport, full-width inside its column, with a 27px gap above it.
- Header is sticky-top, 1.5px Ghost White at 12% bottom border. Brand wordmark left, mode switcher centered, profile/library right.
- Empty state replaces the thread with a single display-typography moment: a 108px+ OldschoolGrotesk wordmark in Ghost White, optionally with one decorative accent shape.

## Do / Don't

### Do
- Use Midnight Abyss as the default; reach for Ghost White panels deliberately, not by default.
- Reserve Lime Squeeze for the singular primary action per zone.
- Use OldschoolGrotesk 800/900 for headlines only. Never inline.
- Hold negative letter-spacing on display type (−0.030 to −0.040em) to keep it dense and confident.
- Vary card radii intentionally (43.2 / 64.8 / asymmetric) so two adjacent cards don't read as siblings.
- Use 1.5px solid borders, never wider, never dashed.

### Don't
- Don't use saturated accents for text or chrome.
- Don't ship a shadow. Use surface/border contrast.
- Don't introduce a new color outside the nine tokens.
- Don't mix outline icons with the filled-icon system.
- Don't add a third button variant. Filled lime, ghost border, that's it.
- Don't apply hero padding (55.8+ vertical) to working UI.

## Quick CSS reference

```css
:root {
  /* Colors */
  --color-midnight-abyss: #141414;
  --color-ghost-white: #fdf9f0;
  --color-lime-squeeze: #c7ff69;
  --color-amethyst-glow: #7a78ff;
  --color-sunset-orange: #ff6d38;
  --color-emerald-sprint: #00a652;
  --color-skybound-blue: #478bff;
  --color-golden-rod: #ffc412;
  --color-lavender-mist: #ccccff;

  /* Typography families */
  --font-aeonik: 'Aeonik', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-oldschoolgrotesk: 'OldschoolGrotesk', 'Bebas Neue', 'Inter', ui-sans-serif, sans-serif;

  /* Type scale */
  --text-caption: 11px;     --leading-caption: 0.85;     --tracking-caption: 0.165px;
  --text-body: 14px;        --leading-body: 1;           --tracking-body: 0.14px;
  --text-subheading: 18px;  --leading-subheading: 1.2;   --tracking-subheading: -0.36px;
  --text-heading: 22px;     --leading-heading: 0.8;      --tracking-heading: -0.44px;
  --text-heading-lg: 36px;  --leading-heading-lg: 0.9;   --tracking-heading-lg: -0.72px;
  --text-display: 165px;    --leading-display: 0.8;      --tracking-display: -6.6px;

  /* Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-6: 6px;   --spacing-7: 7px;   --spacing-9: 9px;   --spacing-14: 14px;
  --spacing-18: 18px; --spacing-21: 21px; --spacing-22: 22px; --spacing-23: 23px;
  --spacing-26: 26px; --spacing-27: 27px; --spacing-28: 28px; --spacing-29: 29px;
  --spacing-36: 36px; --spacing-41: 41px; --spacing-66: 66px; --spacing-72: 72px;

  /* Layout */
  --section-gap: 27px;
  --card-padding: 26px;
  --element-gap: 18px;

  /* Radii */
  --radius-sm: 2.7px;
  --radius-links: 20.7px;
  --radius-buttons: 25.146px;
  --radius-3xl-2: 28.8px;
  --radius-cards: 43.2px;
  --radius-full: 60px;
  --radius-full-2: 62.208px;
  --radius-full-3: 64.8px;
  --radius-full-4: 82.2857px;
  --radius-tags: 1000px;

  /* Motion */
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```
