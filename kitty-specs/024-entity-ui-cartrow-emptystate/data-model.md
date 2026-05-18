# Data Model: CartRow and EmptyState

**Feature**: CartRow and EmptyState Entity UI
**Mission**: 024-entity-ui-cartrow-emptystate
**Date**: 2026-05-18

---

## Overview

This document defines the prop interfaces (component contracts) for the two presentation components. No domain entities are created or modified in this mission - the components receive all data via props.

---

## CartRow

### Props Interface

```typescript
interface CartRowProps {
  // Product identification
  skuId: string

  // Product display data
  name: string
  description: string
  imageUrl: string
  specs?: Record<string, string>  // e.g., { Color: 'Blue', Size: 'M' }

  // Pricing (pre-formatted by consumer)
  price: string  // e.g., "$25.00" or "$29.99 $44.99"

  // Quantity controls
  quantity: number
  minQuantity?: number   // default: 1
  maxQuantity?: number   // default: 99

  // States
  disabled?: boolean     // default: false

  // Interaction callbacks
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}
```

### Data Flow

```
Product (entities/product)
  -> skuId, name, description, imageUrl, category

CartItem (entities/cart)
  -> skuId, name, unitPriceCents, quantity, createdAt

Widget Layer (widgets/cart-list)
  -> Joins CartItem + Product by skuId
  -> Formats price using Money.fromPrice()
  -> Maps to CartRowProps
  -> Renders <CartRow {...props} />
```

### Field Mapping

| CartRow Prop | Source | Transformation |
|---|---|---|
| `skuId` | CartItem.skuId | Direct pass-through |
| `name` | CartItem.name | Direct pass-through |
| `description` | Product.description | Looked up by skuId |
| `imageUrl` | Product.imageUrl | Looked up by skuId |
| `specs` | Product (future) or undefined | Optional; not in current fixtures |
| `price` | CartItem.unitPriceCents | Formatted via Money.format() |
| `quantity` | CartItem.quantity | Direct pass-through |
| `minQuantity` | Constant (1) | Default prop |
| `maxQuantity` | ProductVariant.totalOnHand | Looked up via IStockRepository |
| `disabled` | Cart.state !== 'Active' | Computed by widget |

---

## EmptyState

### Props Interface

```typescript
interface EmptyStateProps {
  // Content
  icon?: React.ReactNode        // default: ShoppingCart icon from lucide-react
  title: string                 // e.g., "Your cart is empty"
  description: string           // e.g., "Looks like you haven't added anything yet."

  // Primary action (required)
  primaryAction: {
    label: string
    onClick: () => void
  }

  // Secondary action (optional)
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}
```

### Data Flow

```
Page (pages/cart)
  -> Defines title, description, action labels
  -> Passes to <EmptyState {...props} />
```

---

## Entity Relationships

```
+----------------+        +------------------+
|    Product     |        |    CartItem      |
|  (catalog)     |        |   (cart domain)  |
+----------------+        +------------------+
| skuId          |<------>| skuId            |
| name           |        | name             |
| description    |        | unitPriceCents   |
| imageUrl       |        | quantity         |
| category       |        | createdAt        |
+----------------+        +------------------+
         ^                          ^
         |                          |
         +-----------+--------------+
                     |
              Widget Layer
                     |
                     v
         +---------------------+
         |     CartRowProps     |
         +---------------------+
         | skuId                |
         | name                 |
         | description          |
         | imageUrl             |
         | specs?               |
         | price (formatted)    |
         | quantity             |
         | minQuantity?         |
         | maxQuantity?         |
         | disabled?            |
         | onIncrement          |
         | onDecrement          |
         | onRemove             |
         +---------------------+
```

---

## Type Exports

Both prop interfaces are exported from their respective `index.ts` files and re-exported from `entities/cart/index.ts` for consumption by widget layers.

```typescript
// entities/cart/ui/cart-row/index.ts
export type { CartRowProps } from './cart-row'

// entities/cart/ui/empty-state/index.ts
export type { EmptyStateProps } from './empty-state'

// entities/cart/index.ts (updated)
export type { CartRowProps } from './ui/cart-row'
export type { EmptyStateProps } from './ui/empty-state'
```
