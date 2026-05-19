# Tasks: CartRow and EmptyState Entity UI

**Mission**: 024-entity-ui-cartrow-emptystate
**Feature**: CartRow and EmptyState Entity UI
**Date**: 2026-05-18

---

## Subtask Index

| ID | Description | WP | Parallel |
|---|---|---|---|
| T001 | Create CartRow directory structure and define CartRowProps interface | WP01 | [P] |
| T002 | Implement CartRow desktop layout (horizontal, `>= lg`) | WP01 | [P] |
| T003 | Implement CartRow responsive tablet and mobile layouts | WP01 | [P] |
| T004 | Integrate CartControl and Remove button with callbacks | WP01 | [P] |
| T005 | Write CartRow Storybook stories | WP01 | [P] |
| T006 | Verify CartRow accessibility | WP01 | [P] |
| T007 | Create EmptyState directory structure and define EmptyStateProps interface | WP02 | [P] |
| T008 | Implement EmptyState layout (icon, title, description, actions) | WP02 | [P] |
| T009 | Integrate Button component for primary/secondary actions | WP02 | [P] |
| T010 | Write EmptyState Storybook stories | WP02 | [P] |
| T011 | Verify EmptyState accessibility | WP02 | [P] |
| T012 | Update entities/cart/index.ts exports | WP03 | - |
| T013 | Run lint and fix errors | WP03 | - |
| T014 | Run lint:arch and fix FSD violations | WP03 | - |
| T015 | Run build and fix type/build errors | WP03 | - |
| T016 | Verify all Storybook stories render | WP03 | - |

---

## Work Packages

### WP01: CartRow Component
**Prompt**: `tasks/WP01-cart-row-component.md`
**Priority**: High
**Estimated Size**: ~400 lines

CartRow displays a single cart line item with product image, name, variant specs, description, price, quantity controls, and remove button.

**Subtasks**:
- [ ] T001 Create CartRow directory structure and define CartRowProps interface
- [ ] T002 Implement CartRow desktop layout (horizontal)
- [ ] T003 Implement CartRow responsive mobile layout (vertical)
- [ ] T004 Integrate CartControl and Remove button with callbacks
- [ ] T005 Write CartRow Storybook stories
- [ ] T006 Verify CartRow accessibility

**Dependencies**: None

---

### WP02: EmptyState Component
**Prompt**: `tasks/WP02-empty-state-component.md`
**Priority**: High
**Estimated Size**: ~350 lines

EmptyState displays the zero-items cart message with icon, title, description, and primary/secondary action buttons.

**Subtasks**:
- [ ] T007 Create EmptyState directory structure and define EmptyStateProps interface
- [ ] T008 Implement EmptyState layout (icon, title, description, actions)
- [ ] T009 Integrate Button component for primary/secondary actions
- [ ] T010 Write EmptyState Storybook stories
- [ ] T011 Verify EmptyState accessibility

**Dependencies**: None

---

### WP03: Integration and Quality Gates
**Prompt**: `tasks/WP03-integration-quality-gates.md`
**Priority**: High
**Estimated Size**: ~300 lines

Export UI components from entity public API and run all quality gates.

**Subtasks**:
- [ ] T012 Update entities/cart/index.ts exports
- [ ] T013 Run lint and fix errors
- [ ] T014 Run lint:arch and fix FSD violations
- [ ] T015 Run build and fix type/build errors
- [ ] T016 Verify all Storybook stories render

**Dependencies**: WP01, WP02

---

## Parallelization

- **WP01 and WP02** can be implemented in parallel (independent components)
- **WP03** must follow WP01 and WP02 (needs both components to exist)

## MVP Scope

WP01 + WP02 + WP03 = full feature. All three are required for a complete, shippable implementation.
