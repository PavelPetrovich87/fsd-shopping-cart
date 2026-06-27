# Research: Product Card

**Mission**: product-card-01KW2695  
**Date**: 2026-06-26

## Research Questions

### Q1: How should price formatting be handled?

**Finding**: The project already has `shared/api/fixtures/products.ts` with `listPriceCents` and `salePriceCents` as integer values. There is no pre-existing money formatting utility in the visible codebase.

**Decision**: Implement a lightweight `centsToDollars` helper in `shared/lib/` or inline a simple `Intl.NumberFormat` call. The component is pure presentation, so formatting is best done as a prop or utility, not a heavy dependency.

**Rationale**: Keeping it simple avoids adding unnecessary dependencies. If the project later needs full currency localization, the utility can be expanded.

### Q2: How should images be lazy-loaded?

**Finding**: The project uses standard React/Vite; no Next.js Image component is present.

**Decision**: Use the native HTML `img` element with `loading="lazy"` attribute.

**Rationale**: Native lazy loading is supported by all modern browsers and requires zero dependencies. For below-the-fold product grids, this satisfies NFR-002.

### Q3: Is there a skeleton component available?

**Finding**: shadcn/ui is used in the project. The `Skeleton` primitive from shadcn is typically available via `npx shadcn add skeleton` or may already be present.

**Decision**: Use the existing shadcn `Skeleton` component if available; otherwise implement a simple CSS-based skeleton using Tailwind's `animate-pulse` and `bg-muted` tokens.

**Rationale**: shadcn skeleton is the project's design system primitive. If not yet added, a minimal Tailwind-based skeleton is trivial to create and avoids adding a new dependency.

### Q4: What are the existing entity UI conventions?

**Finding**: From T-025 (CartRow, EmptyState), the project follows:
- Story-first development (stories before implementation)
- Props-only pure components (no hooks, no store access)
- Responsive design with Tailwind CSS
- `index.ts` barrel exports in the entity root
- Fixtures from `shared/api/fixtures/` used for story data

**Decision**: Follow T-025 conventions exactly.

**Rationale**: Consistency across entity UI components reduces cognitive load and keeps the codebase predictable.
