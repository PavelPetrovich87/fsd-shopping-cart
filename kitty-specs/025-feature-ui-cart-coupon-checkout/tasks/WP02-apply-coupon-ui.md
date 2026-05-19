---
work_package_id: WP02
title: Apply Coupon UI Component
dependencies: []
requirement_refs:
- C-001
- C-002
- C-003
- C-004
- FR-012
- FR-013
- FR-014
- FR-015
- FR-016
- FR-017
- FR-018
- FR-025
- NFR-001
- NFR-003
- NFR-006
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T007
- T008
- T009
- T010
agent: "kilocode:kimi-for-coding:reviewer:reviewer"
shell_pid: "5450"
history:
- timestamp: '2026-05-19T11:59:19Z'
  event: created
  author: spec-kitty.tasks
authoritative_surface: src/features/apply-coupon/
execution_mode: code_change
owned_files:
- src/features/apply-coupon/ui/coupon-input/**
- src/features/apply-coupon/index.ts
tags: []
---

# WP02: Apply Coupon UI Component

## Objective

Implement the **CouponInput** component in the `apply-coupon` feature slice. This is a stateful component that manages the full coupon application lifecycle: initial button → revealed input → validation → error display → success tag → removal. It receives callbacks for apply and remove actions, and manages its own internal UI state.

## Context

- **Stack**: React 19, TypeScript 5.9, Tailwind CSS v4, Storybook (react-vite), Vitest Browser Mode
- **Architecture**: FSD. Component must import only from lower layers (`shared/`, `entities/`)
- **Base components available**: `Button` (shared/ui), `InputField` (shared/ui), `Tag` (shared/ui)
- **Existing use cases**: `ApplyCoupon`, `RemoveCoupon` in `src/features/apply-coupon/model/`
- **Entity types**: `Coupon`, `CouponMode` from `src/entities/coupon/`
- **Constraint C-004**: Button-to-input transition must be an instant toggle without CSS animations

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Implementation command: `spec-kitty agent action implement WP02 --agent <name>`

---

## Subtask T007: Create CouponInput Component

**Purpose**: Build a stateful coupon input that handles the entire coupon application flow.

**Files to create**:
- `src/features/apply-coupon/ui/coupon-input/coupon-input.tsx`
- `src/features/apply-coupon/ui/coupon-input/index.ts`

**Interface**:
```typescript
export interface CouponInputProps {
  appliedCoupon?: {
    code: string
    discountLabel: string  // e.g., "-$10.00" or "-15%"
  }
  error?: string
  isLoading?: boolean
  onApply: (code: string) => void
  onRemove: () => void
}
```

**Internal state machine**:
The component has three primary visual modes determined by props and internal state:

1. **Button mode** (initial): `appliedCoupon` is undefined, input is not visible
   - Shows an "Apply coupon" button
   - Clicking the button reveals the input field (instant toggle, no animation)

2. **Input mode**: input is visible, no coupon applied yet
   - Shows an `InputField` for the coupon code
   - Shows a submit button (e.g., "Apply" or an arrow icon)
   - Validates on submit (not while typing)
   - If submitted empty: shows error "Please enter a valid code" (FR-015)
   - If `error` prop is provided: displays it via InputField's `error` prop
   - If `isLoading` is true: disables the input and button

3. **Tag mode**: `appliedCoupon` is defined
   - Shows a `Tag` component with the coupon code and discount label
   - Tag has a dismiss button (×) that calls `onRemove`
   - Input is hidden

**Implementation steps**:
1. Import `Button` from `@/shared/ui/shadcn/button`, `InputField` from `@/shared/ui/input-field`, `Tag` from `@/shared/ui/tag`
2. Maintain internal state: `isInputVisible` (boolean, default false)
3. Maintain local input value state: `inputValue` (string)
4. Button mode:
   - Render `<Button variant="outline" onClick={() => setIsInputVisible(true)}>Apply coupon</Button>`
5. Input mode (when `isInputVisible` is true and `appliedCoupon` is undefined):
   - Render `InputField` with:
     - `placeholder="Enter coupon code"`
     - `value={inputValue}`
     - `onChange` updates `inputValue`
     - `error={error}`
     - `disabled={isLoading}`
     - `autoFocus={true}` (so input is focused when revealed)
   - Render a submit `Button` next to or below the input
   - On form submit (or button click):
     - If `inputValue.trim() === ''`: the parent should handle this, but the component can also guard. Actually, the spec says validation happens on submit. The simplest approach: call `onApply(inputValue.trim())` and let the parent validate. But per the existing `ApplyCoupon` use case, empty code returns `EMPTY_CODE` error. So the component should pass the trimmed value to `onApply` and display the `error` prop.
     - Wait, re-reading FR-014/FR-015: "CouponInput validates the entered code on submit" and "displays 'Please enter a valid code' error when submitted empty". This suggests the component could do client-side validation before calling `onApply`. Either approach works: validate locally or let parent return error. For simplicity and consistency with the use case, let the parent handle validation and pass the error back via the `error` prop.
6. Tag mode (when `appliedCoupon` is defined):
   - Render `<Tag onDismiss={onRemove}>{appliedCoupon.code} {appliedCoupon.discountLabel}</Tag>`
   - When `onRemove` is called, the parent should clear `appliedCoupon`, and the component should reset `isInputVisible` to false

**State transition handling**:
- When `appliedCoupon` goes from defined → undefined (coupon removed), reset `isInputVisible` to false
- When `appliedCoupon` goes from undefined → defined (coupon applied), clear `inputValue` and set `isInputVisible` to false
- Use a `useEffect` to watch `appliedCoupon` changes and reset internal state appropriately

**No animations (C-004)**:
- The button-to-input transition must be instant. Use conditional rendering (`{isInputVisible && <InputField ... />}`) with no CSS transition/animation classes.

**Accessibility (NFR-001, NFR-003, NFR-006)**:
- The "Apply coupon" button is keyboard accessible (Button component handles this)
- The input field has proper labeling (InputField handles this)
- Error states include text and are perceivable without color alone (InputField shows error text + AlertCircle icon)
- The Tag dismiss button has an aria-label (Tag component handles this)

**Validation**:
- [ ] Component file exists and exports `CouponInput` + `CouponInputProps`
- [ ] Index.ts re-exports from component file
- [ ] No store imports in the component
- [ ] TypeScript compiles without errors

---

## Subtask T008: Create CouponInput Stories

**Purpose**: Provide visual documentation covering every state and variant of CouponInput.

**File to create**: `src/features/apply-coupon/ui/coupon-input/coupon-input.stories.tsx`

**Stories to include**:
1. **ButtonState** — initial state showing "Apply coupon" button
2. **InputVisible** — input field revealed, no coupon applied
3. **Loading** — input visible, `isLoading=true`, input and button disabled
4. **ErrorEmpty** — input visible, `error="Please enter a valid code"`
5. **ErrorInvalid** — input visible, `error="Sorry, but this coupon doesn't exist"`
6. **Success** — `appliedCoupon={ code: "SAVE10", discountLabel: "-$10.00" }`, tag displayed
7. **SuccessPercentage** — `appliedCoupon={ code: "SUMMER15", discountLabel: "-15%" }`, tag displayed

**Implementation notes**:
- Use CSF3 format
- `meta.title` should be `'Features/ApplyCoupon/CouponInput'`
- Use a stateful wrapper for stories that need interaction (ButtonState → InputVisible transition)
- For static state stories (Loading, ErrorEmpty, ErrorInvalid, Success), pass props directly

**Validation**:
- [ ] All 7 stories render without errors in Storybook
- [ ] Each story demonstrates a distinct state

---

## Subtask T009: Update apply-coupon Feature Index

**Purpose**: Expose the new UI component through the feature slice's public API.

**File to edit**: `src/features/apply-coupon/index.ts`

**Changes**:
1. Add re-exports:
   ```typescript
   export { CouponInput } from './ui/coupon-input'
   export type { CouponInputProps } from './ui/coupon-input'
   ```
2. Keep all existing model exports intact

**Validation**:
- [ ] Component can be imported from `@/features/apply-coupon`
- [ ] No circular imports introduced

---

## Subtask T010: Quality Gates

**Purpose**: Verify all code passes static analysis and type-checking.

**Commands to run** (from repo root):
```bash
npm run lint
npm run lint:arch
npm run build
```

**Fix any errors**:
- ESLint errors: fix code style, unused imports, accessibility issues
- Steiger (FSD) errors: verify no cross-layer violations
- TypeScript/build errors: fix type mismatches

**Validation**:
- [ ] `npm run lint` exits 0
- [ ] `npm run lint:arch` exits 0
- [ ] `npm run build` exits 0

---

## Definition of Done

- [ ] CouponInput initial state shows "Apply coupon" button (FR-012)
- [ ] Clicking button reveals input field instantly (FR-013, C-004)
- [ ] Validation happens on submit, not while typing (FR-014)
- [ ] Empty submission shows "Please enter a valid code" (FR-015)
- [ ] Invalid code shows "Sorry, but this coupon doesn't exist" (FR-016)
- [ ] Success state shows dismissible tag with discount (FR-017)
- [ ] Clicking tag dismiss removes coupon (FR-018)
- [ ] All states are documented with stories (FR-025)
- [ ] Component imports only from lower layers per FSD rules (C-003)
- [ ] No CSS animations on state transitions (C-004)
- [ ] All quality gates pass

## Risks & Reviewer Guidance

1. **State management complexity**: CouponInput has multiple UI modes. The internal `isInputVisible` state must be properly reset when `appliedCoupon` changes. Use `useEffect` to sync internal state with prop changes, but avoid infinite loops.
2. **Error message exactness**: FR-015 and FR-016 require specific error strings. The component displays whatever `error` prop is passed, so the parent is responsible for providing the exact strings. Document this in the component's JSDoc.
3. **Form submission**: Decide whether to use a `<form>` element or a standalone button. A `<form onSubmit={...}>` is more semantic and handles Enter key submission naturally. If using a form, call `e.preventDefault()` in the submit handler.
4. **FSD layer violations**: Ensure `apply-coupon/ui/` does NOT import from other feature slices. Only `shared/` and `entities/` are allowed.
5. **Input autoFocus**: When the input is revealed, it should receive focus automatically. Use the `autoFocus` prop on `InputField`.

## Activity Log

- 2026-05-19T12:09:26Z – kilocode:kimi-for-coding:implementer:implementer – shell_pid=5450 – Started implementation via action command
- 2026-05-19T12:19:12Z – kilocode:kimi-for-coding:implementer:implementer – shell_pid=5450 – Ready for review: CouponInput implemented with stories
- 2026-05-19T12:20:27Z – kilocode:kimi-for-coding:reviewer:reviewer – shell_pid=5450 – Started review via action command
- 2026-05-19T12:21:04Z – kilocode:kimi-for-coding:reviewer:reviewer – shell_pid=5450 – Review passed: CouponInput implements all 3 visual modes (button, input, tag) with instant toggle. Error states and loading states handled. All stories cover required states. Quality gates pass.
