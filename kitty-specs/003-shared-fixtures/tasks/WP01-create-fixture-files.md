---
work_package_id: WP01
title: Create All Fixture Files
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
history:
- date: '2026-04-09T12:09:21Z'
  action: created
  note: Initial work package
authoritative_surface: src/shared/api/fixtures/
execution_mode: code_change
owned_files:
- src/shared/api/fixtures/**
- src/shared/api/index.ts
---

# Work Package WP01: Create All Fixture Files

## Objective

Create typed mock data fixtures for products, inventory, and coupons in `src/shared/api/fixtures/`. These fixtures provide in-memory test data consumed by entity repositories until a real API is connected.

## Context

- **Mission:** 003-shared-fixtures
- **Spec:** [spec.md](../spec.md)
- **Plan:** [plan.md](../plan.md)
- **Branch:** main (planning base) → main (merge target)
- **Execution lane:** Single lane — implement directly in project root

## Subtasks

### T001: Create `src/shared/api/fixtures/` directory

**Purpose:** Create the fixture directory that will contain all mock data files.

**Steps:**
1. Create directory `src/shared/api/fixtures/` if it doesn't exist
2. This directory will contain all fixture files

**Files touched:**
- `src/shared/api/fixtures/` (directory)

**Validation:**
- [ ] Directory exists
- [ ] Can be imported via `@/shared/api/fixtures`

---

### T002: Create `products.ts` with `Product` interface + 6 products

**Purpose:** Define the Product data shape and populate with 6 realistic products.

**Steps:**
1. Create `src/shared/api/fixtures/products.ts`
2. Export a `Product` interface with these fields:
   ```typescript
   export interface Product {
     skuId: string;           // Unique identifier
     name: string;            // Display name
     description: string;     // Product description
     imageUrl: string;        // Image URL (use placeholder)
     listPriceCents: number;  // Original price in cents
     salePriceCents: number | null;  // Sale price, null if no sale
     category: string;        // Product category
   }
   ```
3. Export `productsData` array with exactly 6 products
4. Use placeholder images: `https://picsum.photos/seed/{skuId}/400/400`
5. Prices must be between 500 and 50000 cents ($5-$500)
6. Include variety: mix of categories, some with sales, some without

**Example product structure:**
```typescript
export const productsData: Product[] = [
  {
    skuId: "SHIRT-001",
    name: "Classic Cotton T-Shirt",
    description: "Soft, breathable cotton t-shirt for everyday wear",
    imageUrl: "https://picsum.photos/seed/SHIRT-001/400/400",
    listPriceCents: 2999,
    salePriceCents: null,
    category: "Apparel",
  },
  // ... 5 more products
];
```

**Files touched:**
- `src/shared/api/fixtures/products.ts` (create)

**Validation:**
- [ ] `Product` interface exported
- [ ] `productsData` array exported with exactly 6 products
- [ ] All required fields present on each product
- [ ] Prices in range 500-50000 cents
- [ ] Placeholder images using picsum.photos
- [ ] Mix of products with/without sales
- [ ] No `any` types — all fields typed

---

### T003: Create `inventory.ts` with `InventoryRecord` interface + 6 records

**Purpose:** Define inventory tracking data that maps to products by skuId.

**Steps:**
1. Create `src/shared/api/fixtures/inventory.ts`
2. Export an `InventoryRecord` interface:
   ```typescript
   export interface InventoryRecord {
     skuId: string;      // References product skuId
     totalOnHand: number; // Total stock available
     reserved: number;    // Currently reserved (set to 0 for mock data)
   }
   ```
3. Export `inventoryData` array with exactly 6 records
4. Each `skuId` MUST match a product's `skuId` from `productsData`
5. All `reserved` values should be 0 (mock data assumption)

**Example inventory record:**
```typescript
export const inventoryData: InventoryRecord[] = [
  {
    skuId: "SHIRT-001",
    totalOnHand: 150,
    reserved: 0,
  },
  // ... 5 more records matching each product
];
```

**Files touched:**
- `src/shared/api/fixtures/inventory.ts` (create)

**Validation:**
- [ ] `InventoryRecord` interface exported
- [ ] `inventoryData` array exported with exactly 6 records
- [ ] Every product skuId has exactly one matching inventory record
- [ ] All `reserved` values are 0
- [ ] No `any` types

---

### T004: Create `coupons.ts` with `Coupon` interface + 2-3 coupons

**Purpose:** Define coupon/discount codes for testing discount functionality.

**Steps:**
1. Create `src/shared/api/fixtures/coupons.ts`
2. Export a `Coupon` interface:
   ```typescript
   export interface Coupon {
     code: string;                    // Coupon code (uppercase alphanumeric)
     description: string;             // Human-readable description
     discountType: 'flat' | 'percentage'; // Discount mode
     discountValue: number;           // Cents (flat) or 0-100 (percentage)
     minPurchaseCents: number;        // Minimum subtotal required
     maxUses: number;                 // Maximum redemptions allowed
     expiresAt: string | null;        // ISO date or null for no expiry
   }
   ```
3. Export `couponsData` array with 2-3 coupons
4. Include variety:
   - At least one flat discount (e.g., $10 off)
   - At least one percentage discount (e.g., 20% off)
   - Mix of expiry conditions (some with dates, some without)

**Example coupon:**
```typescript
export const couponsData: Coupon[] = [
  {
    code: "SAVE10",
    description: "$10 off your order",
    discountType: 'flat',
    discountValue: 1000, // $10 in cents
    minPurchaseCents: 2500, // $25 minimum
    maxUses: 1000,
    expiresAt: null,
  },
  {
    code: "PERCENT20",
    description: "20% off your purchase",
    discountType: 'percentage',
    discountValue: 20, // 20%
    minPurchaseCents: 5000, // $50 minimum
    maxUses: 500,
    expiresAt: "2026-12-31T23:59:59Z",
  },
  // Optional third coupon
];
```

**Files touched:**
- `src/shared/api/fixtures/coupons.ts` (create)

**Validation:**
- [ ] `Coupon` interface exported with all required fields
- [ ] `couponsData` array exported with 2-3 coupons
- [ ] Mix of flat and percentage discount types
- [ ] Codes are uppercase alphanumeric
- [ ] `discountValue` appropriate for type (cents vs percentage)
- [ ] No `any` types

---

### T005: Create `fixtures/index.ts` re-export barrel

**Purpose:** Create the public API surface for the fixtures module.

**Steps:**
1. Create `src/shared/api/fixtures/index.ts`
2. Re-export everything that should be public:
   ```typescript
   export { productsData, type Product } from './products';
   export { inventoryData, type InventoryRecord } from './inventory';
   export { couponsData, type Coupon } from './coupons';
   ```

**Files touched:**
- `src/shared/api/fixtures/index.ts` (create)

**Validation:**
- [ ] All data arrays re-exported
- [ ] All interfaces re-exported with `type` keyword
- [ ] Import path: `@/shared/api/fixtures` works

---

### T006: Update `src/shared/api/index.ts` to export fixtures

**Purpose:** Make fixtures accessible via the shared/api public API.

**Steps:**
1. Read existing `src/shared/api/index.ts`
2. Add the fixtures re-export:
   ```typescript
   export * from './fixtures';
   ```
3. Ensure it doesn't duplicate existing exports

**Files touched:**
- `src/shared/api/index.ts` (update)

**Validation:**
- [ ] `export * from './fixtures';` added
- [ ] Fixtures importable via `@/shared/api`
- [ ] Example: `import { productsData } from '@/shared/api';`

---

## Definition of Done

All subtasks complete AND:

| Criterion | Verification |
|-----------|--------------|
| 6 products in `productsData` | TypeScript compiles `import { productsData } from '@/shared/api'` |
| 2-3 coupons in `couponsData` | TypeScript compiles `import { couponsData } from '@/shared/api'` |
| Inventory matches products | Every product `skuId` has corresponding `InventoryRecord` |
| No `any` types | ESLint reports no errors |
| `npm run build` exits 0 | Build succeeds |
| Fixtures importable via `@/shared/api` | Full export chain verified |

## Risks

| Risk | Mitigation |
|------|------------|
| skuId mismatch between products and inventory | Double-check each inventory record's skuId matches a product |

## Reviewer Guidance

1. Verify each fixture file exports its interface and data array
2. Check that all 6 products have unique skuIds
3. Confirm every product skuId has exactly one matching inventory record
4. Verify coupon codes are uppercase alphanumeric
5. Confirm mix of flat/percentage coupon types
6. Run `npm run build` to ensure TypeScript compilation passes
7. Run `npm run lint` to ensure code quality

## Implementation Command

```bash
# No dependencies — execute directly
spec-kitty implement WP01
```

## Activity Log

- 2026-04-09T12:52:54Z – unknown – Implementation complete: all 6 fixture files created and verified. Subtasks marked done.
