---
work_package_id: WP01
title: Cart Control — Stories, Component & Validation
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-010
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-017-cart-control
base_commit: 946bd005b45be042ab224ef04435c38cd5044772
created_at: '2026-04-29T14:09:42.680604+00:00'
subtasks:
- T001
- T002
- T003
- T004
shell_pid: '78619'
history: []
authoritative_surface: src/shared/ui/cart-control/
execution_mode: code_change
owned_files:
- src/shared/ui/cart-control/**
- src/shared/ui/index.ts
tags: []
---

# WP01: Cart Control — Stories, Component & Validation

## Objective

Implement `CartControl` — a stateless quantity selector in `shared/ui/cart-control/` — following **story-first convention** (write stories before component). Validate with all project quality gates.

## Context

**Penpot design** (source of truth for UI):
- Board: `Cart Control` (ID `c3a36a78-0a61-5c93-a8ba-78d388de4f2a`)
- Dimensions: 125 × 36
- Layout: flex row, gap 12, padding 2, align center
- Container: bg `#fafafa`, border 1px `#e6e6e6`, radius 6px
- Buttons: 20×20, radius 4px, centered icon
- Quantity text: Noto Sans 14px / 500, `#525252`

**Component role**: Pure presentational quantity selector. No domain knowledge, no state, no API calls.

**Props contract**:
```typescript
interface CartControlProps {
  quantity: number;
  min?: number;        // default 1
  max?: number;        // default 99
  disabled?: boolean;  // disables all buttons
  onIncrement: () => void;
  onDecrement: () => void;
}
```

**Important constraint**: This component does NOT include a remove button or confirmation UI. Those are parent-layer concerns (handled by widget/feature slice).

## Files

| File | Purpose |
|---|---|
| `src/shared/ui/cart-control/cart-control.stories.tsx` | CSF3 stories — all states covered |
| `src/shared/ui/cart-control/cart-control.tsx` | Component implementation |
| `src/shared/ui/cart-control/index.ts` | Public API export |
| `src/shared/ui/index.ts` | Add CartControl export |

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Worktree allocated per lane from `lanes.json`
- No worktrees created during planning — allocation happens at `finalize-tasks`

---

## T001: Write `cart-control.stories.tsx`

**Purpose**: Define all component states as Storybook stories before writing the component. Stories serve as regression guards — they stay forever.

**File**: `src/shared/ui/cart-control/cart-control.stories.tsx`

### Stories to implement

Use CSF3 format: `export default satisfies Meta<typeof CartControl>`.

| Story | Args | Notes |
|---|---|---|
| `Default` | `quantity: 3, min: 1, max: 99, disabled: false` | Baseline — both buttons active |
| `AtMinimum` | `quantity: 1, min: 1, disabled: false` | Decrement disabled |
| `AtMaximum` | `quantity: 99, max: 99, disabled: false` | Increment disabled |
| `Disabled` | `quantity: 3, disabled: true` | All buttons disabled, quantity visible |
| `Interaction` | `quantity: 3, disabled: false` + `play()` | Click handlers fire correctly |

### Interaction story template

```tsx
import { fn } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/react'
import { CartControl } from './cart-control'

type Story = StoryObj<typeof CartControl>

export const Interaction: Story = {
  args: {
    quantity: 3,
    onIncrement: fn(),
    onDecrement: fn(),
  },
  play: async ({ canvas }) => {
    // Click decrement
    const decrementBtn = canvas.getByRole('button', { name: /decrease quantity/i })
    await userEvent.click(decrementBtn)
    // Verify callback fired

    // Click increment
    const incrementBtn = canvas.getByRole('button', { name: /increase quantity/i })
    await userEvent.click(incrementBtn)
    // Verify callback fired
  },
}
```

### Requirements

- **No MSW** — CartControl has no network calls
- **No random data** — no `Math.random()`, no `Date.now()`
- **Deterministic** — all args are static values
- Use `lucide-react` `Plus` and `Minus` for icons
- Use existing `Button` from `@/shared/ui` where applicable
- Import `userEvent` from `@testing-library/react` for play functions

---

## T002: Implement `cart-control.tsx`

**Purpose**: Build the component to satisfy all five stories.

**File**: `src/shared/ui/cart-control/cart-control.tsx`

### Implementation steps

**1. Type the props**:

```typescript
export interface CartControlProps {
  quantity: number
  min?: number
  max?: number
  disabled?: boolean
  onIncrement: () => void
  onDecrement: () => void
}
```

**2. Resolve defaults**:

```typescript
const min = props.min ?? 1
const max = props.max ?? 99
```

**3. Build the layout** (per Penpot):

```tsx
<div
  role="group"
  aria-label="Quantity selector"
  className="inline-flex flex-row items-center gap-3 rounded-md border bg-muted/50 px-0.5 py-0.5"
  style={{ borderColor: '#e6e6e6', backgroundColor: '#fafafa' }}
>
  {/* Decrement button */}
  {/* Quantity display */}
  {/* Increment button */}
</div>
```

**Note**: Use the existing `Button` from `@/shared/ui` for the icon buttons. Check if `size="icon-sm"` (32×32) works visually. If too large, use `size="icon-xs"` (24×24) or apply inline Tailwind to get a 20×20 hit area. The primary constraint is matching the Penpot appearance.

**4. Decrement button**:
```tsx
<Button
  variant="ghost"
  size="icon-sm" // or inline override for 20×20
  aria-label="Decrease quantity"
  disabled={disabled || quantity <= min}
  onClick={onDecrement}
>
  <Minus size={14} />
</Button>
```

**5. Quantity display**:
```tsx
<span
  aria-live="polite"
  aria-atomic="true"
  className="min-w-[32px] text-center text-sm font-medium"
  style={{ color: '#525252' }}
>
  {quantity}
</span>
```

**6. Increment button**:
```tsx
<Button
  variant="ghost"
  size="icon-sm"
  aria-label="Increase quantity"
  disabled={disabled || quantity >= max}
  onClick={onIncrement}
>
  <Plus size={14} />
</Button>
```

### Validation checklist

- [ ] Container is 125×36 (or close — flex containers size to content)
- [ ] Gap between elements is 12px
- [ ] Container has 6px border-radius, 1px border
- [ ] Both buttons have correct `aria-label`
- [ ] Decrement disabled when `quantity <= min`
- [ ] Increment disabled when `quantity >= max`
- [ ] `disabled={true}` disables both buttons
- [ ] Quantity display has `aria-live="polite"`
- [ ] Component renders without console errors

### Button sizing note

The existing `Button` component uses Base UI. Available icon sizes:
- `size="icon-xs"` → 24×24
- `size="icon-sm"` → 32×32
- `size="icon"` → 32×32

Penpot shows 20×20 icon containers. Use `size="icon-xs"` (24×24) as the closest built-in option, or apply inline `className="size-5"` (20×20) if the Button component supports it. If the existing Button can't achieve the exact 20×20, use a plain `<button>` element with Tailwind classes for the icon containers.

---

## T003: Create exports

**Purpose**: Make `CartControl` available from `shared/ui`.

**Files**:
- `src/shared/ui/cart-control/index.ts` — new file
- `src/shared/ui/index.ts` — modify existing

### `src/shared/ui/cart-control/index.ts`

```typescript
export { CartControl } from './cart-control'
export type { CartControlProps } from './cart-control'
```

### `src/shared/ui/index.ts`

Add CartControl to the existing exports. Read the file first to understand the current structure, then add:

```typescript
export { CartControl } from './cart-control'
export type { CartControlProps } from './cart-control'
```

---

## T004: Validate

**Purpose**: Ensure all quality gates pass.

Run in sequence:
```bash
npm run lint
npm run lint:arch
npm run build
npm run test:storybook
```

All must exit with code 0. Fix any violations.

### Common issues

| Issue | Fix |
|---|---|
| `aria-label` missing on icon button | Add `aria-label="Increase quantity"` / `aria-label="Decrease quantity"` |
| Button too large | Use `size="icon-xs"` or apply `className="size-5"` inline |
| Story `play` function fails | Use `userEvent` from `@testing-library/react`, not `fireEvent` |
| `aria-live` not on quantity | Add `aria-live="polite"` to the `<span>` wrapping the number |

---

## Definition of Done

- [ ] All 5 stories render in Storybook
- [ ] Story `Interaction` play function clicks both buttons without errors
- [ ] `npm run lint` exits 0
- [ ] `npm run lint:arch` exits 0
- [ ] `npm run build` exits 0
- [ ] `npm run test:storybook` exits 0 (zero a11y violations)
- [ ] CartControl exported from `src/shared/ui/index.ts`

## Risks

| Risk | Mitigation |
|---|---|
| Button `size="icon-sm"` (32×32) doesn't match Penpot 20×20 | Use `size="icon-xs"` (24×24) as closest match, or plain `<button>` with Tailwind |
| Chromatic baselines vary by environment | Accept ±1% pixel threshold; re-baseline if needed |

## Reviewer Guidance

When reviewing this WP, verify:
1. Story-first convention was followed (stories written before component)
2. All 5 stories exist and render without errors
3. Both buttons have meaningful `aria-label` values
4. Quantity display has `aria-live="polite"` for screen reader announcements
5. Disabled state works correctly (all buttons disabled, quantity visible)
6. Boundary state works: decrement disabled at min, increment disabled at max
7. No console errors in Storybook
8. All validation commands pass

---

**Implement command** (after finalize-tasks):
```
spec-kitty agent action implement WP01 --agent <name>
```
