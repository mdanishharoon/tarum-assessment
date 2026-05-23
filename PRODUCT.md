# Product

## Register

product

## Users

Designers, product folks, and tinkerers using AI image/video tools who are tired of the same Midjourney/Krea/Leonardo chrome. They prompt iteratively — the first generation is rarely the keeper. They reach for ten tools to do what should be one workflow: generate, branch a variation, mask a region, animate the result, drop in references.

The context is desktop-first creative work: a real screen, real time, a brief in mind. Not casual mobile play.

## Product Purpose

A single, opinionated content studio that treats every generation as a node in a branching thread. Prompt, image, edit, animate, fork. The product collapses the dropdown-festival of typical AI gen tools into one dense, expressive prompt bar that morphs by mode. Inpainting, references, and motion controls are first-class actions, not buried settings.

Success: someone uses `/my-way` for ten minutes and feels like they've been working in a real tool, not an AI demo. They notice the prompt bar before they notice the output.

## Brand Personality

Bold, precise, irreverent.

Linear's discipline applied to a Neon Playroom palette. Rigorous information architecture, exact alignment and motion, then loud color used as punctuation. The interface should feel like it knows what it's doing and isn't afraid to look like it. No quiet defaults, no apologetic chrome.

Voice in copy: short, declarative, occasionally cheeky. Never "AI-assisted." Empty states have opinions.

## Anti-references

- **Generic AI tool chrome.** Midjourney, Krea, Leonardo's default dark-grey backgrounds with a single purple/blue accent. We reject the category reflex. Multiple loud accents, off-white surfaces alongside black, typography that is doing something.
- **Safe SaaS template.** Vercel/Linear/Stripe-flavored grayscale minimalism. We borrow Linear's rigor, not its restraint. Color is a primary tool here, not a garnish.
- **The previous Forge build.** Peach skeuomorphic slabs, raised card edges, conservative chrome. Clean break from anything that came before.

## Design Principles

1. **The prompt bar is the product.** It's the most-used surface; it earns the most love. Every other element supports it. No setting lives in a permanent dropdown if it can live as a slash command or contextual chip.
2. **Mode shapes context, not chrome.** Switching image → video → inpaint morphs the prompt bar in place. No tabs, no separate pages, no different surfaces. The bar grows the controls the user needs right now.
3. **Click the image, not a menu.** Actions on a past generation surface contextually on hover/click. Vary, edit, animate, branch. Right-click and hamburger menus are failures of imagination.
4. **Loud color, earned.** The accents are punctuation: a generate button, an active state, one card per screen. Restraint inside expressiveness, never every chip neon at once.
5. **Pixel-honest.** No vibe-coded blur-everywhere. Every radius, every weight, every motion curve is a decision you can name. If it looks intentional from across the room, it's done.

## Accessibility & Inclusion

Aesthetics-first. No formal WCAG floor.

That said, the design will still:
- Keep visible focus rings on every interactive element.
- Not rely on color alone to signal state; pair with weight, icon, or position.
- Respect `prefers-reduced-motion` where it's cheap.
