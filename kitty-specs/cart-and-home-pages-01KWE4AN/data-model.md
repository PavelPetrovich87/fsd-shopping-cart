# Data Model: Cart and Home Pages

**Mission**: cart-and-home-pages-01KWE4AN  
**Date**: 2026-07-01

## Overview

This mission has no persistent storage or backend data model. The only data structures are:
1. The **mock product record** used to populate the HomePage grid.
2. The **page-level state contracts** describing what data flows into the CartPage and HomePage widgets.

## Mock Product Record

Stored in `src/shared/mocks/products.ts`.

```typescript
interface MockProduct {
  skuId: string
  name: string
  imageUrl: string
  listPriceCents: number
  salePriceCents: number | null
}
```

### Fields

| Field | Type | Constraints | Description |
|---|---|---|---|
| `skuId` | `string` | Unique, non-empty | Product identifier |
| `name` | `string` | Non-empty | Product display name |
| `imageUrl` | `string` | Valid URL or placeholder path | Product image |
| `listPriceCents` | `number` | Positive integer | Regular price in cents |
| `salePriceCents` | `number \| null` | Positive integer or null | Sale price in cents; `null` means no sale |

### Sample Data (6 records)

```typescript
export const mockProducts: MockProduct[] = [
  {
    skuId: 'prod-001',
    name: 'Wireless Bluetooth Headphones',
    imageUrl: '/images/headphones.jpg',
    listPriceCents: 9999,
    salePriceCents: 7999,
  },
  {
    skuId: 'prod-002',
    name: 'USB-C Charging Cable 2m',
    imageUrl: '/images/cable.jpg',
    listPriceCents: 1999,
    salePriceCents: null,
  },
  {
    skuId: 'prod-003',
    name: 'Mechanical Keyboard RGB',
    imageUrl: '/images/keyboard.jpg',
    listPriceCents: 14999,
    salePriceCents: 12999,
  },
  {
    skuId: 'prod-004',
    name: 'Wireless Mouse Ergonomic',
    imageUrl: '/images/mouse.jpg',
    listPriceCents: 4999,
    salePriceCents: null,
  },
  {
    skuId: 'prod-005',
    name: 'Portable Laptop Stand Aluminum',
    imageUrl: '/images/stand.jpg',
    listPriceCents: 3999,
    salePriceCents: 3499,
  },
  {
    skuId: 'prod-006',
    name: '4K Webcam with Microphone',
    imageUrl: '/images/webcam.jpg',
    listPriceCents: 7999,
    salePriceCents: null,
  },
]
```

*Note: Image paths are placeholders. The project may not have actual image assets; placeholder URLs (e.g., `https://via.placeholder.com/400`) or inline SVGs can be used if local assets are unavailable.*

## CartPage Data Flow

The CartPage is a stateless composition widget. It receives data and callbacks from its parent (currently `App.tsx` or a future router).

### Input Props

```typescript
interface CartPageProps {
  // From cart state (T-025, T-027)
  cartItems: CartListItem[]
  
  // From order calculation (T-027)
  subtotal: string
  discount?: string
  shipping?: string
  total: string
  
  // From coupon feature (T-026)
  appliedCoupon?: AppliedCoupon
  couponError?: string
  isCouponLoading?: boolean
  
  // Callbacks
  onIncrement: (skuId: string) => void
  onDecrement: (skuId: string) => void
  onRemove: (skuId: string) => void
  onApplyCoupon: (code: string) => void
  onRemoveCoupon: () => void
  onCheckout: () => void
  onEmptyStateAction?: () => void
}
```

### State Transitions

The CartPage itself is **stateless**. All state transitions are delegated to the parent via callbacks:

| Event | Handler | Target State |
|---|---|---|
| Increment quantity | `onIncrement(skuId)` | Parent updates cart quantity |
| Decrement quantity | `onDecrement(skuId)` | Parent updates cart quantity |
| Remove item | `onRemove(skuId)` | Parent removes item from cart |
| Apply coupon | `onApplyCoupon(code)` | Parent validates and applies coupon |
| Remove coupon | `onRemoveCoupon()` | Parent removes coupon |
| Checkout | `onCheckout()` | Parent initiates checkout flow |
| Empty state action | `onEmptyStateAction()` | Parent navigates to HomePage |

## HomePage Data Flow

The HomePage is also **stateless**.

### Input Props

```typescript
interface HomePageProps {
  products: MockProduct[]
  onAddToCart?: (skuId: string) => void
}
```

### State Transitions

| Event | Handler | Target State |
|---|---|---|
| Add to cart | `onAddToCart(skuId)` | Parent adds product to cart |

*Note: The `onAddToCart` handler is optional for this mission because the ProductCard widget currently does not include an "Add to Cart" button. If T-030 or T-032 adds this capability, the HomePage can wire it through.*

## No Backend Contracts

This mission does not define API contracts, database schemas, or server-side data models. All data is static or derived from existing frontend state (cart slice, coupon feature).
