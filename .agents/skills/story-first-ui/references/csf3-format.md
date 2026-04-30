# CSF3 Format

Component Story Format 3 is the standard for Storybook stories.

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta = {
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Click me',
  },
}
```

Key rules:

- Use `satisfies Meta<typeof Component>` for the default export
- Use `StoryObj<typeof meta>` for story types
- Define all variants, sizes, and states as separate stories
