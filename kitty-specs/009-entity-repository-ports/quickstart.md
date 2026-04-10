# Quickstart: Entity Repository Ports

## 1. Implement planned files
- `src/entities/cart/model/ports.ts`
- `src/entities/product/model/ports.ts`
- `src/entities/coupon/model/ports.ts`
- `src/entities/cart/index.ts`
- `src/entities/product/index.ts`
- `src/entities/coupon/index.ts`

## 2. Contract verification checklist
- `ICartRepository` exposes `getCart()` and `saveCart(cart)` with domain cart types
- `IStockRepository` exposes `findBySku(skuId)` and `save(variant)` with domain product types
- `ICouponRepository` exposes `findByCode(code)` with nullable domain coupon result
- All three ports are exported from slice public APIs
- No method signature accepts or returns raw infrastructure shapes

## 3. Run project quality gates
- `npm run lint`
- `npm run lint:arch`
- `npm run build`

## 4. Validate plan outcomes
- T-007 acceptance criteria map directly to implemented interfaces and exports
- Architecture boundaries remain FSD-compliant (public API usage only)
- No runtime behavior changes introduced beyond type-contract surface
