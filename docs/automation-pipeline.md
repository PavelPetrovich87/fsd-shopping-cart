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
│     Lint + Arch      │     Catches: FSD violations, type errors, broken imports,
│     + Build + SB     │            Storybook build failures
│     (whole src/)     │     Speed: ~8-20 seconds
└─────────┬───────────┘
          │ git push succeeds
          ▼
┌─────────────────────┐
│  3. CI/CD            │  ← Clean-room validation. Runs on GitHub after push.
│     GitHub Actions   │     Catches: "works on my machine" problems, test failures
│     (fresh install)  │     Speed: ~60-120 seconds
└─────────────────────┘
```

## Why Three, Not One?

| Problem                                      | Pre-commit |  Pre-push  |     CI     |
| -------------------------------------------- | :--------: | :--------: | :--------: |
| `export default` in a .tsx file              | ✅ catches | ✅ catches | ✅ catches |
| `features/cart` imports from `features/auth` |     —      | ✅ catches | ✅ catches |
| Type error in a component                    |     —      | ✅ catches | ✅ catches |
| Storybook build failure                      |     —      | ✅ catches | ✅ catches |
| Unit test failure                            |     —      |     —      | ✅ catches |
| Storybook browser test failure (a11y)        |     —      |     —      | ✅ catches |
| Forgot to run `npm install` after pulling    |     —      |     —      | ✅ catches |
| Different Node.js version breaks build       |     —      |     —      | ✅ catches |

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
import { useAuth } from '@/features/auth'
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
  > pre-push: lint ✅ (3.1s)
  > pre-push: steiger ✅ (2.1s)
  > pre-push: build ✅ (4.3s)
  > pre-push: build-storybook ✅ (3.0s)
  ✅ Pushed.

  > CI: lint ✅ → lint:arch ✅ → validate:arch ✅ → build ✅ → test:unit ✅ → test:storybook ✅ → build-storybook ✅ (90s)
  ✅ PR ready for review.
```

Total overhead in your workflow: ~13 seconds locally. You don't even notice it.

---

## What Goes Where (Summary)

```
PRE-COMMIT (lint-staged)          PRE-PUSH                    CI (GitHub Actions)
┌───────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│ ESLint on staged files │  │ npm run lint            │  │ npm ci                 │
│                        │  │ npm run lint:arch       │  │ npm run format:check   │
│ • no-default-export    │  │ npm run validate:arch   │  │ npm run lint           │
│ • no-nested-components │  │ npm run build           │  │ npm run lint:arch      │
│ • import-locality      │  │ npm run build-storybook │  │ npm run validate:arch  │
│ • TS/React rules       │  │                         │  │ npm run build          │
│                        │  │ • FSD layer violations  │  │ npm run test:unit      │
│ Speed: ~1-3s           │  │ • type errors           │  │ npm run test:storybook │
│ Scope: changed files   │  │ • broken imports        │  │ npm run build-storybook│
│                        │  │ • SB build failures     │  │                        │
│                        │  │ Speed: ~8-20s           │  │ • Everything above     │
│                        │  │ Scope: whole project    │  │ • Clean environment    │
│                        │  │                         │  │ Speed: ~60-120s        │
└───────────────────────┘  └────────────────────────┘  └────────────────────────┘
```

## Tools

| Tool               | Purpose                                  | Install                    |
| ------------------ | ---------------------------------------- | -------------------------- |
| **Husky**          | Manages git hooks (pre-commit, pre-push) | `npm i -D husky`           |
| **lint-staged**    | Runs linters only on staged files        | `npm i -D lint-staged`     |
| **GitHub Actions** | CI/CD in the cloud                       | `.github/workflows/ci.yml` |
