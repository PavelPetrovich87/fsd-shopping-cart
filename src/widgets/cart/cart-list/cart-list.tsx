import { CartRow, EmptyState } from '@/entities/cart'

import type { CartListProps } from '../model/types'

export function CartList({
  items,
  emptyStateTitle = 'Your cart is empty',
  emptyStateDescription = 'Looks like you have not added anything to your cart yet.',
  emptyStateActionLabel = 'Start shopping',
  onEmptyStateAction,
  onIncrement,
  onDecrement,
  onRemove,
  disabled = false,
}: CartListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyStateTitle}
        description={emptyStateDescription}
        primaryAction={{
          label: emptyStateActionLabel,
          onClick: onEmptyStateAction ?? (() => {}),
        }}
      />
    )
  }

  return (
    <section aria-label="Shopping cart items" className="flex flex-col">
      {items.map((item) => (
        <CartRow
          key={item.skuId}
          skuId={item.skuId}
          name={item.name}
          description={item.description}
          imageUrl={item.imageUrl}
          specs={item.specs}
          price={item.price}
          quantity={item.quantity}
          minQuantity={item.minQuantity}
          maxQuantity={item.maxQuantity}
          disabled={disabled}
          onIncrement={() => onIncrement(item.skuId)}
          onDecrement={() => onDecrement(item.skuId)}
          onRemove={() => onRemove(item.skuId)}
        />
      ))}
    </section>
  )
}
