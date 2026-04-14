---
work_package_id: WP01
title: 'Foundation: Types & Errors'
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-006
- FR-007
- FR-008
- FR-009
- FR-010
- FR-011
- FR-012
- FR-013
- FR-014
- FR-015
- FR-016
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-011-cart-actions-feature
base_commit: 596156aabb746b864ae68a8c97348af6ee2fdbbf
created_at: '2026-04-14T12:48:46.185586+00:00'
subtasks:
- T001
- T002
- T003
shell_pid: "11961"
agent: "kilocode:minimax:reviewer:reviewer"
history:
- date: '2026-04-14T12:34:57Z'
  action: created
  note: Initial WP01 creation
authoritative_surface: src/features/cart-actions/model/
execution_mode: code_change
owned_files:
- src/features/cart-actions/model/errors.ts
- src/features/cart-actions/model/results.ts
tags: []
---

# WP01: Foundation — Types & Errors

## Objective

Create the foundational type definitions (`errors.ts` and `results.ts`) that all three use cases depend on. This work package is the foundation for WP02, WP03, and WP04.

## Context

**Feature:** Cart Actions Feature (T-011)
**Mission:** 011-cart-actions-feature
**Spec:** `/Users/user/work/fsd-shopping-cart/kitty-specs/011-cart-actions-feature/spec.md`
**Plan:** `/Users/user/work/fsd-shopping-cart/kitty-specs/011-cart-actions-feature/plan.md`

### Dependencies
- None (WP01 is the foundation)

### What This WP Produces
```
src/features/cart-actions/
└── model/
    ├── errors.ts   # CartActionsError types
    └── results.ts  # Result types for all use cases
```

---

## Subtask T001: Create Directory Structure

**Purpose:** Create the `features/cart-actions/model/` directory structure.

**Steps:**
1. Create directory `src/features/cart-actions/model/`
2. Verify directory exists with `ls src/features/cart-actions/model/`

**Files:**
- `src/features/cart-actions/model/` (directory)

**Validation:**
- [ ] Directory created successfully

---

## Subtask T002: Implement errors.ts — CartActionsError Types

**Purpose:** Define the discriminated union error type that all use cases return for failure cases.

**Steps:**
1. Create `src/features/cart-actions/model/errors.ts`
2. Import `CartState` from `@/entities/cart`
3. Export the `CartActionsError` type as a discriminated union with 4 variants:

```typescript
export type CartActionsError =
  | { type: 'InsufficientStockError'; skuId: string; requested: number; available: number }
  | { type: 'StockConflictError'; skuId: string; requested: number; currentAvailable: number }
  | { type: 'CartNotModifiableError'; currentState: CartState }
  | { type: 'ItemNotFoundError'; skuId: string };
```

**Files:**
- `src/features/cart-actions/model/errors.ts` (new file)

**Validation:**
- [ ] File exports `CartActionsError` type
- [ ] TypeScript compiles without errors
- [ ] All 4 error variants are represented
- [ ] Each variant has appropriate fields (skuId, requested, available/currentState)

---

## Subtask T003: Implement results.ts — Result Types

**Purpose:** Define the discriminated union result types for all three use cases.

**Steps:**
1. Create `src/features/cart-actions/model/results.ts`
2. Import `Cart` from `@/entities/cart`
3. Import `CartActionsError` from `./errors`
4. Import domain event types from `@/entities/cart/model/events`:
   - `ItemAddedToCart`
   - `ItemRemovedFromCart`
   - `CartItemQuantityChanged`
5. Export three result types:

```typescript
import { Cart } from '@/entities/cart';
import { CartActionsError } from './errors';
import {
  ItemAddedToCart,
  ItemRemovedFromCart,
  CartItemQuantityChanged
} from '@/entities/cart/model/events';

export type AddToCartResult =
  | { success: true; cart: Cart; event: ItemAddedToCart }
  | { success: false; error: CartActionsError };

export type RemoveFromCartResult =
  | { success: true; cart: Cart; event: ItemRemovedFromCart }
  | { success: false; error: CartActionsError };

export type ChangeCartItemQuantityResult =
  | { success: true; cart: Cart; event: CartItemQuantityChanged }
  | { success: false; error: CartActionsError };
```

**Files:**
- `src/features/cart-actions/model/results.ts` (new file)

**Validation:**
- [ ] File exports `AddToCartResult`, `RemoveFromCartResult`, `ChangeCartItemQuantityResult`
- [ ] TypeScript compiles without errors
- [ ] Each result type has `success: true` and `success: false` branches
- [ ] Success branches include `cart` and corresponding event
- [ ] Failure branches include `error: CartActionsError`

---

## Implementation Notes

### TypeScript Best Practices
- Use `export type` for type-only exports (allows tree-shaking)
- Discriminated unions enable exhaustive matching in consumers
- All domain types (`Cart`, `CartState`, event types) come from `entities/cart` — no infrastructure leaks

### What NOT To Do
- Do NOT implement any use case logic in this WP
- Do NOT create mock data or fixtures
- Do NOT import from Zustand or infrastructure layers
- Do NOT use `any` type

---

## Definition of Done

1. **T001:** Directory `src/features/cart-actions/model/` exists
2. **T002:** `errors.ts` exports `CartActionsError` with 4 variants — TypeScript compiles
3. **T003:** `results.ts` exports 3 result types — TypeScript compiles
4. **No runtime errors** — pure type definitions, only compile-time validation needed

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Domain event types don't exist yet | Low | High | T-002 (EventBus) is a Tier 1 dependency — should exist. If not, use placeholder or check T-007 ports. |
| CartState enum missing | Low | High | Check `@/entities/cart` exports before implementing |

---

## Reviewer Guidance

When reviewing this WP:
- Verify `CartActionsError` has exactly 4 variants as specified
- Verify result types match the discriminated union pattern
- Ensure no business logic is present (WP01 is pure types)
- Confirm no imports from infrastructure (Zustand, API clients)
- TypeScript compilation is the only gate needed

---

## Next WP

After WP01 completes, WP02 (AddToCart) and WP03 (RemoveFromCart + ChangeCartItemQuantity) can run in parallel since both depend only on the types created here.

## Activity Log

- 2026-04-14T12:48:52Z – kilocode:minimax:implementer:implementer – shell_pid=11961 – Assigned agent via action command
- 2026-04-14T12:51:14Z – kilocode:minimax:implementer:implementer – shell_pid=11961 – Ready for review: errors.ts and results.ts with CartActionsError and result types
- 2026-04-14T12:51:28Z – kilocode:minimax:reviewer:reviewer – shell_pid=11961 – Started review via action command
- 2026-04-14T12:52:12Z – kilocode:minimax:reviewer:reviewer – shell_pid=11961 – Review passed: errors.ts and results.ts with CartActionsError and 3 result types
