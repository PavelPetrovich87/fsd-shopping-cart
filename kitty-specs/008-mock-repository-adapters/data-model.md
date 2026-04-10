# Data Model: Mock Repository Adapters

## Entity: InventoryLookupRequest
- Fields:
  - `skuId` (string, required)
- Validation rules:
  - Must be non-empty
  - Malformed input is treated as not-found outcome

## Entity: CouponLookupRequest
- Fields:
  - `code` (string, required)
- Validation rules:
  - Must be non-empty
  - Unknown values resolve to null

## Entity: InventoryFixtureRecord
- Fields:
  - `skuId` (string)
  - `totalOnHand` (number)
  - Additional fixture properties required to construct domain product variant
- Relationships:
  - Joined with product fixture data by SKU identity during domain reconstruction
- Validation rules:
  - SKU identity must be unique
  - Required fields for domain mapping must be present

## Entity: CouponFixtureRecord
- Fields:
  - `code` (string)
  - Discount configuration fields used by domain coupon construction
- Validation rules:
  - Coupon code identity must be unique
  - Discount data must satisfy coupon domain constraints

## Entity: ProductVariant (Domain Return Type)
- Source: Reconstructed from fixture-backed records
- State expectations:
  - Represents current inventory state for resolved SKU
- Transition notes:
  - No state transitions occur in repository lookup scope; read-only return behavior only

## Entity: Coupon (Domain Return Type)
- Source: Reconstructed from coupon fixture record
- State expectations:
  - Represents a valid coupon aggregate when found
- Transition notes:
  - No state transitions occur in repository lookup scope; read-only return behavior only

## Relationships Summary
- `InventoryLookupRequest` -> resolves zero or one `ProductVariant`
- `CouponLookupRequest` -> resolves zero or one `Coupon`
- Fixture records act as adapter input only and are not exposed across repository port boundaries
