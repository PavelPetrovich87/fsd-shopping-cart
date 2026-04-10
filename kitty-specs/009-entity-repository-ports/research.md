# Research: Entity Repository Ports

## Decision 1: Keep mission strictly type-contract only
- Decision: Define repository interfaces and public exports only, without adding runtime behavior or adapters.
- Rationale: Confirmed planning alignment and T-007 scope constraints require pure contract work.
- Alternatives considered: Including mock adapters or store-backed implementations in this mission.

## Decision 2: Cart repository exposes get and save operations in domain types
- Decision: `ICartRepository` provides `getCart()` and `saveCart(cart)` using cart domain aggregate types.
- Rationale: Supports cart read/update use cases while maintaining domain-level persistence abstraction.
- Alternatives considered: Splitting into multiple cart mutation methods; exposing infrastructure payloads.

## Decision 3: Stock repository uses SKU lookup plus variant persistence
- Decision: `IStockRepository` provides `findBySku(skuId)` and `save(variant)` with product domain types.
- Rationale: Matches ticket acceptance and keeps stock access keyed by stable product identity.
- Alternatives considered: Batch lookup API; exposing raw inventory records.

## Decision 4: Coupon lookup returns nullable domain aggregate
- Decision: `ICouponRepository.findByCode(code)` returns domain coupon or null when no match exists.
- Rationale: Explicitly communicates absence while preserving simple consumer control flow.
- Alternatives considered: Throwing on missing coupon; sentinel coupon object.

## Decision 5: Enforce public API export accessibility
- Decision: Export each port interface from its slice `index.ts` to preserve FSD public API usage.
- Rationale: Prevents cross-slice internal imports and supports architecture-lint expectations.
- Alternatives considered: Keeping ports internal and importing from `model/ports` directly.
