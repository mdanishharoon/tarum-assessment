# tarum-assessment

Responsive AI content generation web page — frontend technical assessment.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + CSS Modules
- **Hosting**: Vercel
- **CI**: GitHub Actions (lint, type-check, build)
- **Dev Environment**: Nix (optional) + Bun

## Getting Started

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

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

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

## Deployment

Deployed on [Vercel](https://vercel.com). Connect the GitHub repo via the Vercel dashboard — production deploys run on push to `main`, and every PR gets a preview URL automatically. No workflow file is required for deploys.

## Project Structure

```
src/
  app/          # Next.js App Router pages, layouts, API routes
  components/   # Reusable UI components
  lib/          # Utility functions and shared logic
public/         # Static assets
flake.nix       # Nix dev environment
treefmt.nix     # treefmt config (nix-native)
treefmt.toml    # treefmt config (non-nix fallback)
lefthook.yml    # Git hooks (lint, format, type-check on commit)
```
