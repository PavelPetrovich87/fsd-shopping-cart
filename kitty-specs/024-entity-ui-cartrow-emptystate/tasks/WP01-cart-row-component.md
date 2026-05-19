---
work_package_id: WP01
title: CartRow Component
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-006
- FR-007
- FR-008
- FR-009
- FR-010
- FR-011
- FR-012
- FR-019
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
phase: Phase 1 - Component Implementation
assignee: ''
agent: ''
history:
- timestamp: '2026-05-18T12:32:09Z'
  agent: system
  action: Prompt generated via /spec-kitty.tasks
authoritative_surface: src/entities/cart/ui/cart-row/
execution_mode: code_change
owned_files:
- src/entities/cart/ui/cart-row/**
tags: []
---

# Work Package Prompt: WP01 - CartRow Component

## Objective

Implement the CartRow presentation component in `src/entities/cart/ui/cart-row/`. CartRow displays a single cart line item with product image, name, variant specs, description, price, quantity controls (via CartControl), and a remove button. The component is pure presentation - all data and callbacks are received via props.

## Context

- **Design reference**: Penpot board `product`, shape IDs for desktop/tablet/mobile variants
- **Design tokens**: Available in `src/shared/ui/tokens/` (colors, spacing, typography, radius, shadows)
- **Reusable components**: CartControl (`src/shared/ui/shadcn/cart-control/`), Button (`src/shared/ui/shadcn/button.tsx`)
- **Entity model**: CartItem has `skuId`, `name`, `unitPriceCents`, `quantity`, `createdAt`. CartRow receives enriched props that include `imageUrl`, `description`, and `specs` from the widget layer.
- **Story-first convention**: Write `.stories.tsx` first, then implement the component to satisfy the stories.

## Branch Strategy

- **Planning base branch**: `main`
- **Final merge target**: `main`
- **Execution**: This WP will be implemented in a dedicated worktree allocated by `finalize-tasks`. Do not edit files directly in the main checkout.
- **Implementation command**: `spec-kitty agent action implement WP01 --agent <name>`

---

## Subtasks

### T001: Create CartRow directory structure and define CartRowProps interface

**Purpose**: Set up the CartRow component directory and define the complete prop interface.

**Steps**:
1. Create directory `src/entities/cart/ui/cart-row/`
2. Create `src/entities/cart/ui/cart-row/index.ts` that exports the component and its props type
3. Create `src/entities/cart/ui/cart-row/cart-row.tsx` with the CartRowProps interface:

```typescript
export interface CartRowProps {
  skuId: string
  name: string
  description: string
  imageUrl: string
  specs?: Record<string, string>
  price: string
  quantity: number
  minQuantity?: number
  maxQuantity?: number
  disabled?: boolean
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}
```

4. Create `src/entities/cart/ui/cart-row/cart-row.stories.tsx` with a basic story skeleton (to be filled in T005)

**Files**:
- `src/entities/cart/ui/cart-row/index.ts` (new)
- `src/entities/cart/ui/cart-row/cart-row.tsx` (new)
- `src/entities/cart/ui/cart-row/cart-row.stories.tsx` (new)

**Validation**:
- [ ] Directory structure matches FSD conventions
- [ ] Props interface is exported from index.ts
- [ ] TypeScript compiles without errors

---

### T002: Implement CartRow desktop layout (horizontal)

**Purpose**: Build the desktop layout (`>= lg` / 1024px) where the cart row is displayed horizontally (image left, details right).

**Steps**:
1. In `cart-row.tsx`, implement the desktop layout using Tailwind CSS:
   - Outer container: flex row, gap-4, padding, border-bottom for separator
   - Left side: Product image thumbnail (fixed size ~96px x 96px, border-radius 8px using `rounded-md`)
   - Right side: Product details stacked vertically
     - Product name: font-semibold, text-base
     - Variant specs (if provided): horizontal flex of key-value pairs, text-sm, text-neutral-500
     - Description: text-sm, text-neutral-600, max 2 lines with truncate
     - Price: font-medium, text-base
2. Use design tokens via Tailwind classes:
   - Colors: `text-neutral-900` (name), `text-neutral-600` (description), `text-neutral-900` (price)
   - Spacing: `gap-4`, `p-4`
   - Border: `border-b border-neutral-200` for row separator
   - Image radius: `rounded-md` (maps to --radius-md: 0.5rem / 8px)

**Design notes**:
- Desktop breakpoint: `lg:` prefix in Tailwind (1024px and above)
- Image should not stretch: `object-cover`
- Image alt text: use product `name` prop

**Validation**:
- [ ] Desktop layout renders as horizontal flex at `lg` and above
- [ ] Image has correct size and border-radius
- [ ] All text uses design token colors
- [ ] No raw hex values in class names

---

### T003: Implement CartRow responsive tablet and mobile layouts

**Purpose**: Build the mobile (`< md` / 768px) and tablet (`md` to `lg` / 768px - 1024px) layouts.

**Steps**:
1. Implement the three-tier responsive strategy using Tailwind breakpoints:
   - **Mobile** (default, `< md`): `flex-col` - full vertical stack (image top, details below, controls at bottom)
   - **Tablet** (`md:` to `lg:`): `md:flex-row` - compact horizontal layout with smaller image (~80px), tighter spacing
   - **Desktop** (`lg:`): `lg:flex-row` with full sizing - image ~96px, generous spacing
2. Image sizing across breakpoints:
   - Mobile: `w-full h-48` (full width, fixed height)
   - Tablet: `md:w-20 md:h-20` (compact square)
   - Desktop: `lg:w-24 lg:h-24` (full size)
3. Ensure quantity controls and remove button are positioned correctly in all three layouts:
   - Mobile: controls below product details, full-width aligned
   - Tablet: controls inline with price or at the right edge, compact spacing
   - Desktop: controls inline with price or at the right edge, standard spacing
4. Ensure touch targets are at least 44px tall on mobile and tablet

**Design notes**:
- Mobile-first approach: default styles for mobile, `md:` for tablet, `lg:` for desktop
- Tablet is a transition state - it may share characteristics with both mobile and desktop
- CartControl already has proper sizing (`h-9` = 36px, ensure surrounding container padding makes total touch target >= 44px)
- Use `gap-3` on tablet, `gap-4` on desktop for spacing efficiency

**Validation**:
- [ ] Mobile layout (`< md`) stacks vertically
- [ ] Tablet layout (`md` to `lg`) renders correctly (compact horizontal or adjusted layout)
- [ ] Desktop layout (`>= lg`) is full horizontal
- [ ] No information loss at any breakpoint
- [ ] Touch targets are accessible on mobile and tablet

---

### T004: Integrate CartControl and Remove button with callbacks

**Purpose**: Add interactive controls for quantity adjustment and item removal.

**Steps**:
1. Import CartControl from `@/shared/ui/shadcn/cart-control`:
```typescript
import { CartControl } from '@/shared/ui/shadcn/cart-control'
```
2. Add CartControl to the layout, passing:
   - `quantity` prop
   - `min` = `minQuantity ?? 1`
   - `max` = `maxQuantity ?? 99`
   - `disabled` = `disabled`
   - `onIncrement` = `onIncrement`
   - `onDecrement` = `onDecrement`
3. Add a Remove button using the Button component:
```typescript
import { Button } from '@/shared/ui/shadcn/button'
```
   - Variant: `ghost`
   - Size: `sm`
   - Label: "Remove"
   - onClick: `onRemove`
   - Disabled when `disabled` prop is true
4. Position the controls appropriately in both desktop and mobile layouts.

**Design notes**:
- The Remove button should be subtle (ghost variant) since it's a destructive but common action
- Controls should be grouped visually (use a container with gap)
- Ensure the CartControl and Remove button are aligned

**Validation**:
- [ ] CartControl renders with correct quantity
- [ ] Increment/decrement callbacks fire correctly
- [ ] Remove button renders and callback fires
- [ ] Controls respect the `disabled` prop
- [ ] Min/max quantity limits are passed correctly

---

### T005: Write CartRow Storybook stories

**Purpose**: Create Storybook stories for all CartRow states (story-first convention).

**Steps**:
1. In `cart-row.stories.tsx`, import the component and set up the default export:
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { CartRow } from './cart-row'

const meta: Meta<typeof CartRow> = {
  title: 'entities/cart/CartRow',
  component: CartRow,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CartRow>
```
2. Define a base args object with realistic data:
```typescript
const baseArgs = {
  skuId: 'SHIRT-001',
  name: 'Classic Cotton T-Shirt',
  description: 'Soft, breathable cotton t-shirt for everyday wear',
  imageUrl: 'https://picsum.photos/seed/SHIRT-001/400/400',
  price: '$29.99',
  quantity: 2,
  minQuantity: 1,
  maxQuantity: 10,
  onIncrement: () => console.log('increment'),
  onDecrement: () => console.log('decrement'),
  onRemove: () => console.log('remove'),
}
```
3. Create the following stories:
   - **Default**: `quantity: 2`, all controls enabled
   - **MinQuantity**: `quantity: 1`, decrement should be disabled
   - **MaxQuantity**: `quantity: 10`, increment should be disabled
   - **Disabled**: `disabled: true`, all controls disabled
   - **WithSpecs**: includes `specs: { Color: 'Blue', Size: 'M' }`
   - **SalePrice**: shows a strikethrough original price + sale price (pass formatted string like "$29.99 $44.99" in the `price` prop)

**Validation**:
- [ ] All stories render without errors in Storybook
- [ ] Default story shows typical cart item
- [ ] MinQuantity story shows decrement disabled
- [ ] MaxQuantity story shows increment disabled
- [ ] Disabled story shows all controls non-interactive
- [ ] WithSpecs story shows variant key-value pairs

---

### T006: Verify CartRow accessibility

**Purpose**: Ensure CartRow meets accessibility standards.

**Steps**:
1. Verify the product image has descriptive alt text (use the `name` prop)
2. Verify CartControl accessibility (already implemented in the reused component):
   - `role="group"` with `aria-label="Quantity selector"`
   - `aria-label` on increment/decrement buttons
   - `aria-live="polite"` on quantity display
3. Verify the Remove button is keyboard accessible (inherited from Button component)
4. Add any missing ARIA attributes:
   - Consider wrapping the row in an `<article>` or `<li>` element with appropriate semantics
   - Ensure focus order is logical (image is decorative/focusable? no, image should not be focusable)

**Validation**:
- [ ] Image has meaningful alt text
- [ ] CartControl ARIA attributes are present
- [ ] Remove button is keyboard focusable and activatable
- [ ] No accessibility violations in Storybook a11y addon (if available)

---

## Definition of Done

- [ ] All 6 subtasks complete
- [ ] Component renders correctly in all Storybook stories
- [ ] Desktop (`>= lg`), tablet (`md` to `lg`), and mobile (`< md`) layouts verified
- [ ] All callbacks fire correctly
- [ ] No TypeScript errors
- [ ] No lint errors (`npm run lint`)
- [ ] No FSD architecture violations (`npm run lint:arch`)

## Risks

- **Responsive complexity**: CartRow has three distinct layouts (mobile, tablet, desktop). Test all three thoroughly using browser dev tools.
- **Tablet breakpoint ambiguity**: Without direct access to Penpot designs, the tablet layout is an interpretation. Verify visually and adjust if needed.
- **CartControl integration**: Ensure the CartControl component's styling doesn't conflict with CartRow's layout.
- **Image loading**: External images (picsum.photos) may be slow. This is acceptable for Storybook but note that real usage should use optimized images.

## Reviewer Guidance

- Verify the component receives ALL data via props (no store access)
- Check that design tokens are used (no raw hex values in class names)
- Confirm responsive behavior at sm, md, and lg breakpoints (three-tier layout)
- Verify tablet layout (`md` to `lg`) is explicitly handled, not just an accidental in-between state
- Verify CartControl is reused, not reimplemented
- Check that the Remove button uses the correct Button variant (ghost)
- Verify all 6 stories render correctly
