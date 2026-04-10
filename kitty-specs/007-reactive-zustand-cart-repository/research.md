# Research: Reactive Zustand Cart Repository

## Decision 1: Reactive read model uses selector/hook-style consumption
- Decision: `getCart()` behavior is planned around a selector/hook-style reactive read model over the cart store.
- Rationale: User-selected planning direction (Option A) and ticket acceptance require reactive observation after `saveCart`.
- Alternatives considered: Subscription-only callback API; hybrid snapshot-plus-subscribe abstraction.

## Decision 2: Repository remains the boundary for cart persistence and retrieval
- Decision: `saveCart(cart)` is the single persistence pathway and read behavior remains exposed through repository contract boundaries.
- Rationale: Preserves FR-001/FR-003 intent and keeps downstream consumers decoupled from direct store internals.
- Alternatives considered: Direct store access from consumers; bypassing repository for reads.

## Decision 3: Integration verification centers on save->observe round-trip
- Decision: Integration validation will assert save-to-read equivalence and observable reactive updates without repository reinitialization.
- Rationale: Matches FR-004 and primary/secondary user scenarios in the approved specification.
- Alternatives considered: Unit-only validation without integration tests; one-time snapshot checks.

## Decision 4: Scope discipline is enforced at artifact boundaries
- Decision: Planned implementation is restricted to T-009 files and cart slice public API updates only.
- Rationale: Supports FR-005 and constraint C-001 with explicit mission boundaries.
- Alternatives considered: Opportunistic refactors in adjacent slices; UI-level validation changes.

## Decision 5: Performance validation uses local latency sampling
- Decision: Local test validation will measure save-to-observable-update latency against the 100 ms / 95% threshold.
- Rationale: Satisfies NFR-001 with measurable, repeatable checks in mission-level verification.
- Alternatives considered: No explicit timing checks; qualitative responsiveness assertions only.
