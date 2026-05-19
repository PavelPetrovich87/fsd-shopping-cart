import { CartControl } from '@/shared/ui'

export interface QuantitySelectorProps {
  quantity: number
  availableStock: number
  disabled?: boolean
  onChangeQuantity: (newQuantity: number) => void
}

export function QuantitySelector({
  quantity,
  availableStock,
  disabled = false,
  onChangeQuantity,
}: QuantitySelectorProps) {
  const handleIncrement = () => {
    onChangeQuantity(quantity + 1)
  }

  const handleDecrement = () => {
    onChangeQuantity(quantity - 1)
  }

  return (
    <CartControl
      quantity={quantity}
      min={1}
      max={availableStock}
      disabled={disabled || availableStock <= 0}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
    />
  )
}
