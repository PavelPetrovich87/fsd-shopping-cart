# Checkout Feature — Work Package Tasks

**Mission:** 014-checkout-feature
**Created:** 2026-04-15
**Spec:** `kitty-specs/014-checkout-feature/spec.md`
**Plan:** `kitty-specs/014-checkout-feature/plan.md`

---

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|-----|----------|
| T001 | Create CheckoutInitiated event type | WP01 | [P] | [D] |
| T002 | Create InitiateCheckoutResult and StockConflict types | WP01 | [D] |
| T003 | Implement InitiateCheckout use case | WP01 | | [D] |
| T004 | Write unit tests for all scenarios | WP02 | | [D] |
| T005 | Create model/index.ts re-exports | WP01 | [D] |
| T006 | Create public API index.ts | WP02 | [D] |

---

## WP01: Core Use Case Implementation

**Goal:** Implement the `InitiateCheckout` use case with types and events  
**Priority:** High  
**Success Criteria:** `InitiateCheckout` validates stock, transitions cart, emits event  
**Independent Test:** None — validated by WP02 tests  
**Estimated Prompt Size:** ~380 lines

### Subtasks

- [x] T001 Create `src/features/checkout/model/events.ts` — `CheckoutInitiated` event type
- [x] T002 Create `src/features/checkout/model/result-types.ts` — `InitiateCheckoutResult` discriminated union and `StockConflict` interface
- [x] T003 Implement `src/features/checkout/model/initiate-checkout.ts` — `InitiateCheckout` async function
- [x] T005 Create `src/features/checkout/model/index.ts` — re-export use case and types

### Implementation Sketch

1. **events.ts**: Export `CheckoutInitiated` interface with `eventType: 'CheckoutInitiated'`, `cartId`, `userId`, `items`, `subtotal`, `timestamp`
2. **result-types.ts**: Export `StockConflict` interface and `InitiateCheckoutResult` union with 4 variants
3. **initiate-checkout.ts**:
   - Accept `cartRepo: ICartRepository`, `stockRepo: IStockRepository`, `eventBus: EventBus`
   - Fetch cart via `cartRepo.getCart()`
   - Validate state === Active → invalid_state error
   - Validate items.length > 0 → empty_cart error
   - For each item, fetch variant via `stockRepo.findBySku()`, collect conflicts where qty > availableStock
   - If conflicts.length > 0 → return stock_conflict result
   - Call `cart.initiateCheckout()` (state → Checkout_Pending)
   - `await cartRepo.saveCart(cart)`
   - `await eventBus.publish(new CheckoutInitiated({...}))`
   - Return `{ success: true, cart }`
4. **model/index.ts**: Re-export `InitiateCheckout`, `CheckoutInitiated`, `InitiateCheckoutResult`, `StockConflict`

### Dependencies

- None (WP01 is the first work package)

### Risks

- None identified

---

## WP02: Unit Tests & Public API

**Goal:** Validate all scenarios via tests, expose public API  
**Priority:** High  
**Success Criteria:** All 4 scenarios covered, tests pass, public exports available  
**Independent Test:** Yes — tests run against implemented code  
**Estimated Prompt Size:** ~340 lines

### Subtasks

- [x] T004 Write unit tests in `src/features/checkout/model/initiate-checkout.test.ts`
- [x] T006 Create `src/features/checkout/index.ts` — public API re-exports

### Implementation Sketch

1. **initiate-checkout.test.ts**:
   - Mock `cartRepo`, `stockRepo`, `eventBus`
   - Happy path: all items in stock → cart state transitions, event published
   - Empty cart: items=[], returns `{ success: false, reason: 'empty_cart' }`
   - Invalid state: cart.state === Checkout_Pending, returns `{ success: false, reason: 'invalid_state' }`
   - Stock conflict: one item insufficient, returns `{ success: false, reason: 'stock_conflict', conflicts: [...] }`
   - Verify `eventBus.publish` called with correct structure
   - Verify `cartRepo.saveCart` called after state transition
2. **checkout/index.ts**: Re-export everything from `model/index.ts`

### Dependencies

- WP01 (requires the use case to exist before writing tests)

### Risks

- None identified

---

## Validation

- [ ] All 6 subtasks planned
- [ ] 2 work packages created
- [ ] WP sizes within guidelines (WP01: 4 subtasks, WP02: 2 subtasks)
- [ ] No WP exceeds 10 subtasks or 700 lines
- [ ] Dependencies captured: WP02 depends on WP01

---

## Next Step

Run `/spec-kitty.implement` or use implement-review skill to execute work packages.
