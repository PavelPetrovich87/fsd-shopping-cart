# Implementation Plan: 003-shared-fixtures

*Spec: [spec.md](./spec.md)*

**Branch**: `main` | **Date**: 2026-04-09 | **Spec**: `kitty-specs/003-shared-fixtures/spec.md`

## Summary

Create typed mock data fixtures for products, inventory, and coupons in `src/shared/api/fixtures/`. Fixtures are static TypeScript arrays consumed by mock repositories in entity slices. No research required — spec fully specifies data shapes.

---

## Technical Context

| Field | Value |
|-------|-------|
| Language/Version | TypeScript 5.9 |
| Primary Dependencies | React 19, Vite 8, Tailwind CSS v4 |
| Storage | Static in-memory fixture files |
| Testing | ESLint + Steiger + `npm run build` |
| Target Platform | Web (SPA) |
| Performance Goals | N/A (static data) |
| Constraints | No `any` types, strict TypeScript |
| Scale/Scope | 6 products, 2-3 coupons, matching inventory |

---

## Charter Check

Skipped — charter file not found (`.kittify/charter/charter.md`).

---

## Project Structure

### Source Code (to create)

```
src/shared/api/fixtures/
├── products.ts    # 6 product objects + Product interface + productsData export
├── inventory.ts  # 6 inventory records + InventoryRecord interface + inventoryData export
├── coupons.ts    # 2-3 coupon objects + Coupon interface + couponsData export
└── index.ts      # Re-exports all fixtures and types

src/shared/api/
└── index.ts      # UPDATE: add export * from './fixtures'
```

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Image URLs | `https://picsum.photos/seed/{skuId}/400/400` | User confirmed placeholder approach |
| Product count | 6 | Spec minimum |
| Coupon count | 2-3 | Spec minimum |
| Inventory reserved | All 0 | Mock data assumption from spec |
| Product prices | 500-50000 cents | Spec assumption range |

---

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-1 | 6 products in `productsData` | Import compiles |
| AC-2 | 2-3 coupons in `couponsData` | Import compiles |
| AC-3 | Every product has matching inventory record | skuId alignment |
| AC-4 | No `any` types in fixture files | ESLint + TypeScript |
| AC-5 | `npm run build` exits 0 | Build verification |
| AC-6 | Fixtures importable via `@/shared/api` | Export chain verified |

---

## Files to Create

| File | Content |
|------|---------|
| `src/shared/api/fixtures/products.ts` | `Product` interface, `productsData` array (6 items) |
| `src/shared/api/fixtures/inventory.ts` | `InventoryRecord` interface, `inventoryData` array (6 items) |
| `src/shared/api/fixtures/coupons.ts` | `Coupon` interface, `couponsData` array (2-3 items) |
| `src/shared/api/fixtures/index.ts` | Re-exports all fixtures and types |

## Files to Update

| File | Change |
|-------|--------|
| `src/shared/api/index.ts` | Add `export * from './fixtures';` |

---

## Phase 0: Research

Not required — spec fully specifies all data shapes and types.

---

## Phase 1: Design

Data model extracted from spec:

| Entity | Fields | File |
|--------|--------|------|
| `Product` | skuId, name, description, imageUrl, listPriceCents, salePriceCents, category | products.ts |
| `InventoryRecord` | skuId, totalOnHand, reserved | inventory.ts |
| `Coupon` | code, description, discountType, discountValue, minPurchaseCents, maxUses, expiresAt | coupons.ts |

No contracts needed — fixtures are in-memory static data, not API endpoints.

---

## Out of Scope

- Real API integration
- Dynamic data fetching
- Coupon validation logic
- Inventory reservation logic
- Product image uploads

---

*Plan completed. Run `/spec-kitty.tasks` to generate work packages.*
