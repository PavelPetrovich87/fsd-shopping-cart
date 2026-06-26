import { useState } from 'react'

import { Button } from '@/shared/ui'
import { Modal } from '@/shared/ui/modal'

export interface RemoveButtonProps {
  onRemove: () => void
}

export function RemoveButton({ onRemove }: RemoveButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = () => setIsModalOpen(true)
  const handleClose = () => setIsModalOpen(false)

  const handleConfirm = () => {
    onRemove()
    setIsModalOpen(false)
  }

  return (
    <>
      <Button variant="link" size="default" onClick={handleOpen}>
        Remove
      </Button>

      <Modal
        open={isModalOpen}
        onClose={handleClose}
        title="Confirm Item Removal"
      >
        <p className="text-sm text-neutral-600">
          Are you sure you want to remove this item from your shopping cart?
        </p>
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Yes</Button>
        </div>
      </Modal>
    </>
  )
}
