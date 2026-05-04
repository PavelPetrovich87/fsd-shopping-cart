import type { Meta, StoryObj } from '@storybook/react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

const triggerClassName =
  'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button {...{ className: triggerClassName }}>Hover me</button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const Bottom: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button {...{ className: triggerClassName }}>Hover me</button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Tooltip on bottom</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const Left: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button {...{ className: triggerClassName }}>Hover me</button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Tooltip on left</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const Right: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button {...{ className: triggerClassName }}>Hover me</button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Tooltip on right</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const WithCustomContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button {...{ className: triggerClassName }}>Custom content</button>
      </TooltipTrigger>
      <TooltipContent>
        <div {...{ className: 'flex items-center gap-2' }}>
          <span {...{ className: 'font-bold' }}>Bold</span>
          <span>and regular text</span>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
}

export const LongText: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button {...{ className: triggerClassName }}>Long text</button>
      </TooltipTrigger>
      <TooltipContent>
        <p {...{ className: 'max-w-xs' }}>
          This is a longer tooltip text that demonstrates how the component
          handles multi-line content and text wrapping behavior
        </p>
      </TooltipContent>
    </Tooltip>
  ),
}
