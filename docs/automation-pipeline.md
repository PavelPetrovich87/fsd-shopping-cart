# Automation Pipeline: Defense in Depth

Three checkpoints catch violations at different stages. Each one is a fallback for the previous.

## The Three Lines of Defense

```
Developer writes code
        │
        ▼
┌─────────────────────┐
│  1. PRE-COMMIT      │  ← Fast, per-file checks. Runs on every commit.
│     lint-staged      │     Catches: syntax errors, bad exports, nested components
│     (ESLint only)    │     Speed: ~1-3 seconds
└─────────┬───────────┘
          │ git commit succeeds
          ▼
┌─────────────────────┐
│  2. PRE-PUSH        │  ← Full project checks. Runs before code leaves your machine.
│     Steiger + Build  │     Catches: FSD violations, type errors, broken imports
│     (whole src/)     │     Speed: ~5-15 seconds
└─────────┬───────────┘
          │ git push succeeds
          ▼
┌─────────────────────┐
│  3. CI/CD            │  ← Clean-room validation. Runs on GitHub after push.
│     GitHub Actions   │     Catches: "works on my machine" problems
│     (fresh install)  │     Speed: ~30-60 seconds
└─────────────────────┘
```

## Why Three, Not One?

| Problem | Pre-commit | Pre-push | CI |
|---------|:----------:|:--------:|:--:|
| `export default` in a .tsx file | ✅ catches | — | ✅ catches |
| `features/cart` imports from `features/auth` | — | ✅ catches | ✅ catches |
| Type error in a component | — | ✅ catches | ✅ catches |
| Forgot to run `npm install` after pulling | — | — | ✅ catches |
| Different Node.js version breaks build | — | — | ✅ catches |

**Rule of thumb:** catch fast what you can, catch everything else before it goes remote.

---

## Scenario 1: Adding a new component

You create `src/features/shopping-cart/ui/CartButton.tsx`:

```tsx
// ❌ You accidentally write:
export default function CartButton() { ... }
```

**What happens:**

```
$ git add src/features/shopping-cart/ui/CartButton.tsx
$ git commit -m "add cart button"

> lint-staged running ESLint on staged files...

ERROR: Prefer named exports (import/no-default-export)
  src/features/shopping-cart/ui/CartButton.tsx:1

❌ Commit BLOCKED. Fix and retry.
```

You fix it to `export function CartButton()`, commit succeeds. ✅

---

## Scenario 2: Illegal cross-slice import

You're in `features/shopping-cart/ui/CartButton.tsx` and import from another feature:

```tsx
// ❌ Cross-feature import
import { useAuth } from '@/features/auth';
```

**What happens:**

```
$ git commit -m "add auth check to cart"
✅ Pre-commit passes (ESLint doesn't check FSD boundaries)

$ git push

> pre-push: running steiger ./src...

ERROR: fsd/no-cross-imports
  Slice "shopping-cart" in "features" should not import from
  slice "auth" in "features"

❌ Push BLOCKED. Fix and retry.
```

You extract the shared logic to `entities/` or compose in a widget. Push succeeds. ✅

---

## Scenario 3: "Works on my machine"

Your teammate pulls your branch. They have Node 18, you have Node 22. Build passes locally for both of you. But in CI:

```
$ npm ci          ← clean install from lock file
$ npm run lint    ← ESLint
$ npm run lint:arch  ← Steiger
$ npm run build   ← TypeScript + Vite

ERROR: Type 'Promise<Response>' is not assignable to type 'Response'
  (API changed between Node versions)

❌ PR check FAILED. GitHub blocks merge.
```

CI caught what local checks couldn't — environment mismatch. ✅

---

## Scenario 4: Everything passes

Normal day. You write good code.

```
$ git commit -m "add product card"
  > lint-staged: ESLint ✅ (1.2s)
  ✅ Committed.

$ git push
  > pre-push: steiger ✅ (2.1s)
  > pre-push: build ✅ (4.3s)
  ✅ Pushed.

  > CI: lint ✅ → lint:arch ✅ → build ✅ (38s)
  ✅ PR ready for review.
```

Total overhead in your workflow: ~7 seconds locally. You don't even notice it.

---

## What Goes Where (Summary)

```
PRE-COMMIT (lint-staged)          PRE-PUSH                    CI (GitHub Actions)
┌───────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│ ESLint on staged files │  │ steiger ./src           │  │ npm ci                 │
│                        │  │ npm run build           │  │ npm run lint           │
│ • no-default-export    │  │                         │  │ npm run lint:arch      │
│ • no-nested-components │  │ • FSD layer violations  │  │ npm run build          │
│ • import-locality      │  │ • cross-slice imports   │  │                        │
│ • TS/React rules       │  │ • type errors           │  │ • Everything above     │
│                        │  │ • broken imports        │  │ • Clean environment    │
│ Speed: ~1-3s           │  │ Speed: ~5-15s           │  │ • Reproducibility      │
│ Scope: changed files   │  │ Scope: whole project    │  │ Speed: ~30-60s         │
└───────────────────────┘  └────────────────────────┘  └────────────────────────┘
```

## Tools

| Tool | Purpose | Install |
|------|---------|---------|
| **Husky** | Manages git hooks (pre-commit, pre-push) | `npm i -D husky` |
| **lint-staged** | Runs linters only on staged files | `npm i -D lint-staged` |
| **GitHub Actions** | CI/CD in the cloud | `.github/workflows/ci.yml` |
