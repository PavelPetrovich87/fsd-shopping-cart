# Work Tasks: 010 Cart Repository Contract Correction

## Subtask Index

| ID | Description | WP | Parallel |
| -- | ----------- | -- | -------- |
| T001 | Restore `src/entities/coupon/model/ports.ts` from git `2c09b43` | WP01 | [P] | [D] |
| T002 | Restore `src/entities/product/model/ports.ts` from git `2c09b43` | WP01 | [D] |
| T003 | Revert `src/entities/cart/model/ports.ts` to async `ICartRepository` signatures | WP01 | | [D] |
| T004 | Update `src/entities/cart/api/zustand-cart-repository.ts` to async adapter | WP01 | | [D] |
| T005 | Update `src/entities/cart/api/zustand-cart-repository.integration.test.ts` to async API | WP01 | | [D] |
| T006 | Restore `ICouponRepository` export in `src/entities/coupon/index.ts` | WP01 | [D] |
| T007 | Restore `IStockRepository` export in `src/entities/product/index.ts` | WP01 | [D] |
| T008 | Run quality gates: lint, lint:arch, build, test:unit | WP01 | | [D] |

## Work Packages

### WP01: Contract Correction & File Restoration

**Goal**: Restore the async `ICartRepository` contract and the two deleted port files, then verify all quality gates pass.

**Priority**: Critical (blocks all downstream Tier 4 features)

**Test**: Integration test round-trip + all 131 existing unit tests must pass.

**Included subtasks**:
- [x] T001 — Restore `coupon/model/ports.ts`
- [x] T002 — Restore `product/model/ports.ts`
- [x] T003 — Revert cart `ports.ts` to async signatures
- [x] T004 — Update `zustand-cart-repository.ts` to async adapter
- [x] T005 — Update integration tests to async API
- [x] T006 — Restore `ICouponRepository` export in `coupon/index.ts`
- [x] T007 — Restore `IStockRepository` export in `product/index.ts`
- [x] T008 — Run quality gates

**Implementation sketch**:
1. Use `git show 2c09b43:src/entities/coupon/model/ports.ts` and `git show 2c09b43:src/entities/product/model/ports.ts` to restore the deleted port files
2. Edit `src/entities/cart/model/ports.ts` to change `getCart(): Cart` → `getCart(): Promise<Cart>` and `saveCart(cart: Cart): void` → `saveCart(cart: Cart): Promise<void>`
3. Edit `src/entities/cart/api/zustand-cart-repository.ts` to wrap both methods in `Promise.resolve()` / `Promise.resolve(undefined)`
4. Edit `src/entities/cart/api/zustand-cart-repository.integration.test.ts` to `await` all repository calls
5. Edit `src/entities/coupon/index.ts` to add `export type { ICouponRepository } from './model/ports'`
6. Edit `src/entities/product/index.ts` to add `export type { IStockRepository } from './model/ports'`
7. Run `npm run lint`, `npm run lint:arch`, `npm run build`, `npm run test:unit`

**Parallel opportunities**: T001 and T002 are independent (different files). T006 and T007 are independent (different files). T001/T002 can run in parallel with T003/T004/T005.

**Risks**: TypeScript compilation may reveal other consumers of the sync API that also need updating — if so, those are out of scope for this mission and must be tracked separately.

**Estimated prompt size**: ~400 lines
