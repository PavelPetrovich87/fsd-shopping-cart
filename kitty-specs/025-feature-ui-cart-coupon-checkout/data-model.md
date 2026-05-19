# Data Model: 025-feature-ui-cart-coupon-checkout

**Feature**: Feature UI Components for Cart, Coupon, and Checkout

## Component Data Models

Since these are presentational UI components, the "data model" consists of their prop interfaces and state transitions.

### QuantitySelector

**Props Interface**:
```typescript
interface QuantitySelectorProps {
  skuId: string
  quantity: number
  minQuantity?: number        // default: 1
  maxQuantity?: number        // stock-aware upper bound
  disabled?: boolean          // default: false
  onChangeQuantity: (skuId: string, newQuantity: number) => void
}
```

**State Transitions**:
- User clicks "-": if `quantity > minQuantity`, calls `onChangeQuantity(skuId, quantity - 1)`
- User clicks "+": if `quantity < maxQuantity`, calls `onChangeQuantity(skuId, quantity + 1)`
- "-" button disabled when `quantity <= minQuantity`
- "+" button disabled when `quantity >= maxQuantity`

**Validation Rules**:
- `minQuantity` must be >= 1
- `maxQuantity` must be >= `minQuantity`
- `quantity` must be between `minQuantity` and `maxQuantity` (inclusive)

### RemoveButton

**Props Interface**:
```typescript
interface RemoveButtonProps {
  skuId: string
  disabled?: boolean          // default: false
  onRemove: (skuId: string) => void
}
```

**State Transitions**:
- Initial: link visible, modal closed
- User clicks "Remove": modal opens (open: true)
- User clicks "Cancel" / "X" / backdrop / ESC: modal closes (open: false), focus returns to Remove button
- User clicks "Yes": modal closes (open: false), calls `onRemove(skuId)`, focus returns to Remove button

**Validation Rules**:
- Modal must trap focus while open (handled by Modal base component)
- Focus must restore to trigger button on close (handled by Modal base component)

### CouponInput

**Props Interface**:
```typescript
type CouponInputState = 'idle' | 'input' | 'success'

interface CouponInputProps {
  appliedCoupon?: {
    code: string
    discountAmount: string     // formatted display string (e.g., "$5.00")
  }
  error?: string               // validation error message
  disabled?: boolean           // default: false
  onApply: (code: string) => void
  onRemove: () => void
}
```

**State Transitions**:
```
idle (showing "Apply coupon" button)
  |--[click button]--> input (showing text input + submit button)
  |
input
  |--[submit empty]--> input (with error: "Please enter a valid code")
  |--[submit invalid]--> input (with error: "Sorry, but this coupon doesn't exist")
  |--[submit valid]--> success (showing dismissible tag)
  |--[cancel/lose focus?]--> idle (C-004 says instant toggle)
  |
success
  |--[click dismiss]--> idle
```

**Validation Rules**:
- Empty submission triggers immediate error
- Validation happens on submit, not while typing (C-004)
- Error display uses text + icon (NFR-006)

### CheckoutButton

**Props Interface**:
```typescript
interface CheckoutButtonProps {
  disabled?: boolean          // default: false; parent computes from cart state
  onCheckout: () => void
}
```

**State Transitions**:
- User clicks button: calls `onCheckout()`
- Button disabled when `disabled === true`

**Validation Rules**:
- Parent must disable when cart is empty or not in Active state

### StockConflictModal

**Props Interface**:
```typescript
interface StockConflictModalProps {
  open: boolean
  conflicts: StockConflict[]
  onClose: () => void
  onGoBackToCart?: () => void   // only used for empty-cart variant
}

// StockConflict from features/checkout/model/result-types.ts
interface StockConflict {
  skuId: string
  productName: string
  requestedQuantity: number
  availableQuantity: number
}
```

**State Transitions**:
- Modal opens when `open === true` (triggered by parent after InitiateCheckout returns stock conflicts)
- Multi-product variant (conflicts.length > 1 OR any conflict has availableQuantity > 0):
  - Title: "Change of stock"
  - Shows list of affected products with old qty -> arrow -> new qty
  - Action: "Ok" button closes modal
- Single-product empty-cart variant (conflicts.length === 1 AND conflicts[0].availableQuantity === 0):
  - Title: "Change of stock"
  - Shows single product card
  - Message: "Since there are no more items in your cart, you will be brought back to cart"
  - Action: "Go back to cart" button calls `onGoBackToCart()` then closes

**Validation Rules**:
- `conflicts` array must not be empty when modal is open
- Modal must expose correct ARIA semantics (handled by Modal base component)

## Entity Relationships

```
QuantitySelector --uses--> CartControl (shared/ui)
                --receives--> CartItem.quantity, availableStock

RemoveButton --uses--> Button (shared/ui), Modal (shared/ui)
             --triggers--> onRemove callback

CouponInput --uses--> Button (shared/ui), InputField (shared/ui), Tag (shared/ui)
            --triggers--> onApply, onRemove callbacks

CheckoutButton --uses--> Button (shared/ui)
               --triggers--> onCheckout callback

StockConflictModal --uses--> Modal (shared/ui)
                   --displays--> StockConflict[] (from checkout use case)
```

## Type Mapping to Existing Entities

| Component Prop | Maps To | Source |
|---|---|---|
| `QuantitySelectorProps.skuId` | `CartItem.skuId` | `entities/cart/model/cart-item.ts` |
| `QuantitySelectorProps.maxQuantity` | `availableStock(variant)` | `entities/product/model/available-stock.ts` |
| `CouponInputProps.appliedCoupon.code` | `Cart.couponCode` | `entities/cart/model/cart.ts` |
| `StockConflictModalProps.conflicts` | `StockConflict[]` | `features/checkout/model/result-types.ts` |
| `CheckoutButtonProps.disabled` | `cart.items.size === 0 \|\| cart.state !== 'Active'` | `entities/cart/model/cart.ts` |
