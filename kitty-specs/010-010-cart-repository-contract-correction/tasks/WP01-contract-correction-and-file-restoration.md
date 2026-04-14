---
work_package_id: WP01
title: Contract Correction & File Restoration
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
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-010-010-cart-repository-contract-correction
base_commit: f0d3e2c35742cd1acedf3d4b35831cd13044bff1
created_at: '2026-04-14T11:05:46.608593+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
- T007
- T008
shell_pid: '11961'
history: []
authoritative_surface: src/entities/
execution_mode: code_change
owned_files:
- src/entities/coupon/model/ports.ts
- src/entities/product/model/ports.ts
- src/entities/cart/model/ports.ts
- src/entities/cart/api/zustand-cart-repository.ts
- src/entities/cart/api/zustand-cart-repository.integration.test.ts
- src/entities/coupon/index.ts
- src/entities/product/index.ts
tags: []
---

# WP01: Contract Correction & File Restoration

## Work Package Metadata

| Field | Value |
| ----- | ----- |
| **WP ID** | WP01 |
| **Mission** | 010-010-cart-repository-contract-correction |
| **Goal** | Restore async ICartRepository contract and two deleted port files |
| **Priority** | Critical |
| **Execution mode** | code_change |
| **Owned files** | `["src/entities/coupon/model/ports.ts", "src/entities/product/model/ports.ts", "src/entities/cart/model/ports.ts", "src/entities/cart/api/zustand-cart-repository.ts", "src/entities/cart/api/zustand-cart-repository.integration.test.ts", "src/entities/coupon/index.ts", "src/entities/product/index.ts"]` |
| **Authoritative surface** | `src/entities/` |
| **Branch strategy** | Planning base: `main` → Merge target: `main` |
| **Subtasks** | T001, T002, T003, T004, T005, T006, T007, T008 |

---

## Objective

Restore the async `ICartRepository` contract and two port files deleted during the T-009 merge, then verify all quality gates pass.

### Root Cause Summary

1. **ICartRepository sync drift**: T-007 defined async signatures (`getCart(): Promise<Cart>`, `saveCart(): Promise<void>`). The T-009 merge replaced them with sync versions. Downstream consumers expecting `Promise<Cart>` break at runtime.

2. **Deleted port files**: The T-009 merge commit (`8e8c0ab`) silently deleted `src/entities/coupon/model/ports.ts` and `src/entities/product/model/ports.ts`. Both files were created by mission 009 but not present in the T-009 lane branch.

---

## Detailed Guidance by Subtask

### T001: Restore `src/entities/coupon/model/ports.ts`

**Purpose**: Restore the `ICouponRepository` port interface that was deleted during the T-009 merge.

**Steps**:

1. Run: `git show 2c09b43:src/entities/coupon/model/ports.ts` — this retrieves the exact file content from mission 009's branch
2. Write the content to `src/entities/coupon/model/ports.ts`
3. Verify the file now contains:
   ```typescript
   import type { Coupon } from '../index'

   export interface ICouponRepository {
     findByCode(code: string): Promise<Coupon | null>
   }
   ```
4. Verify the file exists on the filesystem with `ls src/entities/coupon/model/ports.ts`

**Files**: `src/entities/coupon/model/ports.ts` (new/ restore from git)

---

### T002: Restore `src/entities/product/model/ports.ts`

**Purpose**: Restore the `IStockRepository` port interface that was deleted during the T-009 merge.

**Steps**:

1. Run: `git show 2c09b43:src/entities/product/model/ports.ts` — retrieves the exact file content from mission 009's branch
2. Write the content to `src/entities/product/model/ports.ts`
3. Verify the file now contains:
   ```typescript
   import type { ProductVariant } from '../index'

   export interface IStockRepository {
     findBySku(skuId: string): Promise<ProductVariant | null>
     save(variant: ProductVariant): Promise<void>
   }
   ```
4. Verify the file exists on the filesystem with `ls src/entities/product/model/ports.ts`

**Files**: `src/entities/product/model/ports.ts` (new/ restore from git)

---

### T003: Revert `src/entities/cart/model/ports.ts` to async signatures

**Purpose**: Restore the async contract that T-007 defined and T-009 mistakenly replaced with sync signatures.

**Steps**:

1. Read `src/entities/cart/model/ports.ts`
2. Change the interface from:
   ```typescript
   export interface ICartRepository {
     getCart(): Cart
     saveCart(cart: Cart): void
   }
   ```
   To:
   ```typescript
   export interface ICartRepository {
     getCart(): Promise<Cart>
     saveCart(cart: Cart): Promise<void>
   }
   ```
3. This file already has the correct import of `Cart` type — no import changes needed

**Files**: `src/entities/cart/model/ports.ts`

**Note**: The `Cart` type is imported from `@/entities/cart` — this import path must remain unchanged.

---

### T004: Update `src/entities/cart/api/zustand-cart-repository.ts` to async adapter

**Purpose**: Update the repository adapter to implement the async interface. The Zustand store is synchronous, so wrap the return values in `Promise.resolve()`.

**Steps**:

1. Read the current `src/entities/cart/api/zustand-cart-repository.ts`
2. Change `getCart()` to return `Promise.resolve(useCartStore.getState().cart)` instead of the raw `Cart`
3. Change `saveCart()` to return `Promise.resolve(undefined)` after calling `replaceCart`
4. The implementation should look like:
   ```typescript
   export const zustandCartRepository: ICartRepository = {
     getCart(): Promise<Cart> {
       return Promise.resolve(useCartStore.getState().cart)
     },
     saveCart(cart: Cart): Promise<void> {
       useCartStore.getState().replaceCart(cart)
       return Promise.resolve(undefined)
     },
   }
   ```

**Files**: `src/entities/cart/api/zustand-cart-repository.ts`

---

### T005: Update integration tests to async API

**Purpose**: Update `zustand-cart-repository.integration.test.ts` to use `await` on all async repository calls.

**Steps**:

1. Read `src/entities/cart/api/zustand-cart-repository.integration.test.ts`
2. Add `await` before each `zustandCartRepository.getCart()` and `zustandCartRepository.saveCart()` call
3. Example transformation:
   - Before: `zustandCartRepository.saveCart(cartWithItem)` / `const retrieved = zustandCartRepository.getCart()`
   - After: `await zustandCartRepository.saveCart(cartWithItem)` / `const retrieved = await zustandCartRepository.getCart()`
4. All 7 test cases need this update
5. Do NOT change any test assertions — only add `await` to the repository calls

**Files**: `src/entities/cart/api/zustand-cart-repository.integration.test.ts`

---

### T006: Restore `ICouponRepository` export in `src/entities/coupon/index.ts`

**Purpose**: Restore the port type export that was removed when `coupon/model/ports.ts` was deleted.

**Steps**:

1. Read `src/entities/coupon/index.ts`
2. Add `export type { ICouponRepository } from './model/ports'` to the type exports section
3. Verify the line appears alongside other type exports

**Files**: `src/entities/coupon/index.ts`

---

### T007: Restore `IStockRepository` export in `src/entities/product/index.ts`

**Purpose**: Restore the port type export that was removed when `product/model/ports.ts` was deleted.

**Steps**:

1. Read `src/entities/product/index.ts`
2. Add `export type { IStockRepository } from './model/ports'` to the type exports section
3. Verify the line appears alongside other type exports

**Files**: `src/entities/product/index.ts`

---

### T008: Run quality gates

**Purpose**: Verify all changes are correct by running the project's quality gates and test suite.

**Steps**:

Run each command in sequence. Stop and fix if any command fails:

1. `npm run lint` — ESLint code quality
2. `npm run lint:arch` — Steiger FSD architecture linter
3. `npm run build` — TypeScript compilation + Vite bundle
4. `npm run test:unit` — All unit tests (including the 131 existing ones)

**Files**: None (verification only)

**Important**: All 4 commands must exit with code 0. If any fail, fix the issue before proceeding.

---

## Branch Strategy

- **Planning base branch**: `main`
- **Final merge target**: `main`
- Worktrees are allocated per computed lane from `lanes.json` — execute within the workspace allocated by `finalize_tasks`

## Test Strategy

This WP has one integration test file that must be updated:
- `src/entities/cart/api/zustand-cart-repository.integration.test.ts` — 7 test cases, all must pass with async API

Unit test file `src/entities/cart/api/cart-store.test.ts` uses the Zustand store directly (not through the repository adapter) and should NOT be modified.

## Definition of Done

- [ ] `src/entities/coupon/model/ports.ts` exists and exports `ICouponRepository`
- [ ] `src/entities/product/model/ports.ts` exists and exports `IStockRepository`
- [ ] `src/entities/cart/model/ports.ts` declares async `getCart(): Promise<Cart>` and `saveCart(): Promise<void>`
- [ ] `src/entities/cart/api/zustand-cart-repository.ts` implements async signatures using `Promise.resolve()`
- [ ] `src/entities/cart/api/zustand-cart-repository.integration.test.ts` uses `await` on all repository calls
- [ ] `src/entities/coupon/index.ts` exports `ICouponRepository` type
- [ ] `src/entities/product/index.ts` exports `IStockRepository` type
- [ ] `npm run lint` exits 0
- [ ] `npm run lint:arch` exits 0
- [ ] `npm run build` exits 0
- [ ] `npm run test:unit` exits 0 (all 131+ tests pass)

## Risks

1. **Other sync consumers**: TypeScript compilation after changing the port interface may reveal other places in the codebase that call `getCart()` expecting a sync return value. If those are in files NOT owned by this WP, they are out of scope — note them and report to the user.

## Reviewer Guidance

- Verify each restored file matches the git content from commit `2c09b43`
- Verify `ICartRepository` interface uses `Promise<Cart>` and `Promise<void>` — NOT raw `Cart` or `void`
- Verify `ZustandCartRepository` wraps sync store calls in `Promise.resolve()`
- Verify all 7 integration tests use `await` on repository calls
- Verify quality gates all pass before approving
