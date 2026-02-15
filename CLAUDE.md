# CLAUDE.md

This file provides guidance for AI assistants working with the ArtifactBin Deploy Template codebase.

## Project Overview

ArtifactBin Deploy Template is a **Next.js 14 App Router** project (TypeScript) that serves as a quick-deploy scaffold for [ArtifactBin.com](https://artifactbin.com). Users paste AI-generated React components into `src/app/page.tsx` and deploy to Vercel. The project ships with the full **shadcn/ui** component library, Tailwind CSS, and common utility dependencies pre-configured.

## Tech Stack

- **Framework:** Next.js 14.2.5 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI Library:** React 18
- **Styling:** Tailwind CSS 3.4 with CSS custom properties (HSL-based theming)
- **Component Library:** shadcn/ui (built on Radix UI primitives + class-variance-authority)
- **Icons:** Lucide React, Phosphor Icons
- **Charts:** Recharts
- **Date Utils:** date-fns

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, metadata, footer)
│   ├── page.tsx                # Main page — user injection point for components
│   ├── globals.css             # Tailwind directives + CSS variable theme tokens
│   └── api/
│       └── placeholder/
│           └── [...path]/
│               └── route.ts    # Edge API: generates placeholder images (GET /api/placeholder/{w}/{h})
├── components/
│   └── ui/
│       ├── index.ts            # Barrel export of all shadcn/ui components
│       ├── button.tsx          # ~35+ shadcn/ui components (accordion, dialog, form, etc.)
│       └── ...
└── lib/
    └── utils.ts                # cn() helper (clsx + tailwind-merge)
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

There is no test runner configured. No test framework (Jest, Vitest, etc.) is installed.

## Key Architecture Details

### Build Configuration

- **TypeScript errors are ignored during build** (`ignoreBuildErrors: true` in `next.config.mjs`)
- **ESLint errors are ignored during build** (`ignoreDuringBuilds: true` in `next.config.mjs`)
- These settings exist because user-pasted components may have type or lint issues

### Import Alias

The `@/*` path alias resolves to `./src/*`. Use it for all imports:
```ts
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
```

### Component Conventions

- All UI primitives live in `src/components/ui/` and follow **shadcn/ui** patterns
- Components use `class-variance-authority` (CVA) for variant definitions
- Use the `cn()` helper from `@/lib/utils` for conditional class composition
- Components are barrel-exported from `src/components/ui/index.ts`

### Styling Conventions

- Use Tailwind utility classes as the primary styling mechanism
- Theme tokens are defined as CSS custom properties (HSL values) in `globals.css`
- Dark mode uses the `class` strategy (toggle via `dark` class on `<html>`)
- Design token colors: `background`, `foreground`, `primary`, `secondary`, `destructive`, `muted`, `accent`, `popover`, `card`, `border`, `input`, `ring`

### API Routes

- Placeholder image API: `GET /api/placeholder/{width}/{height}` — runs on Edge runtime, returns a generated image via `next/og` `ImageResponse`

### Linting

- ESLint with `next/core-web-vitals` ruleset (`.eslintrc.json`)
- No Prettier configuration

## Important Notes

- `src/app/page.tsx` is intentionally a near-empty placeholder — it is the user's injection point
- The root layout includes a persistent "Deployed by Artifact Bin" footer
- No CI/CD pipelines are configured in the repository
- No test infrastructure exists — there are no test files or test runner configurations
- Radix UI packages are used transitively by shadcn components
