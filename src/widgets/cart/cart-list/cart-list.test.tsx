import { page, userEvent } from 'vitest/browser'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CartList } from './cart-list'

import type { CartListItem } from '../model/types'

const mockItems: CartListItem[] = [
  {
    skuId: 'sku-1',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones.',
    imageUrl: 'https://placehold.co/120x120?text=Headphones',
    specs: { Color: 'Black' },
    price: '$199.00',
    quantity: 1,
    minQuantity: 1,
    maxQuantity: 5,
  },
  {
    skuId: 'sku-2',
    name: 'Mechanical Keyboard',
    description: 'Tactile switches with RGB backlight.',
    imageUrl: 'https://placehold.co/120x120?text=Keyboard',
    specs: { Switch: 'Brown' },
    price: '$149.00',
    quantity: 2,
    minQuantity: 1,
    maxQuantity: 3,
  },
]

function renderCartList(props: React.ComponentProps<typeof CartList>) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  root.render(<CartList {...props} />)
  return { container, cleanup: () => root.unmount() }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('CartList', () => {
  it('renders all item names', async () => {
    renderCartList({
      items: mockItems,
      onIncrement: vi.fn(),
      onDecrement: vi.fn(),
      onRemove: vi.fn(),
    })

    await expect.element(page.getByText('Wireless Headphones')).toBeVisible()
    await expect.element(page.getByText('Mechanical Keyboard')).toBeVisible()
  })

  it('calls onIncrement with skuId when increment button is clicked', async () => {
    const onIncrement = vi.fn()
    renderCartList({
      items: mockItems,
      onIncrement,
      onDecrement: vi.fn(),
      onRemove: vi.fn(),
    })

    const incrementButton = page
      .getByRole('group', { name: 'Quantity selector' })
      .getByRole('button', { name: 'Increase quantity' })
      .first()
    await userEvent.click(incrementButton)

    expect(onIncrement).toHaveBeenCalledTimes(1)
    expect(onIncrement).toHaveBeenCalledWith('sku-1')
  })

  it('calls onRemove with skuId when remove button is clicked', async () => {
    const onRemove = vi.fn()
    renderCartList({
      items: mockItems,
      onIncrement: vi.fn(),
      onDecrement: vi.fn(),
      onRemove,
    })

    const removeButton = page.getByRole('button', { name: 'Remove' }).first()
    await userEvent.click(removeButton)

    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith('sku-1')
  })

  it('renders empty state and calls onEmptyStateAction', async () => {
    const onEmptyStateAction = vi.fn()
    renderCartList({
      items: [],
      emptyStateTitle: 'Your cart is empty',
      emptyStateDescription: 'Add something to get started.',
      emptyStateActionLabel: 'Browse products',
      onEmptyStateAction,
      onIncrement: vi.fn(),
      onDecrement: vi.fn(),
      onRemove: vi.fn(),
    })

    await expect.element(page.getByText('Your cart is empty')).toBeVisible()

    const cta = page.getByRole('button', { name: 'Browse products' })
    await userEvent.click(cta)

    expect(onEmptyStateAction).toHaveBeenCalledTimes(1)
  })
})
