# Tasks: 003-shared-fixtures

**Mission:** 003-shared-fixtures  
**Spec:** [spec.md](./spec.md)  
**Plan:** [plan.md](./plan.md)  
**Branch:** main → main  
**Generated:** 2026-04-09

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|-----|----------|
| T001 | Create `src/shared/api/fixtures/` directory | WP01 | ✓ |
| T002 | Create `products.ts` with `Product` interface + 6 products | WP01 | ✓ |
| T003 | Create `inventory.ts` with `InventoryRecord` interface + 6 records | WP01 | ✓ |
| T004 | Create `coupons.ts` with `Coupon` interface + 2-3 coupons | WP01 | ✓ |
| T005 | Create `fixtures/index.ts` re-export barrel | WP01 | ✓ |
| T006 | Update `src/shared/api/index.ts` to export fixtures | WP01 | ✓ |

---

## Work Package WP01: Create All Fixture Files

**Summary:** Create all typed mock data fixtures for products, inventory, and coupons.

- **Goal:** Implement all fixture files in `src/shared/api/fixtures/` per spec
- **Priority:** P0 (MVP)
- **Independent Test:** `npm run build` exits 0
- **Estimated prompt size:** ~350 lines

### Included Subtasks

- [ ] T001 Create `src/shared/api/fixtures/` directory
- [ ] T002 Create `products.ts` with `Product` interface + 6 products
- [ ] T003 Create `inventory.ts` with `InventoryRecord` interface + 6 records
- [ ] T004 Create `coupons.ts` with `Coupon` interface + 2-3 coupons
- [ ] T005 Create `fixtures/index.ts` re-export barrel
- [ ] T006 Update `src/shared/api/index.ts` to export fixtures

### Implementation Sketch

1. Create `src/shared/api/fixtures/` directory
2. Write `products.ts`:
   - Export `Product` interface with all required fields
   - Export `productsData` array with 6 products
   - Use placeholder images: `https://picsum.photos/seed/{skuId}/400/400`
   - Prices in cents (500-50000 range)
3. Write `inventory.ts`:
   - Export `InventoryRecord` interface
   - Export `inventoryData` array with matching skuIds
   - All `reserved` values set to 0
4. Write `coupons.ts`:
   - Export `Coupon` interface with union type for `discountType`
   - Export `couponsData` array with 2-3 coupons
   - Include mix of flat and percentage discounts
5. Write `fixtures/index.ts` barrel file re-exporting all data and types
6. Update `src/shared/api/index.ts` to add `export * from './fixtures';`

### Dependencies

None — all tasks are sequential within the same directory creation.

### Parallel Opportunities

T002, T003, T004 are independent (different files) and could run in parallel, but since they're all in the same WP and the code is straightforward, sequential execution is fine.

### Risks

- None identified — feature is fully specified

### Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-1 | 6 products in `productsData` | Import compiles |
| AC-2 | 2-3 coupons in `couponsData` | Import compiles |
| AC-3 | Every product has matching inventory record | skuId alignment |
| AC-4 | No `any` types in fixture files | ESLint + TypeScript |
| AC-5 | `npm run build` exits 0 | Build verification |
| AC-6 | Fixtures importable via `@/shared/api` | Export chain verified |

---

## Requirement Reference Mapping

| WP | FR | TR |
|----|----|----|
| WP01 | FR-001, FR-002, FR-003, FR-004, FR-005 | TR-001, TR-002, TR-003 |
