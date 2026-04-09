# Specification: T-003 — Shared Fixtures (Mock Data)

## 1. Overview

**Mission Number:** 003  
**Mission Type:** software-dev  
**Friendly Name:** shared fixtures  
**Target Branch:** main  
**Created:** 2026-04-09

### Intent Summary

Create typed mock data fixtures for products, inventory, and coupons that will be consumed by entity repositories until a real API is connected. Fixtures live in `shared/api/fixtures/` and are consumed by mock repositories in entity slices.

---

## 2. User Scenarios & Testing

### Data Consumers

| Consumer | Use Case | Fixture Required |
|----------|----------|------------------|
| `entities/product/api/MockInventoryRepository` | Load product variants with stock | `products.ts`, `inventory.ts` |
| `entities/coupon/api/MockCouponRepository` | Load coupon definitions | `coupons.ts` |

### Verification Scenarios

| Scenario | Expected Outcome |
|----------|------------------|
| Import `productsData` from `@/shared/api` | Returns array of 6+ product objects |
| Import `inventoryData` from `@/shared/api` | Returns array of matching inventory records |
| Import `couponsData` from `@/shared/api` | Returns array of 2-3 coupon objects |
| TypeScript compiles fixture files | No `any` types, strict typing |

---

## 3. Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | Create `src/shared/api/fixtures/products.ts` with product fixture data | pending |
| FR-002 | Create `src/shared/api/fixtures/inventory.ts` with stock level fixture data | pending |
| FR-003 | Create `src/shared/api/fixtures/coupons.ts` with coupon code fixture data | pending |
| FR-004 | Create `src/shared/api/fixtures/index.ts` that re-exports all fixture data | pending |
| FR-005 | Update `src/shared/api/index.ts` to re-export fixtures module | pending |

---

## 4. Data Specifications

### Product Fixture (`products.ts`)

**Minimum Count:** 6 products

**Fields per product:**

| Field | Type | Description |
|-------|------|-------------|
| `skuId` | `string` | Unique stock-keeping unit identifier |
| `name` | `string` | Product display name |
| `description` | `string` | Product description |
| `imageUrl` | `string` | Product image URL |
| `listPriceCents` | `number` | Original price in cents |
| `salePriceCents` | `number \| null` | Sale price in cents (null if no sale) |
| `category` | `string` | Product category |

### Inventory Fixture (`inventory.ts`)

**Matching:** Each product `skuId` must have a corresponding inventory record.

**Fields per record:**

| Field | Type | Description |
|-------|------|-------------|
| `skuId` | `string` | References product skuId |
| `totalOnHand` | `number` | Total stock available |
| `reserved` | `number` | Currently reserved quantity |

### Coupon Fixture (`coupons.ts`)

**Minimum Count:** 2-3 coupons

**Fields per coupon:**

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | Coupon code (case-insensitive lookup) |
| `description` | `string` | Human-readable description |
| `discountType` | `'flat' \| 'percentage'` | Discount mode |
| `discountValue` | `number` | Discount amount (cents) or percentage (0-100) |
| `minPurchaseCents` | `number` | Minimum subtotal to apply coupon |
| `maxUses` | `number` | Maximum total redemptions allowed |
| `expiresAt` | `string \| null` | ISO expiration date or null for no expiry |

---

## 5. TypeScript Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| TR-001 | Each fixture file exports a TypeScript interface defining the data shape | pending |
| TR-002 | Data arrays are typed as the interface, not `any[]` | pending |
| TR-003 | TypeScript compilation succeeds with strict mode | pending |

---

## 6. Export Structure

```typescript
// src/shared/api/fixtures/index.ts
export { productsData, type Product } from './products';
export { inventoryData, type InventoryRecord } from './inventory';
export { couponsData, type Coupon } from './coupons';

// src/shared/api/index.ts
export * from './fixtures';
```

---

## 7. Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| Fixture data importable via `@/shared/api` | Verified by import statement compilation |
| Minimum product count met | ≥ 6 products |
| Coupon codes functional | 2-3 valid coupon codes |
| Inventory matches products | Every product skuId has inventory record |
| Type safety | No `any` types in fixture files |
| TypeScript compiles | `npm run build` exits 0 |

---

## 8. Key Entities

| Entity | Fields | File |
|--------|--------|------|
| `Product` | skuId, name, description, imageUrl, listPriceCents, salePriceCents, category | `products.ts` |
| `InventoryRecord` | skuId, totalOnHand, reserved | `inventory.ts` |
| `Coupon` | code, description, discountType, discountValue, minPurchaseCents, maxUses, expiresAt | `coupons.ts` |

---

## 9. Out of Scope

- API integration (real backend calls)
- Dynamic data fetching
- Product images (use placeholder URLs)
- Inventory reservation logic (handled by entities)
- Coupon validation logic (handled by entities)

---

## 10. Assumptions

- Product images use placeholder URLs (e.g., `https://picsum.photos/seed/{skuId}/400/400`)
- Coupon codes are uppercase alphanumeric
- All inventory `reserved` values default to 0 for mock data
- Product prices are realistic (between 500 cents and 50000 cents / $5-$500)
