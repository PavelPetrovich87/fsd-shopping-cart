import { Button, Modal } from '@/shared/ui'

export interface StockConflict {
  skuId: string
  productName: string
  requestedQuantity: number
  availableQuantity: number
  imageUrl?: string
}

export interface StockConflictModalProps {
  open: boolean
  conflicts: StockConflict[]
  onAcknowledge: () => void
}

export function StockConflictModal({
  open,
  conflicts,
  onAcknowledge,
}: StockConflictModalProps) {
  const isSingleProductEmptyCart =
    conflicts.length === 1 && conflicts[0].availableQuantity === 0

  return (
    <Modal open={open} onClose={onAcknowledge} title="Change of stock">
      <div className="flex flex-col gap-3">
        {conflicts.map((conflict) => (
          <div
            key={conflict.skuId}
            className="flex items-center gap-3 rounded border p-3"
          >
            {conflict.imageUrl ? (
              <img
                src={conflict.imageUrl}
                alt={conflict.productName}
                className="size-12 rounded object-cover"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded bg-neutral-100">
                <span className="text-xs text-neutral-400">IMG</span>
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium">{conflict.productName}</p>
              <p className="text-sm text-neutral-600">
                {conflict.requestedQuantity} → {conflict.availableQuantity}
              </p>
            </div>
          </div>
        ))}

        {isSingleProductEmptyCart && (
          <p className="text-sm text-neutral-600">
            Since there are no more items in your cart, you will be brought back to cart
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onAcknowledge}>
          {isSingleProductEmptyCart ? 'Go back to cart' : 'Ok'}
        </Button>
      </div>
    </Modal>
  )
}
