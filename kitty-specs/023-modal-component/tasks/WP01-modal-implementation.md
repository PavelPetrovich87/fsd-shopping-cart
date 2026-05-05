---
work_package_id: WP01
title: Modal Component Implementation
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
- FR-013
- FR-014
- NFR-001
- NFR-002
- NFR-003
- NFR-004
- C-001
- C-002
- C-003
- C-005
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-023-modal-component
base_commit: 308c3ab4d4b02bd296fe06e1222f7ce7c84cf32f
created_at: '2026-05-05T07:43:57.422236+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
- T007
- T008
shell_pid: "4019"
history: []
authoritative_surface: src/shared/ui/modal/
execution_mode: code_change
owned_files:
- src/shared/ui/modal/modal.tsx
- src/shared/ui/modal/index.ts
tags: []
agent: "kilo"
---

# WP01: Modal Component Implementation

## Objective

Implement the complete Modal component with structure, styling, interactions, accessibility, and animations. This is the core work package containing all component logic.

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution:** This WP is executed in its own worktree allocated by spec-kitty lanes.

## Context

This is **T-024: Modal Component** from the Shopping Cart design system. The modal is a `shared/ui` component — pure presentation, no business logic. It must follow:
- **FSD architecture:** Lives in `shared/ui` (no domain logic)
- **Story-first UI:** Component is implemented with stories (in WP02)
- **Zero-trust styling:** No `className` prop on root element
- **Token law:** Only existing design tokens, no arbitrary values

## Design Reference (from Penpot)

- **Backdrop:** Full viewport, `#0a0a0a` at 70% opacity → `bg-neutral-950/70`
- **Card:** White (`#ffffff` → `bg-white`), `border-radius: 8px` (`rounded-lg`)
- **Card padding:** 24px (`p-6`)
- **Internal gap:** 32px (`gap-8`)
- **Card width:** 343px (default), centered
- **Close button:** 24×24, positioned top-right inside card
- **Title:** Noto Sans, 18px (`text-lg`), weight 600 (`font-semibold`), `#171717` (`text-neutral-950`)
- **Shadow:** Drop shadow on card

## Subtasks

### T001: Create `src/shared/ui/modal/` directory structure

**Purpose:** Set up the FSD slice for the Modal component.

**Steps:**
1. Create directory `src/shared/ui/modal/`

**Files:**
- `src/shared/ui/modal/` (new directory)

**Validation:**
- [ ] Directory exists

---

### T002: Implement `modal.tsx` — structure and styling

**Purpose:** Build the Modal component shell with backdrop, card, close button, and generic children API.

**Steps:**
1. Create `Modal` component accepting `open`, `onClose`, `title`, `children` props
2. Render backdrop as full-viewport fixed overlay with semi-transparent background
3. Render card as white rounded container with padding, centered
4. Render close button (× icon) in top-right corner of card — reuse existing Button component or simple icon button
5. Support `title` prop rendering as styled heading inside card
6. Render `children` inside card below title
7. Use React portal to render modal outside main DOM hierarchy

**Component API:**
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
```

**Styling Requirements:**
- Backdrop: `fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70`
- Card: `relative w-[343px] max-w-[calc(100%-2rem)] rounded-lg bg-white p-6 shadow-lg`
- Close button: positioned absolute top-right inside card (`right-4 top-4`)
- Title: `text-lg font-semibold text-neutral-950`
- Content gap: `gap-8` between title section and children

**Zero-trust constraint:**
- No `className` prop accepted by Modal root

**Files:**
- `src/shared/ui/modal/modal.tsx` (new, ~60-80 lines for structure)

**Validation:**
- [ ] Component compiles
- [ ] Backdrop covers full viewport
- [ ] Card centered with correct styling
- [ ] Close button renders
- [ ] Title and children render

---

### T003: Implement dismissal handlers

**Purpose:** Enable users to close the modal via backdrop click, close button, and ESC key.

**Steps:**
1. **Backdrop click:** Add `onClick` to backdrop — call `onClose()` only if click target is backdrop itself
2. **Close button click:** Add `onClick` to close button — call `onClose()`
3. **ESC key:** Add `useEffect` with `keydown` listener — call `onClose()` on `Escape`
4. All handlers disabled when `open === false`

**Files:**
- `src/shared/ui/modal/modal.tsx` (modified)

**Validation:**
- [ ] Backdrop click closes modal
- [ ] Card click does NOT close modal
- [ ] Close button closes modal
- [ ] ESC closes modal

---

### T004: Implement focus trap and focus management

**Purpose:** Trap focus inside the modal while open, and restore focus on close.

**Steps:**
1. When modal opens, find all focusable elements inside
2. Move focus to first focusable element (or modal container)
3. On `Tab`: cycle to first element after last
4. On `Shift+Tab`: cycle to last element before first
5. Store previously focused element before opening
6. On close, restore focus to previously focused element (if in DOM)
7. Clean up on unmount

**Files:**
- `src/shared/ui/modal/modal.tsx` (modified)

**Validation:**
- [ ] Focus moves on open
- [ ] Tab cycles inside modal
- [ ] Focus restores on close

---

### T005: Add ARIA attributes and accessibility

**Purpose:** Make the modal accessible to screen readers.

**Steps:**
1. Add `role="dialog"` and `aria-modal="true"` to card
2. If `title` provided: generate ID, add `aria-labelledby`
3. If no title: add `aria-label="Dialog"`
4. Lock body scroll when modal is open (`overflow-hidden` on body)

**Files:**
- `src/shared/ui/modal/modal.tsx` (modified)

**Validation:**
- [ ] ARIA attributes present
- [ ] Body scroll locked when open

---

### T006: Implement enter/exit animations

**Purpose:** Add smooth fade + scale animations.

**Steps:**
1. Track `isClosing` state for exit animation
2. Backdrop: `opacity-0` → `opacity-100` (transition 200ms)
3. Card: `opacity-0 scale-95` → `opacity-100 scale-100` (transition 300ms)
4. On close: set `isClosing = true`, wait for animation end, then unmount
5. Use `onTransitionEnd` or `setTimeout(300)` with cleanup

**Files:**
- `src/shared/ui/modal/modal.tsx` (modified)

**Validation:**
- [ ] Enter animation smooth
- [ ] Exit animation smooth
- [ ] Completes within 300ms
- [ ] Handles rapid toggle

---

### T007: Refine animation timing

**Purpose:** Fine-tune animation parameters.

**Steps:**
1. Backdrop duration: 200ms
2. Card duration: 300ms
3. Easing: `ease-out` for enter, `ease-in` for exit
4. Test rapid open/close

**Files:**
- `src/shared/ui/modal/modal.tsx` (modified)

**Validation:**
- [ ] Timing feels responsive
- [ ] No state desync on rapid toggle

---

### T008: Create `index.ts` public API export

**Purpose:** Expose the public API for the modal slice.

**Steps:**
1. Create `src/shared/ui/modal/index.ts`
2. Re-export `Modal` and `ModalProps`

```typescript
export { Modal } from './modal'
export type { ModalProps } from './modal'
```

**Files:**
- `src/shared/ui/modal/index.ts` (new, ~5 lines)

**Validation:**
- [ ] Named exports (no default)
- [ ] Type exported

## Definition of Done

- [ ] All subtasks complete
- [ ] `npm run lint` passes
- [ ] `npm run lint:arch` passes
- [ ] `npm run build` passes
- [ ] Component can be imported from `@/shared/ui/modal`
- [ ] Modal is fully keyboard-navigable
- [ ] Animations are smooth and ≤300ms

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Focus trap may conflict with nested elements | Low | Test with forms and links inside modal |
| Exit animation may not complete | Medium | Use `onTransitionEnd` with fallback timeout |
| Portal may conflict with app structure | Low | Use standard React portal pattern |

## Reviewer Guidance

- Test keyboard navigation: Tab, Shift+Tab, Enter, Space, ESC
- Verify screen reader announces dialog role
- Check focus restoration after close
- Verify animation timing in DevTools

## Activity Log

- 2026-05-05T07:44:06Z – kilo – shell_pid=4019 – Assigned agent via action command
- 2026-05-05T07:50:27Z – kilo – shell_pid=4019 – Ready for review: Modal component with backdrop, focus trap, accessibility, animations
- 2026-05-05T07:55:54Z – kilo – shell_pid=4019 – Started review via action command
