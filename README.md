# FSD Shopping Cart

Learning project for **Harness Engineering** — a self-enforcing repository where architecture rules are embedded into tooling, not memorized by developers.

## Stack

React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, ESLint 9, Steiger (FSD linter).

## Quick Start

```bash
npm install
npm run dev
```

## Commands

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start dev server              |
| `npm run build`   | Type-check + production build |
| `npm run lint`    | ESLint                        |
| `npm run preview` | Preview production build      |

## Architecture

The project follows [Feature-Sliced Design](https://feature-sliced.design/) (FSD):

```
app → pages → widgets → features → entities → shared
```

Dependencies flow top-to-bottom only. No cross-slice imports. Every slice exposes a single `index.ts` as its public API.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — system patterns, data flow, definition of done
- [CONVENTIONS.md](./CONVENTIONS.md) — machine-enforceable rules
- [AGENTS.md](./AGENTS.md) — instructions for AI coding agents
