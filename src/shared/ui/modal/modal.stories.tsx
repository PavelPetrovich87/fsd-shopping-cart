import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/shared/ui/shadcn/button'
import { Modal } from './modal'

const meta = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

function ModalWrapper({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        {children}
      </Modal>
    </>
  )
}

export const Open: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Modal Title',
    children: 'Content',
  },
  render: () => (
    <ModalWrapper title="Modal Title">
      <p>This is the modal content.</p>
    </ModalWrapper>
  ),
}

export const WithoutTitle: Story = {
  args: {
    open: true,
    onClose: () => {},
    children: 'Content',
  },
  render: () => (
    <ModalWrapper>
      <p>This modal has no title.</p>
    </ModalWrapper>
  ),
}

export const WithLongContent: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Long Content',
    children: 'Content',
  },
  render: () => (
    <ModalWrapper title="Long Content">
      <div {...{ className: 'max-h-40 overflow-y-auto' }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </p>
      </div>
    </ModalWrapper>
  ),
}

export const WithFormContent: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Edit Profile',
    children: 'Content',
  },
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Form Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Edit Profile">
          <form
            {...{
              className: 'flex flex-col gap-4',
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div {...{ className: 'flex flex-col gap-1.5' }}>
              <label htmlFor="name" {...{ className: 'text-sm font-medium' }}>
                Name
              </label>
              <input
                id="name"
                type="text"
                {...{
                  className:
                    'rounded-md border border-border px-3 py-2 text-sm',
                }}
              />
            </div>
            <div {...{ className: 'flex flex-col gap-1.5' }}>
              <label htmlFor="email" {...{ className: 'text-sm font-medium' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                {...{
                  className:
                    'rounded-md border border-border px-3 py-2 text-sm',
                }}
              />
            </div>
            <div {...{ className: 'flex justify-end gap-2' }}>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Modal>
      </>
    )
  },
}

export const ConfirmationDialog: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Confirm Item Removal',
    children: 'Content',
  },
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Confirmation</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Item Removal"
        >
          <p {...{ className: 'text-sm text-neutral-600' }}>
            Are you sure you want to remove this item from your shopping cart?
          </p>
          <div {...{ className: 'mt-8 flex justify-end gap-3' }}>
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

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    title: 'Hidden Modal',
    children: 'Content',
  },
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Hidden Modal">
          <p>This modal is currently closed.</p>
        </Modal>
      </>
    )
  },
}
