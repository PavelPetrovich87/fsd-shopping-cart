# Implementation Plan: CartRow and EmptyState Entity UI

**Branch**: `main` | **Date**: 2026-05-18 | **Spec**: `kitty-specs/024-entity-ui-cartrow-emptystate/spec.md`
**Input**: Feature specification from `kitty-specs/024-entity-ui-cartrow-emptystate/spec.md`
**Mission**: `024-entity-ui-cartrow-emptystate`

## Summary

Build two pure presentation components in the `entities/cart/ui/` layer:

1. **CartRow** - Displays a single cart line item with product image, name, variant specs, description, price, quantity controls (via CartControl), and a remove button. Receives all data via props; no store access.

2. **EmptyState** - Displays the zero-items cart message with an icon, title, description, and primary/secondary action buttons. Pure presentation; callbacks via props.

Both components follow the Penpot design specification, reuse existing design tokens and base components (Button, CartControl), and include Storybook stories per the story-first convention.

**Data composition approach (confirmed)**: The widget layer enriches `CartItem` entity data with `Product` catalog data (imageUrl, description, specs) before passing to CartRow. CartItem itself remains unchanged.

---

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: Tailwind CSS v4, Base UI (button primitive), class-variance-authority, Lucide React (icons)
**Storage**: N/A (presentation layer)
**Testing**: Storybook (CSF3), Vitest Browser Mode (via story-first-ui skill)
**Target Platform**: Web browser (responsive: desktop, tablet, mobile)
**Project Type**: Single-page web application (Vite 8)
**Performance Goals**: Zero layout shift (CLS), 60fps interactions
**Constraints**: FSD architecture compliance (Steiger linter), design token system only (no raw values)
**Scale/Scope**: 2 components, ~400 lines total

### Existing Components to Reuse

| Component | Location | Usage |
|---|---|---|
| Button | `src/shared/ui/shadcn/button.tsx` | EmptyState actions, CartRow remove button |
| CartControl | `src/shared/ui/shadcn/cart-control/cart-control.tsx` | CartRow quantity selector |
| Design Tokens | `src/shared/ui/tokens/` | All styling (colors, spacing, typography, radius) |

---

## Charter Check

*Skipped - no project charter exists.*

---

## Project Structure

### Documentation (this feature)

```
kitty-specs/024-entity-ui-cartrow-emptystate/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (minimal - no unknowns)
├── data-model.md        # Phase 1 output - component prop contracts
├── quickstart.md        # Phase 1 output - development workflow
├── checklists/
│   └── requirements.md  # Spec quality checklist (complete)
└── tasks/               # Phase 2 output (WP files - NOT created by plan)
    └── README.md
```

### Source Code (repository root)

```
src/
├── entities/
│   └── cart/
│       ├── ui/
│       │   ├── cart-row/
│       │   │   ├── cart-row.tsx           # NEW
│       │   │   ├── cart-row.stories.tsx   # NEW
│       │   │   └── index.ts               # NEW
│       │   └── empty-state/
│       │       ├── empty-state.tsx        # NEW
│       │       ├── empty-state.stories.tsx # NEW
│       │       └── index.ts               # NEW
│       ├── model/                         # EXISTING
│       ├── api/                           # EXISTING
│       └── index.ts                       # UPDATE - export UI
├── shared/
│   └── ui/
│       ├── shadcn/
│       │   ├── button.tsx                 # EXISTING - reused
│       │   └── cart-control/              # EXISTING - reused
│       └── tokens/                        # EXISTING - reused
└── ...
```

**Structure Decision**: Single frontend project. Components live in `entities/cart/ui/` per FSD. No backend or API contracts needed.

---

## Complexity Tracking

*No violations. Feature is within standard complexity for the project.*

---

## Parallel Work Analysis

### Dependency Graph

```
CartRow component (WP01)
  -> CartControl (T-021) [COMPLETE]
  -> Button (T-019) [COMPLETE]
  -> Design Tokens (T-017) [COMPLETE]

EmptyState component (WP02)
  -> Button (T-019) [COMPLETE]
  -> Design Tokens (T-017) [COMPLETE]

Entity index update (WP03)
  -> CartRow (WP01) [sequential]
  -> EmptyState (WP02) [sequential]
```

### Work Distribution

- **Sequential work**: None - both components are independent and can be built in parallel.
- **Parallel streams**:
  - Stream A: CartRow component + stories
  - Stream B: EmptyState component + stories
- **Agent assignments**: Single agent can handle both sequentially due to small scope.

### Coordination Points

- **Integration**: Both components exported from `entities/cart/index.ts`
- **Quality gates**: `npm run lint`, `npm run lint:arch`, `npm run build` must pass after all files are created

---

## Phase 0: Research

No outstanding unknowns. All technology choices are predetermined by the project stack. All dependencies (Button, CartControl, design tokens) are complete and available.

See `research.md` for consolidated findings (minimal).

---

## Phase 1: Design

### Component Contracts

See `data-model.md` for detailed prop interfaces and data flow.

### Key Design Decisions

1. **CartRow props are flat, not nested** - avoids tight coupling to CartItem shape; widget layer maps entity data to props.
2. **Price formatting is consumer responsibility** - CartRow receives a pre-formatted price string, keeping the component presentation-only.
3. **Variant specs are optional** - `specs?: Record<string, string>` allows flexible key-value pairs without prescribing product attributes.
4. **EmptyState actions are optional** - both primary and secondary actions are optional for maximum reusability.
5. **Responsive breakpoint at `md` (768px)** - desktop horizontal layout below, mobile vertical layout above.

### Accessibility Requirements

- CartRow image: `alt` text derived from product name
- CartControl: already handles `aria-label`, `aria-live` (reused)
- EmptyState buttons: standard Button accessibility (reused)
- No additional ARIA roles needed beyond what's in base components

### Penpot Design References

| Component | Board | Shape ID | Breakpoint |
|---|---|---|---|
| CartRow | `product` | `58d46d69-db46-5106-82fd-6a11c472a236` | Desktop |
| CartRow | `product` | `88e44c78-33ee-5d5d-8200-494cc60b3aaa` | Tablet |
| CartRow | `product` | `47a24fd6-208a-522f-a7dc-5775c730273d` | Mobile |
| EmptyState | `Empty state message` | `62aaf9f0-22d7-53ff-b1bd-87752e16bfe3` | Desktop |
| EmptyState | `Empty state message` | `69f41acf-6b36-58c3-a594-95e79dfcb9c9` | Tablet |
| EmptyState | `Empty state message` | `a1ff7867-132c-5687-a94b-07009623abd8` | Mobile |

---

## Next Steps

1. Run `/spec-kitty.tasks` to generate work packages
2. Implement via worktree using `spec-kitty agent action implement WP01`
