# Deterministic Mocking

Stories must be pixel-perfect reproducible for visual regression (Chromatic).

## Strategies

1. **Fixture files**
   - `src/shared/api/fixtures/products.ts`
   - `src/shared/api/fixtures/coupons.ts`
   - `src/shared/api/fixtures/inventory.ts`
   - Hardcoded objects, never random

2. **Faker with seed**
   - If using faker, always set `faker.seed(12345)` before generation

3. **Static factory functions**
   - `createMockProduct({ skuId: 'SHIRT-001' })` — no random defaults
   - Every property is explicit or has a static default

## Violations

```tsx
// ❌ Never do this in stories
const price = Math.random() * 100
const now = Date.now()
const product = faker.commerce.product() // unseeded
```

## Why

Visual regression requires pixel-perfect reproducibility. Any randomness or network variance breaks Chromatic diffs.
