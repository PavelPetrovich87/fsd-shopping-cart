import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Button } from '@/shared/ui'
import { StockConflictModal } from './stock-conflict-modal'

const meta = {
  title: 'Features/Checkout/StockConflictModal',
  component: StockConflictModal,
  tags: ['autodocs'],
} satisfies Meta<typeof StockConflictModal>

export default meta
type Story = StoryObj<typeof meta>

const multiProductConflicts = [
  {
    skuId: 'sku-1',
    productName: 'Classic T-Shirt',
    requestedQuantity: 3,
    availableQuantity: 1,
    imageUrl: 'https://placehold.co/48',
  },
  {
    skuId: 'sku-2',
    productName: 'Running Shoes',
    requestedQuantity: 2,
    availableQuantity: 0,
    imageUrl: 'https://placehold.co/48',
  },
]

const singleProductConflict = [
  {
    skuId: 'sku-1',
    productName: 'Classic T-Shirt',
    requestedQuantity: 3,
    availableQuantity: 1,
  },
]

const emptyCartConflict = [
  {
    skuId: 'sku-1',
    productName: 'Classic T-Shirt',
    requestedQuantity: 3,
    availableQuantity: 0,
  },
]

function ModalWrapper({
  conflicts,
}: {
  conflicts: Array<{
    skuId: string
    productName: string
    requestedQuantity: number
    availableQuantity: number
    imageUrl?: string
  }>
}) {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <StockConflictModal
        open={open}
        conflicts={conflicts}
        onAcknowledge={() => setOpen(false)}
      />
    </>
  )
}

export const MultiProduct: Story = {
  args: {
    open: true,
    conflicts: multiProductConflicts,
    onAcknowledge: () => {},
  },
  render: () => <ModalWrapper conflicts={multiProductConflicts} />,
}

export const SingleProduct: Story = {
  args: {
    open: true,
    conflicts: singleProductConflict,
    onAcknowledge: () => {},
  },
  render: () => <ModalWrapper conflicts={singleProductConflict} />,
}

export const SingleProductEmptyCart: Story = {
  args: {
    open: true,
    conflicts: emptyCartConflict,
    onAcknowledge: () => {},
  },
  render: () => <ModalWrapper conflicts={emptyCartConflict} />,
}

export const WithImages: Story = {
  args: {
    open: true,
    conflicts: multiProductConflicts,
    onAcknowledge: () => {},
  },
  render: () => <ModalWrapper conflicts={multiProductConflicts} />,
}
