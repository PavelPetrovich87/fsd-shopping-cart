---
work_package_id: WP02
title: Scope Exclusion — Remove/Confirm (Parent Layer)
dependencies: []
requirement_refs:
- FR-006
- FR-007
- FR-008
- FR-009
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks: []
history: []
authoritative_surface: kitty-specs/017-cart-control/
execution_mode: planning_artifact
owned_files:
- kitty-specs/017-cart-control/**
tags: []
agent: "kilo:minimax:m2.7:implementer"
shell_pid: "78619"
---

# WP02: Scope Exclusion — Remove/Confirm (Parent Layer)

## Objective

Formally declare FR-006, FR-007, FR-008, and FR-009 as **excluded from this mission** — they are parent-layer concerns handled by the widget/feature slice.

## Context

Per the user-selected **Option B** and the implementation plan:

- `CartControl` is **quantity selector only** (Penpot `Cart Control` board, 125×36)
- Remove button is a separate element in the Penpot design system
- Confirmation modal is a separate element in the Penpot design system
- These are **not** part of `shared/ui/cart-control/`

## Excluded Functional Requirements

| FR | Description | Disposition |
|---|---|---|
| FR-006 | Emit `onRequestRemove` when remove button is clicked | **Parent layer** — widget/feature slice handles remove action |
| FR-007 | When `confirmingRemove={true}`, show confirmation UI | **Parent layer** — widget/feature slice manages confirmation state |
| FR-008 | Emit `onConfirmRemove` when "Yes" is clicked | **Parent layer** |
| FR-009 | Emit `onCancelRemove` when "Cancel" is clicked | **Parent layer** |

These FRs remain in `spec.md` for traceability but are **not implemented** in this mission.

## Rationale

The Penpot design separates the quantity control (`Cart Control`, 125×36) from the remove button and confirmation modal. The implementation follows the design exactly — `CartControl` is a focused, single-responsibility component.

The parent widget (e.g., `CartItem` in the widgets layer) composes `CartControl` with its own remove button and confirmation state.

## No Implementation Required

WP02 is a **planning artifact only**. No source files are created or modified.

**Implement command**: `spec-kitty agent action implement WP02 --agent <name>` — though this WP has no code to implement; it serves only to satisfy the requirement-mapping validator.

## Activity Log

- 2026-04-29T14:22:39Z – kilo:minimax:m2.7:implementer – shell_pid=78619 – Started implementation via action command
- 2026-04-29T14:22:56Z – kilo:minimax:m2.7:implementer – shell_pid=78619 – WP02 is a planning artifact - no code changes needed. FR-006-009 formally excluded from this mission (parent layer concerns).
