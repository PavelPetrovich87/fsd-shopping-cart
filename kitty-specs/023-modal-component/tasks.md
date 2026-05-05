# Tasks: Modal Component

## Branch Strategy

- **Current branch at workflow start**: `main`
- **Planning/base branch for this feature**: `main`
- **Completed changes must merge into**: `main`

---

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|-----|----------|
| T001 | Create `src/shared/ui/modal/` directory structure | WP01 | ✗ | [D] |
| T002 | Implement `modal.tsx` — structure and styling | WP01 | ✗ | [D] |
| T003 | Implement dismissal handlers (backdrop, close button, ESC) | WP01 | ✗ | [D] |
| T004 | Implement focus trap and focus management | WP01 | ✗ | [D] |
| T005 | Add ARIA attributes and accessibility | WP01 | ✗ | [D] |
| T006 | Implement enter/exit animations | WP01 | ✗ | [D] |
| T007 | Refine animation timing | WP01 | ✗ | [D] |
| T008 | Create `index.ts` public API export | WP01 | ✗ | [D] |
| T009 | Create `modal.stories.tsx` with CSF3 stories | WP02 | ✗ | [D] |
| T010 | Update `src/shared/ui/index.ts` to re-export Modal | WP02 | ✗ | [D] |
| T011 | Run quality gates: lint, lint:arch, build | WP02 | ✗ | [D] |

---

## Work Packages

### WP01 — Modal Component Implementation

**Summary**: Implement the complete Modal component with structure, styling, interactions, accessibility, and animations.

**Goal**: Deliver a production-ready Modal component in `src/shared/ui/modal/` that:
- Renders a full-viewport semi-transparent backdrop with centered white card
- Supports backdrop click, close button, and ESC key dismissal
- Traps focus inside while open and restores focus on close
- Has full ARIA support (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`)
- Animates enter (fade + scale up) and exit (fade + scale down) within 300ms
- Accepts arbitrary children and optional title
- Follows zero-trust styling (no `className` prop)

**Priority**: P0 (blocks WP02)

**Success Criteria**:
- [x] Backdrop covers full viewport with `#0a0a0a` at 70% opacity
- [x] Card is white, `border-radius: 8px`, padding `24px`
- [x] Close button (×) renders in top-right of card
- [x] Title renders when provided (18px, 600 weight, `#171717`)
- [x] Backdrop click, close button, and ESC all dismiss modal
- [x] Focus trapped inside modal; cycles on Tab/Shift+Tab
- [x] Focus restores to trigger element on close
- [ ] `role="dialog"` and `aria-modal="true"` present
- [x] Enter animation: backdrop fade-in + card scale-up/fade-in
- [x] Exit animation: reverse, completes within 300ms
- [x] Zero-trust: no `className` prop on Modal

**Included Subtasks**:
- [x] T001 Create directory structure
- [x] T002 Implement structure and styling
- [x] T003 Implement dismissal handlers
- [x] T004 Implement focus trap
- [x] T005 Add ARIA attributes
- [x] T006 Implement animations
- [x] T007 Refine animation timing
- [x] T008 Create `index.ts` export

**Implementation Sketch**:
1. Create `src/shared/ui/modal/` directory
2. Write `modal.tsx` with full component logic:
   - Portal rendering with `createPortal`
   - Backdrop and card structure with Tailwind tokens
   - Click/ESC handlers
   - Focus trap hook (inline or separate file)
   - ARIA attributes
   - CSS transitions for animations
3. Export from `index.ts`

**Parallel Opportunities**: Subtasks are sequential within this WP

**Dependencies**: None

**Risks**:
- Focus trap may conflict with nested forms — test with various content
- Exit animation timing may need tuning

---

### WP02 — Stories & Integration

**Summary**: Create Storybook stories for all Modal states and integrate into shared UI exports.

**Goal**: Modal is documented, visually tested, and available project-wide.

**Priority**: P1

**Success Criteria**:
- [ ] Storybook stories: Open, Without Title, Long Content, Form Content, Confirmation Dialog, Closed
- [ ] `src/shared/ui/index.ts` re-exports Modal
- [ ] All quality gates pass (lint, lint:arch, build)

**Included Subtasks**:
- [x] T009 Create `modal.stories.tsx`
- [x] T010 Update `src/shared/ui/index.ts`
- [x] T011 Run quality gates

**Implementation Sketch**:
1. Create CSF3 stories with controls for `open` and `title`
2. Use existing Button component for triggers
3. Update shared UI index
4. Run quality gates

**Parallel Opportunities**: T009 and T010 can be done in parallel

**Dependencies**: WP01

**Risks**:
- Storybook portal rendering — should work with standard setup

---

## Size Validation

| WP | Subtasks | Est. Lines | Status |
|----|----------|-----------|--------|
| WP01 | 8 | ~450 | ✅ Ideal |
| WP02 | 3 | ~250 | ✅ Ideal |

**All WPs within ideal range.**

---

## Notes

- This is a **medium complexity UI component** (2 sequential WPs)
- Technology stack: React 19 + TypeScript + Tailwind CSS v4 + CSF3 stories
- Component location follows existing patterns (`src/shared/ui/<component>/`)
- Design tokens from Penpot mapped to existing project Tailwind tokens
- Focus management is the most complex part of this component

---

## Next Command

Run implementation with:
```bash
spec-kitty next --agent <agent> --mission 023-modal-component
```
