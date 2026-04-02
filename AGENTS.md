# AGENTS.md

Vendor-agnostic instructions for AI coding agents. For deep architectural context, see [ARCHITECTURE.md](./ARCHITECTURE.md). For enforceable rules, see [CONVENTIONS.md](./CONVENTIONS.md).

## Stack

React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, ESLint 9 (flat config), Steiger (FSD linter).

## Architecture: Feature-Sliced Design

```
app → pages → widgets → features → entities → shared
```

**One rule to remember:** dependencies flow DOWN only. Never import from a layer above. Never import across slices on the same layer.

Every slice exposes a single `index.ts` as its public API. Direct imports into internal folders (`ui/`, `model/`, `api/`) from outside the slice are forbidden.

## Commands

```bash
npm run lint        # ESLint — code quality + React rules
npm run lint:arch   # Steiger — FSD architecture linter
npm run build       # tsc -b + vite build — type-check and bundle
```

All commands must exit with code 0. Warnings are errors.

## Workflow

```
1. Explore current file structure (ls/glob src/) before writing code
2. Write code
3. Run: npm run lint
4. Errors? Read the message → fix → go to 3
5. Run: npm run build
6. Errors? Fix → go to 5
7. Done only when ALL commands exit 0
```

Do not skip steps. Do not suppress warnings. The linter is your guide.

## File Structure

```
src/
├── app/                → Providers, routing, global styles
├── pages/              → Route-level composition
├── widgets/            → Self-contained composite UI blocks
├── features/           → User interactions + business logic
│   └── <slice>/
├── entities/           → Business objects + data shapes
│   └── <slice>/
└── shared/             → Reusable, business-agnostic infrastructure
    ├── ui/
    ├── lib/
    ├── api/
    └── config/
```

Slices are added as the project grows. Always check the actual file system for current state — this diagram is a template, not a snapshot.

## Import Rules (Quick Reference)

| Rule | Example of violation |
|------|---------------------|
| No higher-level imports | `entities/` importing from `features/` |
| No cross-slice imports | `features/cart` importing from `features/wishlist` |
| Public API only | `import { X } from '@/features/cart/ui/Button'` |
| Relative inside slice | `import { X } from '@/features/cart/model/store'` inside cart |
| Absolute between slices | `import { X } from '../../entities/product'` |
