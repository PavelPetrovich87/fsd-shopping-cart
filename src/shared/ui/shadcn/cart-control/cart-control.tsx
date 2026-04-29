import { Minus, Plus } from 'lucide-react'

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
  return (
    <div
      role="group"
      aria-label="Quantity selector"
      className="inline-flex flex-row items-center gap-3 rounded-md border px-0.5 py-0.5"
      style={{ borderColor: '#e6e6e6', backgroundColor: '#fafafa' }}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || quantity <= min}
        onClick={onDecrement}
        className="flex size-5 items-center justify-center rounded-sm transition-colors hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-50"
      >
        <Minus size={14} style={{ color: '#525252' }} />
      </button>

      <span
        aria-live="polite"
        aria-atomic="true"
        className="min-w-[32px] text-center text-sm font-medium"
        style={{ color: '#525252' }}
      >
        {quantity}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || quantity >= max}
        onClick={onIncrement}
        className="flex size-5 items-center justify-center rounded-sm transition-colors hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-50"
      >
        <Plus size={14} style={{ color: '#525252' }} />
      </button>
    </div>
  )
}
