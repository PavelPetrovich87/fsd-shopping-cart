# Work Packages: Cart Control Component

**Mission**: `017-cart-control`
**Feature**: `CartControl` — quantity selector (shared/ui)
**Date**: 2026-04-29

---

## Subtask Index

| ID | Description | WP | Parallel | Dependencies |
|---|---|---|---|---|
| T001 | Write `cart-control.stories.tsx` — Default, AtMinimum, AtMaximum, Disabled, Interaction stories | WP01 | ✓ | None | [D] | [D] |
| T002 | Implement `cart-control.tsx` — component with Plus/Minus buttons, quantity display, a11y | WP01 | ✓ | T001 | [D] |
| T003 | Create `index.ts`, export from `shared/ui/index.ts` | WP01 | ✓ | T002 | [D] |
| T004 | Validate: `npm run lint`, `npm run lint:arch`, `npm run build`, `npm run test:storybook` | WP01 | ✓ | T002, T003 | [D] |

---

## WP02: Scope Exclusion — Remove/Confirm (Parent Layer)

**Summary**: Formally declare FR-006–FR-009 as excluded (parent-layer concerns). Planning artifact only — no implementation.

**Priority**: 0 (informational — satisfies requirement-mapping validator)

**Success Criteria**: N/A — no code changes.

**Subtasks**: (none — planning artifact)

**Prompt file**: `kitty-specs/017-cart-control/tasks/WP02-scope-exclusion.md`

**Estimated prompt size**: ~50 lines

**Execution mode**: `planning_artifact`

**Owned files**: (none)

---

## WP01: Cart Control — Stories, Component & Validation

**Summary**: Implement the `CartControl` quantity selector in `shared/ui/cart-control/` following story-first convention. Write stories first, then the component. Validate with all project quality gates.

**Priority**: 1 (MVP — this is the only work package)

**Success Criteria**:
- `cart-control.stories.tsx` renders in Storybook with all 5 stories
- `cart-control.tsx` matches Penpot design (125×36, spacing, colors)
- All buttons have `aria-label`; quantity has `aria-live="polite"`
- Decrement disabled at `quantity <= min`; increment disabled at `quantity >= max`
- `npm run test:storybook` passes (zero a11y violations, error mode)
- `npm run lint` passes; `npm run lint:arch` passes; `npm run build` passes

**Subtasks**:
- [x] T001 Write `cart-control.stories.tsx` — Default, AtMinimum, AtMaximum, Disabled, Interaction (WP01)
- [x] T002 Implement `cart-control.tsx` — quantity selector component (WP01)
- [x] T003 Create `index.ts`, export from `shared/ui/index.ts` (WP01)
- [x] T004 Run all validation commands (WP01)

**Prompt file**: `kitty-specs/017-cart-control/tasks/WP01-cart-control-component.md`

**Estimated prompt size**: ~380 lines

**Execution mode**: `code_change`

**Owned files**:
- `src/shared/ui/cart-control/**`
- `src/shared/ui/index.ts`

---

## Implementation Sketch

### Phase 1: Stories (T001)

Write `src/shared/ui/cart-control/cart-control.stories.tsx` following CSF3 story-first convention.

**Stories to implement**:

| Story | Args | Purpose |
|---|---|---|
| `Default` | `quantity: 3, min: 1, max: 99` | Baseline — both buttons active |
| `AtMinimum` | `quantity: 1, min: 1` | Decrement button disabled |
| `AtMaximum` | `quantity: 99, max: 99` | Increment button disabled |
| `Disabled` | `quantity: 3, disabled: true` | All buttons disabled |
| `Interaction` | `quantity: 3` + `play()` | Click −/+ → verify callback fired |

**Important constraints**:
- No MSW (no network calls)
- No random data (`Math.random()`, `Date.now()`)
- Use deterministic static args only
- Interaction story uses `play` function for user interactions
- Import `Plus` and `Minus` from `lucide-react` for icon buttons

### Phase 2: Component (T002)

Implement `src/shared/ui/cart-control/cart-control.tsx` to satisfy the stories.

**Props contract**:
```typescript
interface CartControlProps {
  quantity: number;
  min?: number;        // default 1
  max?: number;       // default 99
  disabled?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}
```

**Layout** (per Penpot `Cart Control` board, ID `c3a36a78-0a61-5c93-a8ba-78d388de4f2a`):
- Outer `<div>`: 125×36, flex row, gap 12, padding 2, align center
- Background: `#fafafa`, border: 1px `#e6e6e6`, radius 6px
- Left: decrement button (20×20, radius 4px)
- Center: quantity text (49×32, Noto Sans 14px/500, `#525252`)
- Right: increment button (20×20, radius 4px)

**Buttons**: Use `lucide-react` `Plus` / `Minus` icons. Use existing `Button` from `@/shared/ui` with:
- `variant="ghost"` or custom styling to match the Penpot icon container look (20×20, transparent bg, subtle border)
- `size="icon-sm"` or smaller — the `Button` size variants may not map exactly; use inline className override if needed
- `aria-label="Decrease quantity"` / `aria-label="Increase quantity"`
- `disabled={disabled || quantity <= min}` / `disabled={disabled || quantity >= max}`

**Quantity display**: `<span aria-live="polite" aria-atomic="true">` so screen readers announce changes.

**Disabled state**: When `disabled={true}`, both buttons get `disabled` attribute; quantity text remains visible.

### Phase 3: Export (T003)

Create `src/shared/ui/cart-control/index.ts`:
```ts
export { CartControl } from './cart-control'
export type { CartControlProps } from './cart-control'
```

Add to `src/shared/ui/index.ts`:
```ts
export { CartControl } from './cart-control'
export type { CartControlProps } from './cart-control'
```

### Phase 4: Validation (T004)

Run in sequence:
```bash
npm run lint
npm run lint:arch
npm run build
npm run test:storybook
```

All must exit with code 0. Fix any violations before marking complete.

---

## Validation Gate

All of the following must pass before WP is considered complete:

| Command | Expected |
|---|---|
| `npm run lint` | Zero errors/warnings |
| `npm run lint:arch` | Zero FSD violations |
| `npm run build` | Type-check + bundle success |
| `npm run test:storybook` | Zero a11y violations |

---

## Dependencies

- T001 → T002 (stories before component)
- T002 → T003 (component before export)
- T002, T003 → T004 (implementation before validation)

**No external dependencies** — all work is self-contained in `shared/ui/cart-control/`.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Button size `icon-sm` (32×32) doesn't match Penpot (20×20) | Use inline `className` to override size, or use `size="icon-xs"` (24×24) as closest match |
| Existing `Button` doesn't support 20×20 icon containers | May need to use raw `<button>` styled with Tailwind instead of the shadcn Button wrapper |
| Chromatic baselines differ slightly across environments | Accept ±1% pixel difference threshold in Chromatic |

---

**Next**: Run `/spec-kitty.implement` to execute WP01.
