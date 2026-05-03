---
work_package_id: WP01
title: Input Field Component — Stories, Implementation & Validation
dependencies: []
requirement_refs:
- C-001
- C-002
- C-003
- C-004
- C-005
- C-006
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
- FR-013
- FR-014
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-020-input-field-component
base_commit: 01540c57313a056f7030ee6a28a890325da944ed
created_at: '2026-05-02T10:06:14.305891+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
- T007
shell_pid: "5702"
history: []
authoritative_surface: src/shared/ui/input-field/
execution_mode: code_change
owned_files:
- src/shared/ui/input-field/**
- src/shared/ui/index.ts
tags: []
agent: "opencode"
---

# WP01: Input Field Component — Stories, Implementation & Validation

## Objective

Implement `InputField` — a reusable labeled text input with hint, inline icon, and 8 Penpot-defined states — in `src/shared/ui/input-field/`. Follow **story-first convention** (write stories before component). Validate against all project quality gates.

## Context

**Penpot design tokens** (extracted from actual design file, not inferred):

| Token | Hex Value | Project Token | Tailwind Class | Usage |
|---|---|---|---|---|
| `color.input.background` | `#fafafa` | `neutral-100` | `bg-neutral-100` / `bg-input` | Input background |
| `color.input.border` | `#e5e5e5` | — | `style={{ borderColor: '#e5e5e5' }}` | Default border |
| `color.input.border.filled` | `#f5f5f5` | `neutral-200` | `border-neutral-200` | Border when value present |
| `color.label` | `#404040` | `neutral-800` | `text-neutral-800` | Label text |
| `color.hint.default` | `#737373` | `neutral-600` | `text-neutral-600` | Default hint |
| `color.hint.error` | `#dc2626` | `error-600` | `text-error-600` | Error hint |
| `color.input.text.placeholder` | `#737373` | `neutral-600` | `placeholder:text-neutral-600` | Placeholder text |
| `color.input.text.filled` | `#a3a3a3` | `neutral-500` | `text-neutral-500` | Value text (unfocused) |
| `color.input.text.focused` | `#171717` | `neutral-950` | `text-neutral-950` | Value text (focused) |
| `color.icon.default` | `#a3a3a3` | `neutral-500` | `text-neutral-500` | Default icon |
| `color.icon.error` | `#dc2626` | `error-600` | `text-error-600` | Error icon |

**Visual rules** (derived from 8 Penpot states):

| Condition | Border | Hint Color | Icon |
|---|---|---|---|
| `disabled` | **none** | `#dc2626` if error else `#737373` | `AlertCircle` if error else `CircleHelp` |
| `:focus` + no error | **none** | `#737373` | `CircleHelp` |
| `value` present + no focus + no error | `#f5f5f5` | `#737373` | `CircleHelp` |
| `error` present | `#e5e5e5` | `#dc2626` | `AlertCircle` |
| Default (empty, no error, not focused) | `#e5e5e5` | `#737373` | `CircleHelp` |

**States** (8 Penpot states = combinations of 4 base conditions):

| State | Border | BG | Input Text | Hint | Icon | Icon Color |
|---|---|---|---|---|---|---|
| **Normal** | `#e5e5e5` | `#fafafa` | `#737373` (placeholder) | `#737373` | CircleHelp | `#a3a3a3` |
| **Error** | `#e5e5e5` | `#fafafa` | `#737373` (placeholder) | `#737373` | CircleHelp | `#a3a3a3` |
| **Filled** | `#f5f5f5` | `#fafafa` | `#a3a3a3` (value) | `#737373` | CircleHelp | `#a3a3a3` |
| **Error filled** | `#e5e5e5` | `#fafafa` | `#171717` (value) | `#737373` | CircleHelp | `#a3a3a3` |
| **Focused** | **none** | `#fafafa` | `#171717` (value) | `#737373` | CircleHelp | `#a3a3a3` |
| **Error focused** | `#e5e5e5` | `#fafafa` | `#737373` (placeholder) | `#dc2626` | AlertCircle | `#dc2626` |
| **Disabled** | **none** | `#fafafa` | `#171717` (value) | `#dc2626` | AlertCircle | `#dc2626` |
| **Success** | `#e5e5e5` | `#fafafa` | `#737373` (placeholder) | `#dc2626` | AlertCircle | `#dc2626` |

**Component role**: Pure presentational input field. No domain knowledge, no state, no API calls.

**Props contract**:
```typescript
interface InputFieldProps {
  label?: string           // Label text displayed above input
  hint?: string            // Hint text displayed below label; color changes based on error
  placeholder?: string      // Placeholder text when empty (default: "")
  value?: string           // Controlled input value
  defaultValue?: string    // Uncontrolled initial value (default: "")
  disabled?: boolean       // Disables the input; removes border (default: false)
  error?: string           // Error/success message; triggers error icon + red hint
  id?: string              // Input element ID (auto-generated via useId if omitted)
  name?: string            // Input name attribute
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}
```

**Accessibility requirements**:
- `id` attribute linked to `<label>` via `htmlFor` attribute
- `disabled` state communicated via `disabled` + `aria-disabled`
- Error hint linked to input via `aria-describedby`
- Icon has `aria-hidden="true"` (decorative)
- Error hint uses `role="alert"` for screen reader announcement
- Focus state: border removal must be offset by text color change to meet WCAG

## Files

| File | Purpose |
|---|---|
| `src/shared/ui/input-field/input-field.stories.tsx` | CSF3 stories — all 8 Penpot states |
| `src/shared/ui/input-field/input-field.tsx` | Component implementation |
| `src/shared/ui/input-field/index.ts` | Public API export |
| `src/shared/ui/index.ts` | Add InputField export |

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Worktree allocated per lane from `lanes.json`
- No worktrees created during planning — allocation happens at `finalize-tasks`

---

## T001: Create `src/shared/ui/input-field/` directory structure

**Purpose**: Set up the component directory with standard FSD structure.

**Steps**:
1. Create directory `src/shared/ui/input-field/`
2. No subdirectories needed for a single component

**Verification**:
- [ ] Directory created at `src/shared/ui/input-field/`

---

## T002: Write `input-field.stories.tsx` (Story-First Convention)

**Purpose**: Define all 8 Penpot states as Storybook stories BEFORE writing the component. Stories serve as regression guards and documentation — they stay forever.

**File**: `src/shared/ui/input-field/input-field.stories.tsx`

### Stories to implement

Use CSF3 format with `satisfies Meta<typeof InputField>`.

| Story | Args | Description |
|---|---|---|
| `Default` | `placeholder: "Enter coupon code"` | Normal state — empty, default border |
| `Filled` | `value: "Add coupon code"` | Value present, grey text, `#f5f5f5` border |
| `Focused` | `value: "OFFSPRING"` | Focused, no border, `#171717` text |
| `Error` | `error: "Please enter a valid code."` | Error state, red hint, error icon |
| `ErrorFilled` | `value: "OFFSPRING", error: "Invalid code"` | Value + error |
| `ErrorFocused` | `error: "Please enter a valid code."` | Focused + error hint |
| `Disabled` | `value: "Add coupon code", disabled: true, error: "Please type coupon to add."` | Disabled, no border, red hint |
| `Success` | `value: "NOSUCHCODE", error: "Sorry, but this coupon doesn't exist."` | Value + error hint (same visual as Error filled) |

### CSF3 story template

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { InputField } from './input-field'

type Story = StoryObj<typeof InputField>

export const Default: Story = {
  args: {
    label: 'Coupon code',
    hint: 'This is a hint text to help user.',
    placeholder: 'Enter coupon code',
  },
}

export const Filled: Story = {
  args: {
    label: 'Coupon code',
    hint: 'This is a hint text to help user.',
    value: 'Add coupon code',
  },
}

export const Error: Story = {
  args: {
    label: 'Coupon code',
    error: 'Please enter a valid code.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Coupon code',
    value: 'Add coupon code',
    disabled: true,
    error: 'Please type coupon to add.',
  },
}
```

### Requirements

- **No MSW** — InputField has no network calls
- **No random data** — deterministic args only
- Import `userEvent` from `@testing-library/react` if interaction testing needed
- Use `autoFocus` prop for focus state stories
- Stories must cover ALL 8 Penpot states

---

## T003: Implement `input-field.tsx`

**Purpose**: Build the component to satisfy all stories and design tokens.

**File**: `src/shared/ui/input-field/input-field.tsx`

### Dependencies

```typescript
import { useId } from 'react'
import { CircleHelp, AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
```

### Implementation steps

**1. Type the props**:
```typescript
export interface InputFieldProps {
  label?: string
  hint?: string
  placeholder?: string
  defaultValue?: string
  value?: string
  disabled?: boolean
  error?: string
  id?: string
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}
```

**2. Generate ID** (for label-for association):
```typescript
const generatedId = useId()
const inputId = id ?? generatedId
const hintId = `${inputId}-hint`
```

**3. Determine icon**:
```typescript
const Icon = error ? AlertCircle : CircleHelp
const iconColorClass = error ? 'text-error-600' : 'text-neutral-500'
```

**4. Build the layout**:
```tsx
<div className="flex flex-col gap-1.5">
  {/* Label */}
  {label && (
    <label
      htmlFor={inputId}
      className="text-sm font-medium text-neutral-800"
    >
      {label}
    </label>
  )}

  {/* Input container */}
  <div
    className={cn(
      'relative flex h-10 w-80 items-center gap-2 rounded bg-neutral-100 px-3',
      // Border logic
      disabled && 'border-none',
      !disabled && !error && 'border',
      !disabled && !error && (!value || value === '') && 'border-[#e5e5e5]',
      !disabled && !error && value && value !== '' && 'border-neutral-200',
      error && !disabled && 'border border-[#e5e5e5]',
    )}
    style={{
      borderColor: (!disabled && !error && (!value || value === '')) ? '#e5e5e5' : undefined,
    }}
  >
    {/* Icon */}
    <Icon
      className={cn('size-4 shrink-0', iconColorClass)}
      aria-hidden="true"
    />

    {/* Input */}
    <input
      id={inputId}
      name={name}
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      disabled={disabled}
      aria-disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? hintId : hint ? hintId : undefined}
      className={cn(
        'flex-1 bg-transparent text-sm outline-none',
        'placeholder:text-neutral-600',
        disabled && 'cursor-not-allowed',
        // Text color logic
        !disabled && 'text-neutral-950 focus:text-neutral-950',
        !disabled && !value && 'text-neutral-500',
      )}
      {...restProps}
    />
  </div>

  {/* Hint / Error */}
  {(hint || error) && (
    <span
      id={hintId}
      className={cn(
        'text-sm',
        error ? 'text-error-600' : 'text-neutral-600',
      )}
      role={error ? 'alert' : undefined}
    >
      {error || hint}
    </span>
  )}
</div>
```

**Note on focus styling**: The border removal on focus is handled by the container's conditional classes. When the input receives focus, the container must lose its border. Use the `:has(:focus)` or `:focus-within` pseudo-class on the container:

```tsx
<div className="... focus-within:border-transparent ...">
```

Or handle via CSS/JS focus state tracking.

### Validation checklist

- [ ] Label renders above input when `label` prop provided (`text-neutral-800`, `font-medium`, `text-sm`)
- [ ] Hint text renders below input (`text-neutral-600`, `text-sm`)
- [ ] Error hint renders in `text-error-600` with `role="alert"`
- [ ] Icon switches: `CircleHelp` (default) ↔ `AlertCircle` (error)
- [ ] Icon color: `text-neutral-500` (default) ↔ `text-error-600` (error)
- [ ] Border: `#e5e5e5` (default) → `#f5f5f5` (filled) → none (focus/disabled)
- [ ] Input text: `placeholder:text-neutral-600` → `text-neutral-500` (filled) → `text-neutral-950` (focused)
- [ ] Disabled: `border-none`, `cursor-not-allowed`, `disabled`, `aria-disabled`
- [ ] `aria-invalid` set when error present
- [ ] `aria-describedby` links hint for screen readers
- [ ] Background `#fafafa` via `bg-neutral-100`
- [ ] 4px border radius via `rounded`
- [ ] 320px width, 40px height

### Color mapping (Penpot → Tailwind)

| Design Token | Hex | Project Token | Tailwind Class |
|---|---|---|---|
| `color.input.background` | `#fafafa` | `neutral-100` | `bg-neutral-100` |
| `color.input.border` | `#e5e5e5` | — | `style={{ borderColor: '#e5e5e5' }}` |
| `color.input.border.filled` | `#f5f5f5` | `neutral-200` | `border-neutral-200` |
| `color.label` | `#404040` | `neutral-800` | `text-neutral-800` |
| `color.hint.default` | `#737373` | `neutral-600` | `text-neutral-600` |
| `color.hint.error` | `#dc2626` | `error-600` | `text-error-600` |
| `color.input.text.placeholder` | `#737373` | `neutral-600` | `placeholder:text-neutral-600` |
| `color.input.text.filled` | `#a3a3a3` | `neutral-500` | `text-neutral-500` |
| `color.input.text.focused` | `#171717` | `neutral-950` | `text-neutral-950` |
| `color.icon.default` | `#a3a3a3` | `neutral-500` | `text-neutral-500` |
| `color.icon.error` | `#dc2626` | `error-600` | `text-error-600` |

**Important**: Use Tailwind semantic classes, NOT arbitrary bracket notation (e.g., `border-[#e5e5e5]`). Use inline `style` for `#e5e5e5` border only.

---

## T004: Create `index.ts` exports

**Purpose**: Make `InputField` available from `shared/ui`.

**Files**:
- `src/shared/ui/input-field/index.ts` — new file
- `src/shared/ui/index.ts` — modify existing

### `src/shared/ui/input-field/index.ts`

```typescript
export { InputField } from './input-field'
export type { InputFieldProps } from './input-field'
```

### `src/shared/ui/index.ts`

Read the existing file first, then add:
```typescript
export { InputField } from './input-field'
export type { InputFieldProps } from './input-field'
```

---

## T005: Validate — All Quality Gates

**Purpose**: Ensure all project quality gates pass.

Run in sequence:
```bash
npm run lint
npm run lint:arch
npm run build
```

All must exit with code 0. Fix any violations before reporting completion.

### Common issues

| Issue | Fix |
|---|---|
| TypeScript error on `useId` | Import from `react` (React 19 native) |
| Missing `aria-invalid` | Add `aria-invalid={!!error}` |
| Error hint not linked | Ensure `aria-describedby={hintId}` when hint/error present |
| Border not removed on focus | Add `focus-within:border-transparent` to container |
| Icon color mismatch | Verify `text-neutral-500` vs `text-error-600` classes |
| Text color not changing | Check conditional `text-neutral-500` / `text-neutral-950` classes |
| Arbitrary value lint error | Replace `border-[#e5e5e5]` with inline `style` or semantic token |

---

## Definition of Done

- [ ] All 8 stories render in Storybook without errors
- [ ] `Default` story: input with placeholder, `#e5e5e5` border, `CircleHelp` icon
- [ ] `Filled` story: value present, `#f5f5f5` border, `text-neutral-500` text
- [ ] `Focused` story: no border, `text-neutral-950` text
- [ ] `Error` story: `text-error-600` hint, `AlertCircle` icon
- [ ] `ErrorFilled` story: value + error hint
- [ ] `ErrorFocused` story: focused + error hint
- [ ] `Disabled` story: no border, non-interactive
- [ ] `Success` story: value + error hint (same as Error filled)
- [ ] Design tokens match Penpot (no inferred values)
- [ ] `npm run lint` exits 0
- [ ] `npm run lint:arch` exits 0
- [ ] `npm run build` exits 0
- [ ] InputField exported from `src/shared/ui/index.ts`

---

## Risks

| Risk | Mitigation |
|---|---|
| `lucide-react` icons don't match Penpot exactly | Use closest semantic equivalents (`CircleHelp` ≈ question-line, `AlertCircle` ≈ error-warning-line) |
| Border removal on focus breaks WCAG | Add `focus-visible:ring-2` as safety net even though design doesn't show it |
| Noto Sans font not loaded | Assume font is loaded globally; if issues arise, document in comments |
| Text color logic gets complex | Document the 3-color rule (placeholder/filled/focused) in code comments |

## Reviewer Guidance

When reviewing this WP, verify:
1. Story-first convention was followed (stories written before component)
2. All 8 Penpot states exist as stories and render without errors
3. Label is associated with input via `htmlFor` / `id`
4. Error hint has `role="alert"` for accessibility
5. Icon switches correctly between `CircleHelp` and `AlertCircle`
6. Border behavior matches Penpot: `#e5e5e5` → `#f5f5f5` → none (focus/disabled)
7. Hint color changes based on error state
8. Input text color changes based on state (placeholder/filled/focused)
9. Disabled state removes border, does not reduce opacity
10. All validation commands pass

---

**Implement command** (after finalize-tasks):
```
spec-kitty agent action implement WP01 --agent <name>
```

## Activity Log

- 2026-05-02T10:06:20Z – kilo:kimi-for-coding:implementer:implementer – shell_pid=6863 – Assigned agent via action command
- 2026-05-02T10:14:00Z – kilo:kimi-for-coding:implementer:implementer – shell_pid=6863 – Ready for review: InputField component with 8 Penpot states, all quality gates pass
- 2026-05-02T10:16:57Z – opencode – shell_pid=5702 – Started review via action command
- 2026-05-02T10:19:44Z – opencode – shell_pid=5702 – Review passed: All 8 Penpot states implemented correctly. One bug found and fixed during review — focus-within border removal was applying to error states, but spec requires error+focused to retain #e5e5e5 border. Fixed by adding !hasError condition. All quality gates pass.
- 2026-05-03T07:28:13Z – opencode – shell_pid=5702 – Re-opening for Penpot design fixes
- 2026-05-03T08:00:37Z – opencode – shell_pid=5702 – Moved to for_review
