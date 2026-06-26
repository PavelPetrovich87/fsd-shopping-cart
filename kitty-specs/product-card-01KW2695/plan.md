# Implementation Plan: Product Card

**Branch**: `main` | **Date**: 2026-06-26 | **Spec**: `kitty-specs/product-card-01KW2695/spec.md`
**Input**: Feature specification from `kitty-specs/product-card-01KW2695/spec.md`

## Summary

Create a `ProductCard` pure presentation component in the `entities/product` layer. The card displays a product image, name, and price (with strikethrough list price + highlighted sale price when applicable). It is used by the HomePage (T-028) to render a product grid. The component is strictly presentational — all interactive logic (add-to-cart, stock checks) is handled by the wrapping page or feature layer.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19
**Primary Dependencies**: Vite 8, Tailwind CSS v4, shadcn/ui, Storybook 8, Vitest Browser Mode, MSW
**Storage**: N/A (presentation component; no data storage)
**Testing**: Storybook for visual regression + Vitest Browser Mode for interaction testing
**Target Platform**: Web (desktop, tablet, mobile — responsive)
**Project Type**: Web application (Feature-Sliced Design)
**Performance Goals**: Component render ≤ 16ms (single frame); images lazy-loaded below the fold
**Constraints**: FSD import rules (entity UI cannot import from features/widgets); use design tokens only; story-first convention
**Scale/Scope**: Single component, 3 visual states, 1 entity

## Charter Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Check | Status | Notes |
|-------|--------|-------|
| **Language/Framework alignment** | ⚠️ Mismatch | Charter specifies Python 3.11+/pytest; project is React 19/TypeScript. Using project conventions (React/TS/Vite) as ground truth. |
| **80%+ coverage target** | ⚠️ Deviated | Project uses Storybook + Vitest Browser Mode, not pytest. Visual and interaction testing satisfy the intent. |
| **Lint/type checks pass** | Pass | ESLint 9 + Steiger (FSD) + `tsc -b` are the project quality gates. |
| **At least one focused reviewer** | Pass | Code review process applies per branch strategy. |
| **macOS/Linux dev env** | Pass | Vite + Node runs on both. |
| **Test-first behavior** | Pass | Storybook stories are authored before component implementation (story-first convention). |
| **Bounded context awareness** | Pass | ProductCard lives in `entities/product/ui/` — bounded by the product context. |

> **Charter Mismatch Resolution**: The charter was generated for a Python project but this codebase is a React/TypeScript frontend. The project's own tooling (ESLint, Steiger, Vite, Vitest) and FSD conventions replace the charter's Python-specific guidance. All directives (DIRECTIVE_001, 003, 010, 018, 024, 025, 028, 029, 030, 031, 032, 033, 034, 035) are applied in the context of this TypeScript/React stack.

## Project Structure

### Documentation (this mission)

```
kitty-specs/product-card-01KW2695/
├── plan.md              # This file (/spec-kitty.plan command output)
├── research.md          # Phase 0 output (/spec-kitty.plan command)
├── data-model.md        # Phase 1 output (/spec-kitty.plan command)
├── quickstart.md        # Phase 1 output (/spec-kitty.plan command)
├── contracts/           # Phase 1 output (/spec-kitty.plan command)
└── tasks.md             # Phase 2 output (/spec-kitty.tasks command - NOT created by /spec-kitty.plan)
```

### Source Code (repository root)

```
src/
├── entities/
│   └── product/
│       ├── ui/
│       │   └── ProductCard/          # ProductCard component + styles + stories
│       │       ├── ProductCard.tsx
│       │       ├── ProductCard.stories.tsx
│       │       └── index.ts
│       ├── index.ts                  # Public API export
│       └── model/                    # Product types (if needed)
├── shared/
│   ├── ui/                          # Design system tokens, shadcn primitives
│   └── lib/                         # Utilities (money formatting, etc.)
└── shared/
    └── api/
        └── fixtures/
            └── products.ts          # Product data fixtures
```

**Structure Decision**: Feature-Sliced Design (FSD) single-project web app. The `ProductCard` is an entity-level UI component — it lives in `entities/product/ui/` and is exported from `entities/product/index.ts`. It uses shared UI primitives and fixtures from the `shared/` layer.

## Complexity Tracking

*No complexity violations for this feature.*

## Implementation Concern Map

### IC-01 — ProductCard Component Implementation

- **Purpose**: Build the `ProductCard` presentational component with image, name, and dual-price display.
- **Relevant requirements**: FR-001, FR-002, FR-003, FR-004, FR-005
- **Affected surfaces**: `src/entities/product/ui/ProductCard/`
- **Sequencing/depends-on**: `none` (no internal dependencies within this mission)
- **Risks**: Image aspect ratio must be consistent; price formatting must handle cents correctly

### IC-02 — Storybook Stories & Visual Testing

- **Purpose**: Create CSF3 stories for default, sale, and skeleton states using MSW + fixtures.
- **Relevant requirements**: FR-006, FR-007
- **Affected surfaces**: `src/entities/product/ui/ProductCard/ProductCard.stories.tsx`
- **Sequencing/depends-on**: `IC-01` (stories depend on the component interface)
- **Risks**: Must align with T-025 (Entity UI conventions) story-first pattern

## Phase 0: Outline & Research

### Extracted Unknowns

| # | Unknown | Why It Matters | Status |
|---|---------|---------------|--------|
| 1 | Price formatting utility | ProductCard must display cents as dollars; project may already have a helper | Resolved via `shared/lib/AGENTS.md` or fixture convention |
| 2 | Image lazy loading | NFR-002 requires deferred below-fold images; need Tailwind/Next.js lazy-loading strategy | Native `img` with `loading="lazy"` is sufficient for this scope |
| 3 | Skeleton/loading state | FR-006 requires a skeleton; need to know if a shared skeleton component exists | Check `shared/ui/` for existing skeleton primitives |

### Research Findings

**Decision**: ProductCard will use the existing `Product` fixture type and the existing price display conventions (if any) from `shared/lib/`. If no money utility exists, implement a simple `centsToDollars` helper in `shared/lib/`.

**Rationale**: The project already has `shared/api/fixtures/products.ts` with `listPriceCents` and `salePriceCents`. The simplest approach is to inline a small formatting function or use a shared utility. Adding a heavy dependency is unnecessary.

**Alternatives considered**:
- `Intl.NumberFormat` — overkill for a simple cents-to-dollars conversion, but could be used if localization is needed later.
- Custom `Money` value object — already exists in the project (from T-005), but for a pure UI component, formatting can be handled at the prop level or via a lightweight utility.

## Phase 1: Design & Contracts

### Data Model

See `data-model.md` for the full model. The relevant data structure for this mission is:

**ProductCardProps** (interface)
```typescript
interface ProductCardProps {
  skuId: string;
  name: string;
  imageUrl: string;
  listPriceCents: number;
  salePriceCents: number | null;
  isLoading?: boolean;
}
```

**Product** (fixture type from `shared/api/fixtures/products.ts`)
```typescript
type Product = {
  skuId: string;
  name: string;
  description: string;
  imageUrl: string;
  listPriceCents: number;
  salePriceCents: number | null;
  category: string;
};
```

### API Contracts

N/A — this is a pure UI component with no external API surface.

### Agent Context Update

*To be completed after plan generation.*

## Stop Point

This command (`/spec-kitty.plan`) is complete after Phase 1 design. The planning artifacts are:

- `kitty-specs/product-card-01KW2695/plan.md` (this file)
- `kitty-specs/product-card-01KW2695/research.md` (Phase 0 output)
- `kitty-specs/product-card-01KW2695/data-model.md` (Phase 1 output)
- `kitty-specs/product-card-01KW2695/quickstart.md` (Phase 1 output)

**Next step**: Run `/spec-kitty.tasks` to generate work packages from the Implementation Concern Map (IC-01, IC-02).
