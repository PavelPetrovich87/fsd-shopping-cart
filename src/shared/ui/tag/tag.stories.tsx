import type { Meta, StoryObj } from '@storybook/react'

import { Tag } from './tag'

const meta = {
  title: 'UI/Tag',
  component: Tag,
  tags: ['autodocs'],
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Label',
  },
}

export const WithDismiss: Story = {
  args: {
    children: 'Removable',
    onDismiss: () => {
      console.log('Tag dismissed')
    },
  },
}

export const LongText: Story = {
  args: {
    children: 'Very long tag label that tests padding',
  },
}
