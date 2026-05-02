# Input Field Component

## 1. Concept & Vision

A reusable input field UI component for the shopping cart application, built on design tokens extracted from the Penpot design system. The component provides a clean, accessible text input with label, hint, and inline icon support, representing the foundational form element used across the application. It embodies a minimal, neutral aesthetic that adapts to various contexts through prop-driven state changes.

## 2. Design Tokens (from Penpot)

The following token values are extracted from the linked Penpot design file:

### Colors

| Token Name | Hex Value | Project Token | Tailwind Class | Usage |
|-----------|-----------|---------------|----------------|-------|
| `color.input.background` | `#fafafa` | `neutral-100` | `bg-neutral-100` / `bg-input` | Input field background fill |
| `color.input.border` | `#e5e5e5` | — | `style={{ borderColor: '#e5e5e5' }}` | Default input border (1px solid) |
| `color.input.border.filled` | `#f5f5f5` | `neutral-200` | `border-neutral-200` | Border when value is present |
| `color.label` | `#404040` | `neutral-800` | `text-neutral-800` | Label text color |
| `color.hint.default` | `#737373` | `neutral-600` | `text-neutral-600` | Default hint/placeholder text |
| `color.hint.error` | `#dc2626` | `error-600` | `text-error-600` | Error hint text color |
| `color.input.text.placeholder` | `#737373` | `neutral-600` | `placeholder:text-neutral-600` | Placeholder text in empty input |
| `color.input.text.filled` | `#a3a3a3` | `neutral-500` | `text-neutral-500` | User-entered text (unfocused) |
| `color.input.text.focused` | `#171717` | `neutral-950` | `text-neutral-950` | User-entered text (focused) |
| `color.icon.default` | `#a3a3a3` | `neutral-500` | `text-neutral-500` | Default inline icon (question-line) |
| `color.icon.error` | `#dc2626` | `error-600` | `text-error-600` | Error inline icon (error-warning-line) |

### Typography

| Token Name | Value | Usage |
|-----------|-------|-------|
| `font.label` | Noto Sans, 500 weight, 14px | Label text |
| `font.hint` | Noto Sans, 400 weight, 14px | Hint text |
| `font.input` | Noto Sans, 400 weight, 14px | User-entered / placeholder text |

### Spacing & Dimensions

| Token Name | Value | Usage |
|-----------|-------|-------|
| `spacing.input.padding` | 8px | Internal horizontal padding |
| `spacing.input.gap` | 8px | Gap between icon and text content |
| `spacing.label-input` | 6px | Gap between label and input area |
| `spacing.input-hint` | 6px | Gap between input and hint text |
| `borderRadius.input` | 4px | Input field corner radius |
| `dimensions.input.width` | 320px | Input field width |
| `dimensions.input.height` | 40px | Input field height |

### States

The Penpot style guide defines **8 distinct visual states** for the input field. These are not 8 separate props — they are combinations of 4 base props (`value`, `error`, `disabled`, `:focus`).

| Penpot State | Border | Background | Input Text | Hint Text | Icon | Icon Color |
|-------------|--------|-----------|------------|-----------|------|------------|
| **Normal** | `#e5e5e5` | `#fafafa` | `#737373` (placeholder) | `#737373` | question-line | `#a3a3a3` |
| **Error** | `#e5e5e5` | `#fafafa` | `#737373` (placeholder) | `#737373` | question-line | `#a3a3a3` |
| **Filled** | `#f5f5f5` | `#fafafa` | `#a3a3a3` (value) | `#737373` | question-line | `#a3a3a3` |
| **Error filled** | `#e5e5e5` | `#fafafa` | `#171717` (value) | `#737373` | question-line | `#a3a3a3` |
| **Focused** | **none** | `#fafafa` | `#171717` (value) | `#737373` | question-line | `#a3a3a3` |
| **Error focused** | `#e5e5e5` | `#fafafa` | `#737373` (placeholder) | `#dc2626` | error-warning-line | `#dc2626` |
| **Disabled** | **none** | `#fafafa` | `#171717` (value) | `#dc2626` | error-warning-line | `#dc2626` |
| **Success** | `#e5e5e5` | `#fafafa` | `#737373` (placeholder) | `#dc2626` | error-warning-line | `#dc2626` |

### Visual Rules (Derived)

These rules determine the final appearance from prop combinations:

| Condition | Border | Hint Color | Icon |
|-----------|--------|-----------|------|
| `disabled` | **none** | `#dc2626` if error else `#737373` | error-warning-line if error else question-line |
| `:focus` + no error | **none** | `#737373` | question-line |
| `value` present + no focus + no error | `#f5f5f5` | `#737373` | question-line |
| `error` present | `#e5e5e5` | `#dc2626` | error-warning-line |
| Default (empty, no error, not focused) | `#e5e5e5` | `#737373` | question-line |

## 3. User Scenarios & Testing

### Primary User Flows

1. **Basic Text Input**
   - User sees input field with label above
   - User clicks/taps into field, cursor appears, border disappears
   - User types text, text displays in `#171717`
   - User can clear field via backspace

2. **With Hint Text**
   - Hint text appears below label, above input
   - Hint is persistent — does not disappear when user types
   - Hint color changes to `#dc2626` when error prop is provided

3. **Focus Navigation**
   - User tabs to field, border disappears (focus state)
   - Input text color changes to `#171717` when focused with value
   - User tabs away, border returns to appropriate state color

4. **Disabled State**
   - Input becomes non-editable
   - Border is removed entirely
   - No opacity reduction (per Penpot design)
   - Cannot receive focus

5. **Error Feedback**
   - Error hint displays in `#dc2626` below input
   - Inline icon switches to error-warning-line (`#dc2626`)
   - Border remains `#e5e5e5` (no red border per design)

### Edge Cases

- Empty submission: Allow (no forced validation)
- Very long text: Scroll horizontally within input bounds
- Paste support: Full clipboard paste support
- Mobile keyboard: Triggers appropriate keyboard type

## 4. Component Specification

### Anatomy

```
┌─────────────────────────────┐
│ Label                       │  ← Optional, above input
├─────────────────────────────┤
│ Hint text                   │  ← Optional, between label and input
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ [?]  User input text    │ │  ← Input area with inline icon
│ │                         │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Error / success hint        │  ← When error prop provided
└─────────────────────────────┘
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Label text displayed above input |
| `hint` | `string` | `undefined` | Hint text displayed below label; color changes based on error state |
| `placeholder` | `string` | `""` | Placeholder text when empty |
| `value` | `string` | `undefined` | Controlled input value |
| `defaultValue` | `string` | `""` | Uncontrolled initial value |
| `disabled` | `boolean` | `false` | Disables the input; removes border |
| `error` | `string` | `undefined` | Error/success message; triggers error icon + red hint |
| `id` | `string` | auto-generated | Input element ID (via `React.useId`) |
| `name` | `string` | `undefined` | Input name attribute |
| `onChange` | `function` | `undefined` | Change event handler |
| `onFocus` | `function` | `undefined` | Focus event handler |
| `onBlur` | `function` | `undefined` | Blur event handler |

**Note**: The inline icon is derived from state — `question-line` (default) or `error-warning-line` (when error is present). It is not a controllable prop.

### Accessibility

- `id` attribute linked to `<label>` via `htmlFor` attribute
- `disabled` state properly communicated via `disabled` + `aria-disabled` attributes
- Error hint linked to input via `aria-describedby`
- Icon has `aria-hidden="true"` (decorative)
- Error hint uses `role="alert"` for screen reader announcement
- Focus state must meet WCAG 2.1 focus visibility requirements (border removal is offset by background/text color change)

## 5. Requirements

### Functional Requirements

| ID | Requirement | Status |
|----|--------------|--------|
| FR-001 | Component renders a labeled text input field | pending |
| FR-002 | Label displays above the input area | pending |
| FR-003 | Optional hint text displays between label and input | pending |
| FR-004 | Placeholder text appears when input is empty | pending |
| FR-005 | Input accepts and displays text input | pending |
| FR-006 | Disabled state prevents user interaction | pending |
| FR-007 | Error state displays error message below input | pending |
| FR-008 | Focus state removes border and changes text color | pending |
| FR-009 | Component supports controlled and uncontrolled modes | pending |
| FR-010 | Change events expose native input events | pending |
| FR-011 | Component displays correct inline icon based on state (question-line vs error-warning-line) | pending |
| FR-012 | Hint text color changes based on error state (`#737373` default, `#dc2626` error) | pending |
| FR-013 | Border color changes based on state (`#e5e5e5` default, `#f5f5f5` filled, none on focus/disabled) | pending |
| FR-014 | Input text color changes based on state (`#737373` placeholder, `#a3a3a3` filled, `#171717` focused) | pending |

### Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|----|--------------|-----------|--------|
| NFR-001 | Input responds to keystroke within | < 16ms | pending |
| NFR-002 | Component works in React 19 environment | Compatible | pending |

### Constraints

| ID | Constraint | Status |
|----|------------|--------|
| C-001 | Must use design tokens from Penpot for styling | pending |
| C-002 | Must integrate with existing FSD architecture | pending |
| C-003 | Must support Storybook CSF3 format | pending |
| C-004 | Must pass lint and typecheck on commit | pending |
| C-005 | Must use lucide-react for inline icons | pending |
| C-006 | Must not use Tailwind arbitrary values (bracket notation) | pending |

## 6. Success Criteria

1. **Usability**: Users can successfully enter text, receive feedback on focus, and understand error states
2. **Accessibility**: Component meets WCAG 2.1 AA standards for form controls
3. **Consistency**: Visual appearance matches Penpot design specifications within tolerance
4. **Maintainability**: Component exports cleanly with documented props and Storybook stories covering all 8 Penpot states

## 7. Key Entities

### InputField Component

**Location**: `src/shared/ui/input-field/`

**Files**:
- `input-field.tsx` - Main component
- `input-field.stories.tsx` - CSF3 stories (8 states)
- `index.ts` - Public exports

**Dependencies**:
- `lucide-react` (for `CircleHelp` and `AlertCircle` icons)
- `@/shared/lib/utils` (for `cn` utility)

## 8. Assumptions

- Font loading (Noto Sans) is handled globally by the application
- Color tokens are implemented via Tailwind CSS v4 semantic classes (`neutral-*`, `error-*`)
- The inline icon is decorative and does not require interactive behavior
- The "Success" state in Penpot is semantically an error state with a success-oriented message; it shares the same visual treatment as other error states
