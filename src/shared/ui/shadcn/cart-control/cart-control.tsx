import { Minus, Plus } from 'lucide-react'

import { Button } from '../button'

export interface CartControlProps {
  quantity: number
  min?: number
  max?: number
  disabled?: boolean
  onIncrement: () => void
  onDecrement: () => void
}

export function CartControl({
  quantity,
  min = 1,
  max = 99,
  disabled = false,
  onIncrement,
  onDecrement,
}: CartControlProps) {
  const atMin = quantity <= min
  const atMax = quantity >= max

  return (
    <div
      role="group"
      aria-label="Quantity selector"
      className="border-border inline-flex h-9 items-center gap-3 rounded-md border bg-neutral-100 p-0.5"
    >
      <Button
        variant="ghost"
        size="icon-2xs"
        aria-label="Decrease quantity"
        disabled={disabled || atMin}
        onClick={onDecrement}
      >
        <Minus />
      </Button>

      <span
        aria-live="polite"
        aria-atomic="true"
        className="flex h-8 min-w-12 items-center justify-center text-sm font-medium text-neutral-700"
      >
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="icon-2xs"
        aria-label="Increase quantity"
        disabled={disabled || atMax}
        onClick={onIncrement}
      >
        <Plus />
      </Button>
    </div>
  )
}
