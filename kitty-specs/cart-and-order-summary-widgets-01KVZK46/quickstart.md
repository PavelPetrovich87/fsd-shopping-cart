# Quick Start: Cart and Order Summary Widgets

## Import the widgets

```tsx
import { CartList, OrderSummary } from '@/widgets/cart'
```

## Render CartList

```tsx
<CartList
  items={cartItems}
  onIncrement={(skuId) => updateQuantity(skuId, 1)}
  onDecrement={(skuId) => updateQuantity(skuId, -1)}
  onRemove={(skuId) => removeItem(skuId)}
  emptyStateTitle="Your cart is empty"
  emptyStateDescription="Looks like you haven't added anything yet."
  emptyStateActionLabel="Continue shopping"
  onEmptyStateAction={() => navigate('/products')}
/>
```

## Render OrderSummary

```tsx
<OrderSummary
  subtotal="$120.00"
  discount="-$12.00"
  shipping="$8.00"
  total="$116.00"
  appliedCoupon={{ code: 'SAVE10', discountLabel: '-10%' }}
  onApplyCoupon={(code) => applyCoupon(code)}
  onRemoveCoupon={() => removeCoupon()}
  onCheckout={() => initiateCheckout()}
/>
```

## Compose on a page

The consuming page owns the responsive layout. Example using Tailwind CSS:

```tsx
export function CartPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <CartList items={items} {...callbacks} />
        </div>

        <div className="order-1 lg:order-2">
          <OrderSummary {...summary} {...couponActions} {...checkoutAction} />
        </div>
      </div>
    </main>
  )
}
```

On mobile the order summary stacks above the cart list; on desktop the cart list is on the left and the summary is on the right.

## Run stories and tests

```bash
# Start Storybook
npm run storybook

# Run browser-mode tests
npm run test:browser

# Run all quality gates
npm run lint && npm run lint:arch && npm run build
```
