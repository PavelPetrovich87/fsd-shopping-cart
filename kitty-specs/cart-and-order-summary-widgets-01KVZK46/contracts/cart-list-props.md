# CartList Props Contract

Source of truth for the public API of `src/widgets/cart/cart-list/cart-list.tsx`.

```ts
export interface CartListItem {
  skuId: string
  name: string
  description: string
  imageUrl: string
  specs?: Record<string, string>
  price: string
  quantity: number
  minQuantity?: number
  maxQuantity?: number
}

export interface CartListProps {
  items: CartListItem[]
  emptyStateTitle?: string
  emptyStateDescription?: string
  emptyStateActionLabel?: string
  onEmptyStateAction?: () => void
  onIncrement: (skuId: string) => void
  onDecrement: (skuId: string) => void
  onRemove: (skuId: string) => void
  disabled?: boolean
}
```
