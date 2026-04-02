# CLAUDE.md

## Project Overview

FSD Shopping Cart — learning project for **Harness Engineering** (self-enforcing repository design).
**Stack:** Vite + React 19 + TypeScript 5.9.
**Architecture:** Feature-Sliced Design (FSD).

## Commands

- `npm run dev` — start dev server
- `npm run build` — type-check + build (`tsc -b && vite build`)
- `npm run lint` — ESLint
- `npm run lint:arch` — Steiger (FSD architecture linter)
- `npm run preview` — preview production build

## FSD Architecture

Layer hierarchy (top → bottom, NEVER reverse):

```
app → pages → widgets → features → entities → shared
```

Each layer imports ONLY from layers below. No sideways imports within the same layer (except `shared`).

### Folder Structure

```
src/
├── app/              # Providers, routing, global styles
├── pages/            # Page compositions
├── widgets/          # Self-contained UI blocks
├── features/         # User interactions + business logic
├── entities/         # Business objects (Product, CartItem)
└── shared/           # Reusable infrastructure (ui/, lib/, api/, config/)
```

### Import Invariants

| Rule | Meaning |
|------|---------|
| **No cross-slice imports** | `features/cart` cannot import from `features/wishlist` |
| **No layer violation** | Lower layers cannot import from upper layers |
| **Public API only** | Import from slice `index.ts` only, never from internal paths |

### Adding a Slice

1. Create `src/<layer>/<slice-name>/`
2. Create `index.ts` as public API — export ONLY what other layers need
3. Internal folders: `ui/`, `model/`, `api/` as needed
4. Run `npm run lint` before committing

## Agent Workflow

```
1. Explore current file structure (ls/glob src/) before writing code
2. Write code
3. npm run lint → fix errors → repeat until 0
4. npm run lint:arch → fix errors → repeat until 0
5. npm run build → fix errors → repeat until 0
6. Done only when ALL commands exit 0
```

## Communication

- **Language:** Russian for conversation, English for all code/docs/comments
- **Tone:** Concise, no fluff. Military analogies welcome.
- **Proactivity:** Do the task first, mention gaps briefly after.
