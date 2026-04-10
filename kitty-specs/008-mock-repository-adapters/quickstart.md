# Quickstart: Mock Repository Adapters

## 1. Implement planned files
- `src/entities/product/api/mock-inventory-repository.ts`
- `src/entities/coupon/api/mock-coupon-repository.ts`
- `src/entities/product/index.ts`
- `src/entities/coupon/index.ts`

## 2. Verify fixture-backed read-only behavior
- Inventory lookup returns `ProductVariant` for known SKU
- Inventory lookup returns not-found for unknown SKU
- Coupon lookup returns `Coupon` for known code
- Coupon lookup returns `null` for unknown code
- Repeated identical lookups are deterministic

## 3. Run project quality gates
- `npm run lint`
- `npm run lint:arch`
- `npm run build`

## 4. Validate plan outcomes
- Adapter behavior satisfies FR-001..FR-008
- NFR determinism/performance checks are represented in tests
- Public API exports expose adapters via slice entrypoints
