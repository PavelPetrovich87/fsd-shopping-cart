import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Button, Modal } from '@/shared/ui'
import { RemoveButton } from './remove-button'

const meta = {
  title: 'Features/CartActions/RemoveButton',
  component: RemoveButton,
  tags: ['autodocs'],
} satisfies Meta<typeof RemoveButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onRemove: () => {},
  },
}

export const ModalOpen: Story = {
  args: {
    onRemove: () => {},
  },
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button variant="link" onClick={() => setOpen(true)}>
          Remove
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Confirm Item Removal">
          <p className="text-sm text-neutral-600">
            Are you sure you want to remove this item from your shopping cart?
          </p>
          <div className="mt-8 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Yes</Button>
          </div>
        </Modal>
      </>
    )
  },
}
