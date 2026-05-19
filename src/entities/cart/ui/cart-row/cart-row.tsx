import { CartControl } from '@/shared/ui'
import { Button } from '@/shared/ui'

export interface CartRowProps {
  skuId: string
  name: string
  description: string
  imageUrl: string
  specs?: Record<string, string>
  price: string
  quantity: number
  minQuantity?: number
  maxQuantity?: number
  disabled?: boolean
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}

function PriceDisplay({ price }: { price: string }) {
  const parts = price.split(' ')
  if (parts.length === 2) {
    return (
      <span className="font-medium text-base text-neutral-900">
        <span>{parts[0]}</span>{' '}
        <span className="text-neutral-500 line-through">{parts[1]}</span>
      </span>
    )
  }
  return <span className="font-medium text-base text-neutral-900">{price}</span>
}

function SpecsDisplay({ specs }: { specs?: Record<string, string> }) {
  if (!specs || Object.keys(specs).length === 0) return null

  const entries = Object.entries(specs)
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {entries.map(([key, value], index) => (
        <span key={key} className="text-sm text-neutral-500">
          {key}: {value}
          {index < entries.length - 1 && (
            <span className="ml-3 text-neutral-300">·</span>
          )}
        </span>
      ))}
    </div>
  )
}

export function CartRow({
  skuId,
  name,
  description,
  imageUrl,
  specs,
  price,
  quantity,
  minQuantity,
  maxQuantity,
  disabled = false,
  onIncrement,
  onDecrement,
  onRemove,
}: CartRowProps) {
  return (
    <li data-skuid={skuId} className="flex flex-col gap-3 border-b border-neutral-200 p-4 md:flex-row md:gap-3 lg:gap-4">
      <div className="shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover rounded-md md:w-20 md:h-20 lg:w-24 lg:h-24"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-base text-neutral-900">{name}</h3>
          <SpecsDisplay specs={specs} />
          <p className="text-sm text-neutral-600 line-clamp-2">{description}</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <PriceDisplay price={price} />

          <div className="flex items-center gap-3">
            <CartControl
              quantity={quantity}
              min={minQuantity ?? 1}
              max={maxQuantity ?? 99}
              disabled={disabled}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={disabled}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}
