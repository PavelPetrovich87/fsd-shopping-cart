# FSD Shopping Cart

Learning project for **Harness Engineering** — a self-enforcing repository where architecture rules are embedded into tooling, not memorized by developers.

## Stack

React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, ESLint 9, Steiger (FSD linter), Vitest Browser Mode, MSW, Chromatic.

## Quick Start

```bash
npm install
npm run dev
```

## Commands

| Command                   | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `npm run dev`             | Start Vite dev server                             |
| `npm run build`           | Type-check + production build                     |
| `npm run lint`            | ESLint                                            |
| `npm run lint:arch`       | Steiger FSD architecture linter                   |
| `npm run validate:arch`   | Validate `ARCHITECTURE.md` against actual imports |
| `npm run test:unit`       | Run unit/domain tests                             |
| `npm run test:storybook`  | Run Storybook stories in Vitest Browser Mode      |
| `npm test`                | Run unit tests + Storybook browser tests          |
| `npm run storybook`       | Start Storybook locally                           |
| `npm run build-storybook` | Build static Storybook                            |
| `npm run chromatic:local` | Publish Storybook to Chromatic (local, no fails)  |
| `npm run chromatic`       | Publish Storybook to Chromatic (CI-like)          |
| `npm run preview`         | Preview production build                          |

## UI Testing Harness

This project uses Storybook as the source of truth for UI examples. Stories are tested at multiple levels:

1. **Storybook** — manual component inspection
2. **Vitest Browser Mode** — render, interaction, and accessibility checks
3. **Chromatic** — visual regression testing
4. **MSW** — deterministic API mocking in stories

### Storybook

```bash
npm run storybook
```

Opens at: `http://localhost:6006`

### Storybook browser tests

```bash
npm run test:storybook
```

Runs stories in Chromium via Vitest. Fails on accessibility violations because a11y addon is set to `test: 'error'`.

### Chromatic

Load the local token first:

```bash
set -a
source .env.chromatic
set +a
```

Then:

```bash
npm run chromatic:local
```

Chromatic builds Storybook, uploads it, captures screenshots, and compares against approved baselines. Use `--exit-zero-on-changes` locally so visual differences do not block your workflow.

For CI:

```bash
npm run chromatic
```

## Git Hooks

Before pushing, Husky runs:

```bash
lint:arch && validate:arch && build && build-storybook && test:storybook
```

This guards architecture, production build, Storybook build, and UI tests.

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
