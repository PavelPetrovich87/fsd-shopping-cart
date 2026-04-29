# Implementation Plan: Cart Control Component

**Branch**: `main` | **Date**: 2026-04-29 | **Spec**: `kitty-specs/017-cart-control/spec.md`
**Input**: Feature specification + Penpot design reference

## Branch Contract (repeat 2/2)

- Current branch at plan start: `main`
- Planning/base branch: `main`
- Final merge target: `main`
- `branch_matches_target`: `true`

## Summary

Implement `CartControl` as a stateless presentational quantity selector in `shared/ui/cart-control/`. The component renders a bounded increment/decrement control with the exact styling from the Penpot design: rounded container, light background, bordered, with icon-only buttons flanking a read-only quantity display.

**Scope adjustment**: The Penpot design (`controls` → `Cart Control`, 125×36) shows a **quantity selector only**. The remove button and confirmation modal exist as separate elements in the design system. Therefore, `CartControl` does **not** include remove/confirm UI. FR-006 through FR-009 from the spec are reclassified as **parent-layer concerns** (widget/feature slice). FR-001 through FR-005 and FR-010 remain in scope.

## Technical Context

| Item | Value |
|---|---|
| Language/Version | TypeScript 5.9, React 19 |
| UI Framework | Tailwind CSS v4 (design tokens in `src/shared/ui/tokens/theme.css`) |
| Component Library | Base UI (`@base-ui/react/button`) via existing `Button` in `shared/ui/shadcn/` |
| Icons | `lucide-react` (Plus, Minus) |
| Testing | Vitest Browser Mode via `@storybook/addon-vitest`, a11y `error` mode, Chromatic |
| Build | Vite 8 |
| Architecture | Feature-Sliced Design (FSD) |
| Target Layer | `shared/ui/` — zero domain knowledge, pure presentational |

## Charter Check

*GATE: Must pass before Phase 0 research.*

- [x] No charter violations — this is a single `shared/ui` component with no cross-layer imports.
- [x] FSD compliance: `shared/ui` may only depend on `shared/lib` (for `cn`, `Button`).
- [x] Complexity is trivial (one component, no state, no API).

## Project Structure

### Documentation (this feature)

```
kitty-specs/017-cart-control/
├── plan.md              # This file
├── spec.md              # Feature specification
├── meta.json            # Mission metadata
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```
src/shared/ui/cart-control/
├── cart-control.stories.tsx   # Story-first: written before component
├── cart-control.tsx           # Component implementation
└── index.ts                   # Public API export
```

## Design Reference (Penpot)

**Source**: Board `Cart Control` (ID `c3a36a78-0a61-5c93-a8ba-78d388de4f2a`)

| Property | Value |
|---|---|
| Width × Height | 125 × 36 |
| Layout | Flex row, gap 12, padding 2, align center, justify center |
| Background | `#fafafa` |
| Border | 1px `#e6e6e6`, radius 6px |
| Quantity text | Noto Sans 14px / 500, `#525252` |
| Button containers | 20 × 20, radius 4px, flex center |
| Icons | `add-fill` (plus), `subtract-fill` (minus), 16.67 × 16.67 |

**Token mapping** (Tailwind v4 `@theme`):
- Background: `var(--color-muted)` or nearest semantic token
- Border: `var(--color-border)`
- Text: `var(--color-foreground)` / `muted-foreground`
- Buttons use existing `Button` component with `size="icon-sm"` or custom sizing

## Data Model

```typescript
interface CartControlProps {
  quantity: number;
  min?: number;           // default 1
  max?: number;           // default 99
  disabled?: boolean;     // disables all buttons
  onIncrement: () => void;
  onDecrement: () => void;
}
```

**Validation rules**:
- `quantity` is integer ≥ 1
- Decrement button disabled when `quantity <= min`
- Increment button disabled when `quantity >= max`

## Component Design

### Layout

```
┌─────────────────────────────────────┐
│  [−]      quantity       [+]        │
│  20×20    49×32          20×20      │
│  icon     text center    icon       │
└─────────────────────────────────────┘
```

- Outer container: `<div>` with flex row, gap, border, radius, background
- Quantity display: `<span>` with `aria-live="polite"` for screen-reader announcements
- Buttons: existing `Button` component with `aria-label`

### A11y

- Decrement button: `aria-label="Decrease quantity"`
- Increment button: `aria-label="Increase quantity"`
- Quantity: `aria-live="polite"` so changes are announced
- Keyboard: buttons are natively focusable and activatable via Enter/Space

## Story Coverage

Story-first: write `cart-control.stories.tsx` before `cart-control.tsx`.

| Story | Props | Purpose |
|---|---|---|
| `Default` | `quantity: 3` | Baseline rendering |
| `AtMinimum` | `quantity: 1, min: 1` | Decrement disabled |
| `AtMaximum` | `quantity: 99, max: 99` | Increment disabled |
| `Disabled` | `quantity: 3, disabled: true` | All buttons disabled |
| `Interaction` | `quantity: 3` + `play()` | Clicks increment/decrement, verifies callback emission |

No MSW needed (no network). No random data. Deterministic.

## Testing Strategy

1. `npm run test:storybook` — must pass with zero a11y violations (error mode).
2. `npm run lint` — zero errors/warnings.
3. `npm run lint:arch` — FSD compliance verified.
4. `npm run build` — type-check and bundle succeed.
5. Optional: `npm run chromatic:local` — capture baselines for Default, AtMinimum, AtMaximum, Disabled.

## Acceptance Criteria

- [ ] `CartControl` renders in Storybook matching Penpot design (125×36 proportions, colors, spacing).
- [ ] Decrement disabled at `quantity <= min`; increment disabled at `quantity >= max`.
- [ ] `disabled={true}` disables all buttons; quantity remains visible.
- [ ] All buttons have `aria-label`; quantity has `aria-live="polite"`.
- [ ] `npm run test:storybook` passes (a11y error mode).
- [ ] `npm run lint` passes.
- [ ] `npm run lint:arch` passes.
- [ ] `npm run build` passes.

## Scope Exclusions (from spec, delegated to parent)

- Remove button UI (separate Penpot element, handled by parent widget).
- Confirmation modal (separate Penpot element, handled by parent widget).
- `onRequestRemove`, `onConfirmRemove`, `onCancelRemove` callbacks (parent layer).

## Files to Create / Modify

### Create
- `src/shared/ui/cart-control/cart-control.stories.tsx`
- `src/shared/ui/cart-control/cart-control.tsx`
- `src/shared/ui/cart-control/index.ts`

### Modify
- `src/shared/ui/index.ts` — add `CartControl` export

## Complexity Tracking

N/A — trivial component, no violations.

---

**Next step**: Run `/spec-kitty.tasks` to generate work packages.
