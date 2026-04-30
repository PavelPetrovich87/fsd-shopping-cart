# Ports & Adapters

## Port = Interface

A Port is a TypeScript interface defined in the slice's `model/ports.ts`:

```typescript
// entities/cart/model/ports.ts
export interface ICartRepository {
  getCart(): Promise<Cart>
  saveCart(cart: Cart): Promise<void>
}
```

## Adapter = Concrete Implementation

An Adapter lives in the `api/` segment and implements the Port:

- **Mock adapter** — for testing/dev (e.g., `entities/coupon/api/mock-coupon-repository.ts`)
- **Real adapter** — Zustand store (e.g., `entities/cart/api/zustand-cart-repository.ts`)

## Dependency Direction

Domain depends on the Port, not the Adapter.

```typescript
// features/checkout receives repositories as params
export function checkout(
  cartRepo: ICartRepository,
  stockRepo: IStockRepository,
) {
  // ...
}
```

This inversion allows swapping implementations without touching domain logic.
