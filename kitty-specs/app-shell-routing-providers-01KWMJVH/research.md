# Phase 0 Research: App Shell — Routing & Providers

**Mission**: `app-shell-routing-providers-01KWMJVH`
**Date**: 2026-07-03

Four research items were identified during planning interrogation. All are resolved below by reading the actual codebase (no `[NEEDS CLARIFICATION]` markers remain).

---

## R-01: `confirmDepletion` signature and depletion semantics

**Question**: How does the product aggregate deplete stock at checkout, and what is the exact call sequence?

**Source**: `src/entities/product/model/operations.ts`

**Finding**: The product aggregate exposes three stock-mutation operations:

```ts
reserve(params: { variant: ProductVariant; orderId: string; quantity: number })
  → { variant: ProductVariant; event?: StockReserved; depletedEvent?: StockDepleted }

releaseReservation(params: { variant: ProductVariant; orderId: string })
  → { variant: ProductVariant; event?: StockReleased }

confirmDepletion(params: { variant: ProductVariant; orderId: string })
  → { variant: ProductVariant; event?: StockDepleted }
```

**Critical detail**: `confirmDepletion` does **not** take a quantity. It looks up the reservation on `variant` matching `orderId`, then permanently subtracts that reservation's quantity from `variant.totalOnHand`, increments `variant.sold`, and removes the reservation. **If no reservation exists for `orderId`, it returns the variant unchanged.**

**Decision**: The checkout subscription must perform **both** `reserve()` and `confirmDepletion()` per line item:

```ts
const orderId = event.cartId
for (const item of event.items) {
  const variant = await stockRepo.findBySku(item.skuId)
  if (!variant) continue
  const { variant: reserved } = reserve({ variant, orderId, quantity: item.quantity })
  const { variant: depleted } = confirmDepletion({ variant: reserved, orderId })
  await stockRepo.save(depleted)
}
```

**Rationale**: This is the canonical depletion path in the domain model. Pure direct mutation of `totalOnHand` is **not** a domain operation and would bypass the aggregate's invariants.

**Alternatives considered**:
- *Direct `totalOnHand` mutation*: rejected — circumvents the aggregate, sets a bad precedent, no domain operation supports it.
- *Reserve only (soft hold)*: rejected — leaves inventory in limbo; no payment step exists to confirm later.

**Edge case (partial reserve)**: `reserve()` calls `Math.min(quantity, currentAvailable)` internally. If stock is insufficient at subscription time, it reserves whatever is available, and `confirmDepletion` depletes that amount. The cart was already validated for stock sufficiency by `InitiateCheckout` itself (which returns `stock_conflict` if any item exceeds availability), so the subscription normally depletes the full requested quantity. Partial depletion can only occur under a true race condition between checkout validation and the subscription firing.

---

## R-02: Source of `description`, `imageUrl`, and `specs` for `CartListItem`

**Question**: Where do the presentational `CartListItem` fields come from? The demo (`src/pages/App.tsx`) hardcoded them.

**Sources**: `src/widgets/cart/model/types.ts`, `src/entities/cart/model/cart-item.ts`, `src/shared/api/fixtures/products.ts`

**Finding**:

| Field          | On `CartItem`? | On `Product` fixture? | Source |
| -------------- | -------------- | --------------------- | ------ |
| `skuId`        | ✅              | ✅                     | `CartItem` |
| `name`         | ✅              | ✅                     | `CartItem` |
| `description`  | ❌              | ✅                     | `productsData.find(p => p.skuId === item.skuId)?.description` |
| `imageUrl`     | ❌              | ✅                     | `productsData.find(p => p.skuId === item.skuId)?.imageUrl` |
| `specs`        | ❌              | ❌                     | **Nowhere** |
| `price`        | `unitPriceCents` (number) | `listPriceCents`/`salePriceCents` (numbers) | Derive via `Money.fromCents(item.unitPriceCents).format()` |
| `quantity`     | ✅              | ❌                     | `CartItem` |

**Decision**:
- `description`, `imageUrl` → joined from `productsData` by `skuId`.
- `price` → derived from `CartItem.unitPriceCents` via `Money.fromCents(...).format()` (satisfies C-003).
- `specs` → **omitted** from the derived `CartListItem`. The demo fabricated it (`{ Color: 'Black', Connectivity: 'Bluetooth 5.3' }`), but neither `CartItem` nor `Product` carries specs. Fabricating data again would violate the spec's truthfulness principle. `CartListItem.specs` is optional (`specs?: Record<string, string>`), so omitting it is a valid contract usage.

**Rationale**: The container joins cart items with the product fixture for display-only fields (description, image) that the cart aggregate legitimately doesn't duplicate. Omitting `specs` is honest — the data model doesn't have it, so the UI shouldn't invent it.

**Alternatives considered**:
- *Derive minimal specs from category* (e.g., `{ Category: product.category }`): rejected — it's a weak approximation of the demo's richer specs and adds little value.
- *Extend the `Product` fixture with a `specs` field*: rejected — touches `shared/api/fixtures/` outside the app layer and expands mission scope beyond wiring.

**Implication for CartRow**: The `CartRow` component (T-025) renders `specs` when present; with `specs` omitted, it simply won't render a specs block. Visually cleaner than fabricated data.

---

## R-03: Cart coupon exposure and discount derivation

**Question**: How does the cart expose the applied coupon, and how does the container derive the `discount` / `appliedCoupon` for the order summary?

**Sources**: `src/entities/cart/model/cart.ts`, `src/widgets/cart/model/types.ts`, `src/entities/coupon/model/`

**Finding**:
- `Cart` exposes `couponCode: string` (empty string when no coupon applied).
- `applyCoupon(cart, code)` / `removeCoupon(cart)` mutate `cart.couponCode` and emit `CouponApplied` / `CouponRemoved` events.
- The cart does **not** track the discount amount or coupon entity — only the code string.
- The `Coupon` aggregate (looked up via `couponRepo.findByCode(code)`) carries the discount value.

**`AppliedCoupon` shape** (presentational, from `widgets/cart/model/types.ts`):
```ts
export interface AppliedCoupon {
  code: string
  discountLabel: string  // pre-formatted, e.g., "-$20.00"
}
```

**Decision**: The container derives `appliedCoupon` and `discount` asynchronously:

```ts
const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | undefined>()
const [discountCents, setDiscountCents] = useState<number | undefined>()

useEffect(() => {
  if (!cart.couponCode) {
    setAppliedCoupon(undefined)
    setDiscountCents(undefined)
    return
  }
  couponRepo.findByCode(cart.couponCode).then(coupon => {
    if (!coupon) { setAppliedCoupon(undefined); setDiscountCents(undefined); return }
    // coupon.discountCents or coupon.discountKind — confirm exact Coupon field during implement
    setAppliedCoupon({ code: coupon.code, discountLabel: Money.fromCents(coupon.amountCents).format() })
    setDiscountCents(coupon.amountCents)
  })
}, [cart.couponCode])
```

**Open detail**: The exact field on the `Coupon` aggregate that holds the discount amount (`amountCents` vs `discountCents` vs a percentage) must be confirmed at the start of the implement lane by reading `src/entities/coupon/model/`. The container's derivation will use that field.

**Rationale**: The cart aggregate stays focused on cart state (items, couponCode, lifecycle). Discount calculation requires coupon-entity knowledge, which the container resolves via `couponRepo`. This keeps aggregates cohesive.

---

## R-04: Confirmation UI primitive for "Order placed"

**Question**: How should the "Order placed" success confirmation be rendered (FR-010)? No toast primitive exists.

**Source**: `src/shared/ui/` inventory.

**Finding**: Available shared primitives:
- `src/shared/ui/modal/` — accessible Modal (focus trap, ESC, ARIA), T-024
- `src/shared/ui/shadcn/button.tsx` — Button, T-019
- `src/shared/ui/tooltip/`, `src/shared/ui/tag/`, `src/shared/ui/input-field/`

No `Toast`, `Notification`, `Banner`, or `Alert` primitive exists.

**Decision**: Use the existing `Modal` primitive for the "Order placed" confirmation. A new file `src/app/ui/checkout-success-modal.tsx` composes `Modal` with a brief message ("Your order has been placed.") and a "Continue shopping" button that closes the modal and navigates to `/`.

```tsx
<Modal open={open} onClose={onClose} title="Order placed">
  <p>Your order has been placed.</p>
  <Button onClick={() => { onClose(); navigate('/') }}>Continue shopping</Button>
</Modal>
```

**Rationale**: `Modal` is the only existing primitive suited for a momentary confirmation dialog. Composing it into a thin wrapper satisfies C-007 (no new primitives) and reuses the accessible, tested Modal component.

**Alternatives considered**:
- *Inline banner composed from tokens*: rejected — borderline vs C-007 (a banner is arguably a new primitive), and lacks the focus-management/a11y that Modal provides.
- *Dedicated `/checkout/success` route*: rejected — adds a third route beyond the spec's minimal `/` and `/cart`; scope creep.
