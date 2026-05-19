# Implementation Plan: 025-feature-ui-cart-coupon-checkout

**Branch**: `main` | **Date**: 2026-05-19 | **Spec**: `kitty-specs/025-feature-ui-cart-coupon-checkout/spec.md`
**Input**: Feature specification from `/kitty-specs/025-feature-ui-cart-coupon-checkout/spec.md`

**Branch contract confirmation** (2 of 2):
- Current branch at plan start: `main`
- Planning/base branch for this feature: `main`
- Final merge target for completed changes: `main`
- `branch_matches_target`: true

## Summary

Build five interactive feature-level UI components that connect the design system's base components to domain use cases for cart quantity management, item removal, coupon application, and checkout initiation. Components are pure presentational: they receive data via props and delegate actions via callbacks, with no direct store access.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: Vite 8, Tailwind CSS v4, Storybook (react-vite), @storybook/addon-vitest with Vitest Browser Mode (Playwright/Chromium), @base-ui/react
**Storage**: N/A (client-side state via Zustand cart store, not accessed directly by these components)
**Testing**: Storybook stories for visual documentation; Vitest Browser Mode for component-level testing; ESLint 9 + Steiger (FSD linter) for static validation
**Target Platform**: Web browsers (viewport 320px - 1440px)
**Project Type**: Single-page web application (frontend)
**Performance Goals**: Component render < 16ms, story load < 2s
**Constraints**: No CSS animations for CouponInput toggle (C-004); reuse existing base components only (C-001); components import only from lower layers per FSD rules (C-003)
**Scale/Scope**: 5 components + stories, ~600-800 lines of production code

## Charter Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Gate | Status | Notes |
|---|---|---|
| Charter exists | Yes | `/Users/user/work/fsd-shopping-cart/.kittify/charter/charter.md` |
| Language/framework alignment | **MISMATCH** | Charter specifies Python 3.11+/pytest; project is React 19/TypeScript/Vitest Browser Mode. This is a known drift - the project predates charter generation or charter was copied from a different project template. |
| Testing standards | Partial | Charter requires 80%+ coverage (pytest-oriented). Project uses Storybook + Vitest Browser Mode. Visual regression and interaction testing via stories replaces traditional unit coverage for UI components. |
| Quality gates | Pass | Tests pass, lint clean, type checks pass, no unresolved review findings - aligns with project AGENTS.md workflow. |
| Branch strategy | Pass | At least one focused reviewer approves before merge - aligns with spec-kitty lane-based workflow. |
| DIRECTIVE_035 (lane-based worktrees) | Pass | Project uses spec-kitty worktree workflow. |

**Charter/Project Mismatch Resolution**: The charter was generated for a Python CLI project but this is a React/TypeScript frontend project. The FSD architecture, Storybook-based testing, and Tailwind CSS stack are established in `AGENTS.md` and practiced in the codebase. Implementation will follow the project's actual stack, not the charter's Python directives.

## Project Structure

### Documentation (this feature)

```
kitty-specs/025-feature-ui-cart-coupon-checkout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/spec-kitty.tasks command)
```

### Source Code (repository root)

```
src/
├── entities/
│   ├── cart/
│   │   ├── model/          # Cart, CartItem, CartState types
│   │   └── ui/             # CartRow, EmptyState (existing)
│   ├── coupon/
│   │   └── model/          # Coupon, CouponMode types
│   └── product/
│       └── model/          # StockConflict, availableStock
├── features/
│   ├── cart-actions/
│   │   ├── model/          # ChangeQuantity, RemoveFromCart use cases (existing)
│   │   └── ui/             # QuantitySelector, RemoveButton (NEW)
│   ├── apply-coupon/
│   │   ├── model/          # ApplyCoupon, RemoveCoupon use cases (existing)
│   │   └── ui/             # CouponInput (NEW)
│   ├── checkout/
│   │   ├── model/          # InitiateCheckout use case (existing)
│   │   └── ui/             # CheckoutButton, StockConflictModal (NEW)
│   └── shopping-cart/
│       └── ui/             # Widget composition (out of scope, T-027)
├── shared/
│   ├── ui/                 # Base components: Button, InputField, CartControl, Tag, Modal
│   └── lib/                # Utils, Money, EventBus
└── pages/
    └── App.tsx             # Page layout (out of scope, T-028)
```

**Structure Decision**: Single-page web application using Feature-Sliced Design (FSD). Feature UI components are co-located in their respective feature slices (`cart-actions/ui/`, `apply-coupon/ui/`, `checkout/ui/`). Each feature slice exports its public API via `index.ts`. Components import only from lower layers: `shared/ui/` (base components) and `entities/` (types).

## Complexity Tracking

*No violations. All constraints align with the established architecture.*

## Parallel Work Analysis

### Dependency Graph

```
Base components (existing)
    |
    v
QuantitySelector (cart-actions/ui) -> CartControl (shared/ui)
RemoveButton (cart-actions/ui) -> Button, Modal (shared/ui)
CouponInput (apply-coupon/ui) -> Button, InputField, Tag (shared/ui)
CheckoutButton (checkout/ui) -> Button (shared/ui)
StockConflictModal (checkout/ui) -> Modal (shared/ui)
    |
    v
Stories for all components (can run in parallel per component)
```

### Work Distribution

- **Sequential work**: None. All five components are independent of each other - they share only the existing base component layer.
- **Parallel streams**: All five components can be implemented in parallel since there are no inter-component dependencies.
- **Agent assignments**: A single agent can implement all components sequentially, or they can be split across agents by feature slice (cart-actions, apply-coupon, checkout).

### Coordination Points

- **Sync schedule**: After all components are implemented, run lint, lint:arch, and build to verify cross-component consistency.
- **Integration tests**: Storybook serves as the integration surface - each story renders the component with its base component dependencies.

---

*Planning questions answered and Engineering Alignment confirmed. Proceeding to Phase 0 research.*
