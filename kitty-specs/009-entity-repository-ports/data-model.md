# Data Model: Entity Repository Ports

## Entity: CartRepositoryContract
- Purpose: Domain persistence boundary for cart aggregate access and updates.
- Operations:
  - `getCart()` -> returns current cart aggregate
  - `saveCart(cart)` -> persists provided cart aggregate
- Validation rules:
  - `saveCart` input must be a valid cart domain aggregate
  - No raw infrastructure payloads are accepted

## Entity: StockRepositoryContract
- Purpose: Domain persistence boundary for product variant stock access and updates.
- Operations:
  - `findBySku(skuId)` -> returns product variant aggregate for SKU
  - `save(variant)` -> persists provided product variant aggregate
- Validation rules:
  - `skuId` is required and treated as stable variant identity key
  - `save` input must be a valid product variant domain aggregate

## Entity: CouponRepositoryContract
- Purpose: Domain persistence boundary for coupon lookup by code.
- Operations:
  - `findByCode(code)` -> returns coupon aggregate or null
- Validation rules:
  - `code` is required lookup input
  - Missing coupon resolves to explicit null outcome

## Shared Contract Constraints
- All operations consume and return domain entities/value objects only.
- Contracts are technology-agnostic and independent from concrete adapters.
- Ports are exported through each entity slice public API.

## Relationships Summary
- Use cases depend on `CartRepositoryContract`, `StockRepositoryContract`, and `CouponRepositoryContract`.
- Concrete adapters implement contracts behind these interfaces.
- Slice public APIs expose contracts for cross-slice consumption without internal imports.
