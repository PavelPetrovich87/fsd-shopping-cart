# Cart Actions Feature — Tasks

**Mission:** 011-cart-actions-feature
**Created:** 2026-04-14
**Spec:** `kitty-specs/011-cart-actions-feature/spec.md`
**Plan:** `kitty-specs/011-cart-actions-feature/plan.md`

---

## Subtask Index

| ID | Description | WP | Parallel | Dependencies |
|----|-------------|-----|----------|--------------|
| T001 | Create `features/cart-actions` directory structure | WP01 | — | — | [D] |
| T002 | Implement `model/errors.ts` — CartActionsError types | WP01 | [P] | T001 | [D] |
| T003 | Implement `model/results.ts` — Result types | WP01 | [P] | T001 | [D] |
| T004 | Implement `AddToCart` use case | WP02 | — | T002, T003 | [D] |
| T005 | Write `AddToCart` unit tests | WP02 | — | T004 | [D] |
| T006 | Implement `RemoveFromCart` use case | WP03 | [P] | T002, T003 | [D] |
| T007 | Write `RemoveFromCart` unit tests | WP03 | — | T006 | [D] |
| T008 | Implement `ChangeCartItemQuantity` use case | WP03 | [P] | T002, T003 | [D] |
| T009 | Write `ChangeCartItemQuantity` unit tests | WP03 | — | T008 | [D] |
| T010 | Create `model/index.ts` — re-exports | WP04 | — | T004, T006, T008 | [D] |
| T011 | Create `index.ts` — public API | WP04 | — | T010 | [D] |
| T012 | Run quality gates (lint, typecheck, tests) | WP04 | — | T011 | [D] |

---

## Work Package WP01 — Foundation: Types & Errors

**Goal:** Create shared type definitions (errors + results) that all use cases depend on.

**Priority:** 1 (Foundation — unblocks all other WPs)

**Testable independently:** Yes — types have no runtime behavior, only compile-time validation.

**Included Subtasks:**
- [x] T001 — Create `features/cart-actions` directory structure
- [x] T002 — Implement `model/errors.ts` — CartActionsError types
- [x] T003 — Implement `model/results.ts` — Result types

**Implementation Sketch:**
1. Create `src/features/cart-actions/model/` directory structure
2. Create `model/errors.ts` with the `CartActionsError` discriminated union (4 variants: InsufficientStockError, StockConflictError, CartNotModifiableError, ItemNotFoundError)
3. Create `model/results.ts` with `AddToCartResult`, `RemoveFromCartResult`, `ChangeCartItemQuantityResult` discriminated unions
4. Verify TypeScript compilation for both files

**Parallel Opportunities:** T002 and T003 can be created in parallel (both depend only on T001)

**Risks:** Low — pure type definitions, no business logic

---

## Work Package WP02 — AddToCart Use Case

**Goal:** Implement `AddToCart(skuId, quantity)` use case with full stock validation and unit tests.

**Priority:** 2 (Core user-facing functionality)

**Testable independently:** Yes — mocks all dependencies

**Included Subtasks:**
- [x] T004 — Implement `AddToCart` use case
- [x] T005 — Write `AddToCart` unit tests

**Implementation Sketch:**
1. Create `model/add-to-cart.ts` with async function:
   - Accept: `skuId`, `quantity`, `cartRepo`, `stockRepo`, `eventBus`
   - Check cart state (must be Active)
   - Check stock via `stockRepo.findBySku()` → handle ItemNotFoundError
   - Validate quantity <= availableStock → InsufficientStockError
   - Double-check stock before save (race condition) → StockConflictError
   - Call `cart.addItem()`
   - Call `cartRepo.saveCart()`
   - Publish `ItemAddedToCart` event
   - Return `{ success: true, cart, event }` or `{ success: false, error }`
2. Create `model/add-to-cart.test.ts` with describe blocks:
   - Happy path: adds new item, increments existing
   - Insufficient stock error
   - Cart not modifiable (checkout pending) error
   - Item not found error
   - Stock conflict (race) error
   - Verify eventBus.publish called
   - Verify cartRepo.saveCart called

**Risks:** Medium — must correctly check and handle all error conditions

---

## Work Package WP03 — RemoveFromCart + ChangeCartItemQuantity

**Goal:** Implement remaining two use cases with unit tests.

**Priority:** 2 (Core user-facing functionality)

**Testable independently:** Yes — mocks all dependencies

**Included Subtasks:**
- [x] T006 — Implement `RemoveFromCart` use case
- [x] T007 — Write `RemoveFromCart` unit tests
- [x] T008 — Implement `ChangeCartItemQuantity` use case
- [x] T009 — Write `ChangeCartItemQuantity` unit tests

**Implementation Sketch:**

### RemoveFromCart (T006-T007):
1. Create `model/remove-from-cart.ts`:
   - Accept: `skuId`, `cartRepo`, `eventBus`
   - Check cart state (must be Active)
   - Call `cart.removeItem(skuId)`
   - Call `cartRepo.saveCart()`
   - Publish `ItemRemovedFromCart` event
   - Return success/error result
2. Tests: happy path, cart not modifiable error, item not found error

### ChangeCartItemQuantity (T008-T009):
1. Create `model/change-quantity.ts`:
   - Accept: `skuId`, `newQuantity`, `cartRepo`, `stockRepo`, `eventBus`
   - Enforce newQuantity >= 1 (return error for 0 — should be remove)
   - Check cart state (must be Active)
   - Check stock via `stockRepo.findBySku()`
   - Validate newQuantity <= availableStock
   - Double-check stock before save
   - Call `cart.changeQuantity(skuId, newQuantity)`
   - Save, publish event, return result
2. Tests: happy path (increase/decrease), quantity < 1 error, insufficient stock, cart not modifiable, stock conflict

**Parallel Opportunities:** T006 and T008 can be implemented in parallel (independent use cases)

**Risks:** Medium — ChangeQuantity has most error variants

---

## Work Package WP04 — Exports & Quality Gates

**Goal:** Create public API surface and verify all quality gates pass.

**Priority:** 3 (Final integration)

**Testable independently:** No — requires all preceding WPs

**Included Subtasks:**
- [x] T010 — Create `model/index.ts` — re-exports
- [x] T011 — Create `index.ts` — public API
- [x] T012 — Run quality gates (lint, typecheck, tests)

**Implementation Sketch:**
1. Create `model/index.ts` — re-export all use cases and types
2. Create `index.ts` — re-export from model/index.ts (public API)
3. Run quality gates:
   - `npm run lint` — ESLint + React rules
   - `npm run lint:arch` — FSD architecture linter
   - `npm run build` — TypeScript + Vite bundle
   - `npm test` — All unit tests pass

**Risks:** Low — straightforward exports, standard quality checks

---

## Dependencies Summary

```
WP01 (Foundation)
  └─ WP02 (AddToCart)
  └─ WP03 (RemoveFromCart + ChangeQuantity)
        └─ WP04 (Exports + Quality Gates)
```

**Note:** WP02 and WP03 can run in parallel after WP01 (both depend on shared types from WP01).

---

## Size Summary

| WP | Subtasks | Est. Lines | Status |
|----|----------|------------|--------|
| WP01 | 3 | ~250 | OK |
| WP02 | 2 | ~350 | OK |
| WP03 | 4 | ~500 | OK |
| WP04 | 3 | ~200 | OK |

**Size Validation:** ✓ All WPs within 3-7 subtasks, <500 lines

---

## Next Step

Run `/spec-kitty.tasks` finalize to create WP prompt files and commit to target branch.
