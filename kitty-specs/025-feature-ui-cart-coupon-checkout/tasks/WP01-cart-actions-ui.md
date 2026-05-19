---
work_package_id: WP01
title: Cart Actions UI Components
dependencies: []
requirement_refs:
- C-001
- C-002
- C-003
- C-005
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
- FR-025
- NFR-001
- NFR-002
- NFR-003
- NFR-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-025-feature-ui-cart-coupon-checkout
base_commit: 0eff897e74b8ee9699e03a9781fcbd18ebd4c546
created_at: '2026-05-19T12:08:58.853839+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
shell_pid: "5450"
agent: "kilocode:kimi-for-coding:reviewer:reviewer"
history:
- timestamp: '2026-05-19T11:59:19Z'
  event: created
  author: spec-kitty.tasks
authoritative_surface: src/features/cart-actions/
execution_mode: code_change
owned_files:
- src/features/cart-actions/ui/quantity-selector/**
- src/features/cart-actions/ui/remove-button/**
- src/features/cart-actions/index.ts
tags: []
---

# WP01: Cart Actions UI Components

## Objective

Implement two interactive feature-level UI components for cart item management: **QuantitySelector** and **RemoveButton**. Both components are pure presentational: they receive data via props and delegate actions through callbacks, with no direct store access. They reside in the `features/cart-actions` slice and import only from lower layers (`shared/ui`, `entities`).

## Context

- **Stack**: React 19, TypeScript 5.9, Tailwind CSS v4, Storybook (react-vite), Vitest Browser Mode
- **Architecture**: Feature-Sliced Design (FSD). Components must import only from lower layers (`shared/`, `entities/`)
- **Base components available**: `CartControl` (shared/ui), `Button` (shared/ui), `Modal` (shared/ui)
- **Existing use cases**: `ChangeCartItemQuantity`, `RemoveFromCart` in `src/features/cart-actions/model/`
- **Entity types**: `CartItem` from `src/entities/cart/`, `StockConflict` from `src/entities/product/`

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Implementation command: `spec-kitty agent action implement WP01 --agent <name>`

---

## Subtask T001: Create QuantitySelector Component

**Purpose**: Build a feature-level quantity selector that wraps the base `CartControl` component and enforces stock-aware min/max constraints.

**Files to create**:
- `src/features/cart-actions/ui/quantity-selector/quantity-selector.tsx`
- `src/features/cart-actions/ui/quantity-selector/index.ts`

**Interface** (adjust as needed):
```typescript
export interface QuantitySelectorProps {
  quantity: number
  availableStock: number
  disabled?: boolean
  onChangeQuantity: (newQuantity: number) => void
}
```

**Implementation steps**:
1. Import `CartControl` from `@/shared/ui/shadcn/cart-control`
2. Compute `min = 1`, `max = availableStock`
3. Render `CartControl` with:
   - `quantity` prop
   - `min={1}`
   - `max={availableStock}`
   - `disabled={disabled || quantity >= availableStock}` (the CartControl already handles disabling the + button when at max, but the `disabled` prop should also disable the entire control)
   - `onIncrement`: calls `onChangeQuantity(quantity + 1)`
   - `onDecrement`: calls `onChangeQuantity(quantity - 1)`
4. Ensure the component does not access any store directly — all data comes via props and actions go via callbacks
5. The component should be a thin wrapper that adds the stock-aware `max` constraint on top of `CartControl`

**Accessibility (NFR-004)**:
- `CartControl` already has `aria-live="polite"` on the quantity display. Verify this is preserved.
- The `−` and `+` buttons inside `CartControl` already have `aria-label` attributes.

**Edge cases**:
- `availableStock` <= 0: both increment and decrement should be disabled; quantity should still display
- `quantity` > `availableStock` (e.g., stale data): disable increment, but still allow decrement
- `quantity` === 1: decrement is disabled by CartControl's `atMin` logic

**Validation**:
- [ ] Component file exists and exports `QuantitySelector` + `QuantitySelectorProps`
- [ ] Index.ts re-exports from component file
- [ ] No store imports in the component
- [ ] TypeScript compiles without errors

---

## Subtask T002: Create QuantitySelector Stories

**Purpose**: Provide visual documentation covering all states and variants of QuantitySelector.

**File to create**: `src/features/cart-actions/ui/quantity-selector/quantity-selector.stories.tsx`

**Stories to include**:
1. **Default** — quantity=3, availableStock=10
2. **AtMinimum** — quantity=1, availableStock=10 (minus button disabled)
3. **AtMaximum** — quantity=10, availableStock=10 (plus button disabled)
4. **Disabled** — quantity=3, availableStock=10, disabled=true
5. **OutOfStock** — quantity=3, availableStock=0 (both buttons disabled)

**Implementation notes**:
- Use CSF3 format (same as existing stories in the project)
- Use a stateful wrapper component for stories that need interactivity (increment/decrement)
- `meta.title` should be `'Features/CartActions/QuantitySelector'`
- Add `tags: ['autodocs']`

**Validation**:
- [ ] All 5 stories render without errors in Storybook
- [ ] Each story demonstrates a distinct state

---

## Subtask T003: Create RemoveButton Component

**Purpose**: Build a feature-level remove button that renders as a text link and opens a confirmation modal before executing removal.

**Files to create**:
- `src/features/cart-actions/ui/remove-button/remove-button.tsx`
- `src/features/cart-actions/ui/remove-button/index.ts`

**Interface**:
```typescript
export interface RemoveButtonProps {
  onRemove: () => void
}
```

**Implementation steps**:
1. Import `Button` from `@/shared/ui/shadcn/button` and `Modal` from `@/shared/ui/modal`
2. Maintain local state: `isModalOpen` (boolean)
3. Render a `Button` with:
   - `variant="link"`
   - `size="default"` (or appropriate size)
   - Label text: `"Remove"`
   - `onClick`: opens the modal (sets `isModalOpen = true`)
4. Render `Modal` with:
   - `open={isModalOpen}`
   - `onClose`: closes modal (sets `isModalOpen = false`)
   - `title="Confirm Item Removal"`
   - Body: paragraph with text `"Are you sure you want to remove this item from your shopping cart?"`
   - Footer actions: two `Button` elements inside the modal body:
     - `"Cancel"` button with `variant="outline"`, closes modal
     - `"Yes"` button with `variant="default"`, calls `onRemove()` then closes modal
5. Focus management: the `Modal` component handles focus trap and focus restoration automatically

**Accessibility**:
- The remove link must be keyboard accessible (Button component handles this)
- Modal has correct ARIA semantics (handled by Modal component: `role="dialog"`, `aria-modal="true"`)

**Constraints**:
- Must reuse the existing `Modal` component (C-005), not create a custom modal

**Validation**:
- [ ] Component file exists and exports `RemoveButton` + `RemoveButtonProps`
- [ ] Index.ts re-exports from component file
- [ ] Clicking "Remove" opens the modal
- [ ] Clicking "Cancel" or the × button closes the modal without calling `onRemove`
- [ ] Clicking "Yes" calls `onRemove` and closes the modal
- [ ] ESC key and backdrop click close the modal (handled by Modal)

---

## Subtask T004: Create RemoveButton Stories

**Purpose**: Provide visual documentation for RemoveButton and its confirmation modal.

**File to create**: `src/features/cart-actions/ui/remove-button/remove-button.stories.tsx`

**Stories to include**:
1. **Default** — shows the "Remove" link (use a wrapper that manages modal state)
2. **ModalOpen** — shows the component with the confirmation modal already open

**Implementation notes**:
- Use CSF3 format
- `meta.title` should be `'Features/CartActions/RemoveButton'`
- For the ModalOpen story, initialize the wrapper state with `isModalOpen = true`

**Validation**:
- [ ] Both stories render without errors
- [ ] ModalOpen story shows the full confirmation dialog with title, body text, and action buttons

---

## Subtask T005: Update cart-actions Feature Index

**Purpose**: Expose the new UI components through the feature slice's public API.

**File to edit**: `src/features/cart-actions/index.ts`

**Changes**:
1. Add re-exports for the new UI components:
   ```typescript
   export { QuantitySelector } from './ui/quantity-selector'
   export type { QuantitySelectorProps } from './ui/quantity-selector'
   export { RemoveButton } from './ui/remove-button'
   export type { RemoveButtonProps } from './ui/remove-button'
   ```
2. Keep all existing model exports intact

**Validation**:
- [ ] Both components can be imported from `@/features/cart-actions`
- [ ] No circular imports introduced

---

## Subtask T006: Quality Gates

**Purpose**: Verify all code passes static analysis and type-checking.

**Commands to run** (from repo root):
```bash
npm run lint
npm run lint:arch
npm run build
```

**Fix any errors**:
- ESLint errors: fix code style, unused imports, accessibility issues
- Steiger (FSD) errors: verify no cross-layer violations (e.g., UI importing from other features)
- TypeScript/build errors: fix type mismatches

**Validation**:
- [ ] `npm run lint` exits 0
- [ ] `npm run lint:arch` exits 0
- [ ] `npm run build` exits 0

---

## Definition of Done

- [ ] QuantitySelector wraps CartControl with stock-aware max constraint (FR-001, FR-002, FR-003, FR-004)
- [ ] RemoveButton renders as a text link and opens a confirmation modal (FR-005, FR-006)
- [ ] Confirmation modal has correct title, body, and action buttons (FR-007, FR-008, FR-009)
- [ ] Modal closes via all expected methods (FR-010) — handled by base Modal component
- [ ] Focus trap and restoration work (FR-011) — handled by base Modal component
- [ ] All components have visual stories covering every state (FR-025)
- [ ] Components import only from lower layers per FSD rules (C-003)
- [ ] All quality gates pass

## Risks & Reviewer Guidance

1. **CartControl interface drift**: Verify `CartControlProps` in `src/shared/ui/shadcn/cart-control/cart-control.tsx` before implementing. If the interface has changed, adjust QuantitySelector accordingly.
2. **Modal footer layout**: The Modal component renders children in the body. Action buttons (Cancel/Yes) should be placed inside the modal's children prop, after the paragraph text, using flexbox for alignment.
3. **FSD layer violations**: Ensure `cart-actions/ui/` does NOT import from `features/apply-coupon/`, `features/checkout/`, or other feature slices. Only `shared/` and `entities/` are allowed.
4. **Storybook interaction**: The Default story for RemoveButton should show the link; clicking it should open the modal in the story canvas. Use a wrapper with `useState`.

## Activity Log

- 2026-05-19T12:09:04Z – kilocode:kimi-for-coding:implementer:implementer – shell_pid=5450 – Assigned agent via action command
- 2026-05-19T12:19:05Z – kilocode:kimi-for-coding:implementer:implementer – shell_pid=5450 – Ready for review: QuantitySelector and RemoveButton implemented with stories
- 2026-05-19T12:19:47Z – kilocode:kimi-for-coding:reviewer:reviewer – shell_pid=5450 – Started review via action command
