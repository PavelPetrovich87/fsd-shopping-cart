---
work_package_id: WP02
title: Use Cases — ApplyCoupon & RemoveCoupon
dependencies:
- WP01
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-006
- FR-007
- FR-008
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-013-apply-coupon-feature
base_commit: 028ce2ebb7b822e063dbe8e7ae3383ee5720e875
created_at: '2026-04-15T10:27:34.421416+00:00'
subtasks:
- T004
- T005
- T006
- T007
shell_pid: '7109'
history:
- date: '2026-04-15'
  action: created
  details: Initial WP02 prompt
authoritative_surface: src/features/apply-coupon/
execution_mode: code_change
owned_files:
- src/features/apply-coupon/model/apply-coupon.ts
- src/features/apply-coupon/model/remove-coupon.ts
- src/features/apply-coupon/model/index.ts
- src/features/apply-coupon/index.ts
tags: []
---

# WP02: Use Cases — ApplyCoupon & RemoveCoupon

## Objective

Implement the two main use cases for the Apply Coupon feature: `ApplyCoupon` and `RemoveCoupon`. These use cases orchestrate the Cart and Coupon entities via their repository ports and publish feature-specific events via EventBus.

## Context

This work package depends on WP01 (foundation types). The use cases follow T-011 (Cart Actions) patterns exactly:
- Same function signature pattern: `async function UseCaseName(params, cartRepo, couponRepo, eventBus)`
- Same result pattern: `Promise<UseCaseResult>` with discriminated union
- Same EventBus usage: `eventBus.publish(event)` where event has `eventType` field
- Same FSD import paths: `entities/cart`, `entities/coupon`, `shared/lib`

### Dependencies

- **Requires**: WP01 (T001: errors.ts, T002: events.ts, T003: results.ts)

### Reference Files

- T-011 AddToCart: `src/features/cart-actions/model/add-to-cart.ts`
- T-011 RemoveFromCart: `src/features/cart-actions/model/remove-from-cart.ts`
- Apply Coupon spec: `kitty-specs/013-apply-coupon-feature/spec.md`
- Apply Coupon plan: `kitty-specs/013-apply-coupon-feature/plan.md`
- WP01 foundation: `src/features/apply-coupon/model/errors.ts`, `events.ts`, `results.ts`

---

## Subtasks

### T004: Create `model/apply-coupon.ts` — ApplyCoupon Use Case

**Purpose**: Implement the main `ApplyCoupon` use case that validates a coupon code and applies it to the cart.

**Function Signature**:
```typescript
export async function ApplyCoupon(
  code: string,
  cartRepo: ICartRepository,
  couponRepo: ICouponRepository,
  eventBus: EventBus
): Promise<ApplyCouponResult>
```

**Steps**:

1. Create `src/features/apply-coupon/model/apply-coupon.ts`
2. Import required types:
   - `ICartRepository` from `@/entities/cart/model/ports`
   - `ICouponRepository` from `@/entities/coupon` (ports export)
   - `EventBus` from `@/shared/lib/event-bus`
   - `ApplyCouponError` from `./errors`
   - `ApplyCouponResult` from `./results`
   - `CouponApplied` from `./events`
3. Validate input: If code is empty or whitespace only → return `{ success: false, error: { type: 'EMPTY_CODE', message: 'Please enter a valid code' } }`
4. Lookup coupon: Call `couponRepo.findByCode(code.trim())`
5. If not found → return `{ success: false, error: { type: 'INVALID_CODE', message: 'Sorry, but this coupon doesn't exist' } }`
6. If coupon is expired (check `coupon.isValid()` or equivalent — verify from T-006 Coupon entity) → return `{ success: false, error: { type: 'COUPON_EXPIRED', message: 'This coupon has expired' } }`
7. Get current cart: `const cart = await cartRepo.getCart()`
8. Calculate discount: `const discount = coupon.calculateDiscount(cart.subtotal)` — returns `Money`
9. Apply coupon to cart: Set `cart.couponCode = code` (replace any existing — no stacking per spec FR-005)
10. Save cart: `await cartRepo.saveCart(updatedCart)`
11. Publish event: `eventBus.publish({ eventType: 'CouponApplied', couponCode: code, discountAmountCents: discount.toCents(), occurredAt: new Date() })`
12. Return `{ success: true, cart: updatedCart, event: publishedEvent }`

**Important Implementation Notes**:
- `cart.subtotal` returns a `Money` object — use `.toCents()` or equivalent to get numeric value for event
- When applying a coupon, **replace any existing coupon** (no stacking — spec FR-005)
- The `couponRepo.findByCode(code)` returns `Promise<Coupon | null>` per T-010 async contract
- Cart has `couponCode: string` field (per spec assumptions)
- The `coupon.isValid()` check — verify the exact method name and return type from T-006 Coupon entity

**Edge Cases to Handle**:
- Empty code → EMPTY_CODE error
- Whitespace-only code → treat as empty
- Code not found → INVALID_CODE error
- Expired coupon → COUPON_EXPIRED error
- Valid code, re-apply → idempotent (emit CouponApplied again)

**Files**:
- Create: `src/features/apply-coupon/model/apply-coupon.ts`

**Validation**:
- [ ] Function signature matches above
- [ ] Empty code returns EMPTY_CODE error with "Please enter a valid code" message
- [ ] Invalid code returns INVALID_CODE error with "Sorry, but this coupon doesn't exist" message
- [ ] Expired coupon returns COUPON_EXPIRED error
- [ ] Valid code: coupon applied to cart, saveCart called, CouponApplied event published
- [ ] Re-applying valid code works (idempotent)
- [ ] No stacking: new coupon replaces existing
- [ ] TypeScript compiles without errors

---

### T005: Create `model/remove-coupon.ts` — RemoveCoupon Use Case

**Purpose**: Implement the `RemoveCoupon` use case that removes an applied coupon from the cart.

**Function Signature**:
```typescript
export async function RemoveCoupon(
  cartRepo: ICartRepository,
  eventBus: EventBus
): Promise<RemoveCouponResult>
```

**Steps**:

1. Create `src/features/apply-coupon/model/remove-coupon.ts`
2. Import required types:
   - `ICartRepository` from `@/entities/cart/model/ports`
   - `EventBus` from `@/shared/lib/event-bus`
   - `RemoveCouponResult` from `./results`
   - `CouponRemoved` from `./events`
3. Get current cart: `const cart = await cartRepo.getCart()`
4. If no coupon is applied (`cart.couponCode` is empty/null) → return `{ success: true, cart }` (no-op per spec)
5. Store the code being removed: `const removedCode = cart.couponCode`
6. Clear the coupon: Set `cart.couponCode = ''` (or null — verify from cart entity)
7. Save cart: `await cartRepo.saveCart(updatedCart)`
8. Publish event: `eventBus.publish({ eventType: 'CouponRemoved', couponCode: removedCode, occurredAt: new Date() })`
9. Return `{ success: true, cart: updatedCart, event: publishedEvent }`

**Important Implementation Notes**:
- RemoveCoupon has NO failure path — spec says "Cart has no active coupon, RemoveCoupon called → No-op, no error"
- The `RemoveCouponResult` type has `error: never` on the failure branch (compile-time guarantee of no errors)
- When removing, emit `CouponRemoved` event with the code that was removed

**Edge Cases to Handle**:
- No coupon applied → return success with original cart (no-op)
- Coupon applied → remove it, publish event

**Files**:
- Create: `src/features/apply-coupon/model/remove-coupon.ts`

**Validation**:
- [ ] Function signature matches above
- [ ] No coupon on cart → return success without event (no-op)
- [ ] Coupon on cart → remove, saveCart called, CouponRemoved event published
- [ ] TypeScript compiles without errors

---

### T006: Create `model/index.ts` — Re-exports

**Purpose**: Create the barrel export file that re-exports all types and use cases from the model directory.

**Steps**:

1. Create `src/features/apply-coupon/model/index.ts`
2. Re-export everything from:
   - `./errors` (ApplyCouponError)
   - `./events` (CouponApplied, CouponRemoved)
   - `./results` (ApplyCouponResult, RemoveCouponResult)
   - `./apply-coupon` (ApplyCoupon function)
   - `./remove-coupon` (RemoveCoupon function)

**Files**:
- Create: `src/features/apply-coupon/model/index.ts`

**Validation**:
- [ ] All types and functions from errors, events, results, apply-coupon, remove-coupon are re-exported
- [ ] Can import everything from `@/features/apply-coupon/model` if needed

---

### T007: Create `index.ts` — Public API Entry Point

**Purpose**: Create the public API entry point for the `apply-coupon` feature slice.

**Steps**:

1. Create `src/features/apply-coupon/index.ts`
2. Re-export from `./model`:
   - `ApplyCouponError` (from errors)
   - `CouponApplied`, `CouponRemoved` (from events)
   - `ApplyCouponResult`, `RemoveCouponResult` (from results)
   - `ApplyCoupon`, `RemoveCoupon` (use cases)
3. Consumers can import from `@/features/apply-coupon` to get everything

**Files**:
- Create: `src/features/apply-coupon/index.ts`

**Validation**:
- [ ] Public API re-exports ApplyCoupon, RemoveCoupon, and all types
- [ ] Consumers import from `@/features/apply-coupon` (not from model subdirectory directly)

---

## Implementation Notes

### File Structure

```
src/features/apply-coupon/
├── model/
│   ├── errors.ts          # WP01: ApplyCouponError
│   ├── events.ts          # WP01: CouponApplied, CouponRemoved
│   ├── results.ts         # WP01: ApplyCouponResult, RemoveCouponResult
│   ├── apply-coupon.ts    # T004: ApplyCoupon use case
│   ├── remove-coupon.ts   # T005: RemoveCoupon use case
│   ├── index.ts           # T006: barrel re-exports
│   └── apply-coupon.test.ts  # WP03: tests
└── index.ts               # T007: public API
```

### Error Messages (from spec)

| Error | Message |
|-------|---------|
| EMPTY_CODE | "Please enter a valid code" |
| INVALID_CODE | "Sorry, but this coupon doesn't exist" |
| COUPON_EXPIRED | "This coupon has expired" (or similar) |

### Cart Entity Fields Needed

- `couponCode: string` — the applied coupon code (empty string if none)
- `subtotal: Money` — calculated from cart items (for discount calculation)
- Methods: `getCart()`, `saveCart()` from ICartRepository

### Coupon Entity (T-006) Methods Needed

- `findByCode(code): Promise<Coupon | null>` — via ICouponRepository
- `isValid(): boolean` — check if coupon is still valid (not expired)
- `calculateDiscount(subtotal: Money): Money` — calculate discount amount

### EventBus Usage

```typescript
// ApplyCoupon publishes:
{ eventType: 'CouponApplied', couponCode: string, discountAmountCents: number, occurredAt: Date }

// RemoveCoupon publishes:
{ eventType: 'CouponRemoved', couponCode: string, occurredAt: Date }
```

Note: `eventType` (not `type`) — this matches the T-012 EventBus fix pattern.

---

## Definition of Done

- [ ] T004: `apply-coupon.ts` implements ApplyCoupon per spec
- [ ] T005: `remove-coupon.ts` implements RemoveCoupon per spec
- [ ] T006: `model/index.ts` re-exports all types and use cases
- [ ] T007: `index.ts` public API entry point created
- [ ] All use cases follow T-011 patterns exactly
- [ ] TypeScript compiles without errors

## Risks & Reviewer Guidance

**Risks**:
- Cart entity `couponCode` field may not exist — verify from T-004 Cart implementation
- Coupon entity `isValid()` method signature may differ from assumptions
- Discount calculation returns Money object — need `.toCents()` or similar for event field

**Reviewer Checklist**:
- [ ] ApplyCoupon empty code → correct error message
- [ ] ApplyCoupon invalid code → correct error message
- [ ] ApplyCoupon expired → correct error
- [ ] ApplyCoupon valid → cart updated, event published
- [ ] RemoveCoupon no coupon → no-op (success without event)
- [ ] RemoveCoupon with coupon → removed, event published
- [ ] No coupon stacking (only one active)
- [ ] EventBus.publish called with correct event structure (`eventType` field)
- [ ] Async/await used correctly for repository calls
- [ ] TypeScript compilation succeeds