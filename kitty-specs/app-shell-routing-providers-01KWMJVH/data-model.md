# Phase 1 Data Model: App Shell — Routing & Providers

**Mission**: `app-shell-routing-providers-01KWMJVH`
**Date**: 2026-07-03

This mission adds no persistent storage and no new domain entities. The "data model" here is the **internal TypeScript contract surface** for the new `app/` layer: the dependency-injection shape, the `CartListItem` derivation mapping, and the order-summary derivation table.

---

## New Types

### `AppDeps` (the dependency-injection shape)

```ts
// src/app/providers/app-deps.ts
import type { EventBus } from '@/shared/lib/event-bus'
import type { ICartRepository } from '@/entities/cart'
import type { IStockRepository } from '@/entities/product'
import type { ICouponRepository } from '@/entities/coupon'

export interface AppDeps {
  readonly eventBus: EventBus
  readonly cartRepo: ICartRepository
  readonly stockRepo: IStockRepository
  readonly couponRepo: ICouponRepository
}

export const AppDepsContext = createContext<AppDeps | null>(null)

export function useAppDeps(): AppDeps {
  const ctx = useContext(AppDepsContext)
  if (!ctx) throw new Error('useAppDeps must be used within <AppProviders>')
  return ctx
}
```

### `ProductCardProps` (refined — adds optional callback)

```ts
// src/entities/product/ui/ProductCard/ProductCard.tsx
export interface ProductCardProps {
  skuId: string
  name: string
  imageUrl: string
  listPriceCents: number
  salePriceCents: number | null
  isLoading?: boolean
  onAddToCart?: () => void          // NEW — optional. When provided, renders an Add-to-cart Button.
}
```

Backward-compatible: existing usages and stories that omit `onAddToCart` render exactly as today.

---

## Derivation Mapping: Cart aggregate → `CartListItem`

The presentational `CartPage` accepts `CartListItem[]` (pre-formatted strings). The container derives each entry from a `CartItem` joined with `productsData`:

```ts
// src/app/containers/cart-container.tsx
import { productsData } from '@/shared/api'
import { Money } from '@/shared/lib'
import type { CartItem } from '@/entities/cart'
import type { CartListItem } from '@/widgets/cart'

function toCartListItem(item: CartItem): CartListItem {
  const product = productsData.find(p => p.skuId === item.skuId)
  return {
    skuId: item.skuId,
    name: item.name,
    description: product?.description ?? '',
    imageUrl: product?.imageUrl ?? '',
    // specs intentionally omitted (see research.md R-02)
    price: Money.fromCents(item.unitPriceCents).format(),
    quantity: item.quantity,
    // minQuantity / maxQuantity: optional, sourced from ProductVariant if needed
    // (default behavior: omit, let QuantitySelector use its own defaults)
  }
}
```

| `CartListItem` field | Source | Derivation |
|---|---|---|
| `skuId` | `CartItem.skuId` | direct |
| `name` | `CartItem.name` | direct |
| `description` | `productsData` joined by skuId | `product?.description ?? ''` |
| `imageUrl` | `productsData` joined by skuId | `product?.imageUrl ?? ''` |
| `specs` | **omitted** | not available in the data model (see research.md R-02) |
| `price` | `CartItem.unitPriceCents` (number) | `Money.fromCents(unitPriceCents).format()` |
| `quantity` | `CartItem.quantity` | direct |
| `minQuantity` / `maxQuantity` | `ProductVariant`? (optional) | omit unless needed; let `QuantitySelector` default |

---

## Derivation Table: Order Summary

The `OrderSummary` widget accepts pre-formatted strings for subtotal/discount/shipping/total. The container derives them from the cart aggregate + coupon lookup using `Money`:

| Field       | Source | Derivation |
|-------------|--------|------------|
| `subtotal`  | `getSubtotalCents(cart)` (helper from `entities/cart`) | `Money.fromCents(getSubtotalCents(cart)).format()` |
| `discount`  | `couponRepo.findByCode(cart.couponCode)` (async) | `Money.fromCents(coupon.amountCents).format()` prefixed with `-` (or however the existing Coupon carries its value — confirm field name at implement time) |
| `shipping`  | Fixed rule (no shipping entity exists) | If cart has items: `Money.fromCents(SHIPPING_FLAT_CENTS).format()`; else `undefined` |
| `total`     | Computed | `Money.fromCents(subtotalCents - (discountCents ?? 0) + (shippingCents ?? 0)).format()` |
| `appliedCoupon` | `couponRepo.findByCode(cart.couponCode)` (async) | `{ code: coupon.code, discountLabel: '-' + Money.fromCents(coupon.amountCents).format() }` |

**Shipping rule**: The demo used a flat `$12.00` when the cart has items. The container will use a constant `SHIPPING_FLAT_CENTS = 1200`. This is a presentation-only constant; it is not a domain rule and lives in the container.

**Coupon field confirmation**: The exact field on the `Coupon` aggregate that carries the discount amount (`amountCents` vs `discountCents` vs a percentage) must be confirmed at the start of the implement lane by reading `src/entities/coupon/model/`. The container's derivation will use that field.

---

## Event Subscription Contracts

### `CheckoutInitiated` handler signature

```ts
// src/app/subscriptions/checkout-subscription.tsx
import type { CheckoutInitiated } from '@/entities/cart'

async function onCheckoutInitiated(event: CheckoutInitiated): Promise<void> {
  const orderId = event.cartId
  for (const item of event.items) {
    const variant = await stockRepo.findBySku(item.skuId)
    if (!variant) continue
    const { variant: reserved } = reserve({ variant, orderId, quantity: item.quantity })
    const { variant: depleted } = confirmDepletion({ variant: reserved, orderId })
    await stockRepo.save(depleted)
  }
}
```

### Diagnostics handler signature

```ts
// src/app/subscriptions/diagnostics-subscription.tsx
function onCartEvent(event: CartDomainEvent): void {
  console.debug('[cart-event]', event.eventType, event)
}
```

Subscribed to the union of cart event types (`ItemAddedToCart`, `CartItemQuantityChanged`, `ItemRemovedFromCart`, `CartCleared`, `CheckoutInitiated`, `CheckoutCompleted`, `CouponApplied`, `CouponRemoved`). No business logic; separable.

---

## Contracts Directory

**None generated.** This mission has no public API surface — no new endpoints, no new published functions beyond the `AppShell` export from `src/app/index.ts`. All contracts are internal TypeScript types consumed within the app layer. The mission composes existing use cases; it does not expose new ones.

---

## Validation Rules (from spec requirements)

- `Money.fromCents(cents)` requires `cents >= 0`. All derivation paths produce non-negative inputs (cart subtotals, coupon amounts, shipping constants).
- `reserve({ variant, orderId, quantity })` requires `quantity >= 0`; the cart validates positive quantities upstream.
- `confirmDepletion({ variant, orderId })` is a no-op if no reservation matches — safe to call unconditionally after `reserve`.
- `useAppDeps()` throws if called outside `<AppProviders>` — fails fast in dev, surfaces clearly in tests.
