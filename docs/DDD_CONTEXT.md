# Domain Context — FSD Mapping

This document maps the Shopping Cart domain model (originally designed with DDD / Hexagonal Architecture) onto Feature-Sliced Design. It serves as the reference for generating implementation tickets.

## 1. Mapping Principles

| DDD Concept                 | FSD Location                                        | Rationale                                               |
| --------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| Aggregate Root / Entity     | `entities/<name>/model/`                            | Entities own business objects and their invariants      |
| Value Object (domain-wide)  | `shared/lib/`                                       | Reusable across all entities, no domain coupling        |
| Domain Events (types)       | `entities/<name>/model/events.ts`                   | Events belong to the aggregate that emits them          |
| Event Bus (infrastructure)  | `shared/lib/event-bus.ts`                           | Generic pub/sub, no domain knowledge                    |
| Use Case (Command/Query)    | `features/<name>/model/`                            | Features orchestrate entity state for user interactions |
| Port (Interface)            | `entities/<name>/model/ports.ts`                    | Contract defined by the data owner                      |
| Driven Adapter (Repository) | `entities/<name>/api/`                              | Data access lives in the entity's `api/` segment        |
| Driving Adapter (UI)        | `entities/*/ui/`, `features/*/ui/`, `widgets/*/ui/` | Depends on abstraction level                            |
| Fixtures / Mock Data        | `shared/api/`                                       | Mock data is infrastructure, not domain                 |

### Key Constraint

FSD forbids cross-slice imports within the same layer. DDD bounded contexts communicated via ports — in FSD, the same decoupling is achieved by:

- Entities cannot import from other entities → shared types go to `shared/lib/`
- Features can import from any entity (features → entities is allowed)
- Features cannot import from other features → composition happens in `widgets/` or `pages/`

---

## 2. Slice Decomposition

### Entities Layer

| Slice              | DDD Origin                | Owns                                                                       |
| ------------------ | ------------------------- | -------------------------------------------------------------------------- |
| `entities/cart`    | Cart Bounded Context      | `Cart` aggregate, `CartItem` entity, cart state, `ICartRepository` port    |
| `entities/product` | Inventory Bounded Context | `ProductVariant` aggregate, `StockReservation` VO, `IStockRepository` port |
| `entities/coupon`  | Pricing Bounded Context   | `Coupon` aggregate, discount logic, `ICouponRepository` port               |

### Features Layer

| Slice                   | DDD Origin             | Orchestrates                                                                                   |
| ----------------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| `features/cart-actions` | Cart Use Cases         | AddToCart, RemoveFromCart, ChangeQuantity (imports: `entities/cart`, `entities/product`)       |
| `features/apply-coupon` | Pricing Use Cases      | ApplyCoupon, RemoveCoupon (imports: `entities/cart`, `entities/coupon`)                        |
| `features/checkout`     | Cross-Context Checkout | InitiateCheckout, stock validation, reservation (imports: `entities/cart`, `entities/product`) |

### Widgets Layer

| Slice                   | Composes                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `widgets/cart-list`     | CartRow + EmptyState + QuantitySelector (from `entities/cart/ui/` + `features/cart-actions/ui/`) |
| `widgets/order-summary` | OrderSummary + CouponInput (from `entities/cart/ui/` + `features/apply-coupon/ui/`)              |

### Pages Layer

| Slice        | Composes                                               |
| ------------ | ------------------------------------------------------ |
| `pages/cart` | `widgets/cart-list` + `widgets/order-summary` + layout |
| `pages/home` | Product grid + AddToCart buttons                       |

### Shared Layer

| Segment          | Contains                                                                          |
| ---------------- | --------------------------------------------------------------------------------- |
| `shared/lib/`    | `Money` VO, `EventBus`, `cn()` utility, generic types (`ApiResponse`, `Nullable`) |
| `shared/ui/`     | shadcn components, custom UI primitives (Button, Input, Badge, etc.)              |
| `shared/api/`    | HTTP client, mock fixtures (products, inventory, coupons data)                    |
| `shared/config/` | Environment variables, constants                                                  |

---

## 3. Bounded Contexts → FSD Cross-References

### Cart Context (🛍️)

**Ubiquitous Language:** Cart, CartItem, skuId, subtotal, quantity.

**FSD distribution:**

- `entities/cart/model/cart.ts` — Cart aggregate root (state: Active → Checkout_Pending → Checked_Out)
- `entities/cart/model/cart-item.ts` — CartItem entity (identifier: skuId)
- `entities/cart/model/events.ts` — ItemAddedToCart, CartItemQuantityChanged, ItemRemovedFromCart, CouponApplied, CouponRemoved, CartCleared, CheckoutInitiated
- `entities/cart/model/ports.ts` — ICartRepository
- `entities/cart/api/` — ZustandCartRepository (implements ICartRepository)
- `entities/cart/ui/` — CartRow, EmptyState (pure presentation of cart data)
- `features/cart-actions/model/` — AddToCart, RemoveFromCart, ChangeQuantity use cases
- `features/cart-actions/ui/` — QuantitySelector, RemoveButton (interactive controls)

### Inventory Context (📦)

**Ubiquitous Language:** ProductVariant, stock availability, reservation, depletion.

**FSD distribution:**

- `entities/product/model/product-variant.ts` — ProductVariant aggregate (skuId, totalOnHand, sold, pricing)
- `entities/product/model/stock-reservation.ts` — StockReservation VO (orderId, quantity, timestamp)
- `entities/product/model/events.ts` — StockReserved, StockDepleted
- `entities/product/model/ports.ts` — IStockRepository
- `entities/product/api/` — MockInventoryRepository (loads from shared/api fixtures)
- `entities/product/ui/` — ProductCard (pure presentation)

### Pricing Context (🎟️)

**Ubiquitous Language:** Coupon, validation, discount.

**FSD distribution:**

- `entities/coupon/model/coupon.ts` — Coupon aggregate (code, discount_amount, discount_percentage)
- `entities/coupon/model/events.ts` — CouponValidated, CouponValidationFailed, DiscountCalculated
- `entities/coupon/model/ports.ts` — ICouponRepository
- `entities/coupon/api/` — MockCouponRepository (loads from shared/api fixtures)
- `features/apply-coupon/model/` — ValidateCoupon, CalculateDiscount use cases
- `features/apply-coupon/ui/` — CouponInput component

---

## 4. Cross-Context Communication in FSD

| DDD Pattern                                           | FSD Implementation                                                                                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Synchronous port call (Cart → Inventory)              | Feature imports from two entities: `features/cart-actions` imports `entities/cart` + `entities/product`. No direct entity↔entity import. |
| Async domain event (CheckoutInitiated → ReserveStock) | `shared/lib/event-bus.ts` carries the event. `features/checkout` publishes, subscription wired in `app/` providers.                      |
| Context Adapter (InventoryContextAdapter)             | Not needed in FSD. Features import entities directly — the layer hierarchy IS the adapter.                                               |

### Why Context Adapters Disappear

In Hexagonal, `InventoryContextAdapter` existed because Cart Context couldn't directly call Inventory Context — they were separate hexagons. In FSD, `features/cart-actions/` can directly import from `entities/product/` (features → entities is allowed). The FSD layer rule replaces the port indirection.

**Exception:** `ICartRepository` (and other repository ports) remain because they abstract over storage mechanism (Zustand today, API tomorrow). This is infrastructure decoupling, not context decoupling.

---

## 5. File Structure (Target)

```
src/
├── app/
│   ├── providers/          # EventBus wiring, Zustand providers
│   ├── routing/            # Route config
│   └── index.ts
├── pages/
│   ├── cart/
│   │   ├── ui/CartPage.tsx
│   │   └── index.ts
│   └── home/
│       ├── ui/HomePage.tsx
│       └── index.ts
├── widgets/
│   ├── cart-list/
│   │   ├── ui/CartList.tsx
│   │   └── index.ts
│   └── order-summary/
│       ├── ui/OrderSummary.tsx
│       └── index.ts
├── features/
│   ├── cart-actions/
│   │   ├── model/          # AddToCart, RemoveFromCart, ChangeQuantity
│   │   ├── ui/             # QuantitySelector, RemoveButton
│   │   └── index.ts
│   ├── apply-coupon/
│   │   ├── model/          # ValidateCoupon, CalculateDiscount
│   │   ├── ui/             # CouponInput
│   │   └── index.ts
│   └── checkout/
│       ├── model/          # InitiateCheckout, stock validation
│       ├── ui/             # CheckoutButton, StockConflictModal
│       └── index.ts
├── entities/
│   ├── cart/
│   │   ├── model/          # Cart, CartItem, events, ports, types
│   │   ├── api/            # ZustandCartRepository
│   │   ├── ui/             # CartRow, EmptyState
│   │   └── index.ts
│   ├── product/
│   │   ├── model/          # ProductVariant, StockReservation, events, ports
│   │   ├── api/            # MockInventoryRepository
│   │   ├── ui/             # ProductCard
│   │   └── index.ts
│   └── coupon/
│       ├── model/          # Coupon, events, ports
│       ├── api/            # MockCouponRepository
│       └── index.ts
└── shared/
    ├── ui/                 # shadcn + custom components
    ├── lib/                # Money, EventBus, cn(), types
    ├── api/                # HTTP client, fixtures
    └── config/             # Constants, env
```
