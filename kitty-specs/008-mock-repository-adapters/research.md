# Research: Mock Repository Adapters

## Decision 1: Static fixture-backed repositories are read-only
- Decision: Both repositories load fixture data at initialization and expose read-only lookup behavior.
- Rationale: Mission scope is adapter wiring for existing ports; immutable fixture sourcing keeps behavior deterministic and simple.
- Alternatives considered: Runtime mutation support; deferred lazy loading; external API fallback.

## Decision 2: Inventory lookup returns domain object or not-found outcome
- Decision: Inventory repository resolves known `skuId` to a `ProductVariant` domain object and returns not-found for unknown SKU.
- Rationale: Aligns with FR-002/FR-003 and preserves domain type boundaries.
- Alternatives considered: Return raw fixture records; throw exceptions for unknown SKU.

## Decision 3: Coupon lookup returns domain object or null
- Decision: Coupon repository resolves known code to a `Coupon` domain object and returns `null` for unknown code.
- Rationale: Aligns with FR-005/FR-006 and expected caller control flow.
- Alternatives considered: Throw on unknown code; return non-null sentinel object.

## Decision 4: Determinism and performance validation
- Decision: Plan verification asserts deterministic repeated lookups and timing threshold for local single-item reads.
- Rationale: Supports NFR-001 and NFR-002 without introducing caching or mutable state.
- Alternatives considered: Throughput-only checks; non-deterministic randomized lookup tests.
