---
work_package_id: WP03
title: Public APIs, App Wiring & Quality Gates
dependencies:
- WP01
- WP02
requirement_refs:
- C-003
- FR-005
tracker_refs: []
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this mission were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T008
- T009
- T010
create_intent:
- src/pages/index.ts
agent: "kilo:kimi-k2.7-code::implementer"
shell_pid: "70422"
history:
- date: '2026-07-01'
  agent: kilo
  action: created
  event: WP03 prompt generated
authoritative_surface: src/pages/
execution_mode: code_change
owned_files:
- src/pages/index.ts
- src/pages/App.tsx
tags: []
---

# WP03 — Public APIs, App Wiring & Quality Gates

## Objective

Create the top-level barrel export for the `pages/` slice, update the app entry point to render the new pages, and run all project quality gates to validate correctness.

## Context

- **Mission**: cart-and-home-pages-01KWE4AN
- **Feature Dir**: `/Users/user/work/fsd-shopping-cart/kitty-specs/cart-and-home-pages-01KWE4AN`
- **Spec**: [spec.md](spec.md) — FR-005, C-003
- **Plan**: [plan.md](plan.md) — IC-04
- **Dependencies**: WP01 (HomePage exists), WP02 (CartPage exists)

### Existing App Entry Point

`src/pages/App.tsx` currently contains a boilerplate Vite starter page (React + Vite logos, counter button, links). It will be replaced with a simple composition that renders the new pages.

### FSD Rules

- `src/pages/index.ts` must re-export the public API of all page slices.
- It must NOT create circular imports: individual page slices (e.g., `pages/cart/`) must not re-import from `pages/index.ts`.
- `src/pages/App.tsx` is the app entry point. It may import from `pages/index.ts` or directly from page slices.
- App.tsx is allowed to hold local demo state (e.g., a simple toggle to switch between pages for manual testing).

### Quality Gates

The project uses these commands (from `AGENTS.md`):
1. `npm run lint` — ESLint + React rules. Must exit 0.
2. `npm run lint:arch` — Steiger FSD architecture linter. Must exit 0.
3. `npm run test:unit` — Vitest unit tests. All must pass.
4. `npm run build` — TypeScript + Vite build. Must exit 0.

Warnings are treated as errors.

## Subtasks

### T008 — Create `src/pages/index.ts`

**Purpose**: Re-export CartPage and HomePage from the `pages/` slice public API.

**Steps**:
1. Create `src/pages/index.ts` if it doesn't exist.
2. Re-export from the individual page slices:
   ```typescript
   export { CartPage, type CartPageProps } from './cart'
   export { HomePage } from './home'
   ```
3. Do NOT import from any other layer or create circular dependencies.
4. If `src/pages/index.ts` already exists with other exports, add the new ones without removing existing ones.

**Validation**:
- [ ] `import { CartPage, HomePage } from '@/pages'` works from outside the `pages/` slice.
- [ ] No circular imports are introduced (Steiger will catch this).
- [ ] File does not import from any non-page layer (only from `./cart` and `./home`).

### T009 — Update `src/pages/App.tsx` to render pages

**Purpose**: Replace the boilerplate Vite starter content with a simple demo composition that renders the new CartPage and HomePage.

**Steps**:
1. Read the current `src/pages/App.tsx` to understand its structure.
2. Replace the entire content with a simple composition that renders the pages. Since routing is deferred to T-029, keep the App.tsx minimal:
   - Option A: Render HomePage by default and add a simple toggle to switch to CartPage.
   - Option B: Render both pages stacked vertically for demo purposes.
   - **Recommended**: Option A — a simple toggle using React `useState`:
     ```tsx
     import { useState } from 'react'
     import { HomePage } from './home'
     import { CartPage } from './cart'
     import type { CartListItem, AppliedCoupon } from '@/widgets/cart/model/types'

     const initialItems: CartListItem[] = [
       // ... 2 sample items (same as cart story)
     ]

     export function App() {
       const [page, setPage] = useState<'home' | 'cart'>('home')
       // ... cart state and handlers (same pattern as cart-page story)
       
       return (
         <div className="min-h-screen bg-neutral-50">
           <nav className="border-b border-neutral-200 bg-white px-4 py-3">
             <div className="mx-auto flex max-w-6xl gap-4">
               <button
                 className={`text-sm font-medium ${page === 'home' ? 'text-neutral-900' : 'text-neutral-500'}`}
                 onClick={() => setPage('home')}
               >
                 Home
               </button>
               <button
                 className={`text-sm font-medium ${page === 'cart' ? 'text-neutral-900' : 'text-neutral-500'}`}
                 onClick={() => setPage('cart')}
               >
                 Cart
               </button>
             </div>
           </nav>
           {page === 'home' ? <HomePage /> : <CartPage ... />}
         </div>
       )
     }
     ```
3. Keep the cart state management local to App.tsx (this is demo state, not production state). Follow the same pattern as the existing `cart-page.stories.tsx` for computing totals, handling increments/decrements, and coupon logic.
4. Remove all imports of the old boilerplate files: `reactLogo`, `viteLogo`, `heroImg`, `App.css`.
5. Do NOT leave dead code or unused imports.
6. If the old `App.css` file is no longer needed, you may delete it — but check if anything else imports it.

**Validation**:
- [ ] App.tsx renders without errors in the browser (`npm run dev` or `npm run build` + preview).
- [ ] Home page is visible by default with the 6 product cards.
- [ ] Cart page is accessible via the toggle button and shows cart items + order summary.
- [ ] Empty cart state renders correctly when all items are removed.
- [ ] Coupon "SAVE20" applies correctly in the CartPage demo.
- [ ] No unused imports or dead code remain.
- [ ] `npm run lint` passes on App.tsx.

### T010 — Run quality gates

**Purpose**: Validate that all new files satisfy the project's lint, architecture, test, and build requirements.

**Steps**:
1. Run `npm run lint` in the project root.
2. If errors appear in the new files, fix them immediately. Common issues:
   - Missing `key` props on mapped elements.
   - Incorrect import order (ESLint import/order rule).
   - Unused variables or imports.
   - Missing accessibility attributes.
3. Run `npm run lint:arch` in the project root.
4. If Steiger reports FSD violations, fix them immediately. Common issues:
   - Page importing from another page.
   - Shared module importing from a page.
   - Missing barrel exports.
5. Run `npm run test:unit` in the project root.
6. All 181 tests must pass. If any fail due to the changes, investigate and fix.
7. Run `npm run build` in the project root.
8. The build must complete with no TypeScript errors and no Vite build errors.

**Validation**:
- [ ] `npm run lint` exits with code 0.
- [ ] `npm run lint:arch` exits with code 0.
- [ ] `npm run test:unit` passes all tests (181/181).
- [ ] `npm run build` exits with code 0.
- [ ] No new warnings are introduced.

## Edge Cases & Risks

- **Circular imports**: If `pages/cart/index.ts` or `pages/home/index.ts` accidentally imports from `pages/index.ts`, Steiger will flag it. Ensure barrel exports only import from their own slice internals.
- **App.tsx state management**: Keep the demo state simple. Do not introduce Redux, Zustand, or Context for this mission — local `useState` in App.tsx is sufficient for demo purposes.
- **Existing tests breaking**: If `test:unit` fails, check whether the failure is related to your changes or pre-existing. If related, fix it. If pre-existing, document it but do not let it block the mission.
- **App.css deletion**: Check if any other files import `App.css` before deleting it. If unsure, leave it in place and just remove the import from App.tsx.

## Definition of Done

- All 3 subtasks are implemented and individually validated.
- `src/pages/index.ts` cleanly re-exports CartPage and HomePage.
- `src/pages/App.tsx` renders both pages in a simple demo composition.
- All four quality gates pass: lint, lint:arch, test:unit, build.
- No circular imports or FSD violations.

## Reviewer Guidance

- Verify that `src/pages/index.ts` does not create circular imports with individual page slices.
- Check that App.tsx has no dead code or unused imports from the old boilerplate.
- Confirm that all four quality gates pass in sequence.
- Check that Steiger does not report any new FSD violations.
- If App.css was deleted, verify no other file references it.

## Activity Log

- 2026-07-01T07:33:37Z – kilo:kimi-k2.7-code::implementer – shell_pid=70422 – Assigned agent via action command
- 2026-07-01T07:44:50Z – kilo:kimi-k2.7-code::implementer – shell_pid=70422 – Ready for review
- 2026-07-01T07:46:50Z – kilo:kimi-k2.7-code::reviewer – shell_pid=70422 – Started review via action command
- 2026-07-01T07:52:37Z – user – shell_pid=70422 – Moved to planned
- 2026-07-01T09:11:18Z – kilo:kimi-k2.7-code::implementer – shell_pid=70422 – Started implementation via action command
