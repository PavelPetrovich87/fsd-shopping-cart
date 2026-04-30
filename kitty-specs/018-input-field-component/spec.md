# Input Field Component — Specification

> **STATUS: CANCELLED** — Blocked by incomplete design token system. See T-017 (Design System Foundation) which must be completed before any UI component work resumes.

## 1. Concept & Vision

A reusable, accessible Input Field component that integrates seamlessly with the existing design system. The component provides a clean, typed way to collect user text input across the application. It maintains visual consistency with the Button component (T-019) and relies on Design Tokens (T-018) for all styling decisions. Validation is handled externally by parent components, keeping the Input focused on presentation and accessibility.

---

## 2. User Experience

### 2.1 Visual Design

| Token | Value |
|-------|-------|
| **Background** | `--color-surface` |
| **Border** | `--color-border` (default), `--color-primary` (focus), `--color-error` (error) |
| **Text** | `--color-text-primary` |
| **Label** | `--color-text-secondary` |
| **Error message** | `--color-error` |
| **Height** | 40px (md), 32px (sm), 48px (lg) |
| **Padding** | 12px horizontal |
| **Border radius** | `--radius-md` (8px) |
| **Font size** | `--text-body` |
| **Disabled opacity** | 0.5 |

### 2.2 Component States

| State | Visual Treatment |
|-------|------------------|
| **Default** | 1px border in `--color-border`, white background |
| **Focus** | 2px border in `--color-primary`, subtle shadow ring |
| **Error** | 1px border in `--color-error`, red error message below |
| **Disabled** | 50% opacity, `not-allowed` cursor, no interaction |
| **Filled** | Same as default (content distinguishes) |

### 2.3 Layout & Structure

```
┌──────────────────────────────────────┐
│ [Label - above input]                │
├──────────────────────────────────────┤
│                                      │
│  [Input field with placeholder]     │
│                                      │
└──────────────────────────────────────┘
┌──────────────────────────────────────┐
│ [Error message - below input]        │
└──────────────────────────────────────┘
```

- Label renders above the input field
- Error message renders below when `error` prop is provided
- Full-width by default (flex-grow: 1)

---

## 3. Functionality

### 3.1 Core Features

| Feature | Description |
|---------|-------------|
| **Controlled input** | Value managed externally via `value` and `onChange` props |
| **Input types** | `text`, `email`, `password` supported via `type` prop |
| **Label** | Optional label rendered above via `label` prop |
| **Placeholder** | Optional placeholder text via `placeholder` prop |
| **Error display** | Error message rendered below via `error` string prop |
| **Disabled state** | Interaction blocked, reduced opacity |

### 3.2 User Interactions

| Interaction | Behavior |
|-------------|----------|
| **Typing** | `onChange` fires with updated string value |
| **Focus** | Focus ring appears, focus state styles applied |
| **Blur** | `onBlur` fires (for validation triggers) |
| **Tab navigation** | Input is focusable, participates in natural tab order |
| **Disabled click** | No interaction, cursor shows `not-allowed` |

### 3.3 Edge Cases

| Case | Handling |
|------|----------|
| Empty label | Label element not rendered |
| Empty error | Error message not rendered |
| Long input text | Text truncates with ellipsis or scrolls (TBD by CSS) |
| No placeholder | Placeholder attribute omitted |

---

## 4. Component Inventory

### 4.1 Props Interface

```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onBlur?: () => void;
  id?: string;
}
```

### 4.2 Storybook Stories

| Story | Description |
|-------|-------------|
| `Default` | Text input in default state |
| `WithLabel` | Input with visible label above |
| `WithPlaceholder` | Input showing placeholder text |
| `WithError` | Input in error state with error message |
| `Disabled` | Input in disabled state |
| `EmailType` | Email input with email keyboard on mobile |
| `PasswordType` | Password input with masked characters |
| `AllStates` | Knobs/controls for all prop combinations |

---

## 5. Dependencies

| Ticket | Status | Relationship |
|--------|--------|--------------|
| T-018 | ✅ Done | Design Tokens used for all styling |
| T-019 | ✅ Done | Component follows same patterns as Button |

---

## 6. Acceptance Criteria

| ID | Criterion | Testable |
|----|-----------|----------|
| FR-001 | Component accepts `value` and `onChange` props for controlled input | Yes |
| FR-002 | Component supports `type` prop: `text`, `email`, `password` | Yes |
| FR-003 | Component accepts optional `label` prop rendered above input | Yes |
| FR-004 | Component accepts optional `placeholder` prop | Yes |
| FR-005 | Component accepts optional `error` prop; when provided, shows error message and red border | Yes |
| FR-006 | Component accepts optional `disabled` prop; when true, blocks interaction | Yes |
| FR-007 | Component accepts optional `onBlur` prop | Yes |
| FR-008 | Input has visible focus state using `--color-primary` border and shadow ring | Visual |
| FR-009 | All styling uses design tokens from T-018 | Code review |
| FR-010 | Storybook stories cover all states and variants | Storybook |
| FR-011 | Component is fully accessible (label association, focus management) | a11y test |

---

## 7. Files to Create

| File | Purpose |
|------|---------|
| `src/shared/ui/input/input.tsx` | Input component |
| `src/shared/ui/input/input.stories.tsx` | Storybook stories |
| `src/shared/ui/input/index.ts` | Public API export |
| `src/shared/ui/index.ts` | Updated barrel export |

---

## 8. Success Criteria

1. **Functional**: All props work as specified with correct behavior for each state
2. **Visual**: Input matches design system aesthetics (border radius, colors, spacing from tokens)
3. **Accessible**: Properly associated labels, focus indicators, aria attributes
4. **Documented**: Storybook stories demonstrate all states and variants
5. **Integration**: Component builds without errors, passes lint/type checks