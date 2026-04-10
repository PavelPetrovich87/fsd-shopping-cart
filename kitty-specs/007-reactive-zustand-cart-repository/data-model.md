# Data Model: Reactive Zustand Cart Repository

## Entity: CartStoreState
- Fields:
  - `cart` (Cart, required)
  - `lastUpdatedAt` (timestamp marker, required for change tracking)
- Validation rules:
  - `cart` must always be a valid cart aggregate instance.
  - Initial state must contain a valid empty cart representation.

## Entity: CartSnapshot
- Fields:
  - `cartId` (string)
  - `items` (collection of cart items)
  - `coupons` (collection)
  - `state` (cart lifecycle state)
  - `subtotal` (money value)
- Validation rules:
  - Snapshot must be internally consistent with cart domain invariants.
  - Quantity values in `items` must satisfy cart invariant requirements.

## Entity: ReactiveCartSelector
- Fields:
  - `selector` (function selecting cart or cart-derived state)
  - `selectedValue` (current derived value)
- Validation rules:
  - Selected value must update after repository persistence operations that change relevant cart state.
  - Selectors must not expose mutable access to internal store state.

## Entity: SaveCartCommand
- Fields:
  - `cart` (Cart, required)
- Validation rules:
  - Input cart must be a valid aggregate.
  - Command completion updates cart store state atomically for repository observers.

## Relationships Summary
- `SaveCartCommand` updates `CartStoreState`.
- `ReactiveCartSelector` derives observable values from `CartStoreState`.
- `CartSnapshot` is the persisted/read representation surfaced through repository contract behavior.

## State Transition Notes
- Initial: store initialized with valid baseline cart state.
- On `saveCart(cart)`: store transitions to new cart state and updates change marker.
- On `getCart()` consumption: selectors reflect latest persisted cart state reactively.
