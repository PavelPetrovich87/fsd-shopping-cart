# Implementation Plan: Cart and Home Pages

**Branch**: `kitty/mission-cart-and-home-pages-01KWE4AN` | **Date**: 2026-07-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `kitty-specs/cart-and-home-pages-01KWE4AN/spec.md`

## Summary

Implement a **Cart page** and a **Home page** as page-level compositions using existing FSD widgets, entities, and shared components. The Cart page renders a responsive two-column layout (cart list + order summary) with an empty-state fallback. The Home page renders a responsive grid of product cards populated by static mock data stored in `src/shared/mocks/`.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: Vite 8, Tailwind CSS v4, ESLint 9 (flat config), Steiger (FSD linter)
**Storage**: N/A — static TypeScript mock data only (`src/shared/mocks/products.ts`)
**Testing**: Vitest unit tests (existing `npm run test:unit` harness); Storybook for visual regression of composed pages
**Target Platform**: Web (responsive: Desktop 1440px, Tablet 768px, Mobile 375px)
**Project Type**: Web (single-page application, Vite-based)
**Performance Goals**: Page render within 2 seconds under normal network conditions; no heavy JS bundles added
**Constraints**: FSD layer import rules enforced by Steiger; pages may import only from widgets, features, entities, and shared; no cross-page imports
**Scale/Scope**: Two pages (Cart, Home); ~6 mock product records; lightweight composition, no backend integration

## Charter Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **FSD Compliance**: All new files must reside in `src/pages/` or `src/shared/mocks/`. Pages must only import from lower layers (widgets, features, entities, shared). Steiger will validate this.
- **No Backend Integration**: This mission is purely frontend composition; no API contracts or server logic.
- **Design Reference**: CartPage layout must match the Penpot design boards. HomePage grid layout is inferred from the ProductCard component design and standard responsive patterns.
- **Accessibility**: All interactive elements must have accessible labels and focus states (handled by existing widgets, but composed pages must maintain this).

**Gate Result**: PASS. No violations.

## Project Structure

### Documentation (this mission)

```
kitty-specs/cart-and-home-pages-01KWE4AN/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Not applicable (no backend contracts)
└── tasks.md             # Phase 2 output (created by /spec-kitty.tasks)
```

### Source Code (repository root)

```
src/
├── pages/
│   ├── cart/
│   │   ├── ui/
│   │   │   └── cart-page.tsx
│   │   └── index.ts
│   ├── home/
│   │   ├── ui/
│   │   │   └── home-page.tsx
│   │   └── index.ts
│   └── index.ts
├── shared/
│   └── mocks/
│       └── products.ts
```

**Structure Decision**: Single frontend project. New files are limited to `src/pages/cart/`, `src/pages/home/`, and `src/shared/mocks/products.ts`. All existing FSD layers (widgets, features, entities, shared/ui) are reused as-is.

## Complexity Tracking

*No violations. This is a straightforward composition mission with no architectural complexity.*

## Implementation Concern Map

### IC-01 — Cart Page Layout & Empty State

- **Purpose**: Compose the CartList and OrderSummary widgets into a responsive two-column layout with an empty-state fallback.
- **Relevant requirements**: FR-001, FR-002, FR-006, NFR-002
- **Affected surfaces**: `src/pages/cart/ui/cart-page.tsx`, `src/pages/cart/index.ts`
- **Sequencing/depends-on**: none (all dependencies T-025, T-027 are already implemented)
- **Risks**: Ensure the responsive breakpoints (Tailwind `lg`, `md`) match the Penpot design dimensions exactly.

### IC-02 — Home Page Product Grid

- **Purpose**: Create a responsive grid of ProductCard widgets populated by static mock data.
- **Relevant requirements**: FR-003, FR-004, NFR-002
- **Affected surfaces**: `src/pages/home/ui/home-page.tsx`, `src/pages/home/index.ts`, `src/shared/mocks/products.ts`
- **Sequencing/depends-on**: none (T-031 ProductCard is already implemented)
- **Risks**: HomePage has no dedicated Penpot design; grid column counts at breakpoints must be sensible defaults (e.g., 3-col desktop, 2-col tablet, 1-col mobile).

### IC-03 — Mock Data

- **Purpose**: Provide a static, typed dataset of at least six products for the HomePage grid.
- **Relevant requirements**: FR-004, C-001
- **Affected surfaces**: `src/shared/mocks/products.ts`
- **Sequencing/depends-on**: none
- **Risks**: Mock data must match the ProductCard widget's expected prop interface. Verify against `src/widgets/product-card/` before finalizing.

### IC-04 — Page Public APIs & Barrel Exports

- **Purpose**: Expose CartPage and HomePage via clean barrel exports so they can be wired into routing later (T-029).
- **Relevant requirements**: FR-005
- **Affected surfaces**: `src/pages/cart/index.ts`, `src/pages/home/index.ts`, `src/pages/index.ts`
- **Sequencing/depends-on**: IC-01, IC-02 (pages must exist before exporting)
- **Risks**: Avoid exporting internals; only the page components should be public.
