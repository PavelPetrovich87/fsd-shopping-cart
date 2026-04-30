---
work_package_id: WP01
title: Input Field Component — Stories, Implementation & Validation
dependencies: []
requirement_refs:
- C-001
- C-002
- C-003
- C-004
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
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: main
base_commit: 6b4c2045372abd4a259fa484841591515bb47aaa
created_at: '2026-04-30T14:06:00Z'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
- T007
- T008
history: []
authoritative_surface: src/shared/ui/input-field/
execution_mode: code_change
owned_files:
- src/shared/ui/input-field/**
- src/shared/ui/index.ts
tags: []
---

# WP01: Input Field Component — Stories, Implementation & Validation

## Objective

Implement `InputField` — a reusable labeled text input with hint, error, focus, and disabled states — in `src/shared/ui/input-field/`. Follow **story-first convention** (write stories before component). Validate against all project quality gates.

## Context

**Penpot design tokens** (source of truth):
| Token | Hex Value | Usage |
|---|---|---|
| `color.input.background` | `#fafafa` | Input field background |
| `color.input.border` | `#e5e5e5` | Default/error/disabled border |
| `color.input.border.focus` | `#000000` | Focus state border |
| `color.input.border.error` | `#ef4444` | Error state border |
| `color.label` | `#404040` | Label text |
| `color.hint` | `#737373` | Hint text |
| `spacing.input.padding` | `8px` | Horizontal padding |
| `borderRadius.input` | `4px` | Input corner radius |

**States**:
| State | Border | Background | Additional |
|---|---|---|---|
| Default | `#e5e5e5` 1px solid | `#fafafa` | — |
| Focus | `#000000` 1px solid | `#fafafa` | Focus ring via outline |
| Disabled | `#e5e5e5` 1px solid | `#f5f5f5` | Reduced opacity (0.5) |
| Error | `#ef4444` 1px solid | `#fafafa` | Error message below |

**Component role**: Pure presentational input field. No domain knowledge, no state, no API calls.

**Props contract**:
```typescript
interface InputFieldProps {
  label?: string           // Label text displayed above input
  hint?: string            // Hint text displayed below label, above input
  placeholder?: string      // Placeholder text when empty (default: "")
  value?: string           // Controlled input value
  defaultValue?: string    // Uncontrolled initial value (default: "")
  disabled?: boolean       // Disables the input (default: false)
  error?: string           // Error message; triggers error state
  id?: string              // Input element ID (auto-generated if omitted)
  name?: string            // Input name attribute
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  className?: string       // Additional CSS classes
}
```

**Accessibility requirements**:
- `id` attribute linked to `<label>` via `for` attribute
- `disabled` state communicated via `aria-disabled`
- Error message linked via `aria-describedby`
- Focus indicator meets WCAG 2.1 contrast requirements

## Files

| File | Purpose |
|---|---|
| `src/shared/ui/input-field/input-field.stories.tsx` | CSF3 stories — all states covered |
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

**Purpose**: Define all component states as Storybook stories BEFORE writing the component. Stories serve as regression guards and documentation — they stay forever.

**File**: `src/shared/ui/input-field/input-field.stories.tsx`

### Stories to implement

Use CSF3 format with `satisfies Meta<typeof InputField>`.

| Story | Args | Description |
|---|---|---|
| `Default` | `placeholder: "Enter text"` | Baseline input |
| `WithLabel` | `label: "Email Address", placeholder: "user@example.com"` | Label above input |
| `WithHint` | `label: "Username", hint: "Must be 3-20 characters", placeholder: "username"` | Label + hint |
| `WithValue` | `label: "Full Name", value: "John Doe"` | Controlled with prefilled value |
| `Error` | `label: "Email", error: "Please enter a valid email address"` | Error state with border + message |
| `Disabled` | `label: "Read-only field", disabled: true, value: "Cannot edit"` | Disabled input |
| `Focus` | `label: "Focus demo", placeholder: "Click to focus"` | Focus state (use `autofocus` or interactive) |

### CSF3 story template

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { InputField } from './input-field'

type Story = StoryObj<typeof InputField>

export const Default: Story = {
  args: {
    placeholder: 'Enter text',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'user@example.com',
  },
}

export const Error: Story = {
  args: {
    label: 'Email',
    error: 'Please enter a valid email address',
  },
}
```

### Requirements

- **No MSW** — InputField has no network calls
- **No random data** — deterministic args only
- Import `userEvent` from `@testing-library/react` if interaction testing needed
- Use `autofocus` attribute or Storybook `focus` addon for focus state stories
- Stories should cover ALL states: default, focus, error, disabled

---

## T003: Implement `input-field.tsx`

**Purpose**: Build the component to satisfy all stories and design tokens.

**File**: `src/shared/ui/input-field/input-field.tsx`

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
  className?: string
}
```

**2. Generate ID** (for label-for association):
```typescript
const generatedId = useId()
const inputId = id ?? generatedId
const errorId = `${inputId}-error`
const hintId = `${inputId}-hint`
```

**3. Build the layout**:
```tsx
<div className="flex flex-col gap-1">
  {/* Label */}
  {label && (
    <label
      htmlFor={inputId}
      className="text-sm font-medium"
      style={{ color: '#404040' }}
    >
      {label}
    </label>
  )}

  {/* Hint */}
  {hint && !error && (
    <span
      id={hintId}
      className="text-xs"
      style={{ color: '#737373' }}
    >
      {hint}
    </span>
  )}

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
    aria-describedby={
      error ? errorId : hint ? hintId : undefined
    }
    className={cn(
      'h-9 w-full rounded border bg-transparent px-3 text-sm transition-colors',
      'placeholder:text-neutral-400',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
      // States
      !error && !disabled && 'border-[#e5e5e5] focus:border-[#000000] focus-visible:ring-[#000000]/30',
      error && 'border-[#ef4444] focus-visible:ring-[#ef4444]/30',
      disabled && 'opacity-50 cursor-not-allowed border-[#e5e5e5] bg-[#f5f5f5]',
      className
    )}
    style={{ borderRadius: '4px' }}
    {...restProps}
  />

  {/* Error message */}
  {error && (
    <span
      id={errorId}
      className="text-xs text-red-600"
      role="alert"
    >
      {error}
    </span>
  )}
</div>
```

### Validation checklist

- [ ] Label renders above input when `label` prop provided
- [ ] Hint text renders between label and input
- [ ] Error message renders below input in error state
- [ ] Border color changes: `#e5e5e5` (default) → `#000000` (focus) → `#ef4444` (error)
- [ ] Disabled state: `opacity-50`, `cursor-not-allowed`, `aria-disabled`
- [ ] `aria-invalid` set when error present
- [ ] `aria-describedby` links error/hint for screen readers
- [ ] Focus ring visible on focus (outline + ring)
- [ ] Input background `#fafafa` (default/focus/error), `#f5f5f5` (disabled)
- [ ] 4px border radius matches design token
- [ ] 8px horizontal padding matches design token

### Color mapping from hex to Tailwind

Since the design tokens use hex values directly, use inline `style` for precise color matching where Tailwind doesn't have exact equivalents:

| Design Token | Hex | Implementation |
|---|---|---|
| `color.input.background` | `#fafafa` | `bg-[#fafafa]` (Tailwind supports hex in brackets) |
| `color.input.border` | `#e5e5e5` | `border-[#e5e5e5]` |
| `color.input.border.focus` | `#000000` | `focus:border-[#000000]` |
| `color.input.border.error` | `#ef4444` | `error && 'border-[#ef4444]'` |
| `color.label` | `#404040` | `style={{ color: '#404040' }}` or `text-[#404040]` |
| `color.hint` | `#737373` | `text-[#737373]` |

Note: Tailwind v4 supports arbitrary values with bracket notation (`bg-[#fafafa]`). Verify this works with your project's Tailwind configuration.

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
| TypeScript error on `useId` | Import from `react` |
| Missing `aria-invalid` | Add `aria-invalid={!!error}` |
| Error message not linked | Ensure `aria-describedby={errorId}` when error present |
| Focus ring missing | Add `focus-visible:ring-2` classes |
| Border radius mismatch | Add `style={{ borderRadius: '4px' }}` inline style |

---

## Definition of Done

- [ ] All 7 stories render in Storybook without errors
- [ ] `Default` story: input with placeholder
- [ ] `WithLabel` story: label above input
- [ ] `WithHint` story: label + hint text
- [ ] `Error` story: error border + error message with `role="alert"`
- [ ] `Disabled` story: opacity-50, `aria-disabled`, non-editable
- [ ] Design tokens match Penpot (colors, radius, spacing)
- [ ] `npm run lint` exits 0
- [ ] `npm run lint:arch` exits 0
- [ ] `npm run build` exits 0
- [ ] InputField exported from `src/shared/ui/index.ts`

---

## Risks

| Risk | Mitigation |
|---|---|
| Tailwind doesn't support hex colors directly | Use bracket notation (`bg-[#fafafa]`) or inline styles |
| Noto Sans font not loaded | Assume font is loaded globally; if issues arise, document in comments |
| Focus ring visibility | Use both `outline-none` and `ring-2` for visible focus indicator |

## Reviewer Guidance

When reviewing this WP, verify:
1. Story-first convention was followed (stories written before component)
2. All 7 stories exist and render without errors
3. Label is associated with input via `htmlFor` / `id`
4. Error message has `role="alert"` for accessibility
5. Focus state has visible ring indicator
6. Disabled state prevents interaction (`disabled`, `aria-disabled`, `opacity-50`)
7. Design tokens accurately match Penpot specification
8. All validation commands pass

---

**Implement command** (after finalize-tasks):
```
spec-kitty agent action implement WP01 --agent <name>
```