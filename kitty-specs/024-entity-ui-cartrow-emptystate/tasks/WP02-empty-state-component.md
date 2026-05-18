---
work_package_id: WP02
title: EmptyState Component
dependencies: []
requirement_refs:
- FR-013
- FR-014
- FR-015
- FR-016
- FR-017
- FR-018
- FR-019
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts were generated on main; completed changes must merge back into main.
subtasks:
- T007
- T008
- T009
- T010
- T011
phase: Phase 1 - Component Implementation
assignee: ''
agent: ''
history:
- timestamp: '2026-05-18T12:32:09Z'
  agent: system
  action: Prompt generated via /spec-kitty.tasks
authoritative_surface: src/entities/cart/ui/empty-state/
execution_mode: code_change
owned_files:
- src/entities/cart/ui/empty-state/**
tags: []
---

# Work Package Prompt: WP02 - EmptyState Component

## Objective

Implement the EmptyState presentation component in `src/entities/cart/ui/empty-state/`. EmptyState displays a friendly message when the cart contains no items, including an icon in a circular container, a title, a description, and one or two action buttons.

## Context

- **Design reference**: Penpot board `Empty state message`, shape IDs for desktop/tablet/mobile variants
- **Design tokens**: Available in `src/shared/ui/tokens/` (colors, spacing, typography, radius, shadows)
- **Reusable component**: Button (`src/shared/ui/shadcn/button.tsx`) with variants: default, outline, secondary, ghost, destructive, link
- **Story-first convention**: Write `.stories.tsx` first, then implement the component to satisfy the stories.
- **Icon library**: Lucide React (`lucide-react`) - use `ShoppingCart` as default icon

## Branch Strategy

- **Planning base branch**: `main`
- **Final merge target**: `main`
- **Execution**: This WP will be implemented in a dedicated worktree allocated by `finalize-tasks`. Do not edit files directly in the main checkout.
- **Implementation command**: `spec-kitty agent action implement WP02 --agent <name>`

---

## Subtasks

### T007: Create EmptyState directory structure and define EmptyStateProps interface

**Purpose**: Set up the EmptyState component directory and define the complete prop interface.

**Steps**:
1. Create directory `src/entities/cart/ui/empty-state/`
2. Create `src/entities/cart/ui/empty-state/index.ts` that exports the component and its props type
3. Create `src/entities/cart/ui/empty-state/empty-state.tsx` with the EmptyStateProps interface:

```typescript
export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  primaryAction: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}
```

4. Create `src/entities/cart/ui/empty-state/empty-state.stories.tsx` with a basic story skeleton (to be filled in T010)

**Files**:
- `src/entities/cart/ui/empty-state/index.ts` (new)
- `src/entities/cart/ui/empty-state/empty-state.tsx` (new)
- `src/entities/cart/ui/empty-state/empty-state.stories.tsx` (new)

**Validation**:
- [ ] Directory structure matches FSD conventions
- [ ] Props interface is exported from index.ts
- [ ] TypeScript compiles without errors

---

### T008: Implement EmptyState layout (icon, title, description, actions)

**Purpose**: Build the EmptyState layout with centered content, circular icon container, title, description, and action button area.

**Steps**:
1. In `empty-state.tsx`, implement the layout using Tailwind CSS:
   - Outer container: flex column, items-center, justify-center, text-center, padding
   - Icon container: circular background (`bg-neutral-100`), fixed size (`w-12 h-12` = 48px), centered icon, `rounded-full`
   - Icon: default to `ShoppingCart` from `lucide-react` if no custom icon provided
   - Title: `text-xl`, `font-semibold`, `text-neutral-900`, margin-top `mt-6`
   - Description: `text-sm`, `text-neutral-600`, margin-top `mt-2`, max-width for readability
   - Action area: flex row with gap, margin-top `mt-8`
2. Use design tokens via Tailwind classes:
   - Background: `bg-neutral-100` for icon circle
   - Text colors: `text-neutral-900` (title), `text-neutral-600` (description)
   - Spacing: use standard Tailwind spacing scale

**Design notes**:
- The component should be self-contained and centered within its parent
- The icon circle should be visually prominent but subtle (neutral background)
- The title and description should be clearly separated from the icon
- Action buttons should be grouped with consistent gap

**Responsive behavior**:
- EmptyState should look good at all breakpoints
- Padding should adjust: `p-6` on mobile, `p-8` on desktop
- Max-width for content: `max-w-md` to prevent overly wide text

**Validation**:
- [ ] Layout is centered both horizontally and vertically
- [ ] Icon renders inside circular container
- [ ] Title and description are properly styled
- [ ] Action area has correct spacing
- [ ] Responsive padding works

---

### T009: Integrate Button component for primary/secondary actions

**Purpose**: Add primary and optional secondary action buttons using the existing Button component.

**Steps**:
1. Import Button from `@/shared/ui/shadcn/button`:
```typescript
import { Button } from '@/shared/ui/shadcn/button'
```
2. Render the primary action button:
   - Variant: `default`
   - Size: `default`
   - Label: `primaryAction.label`
   - onClick: `primaryAction.onClick`
3. Conditionally render the secondary action button if `secondaryAction` is provided:
   - Variant: `outline`
   - Size: `default`
   - Label: `secondaryAction.label`
   - onClick: `secondaryAction.onClick`
4. Ensure buttons are grouped in a flex container with `gap-3`

**Design notes**:
- Primary action should be visually dominant (default variant with primary background)
- Secondary action should be subtle (outline variant)
- Both buttons should have the same height for visual alignment
- Button text should not wrap (use `whitespace-nowrap` if needed, but Button component should handle this)

**Validation**:
- [ ] Primary button renders with correct label
- [ ] Primary button onClick fires correctly
- [ ] Secondary button renders when prop is provided
- [ ] Secondary button does not render when prop is omitted
- [ ] Both buttons use correct variants

---

### T010: Write EmptyState Storybook stories

**Purpose**: Create Storybook stories for all EmptyState states.

**Steps**:
1. In `empty-state.stories.tsx`, import the component and set up the default export:
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ShoppingCart } from 'lucide-react'
import { EmptyState } from './empty-state'

const meta: Meta<typeof EmptyState> = {
  title: 'entities/cart/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EmptyState>
```
2. Define a base args object:
```typescript
const baseArgs = {
  title: 'Your cart is empty',
  description: 'Looks like you have not added anything to your cart yet. Browse our products and find something you like.',
  primaryAction: {
    label: 'Explore products',
    onClick: () => console.log('explore'),
  },
}
```
3. Create the following stories:
   - **Default**: primaryAction only, default ShoppingCart icon
   - **WithSecondaryAction**: includes `secondaryAction: { label: 'Sign in', onClick: () => console.log('signin') }`
   - **CustomIcon**: uses a different Lucide icon (e.g., `Package` or `ShoppingBag`)
   - **LongDescription**: tests text wrapping with a longer description

**Validation**:
- [ ] Default story shows cart icon, title, description, and primary button
- [ ] WithSecondaryAction shows both buttons
- [ ] CustomIcon story shows a different icon
- [ ] LongDescription story handles text wrapping gracefully

---

### T011: Verify EmptyState accessibility

**Purpose**: Ensure EmptyState meets accessibility standards.

**Steps**:
1. Verify the icon has appropriate semantics:
   - The icon is decorative (inside a visual container), so it should have `aria-hidden="true"`
   - If using a custom icon component, ensure it doesn't expose redundant aria-labels
2. Verify heading hierarchy:
   - The title should use an `<h2>` element (or appropriate heading level for the context)
   - Do NOT hardcode `<h1>` - EmptyState may appear inside a page that already has an h1
3. Verify button accessibility (inherited from Button component):
   - Buttons are keyboard focusable
   - Buttons have visible focus states
   - Button labels are descriptive
4. Verify color contrast:
   - Title text (`text-neutral-900` on white) passes WCAG AA
   - Description text (`text-neutral-600` on white) passes WCAG AA
   - Icon circle background (`bg-neutral-100`) provides sufficient contrast with icon

**Validation**:
- [ ] Icon has aria-hidden (decorative)
- [ ] Title uses semantic heading element
- [ ] Primary and secondary buttons are keyboard accessible
- [ ] Color contrast ratios meet WCAG AA standards
- [ ] No accessibility violations in Storybook a11y addon (if available)

---

## Definition of Done

- [ ] All 5 subtasks complete
- [ ] Component renders correctly in all Storybook stories
- [ ] Primary and secondary actions work correctly
- [ ] Custom icon support verified
- [ ] No TypeScript errors
- [ ] No lint errors (`npm run lint`)
- [ ] No FSD architecture violations (`npm run lint:arch`)

## Risks

- **Heading level**: EmptyState uses `<h2>` for the title, but this may need adjustment depending on where it's used. Consider making the heading level configurable via prop if needed (but keep it simple for now).
- **Button alignment**: Primary and secondary buttons must have the same height. The Button component should handle this, but verify visually.
- **Long text**: Titles or descriptions may be longer than expected. Ensure truncation or wrapping is handled gracefully.

## Reviewer Guidance

- Verify the component receives ALL data via props (no store access)
- Check that design tokens are used (no raw hex values in class names)
- Confirm the icon is decorative (aria-hidden)
- Verify primary button uses `default` variant, secondary uses `outline` variant
- Check that both buttons are the same height
- Verify all 4 stories render correctly
- Confirm heading element is semantic but not hardcoded as h1
