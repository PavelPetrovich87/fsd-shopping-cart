import type { Meta, StoryObj } from '@storybook/react'
import { VisualHarness } from './VisualHarness'

const meta = {
  title: 'Widgets/VisualHarness',
  component: VisualHarness,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VisualHarness>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  parameters: {
    mockData: {
      components: [],
    },
  },
}

export const FilteredToShared: Story = {
  decorators: [
    (Story) => {
      return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
          <Story />
        </div>
      )
    },
  ],
}

export const StorybookUnavailable: Story = {
  parameters: {
    mockError:
      'Storybook unavailable. Please ensure Storybook is running on localhost:6006',
  },
}
