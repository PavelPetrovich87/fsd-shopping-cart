# 010 Cart Repository Contract Correction

## Context

During the merge of mission 007 (T-009: Zustand Cart Repository), two critical issues were introduced that broke the existing repository contract established by T-007 (Entity Ports) and the parallel mission 009 (entity-repository-ports).

### Issue 1: ICartRepository Signature Changed from Async to Sync

T-007 defined `ICartRepository` with async signatures:

```typescript
interface ICartRepository {
  getCart(): Promise<Cart>;
  saveCart(cart: Cart): Promise<void>;
}
```

The T-009 merge replaced these with synchronous signatures (`getCart(): Cart`, `saveCart(cart: Cart): void`). Any downstream consumer expecting `Promise<Cart>` from `getCart()` will receive a raw `Cart` and break at runtime. The T-009 spec explicitly stated "T-007 repository port contract (ICartRepository) is available and unchanged" — the merge violated this clause.

### Issue 2: Cross-Mission Port File Deletions

Mission 009 (`009-entity-repository-ports`) created two port files as part of its repository port definitions:

- `src/entities/coupon/model/ports.ts` — `ICouponRepository`
- `src/entities/product/model/ports.ts` — `IStockRepository`

The T-009 merge commit (`8e8c0ab`) silently deleted both files because they did not exist in the T-009 lane branch and were not included in the lane's diff during conflict resolution. This breaks mission 009's consumers that depend on these port interfaces.

## Intent Summary

Restore the original async `ICartRepository` contract, restore the two deleted port files, and update the ZustandCartRepository adapter and integration tests to use the corrected async signatures. No new functionality is being added — this is a corrective action to bring the codebase back into compliance with the established T-007 contract.

## Scope

### In Scope

- Restore `src/entities/coupon/model/ports.ts` with `ICouponRepository` interface
- Restore `src/entities/product/model/ports.ts` with `IStockRepository` interface
- Revert `src/entities/cart/model/ports.ts` to async `ICartRepository` signatures
- Update `src/entities/cart/api/zustand-cart-repository.ts` to implement async signatures
- Update `src/entities/cart/api/zustand-cart-repository.integration.test.ts` to handle async API
- Restore port type exports in `src/entities/coupon/index.ts` and `src/entities/product/index.ts`
- All quality gates pass: lint, lint:arch, build

### Out of Scope

- No new business logic or features
- No changes to Cart aggregate, CartItem entity, or domain models
- No changes to Zustand store structure (only signature alignment)
- No changes to mission 009 implementation files beyond restoring the deleted ports

## User Scenarios & Testing

### Scenario 1: Port Signature Restoration

Given the repository contracts are restored to async signatures,
When a downstream feature (T-011 Cart Actions) calls `repository.getCart()`,
Then it receives `Promise<Cart>` as defined by T-007 — not a raw `Cart`.

### Scenario 2: Deleted Port Files Restored

Given mission 009's port files were deleted during T-009 merge,
When T-011 or T-012 imports `ICouponRepository` or `IStockRepository`,
Then the import resolves successfully from the restored port files.

### Scenario 3: Integration Test Passes

Given the corrected async repository adapter,
When the integration test runs (save → get → verify round-trip),
Then all assertions pass under the async API.

## Key Entities

### ICartRepository
- Port interface for cart persistence
- Async signatures: `getCart(): Promise<Cart>`, `saveCart(cart: Cart): Promise<void>`

### ICouponRepository
- Port interface for coupon lookup
- Signature: `findByCode(code: string): Promise<Coupon | null>`

### IStockRepository
- Port interface for product variant stock
- Signatures: `findBySku(skuId: string): Promise<ProductVariant | null>`, `save(variant: ProductVariant): Promise<void>`

### ZustandCartRepository
- Repository adapter implementing `ICartRepository`
- Wraps synchronous Zustand store operations in `Promise.resolve()` to satisfy async contract

## Functional Requirements

| ID | Requirement | Status |
| -- | ----------- | ------ |
| FR-001 | `ICartRepository` defines `getCart(): Promise<Cart>` | pending |
| FR-002 | `ICartRepository` defines `saveCart(cart: Cart): Promise<void>` | pending |
| FR-003 | `ZustandCartRepository` implements `getCart()` returning `Promise<Cart>` | pending |
| FR-004 | `ZustandCartRepository` implements `saveCart()` returning `Promise<void>` | pending |
| FR-005 | `coupon/model/ports.ts` exists and exports `ICouponRepository` | pending |
| FR-006 | `product/model/ports.ts` exists and exports `IStockRepository` | pending |
| FR-007 | `coupon/index.ts` exports `ICouponRepository` type | pending |
| FR-008 | `product/index.ts` exports `IStockRepository` type | pending |
| FR-009 | Integration test round-trip (save → get → verify) passes with async API | pending |
| FR-010 | All existing unit tests remain passing after signature change | pending |

## Success Criteria

- SC-001: `npm run lint` exits with code 0
- SC-002: `npm run lint:arch` exits with code 0
- SC-003: `npm run build` exits with code 0
- SC-004: `ICartRepository` has `getCart(): Promise<Cart>` signature (verified by TypeScript compilation)
- SC-005: `ICartRepository` has `saveCart(cart: Cart): Promise<void>` signature (verified by TypeScript compilation)
- SC-006: `src/entities/coupon/model/ports.ts` and `src/entities/product/model/ports.ts` exist in the filesystem
- SC-007: No test file is broken by the signature change

## Assumptions

- The Zustand store operations are synchronous by nature; the adapter will wrap them in `Promise.resolve()` to satisfy the async port contract
- Restoring the two port files from mission 009 artifacts is sufficient — no structural changes needed to those files
- The integration test already covers the round-trip scenario; only the async/await syntax needs updating
