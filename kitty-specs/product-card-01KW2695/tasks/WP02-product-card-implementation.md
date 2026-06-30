---
work_package_id: WP02
title: ProductCard Implementation & Quality
dependencies:
- WP01
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-006
- FR-007
- NFR-001
- NFR-002
- NFR-003
- NFR-004
- NFR-005
tracker_refs: []
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this mission were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T006
- T007
- T008
- T009
- T010
history: []
authoritative_surface: src/entities/product/ui/ProductCard/
create_intent: []
execution_mode: code_change
owned_files:
- src/entities/product/ui/ProductCard/**
- src/entities/product/index.ts
tags: []
---

# WP02: ProductCard Implementation & Quality

## Objective

Implement the `ProductCard` component with all three visual states (default, sale, skeleton), add responsive design and accessibility, export from the entity public API, and pass all quality gates.

## Context

This WP implements the actual rendering logic of the ProductCard component created in WP01. The component is a **pure presentation component** in the `entities/product` layer of a Feature-Sliced Design (FSD) React application.

**Key constraints**:
- Must use design tokens for all visual properties (colors, typography, spacing, radius, shadows)
- Must be responsive across desktop (≥1024px), tablet (768px–1023px), and mobile (≤767px)
- Must be accessible (alt text, semantic HTML, WCAG AA contrast)
- Must render within 16ms (single frame)
- Images must use `loading="lazy"` for below-the-fold deferral
- Component tree must be shallow (≤ 3 levels of nesting)

## Branch Strategy

- **Planning base branch**: `main`
- **Final merge target**: `main`
- **Execution**: Run `spec-kitty agent action implement WP02 --agent <name>` to allocate a worktree. The worktree will be created from the `main` branch (or from the WP01 worktree branch if WP01 is already merged).
- **Commit target**: All changes must be committed to the worktree branch, then merged to `main`.

## Technical Context

- **Stack**: React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, shadcn/ui, Storybook 8
- **Design tokens**: Available via `@theme` in `src/shared/ui/tokens/theme.css`:
  - Colors: `text-neutral-900`, `text-neutral-600`, `text-neutral-500`, `text-brand-600`, `text-error-600`, `bg-neutral-200`, `bg-neutral-100`, `bg-white`, `bg-card`
  - Typography: `text-base`, `text-lg`, `font-semibold`, `font-medium`
  - Spacing: `p-4`, `gap-2`, `gap-3`
  - Radius: `rounded-lg`, `rounded-md`
  - Shadows: `shadow-subtle`, `shadow-medium`
- **Money utility**: `Money.fromCents(cents).format()` from `shared/lib/money.ts`
- **Fixtures**: `shared/api/fixtures/products.ts` for story data
- **Entity UI conventions**: Follow T-025 (CartRow, EmptyState) patterns:
  - Use `article` or `div` as the outer wrapper with semantic attributes
  - Use `img` (not `Image` component) with `alt` and `loading="lazy"`
  - Use Tailwind utility classes for all styling
  - No inline styles

## Subtasks

### T006: Implement ProductCard component with all states

**Purpose**: Implement the full rendering logic for default, sale, and skeleton states in a single component file.

**Steps**:

1. **Open `src/entities/product/ui/ProductCard/ProductCard.tsx`** (created in WP01).

2. **Import dependencies**:

```typescript
import { Money } from '@/shared/lib'
```

3. **Replace the placeholder component with full implementation**:

```typescript
export function ProductCard({
  skuId,
  name,
  imageUrl,
  listPriceCents,
  salePriceCents,
  isLoading = false,
}: ProductCardProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-subtle">
        <div className="aspect-square animate-pulse rounded-md bg-neutral-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
      </div>
    )
  }

  const listPrice = Money.fromCents(listPriceCents).format()
  const salePrice = salePriceCents ? Money.fromCents(salePriceCents).format() : null

  return (
    <article
      data-skuid={skuId}
      className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-subtle"
    >
      <div className="aspect-square overflow-hidden rounded-md">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 line-clamp-2">
        {name}
      </h3>
      <div className="flex items-center gap-2">
        {salePrice ? (
          <>
            <span className="text-base font-medium text-error-600">
              {salePrice}
            </span>
            <span className="text-sm text-neutral-500 line-through">
              {listPrice}
            </span>
          </>
        ) : (
          <span className="text-base font-medium text-neutral-900">
            {listPrice}
          </span>
        )}
      </div>
    </article>
  )
}
```

**Key design decisions**:
- **Outer wrapper**: `div` (not `article` to keep tree shallow; use `article` if semantically appropriate — the spec says "semantic HTML")
- **Image**: `aspect-square` (1:1 ratio), `object-cover`, `loading="lazy"`, `rounded-md`
- **Skeleton**: Use `animate-pulse` + `bg-neutral-200` for all placeholder blocks. The skeleton must mimic the same structure as the loaded card to prevent layout shift.
- **Price display**: If `salePrice` exists, show it in `text-error-600` (red highlight) and show `listPrice` in `text-neutral-500` with `line-through`. If no sale, show `listPrice` in `text-neutral-900`.
- **Name**: `line-clamp-2` to prevent long names from breaking the card height.

**Validation**:
- Default story renders image, name, and price without errors.
- Sale story renders strikethrough list price + highlighted sale price.
- Skeleton story renders 3 placeholder blocks (image, name, price) with `animate-pulse`.
- Component tree is shallow: verify with React DevTools that nesting is ≤ 3 levels.

**Files touched**:
- `src/entities/product/ui/ProductCard/ProductCard.tsx` (modify)

### T007: Add responsive design

**Purpose**: Ensure the ProductCard scales appropriately across desktop, tablet, and mobile viewports.

**Steps**:

1. The card itself is designed to be placed inside a responsive grid (managed by the wrapping page, T-028). The card's internal layout should adapt to its container width.

2. **Responsive considerations**:
   - Image aspect ratio stays 1:1 (`aspect-square`) regardless of viewport size.
   - Text size remains `text-base` on all viewports (the page grid will adjust card width).
   - Padding stays `p-4` on all viewports (adequate touch targets on mobile).
   - The card's width is determined by its container (the grid), not by the card itself.

3. **No additional responsive classes needed** for the card internals. The card is inherently responsive because it uses flexbox and relative sizing. However, if you want to add subtle adjustments:
   - Consider `md:p-4` → `p-3` for smaller padding on mobile (optional, `p-4` is fine).
   - Consider `md:text-base` → `text-sm` for smaller text on mobile (optional, not required by spec).

**Validation**:
- Resize Storybook viewport to mobile (375px), tablet (768px), and desktop (1440px).
- Card renders correctly at all sizes without overflow or clipping.
- Image maintains aspect ratio.

**Files touched**:
- `src/entities/product/ui/ProductCard/ProductCard.tsx` (modify, if adding responsive adjustments)

### T008: Add accessibility

**Purpose**: Ensure the ProductCard meets WCAG AA and accessibility best practices.

**Steps**:

1. **Alt text**: The `img` already has `alt={name}` — verify this is present.
2. **Semantic HTML**: Use `article` as the outer wrapper (change from `div` to `article` in T006 if not already done). Add `aria-label` or ensure the card is navigable.
3. **Data attributes**: The `data-skuid={skuId}` attribute is already present — good for testing.
4. **Color contrast**: 
   - `text-neutral-900` on `bg-white` → WCAG AA pass (contrast ratio ~16:1).
   - `text-error-600` on `bg-white` → WCAG AA pass (contrast ratio ~4.5:1).
   - `text-neutral-500` on `bg-white` → WCAG AA pass for large text (contrast ratio ~3.9:1, acceptable for the strikethrough text which is decorative).
5. **Skeleton accessibility**: Add `aria-busy="true"` to the skeleton state and `role="status"` with `aria-label="Loading product"`.

**Update skeleton state**:

```typescript
if (isLoading) {
  return (
    <div
      className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-subtle"
      aria-busy="true"
      role="status"
      aria-label="Loading product"
    >
      <div className="aspect-square animate-pulse rounded-md bg-neutral-200" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
    </div>
  )
}
```

**Validation**:
- axe-core automated checks pass (no color contrast violations, no missing alt text).
- Skeleton state has `aria-busy="true"` and `role="status"`.

**Files touched**:
- `src/entities/product/ui/ProductCard/ProductCard.tsx` (modify)

### T009: Export ProductCard from entity public API

**Purpose**: Add the ProductCard to the `entities/product` public API so other layers can import it.

**Steps**:

1. Open `src/entities/product/index.ts`.
2. Add the export:

```typescript
export { ProductCard } from './ui/ProductCard'
export type { ProductCardProps } from './ui/ProductCard'
```

3. Ensure the import path follows FSD conventions: `./ui/ProductCard` (relative within the entity).

**Validation**:
- `import { ProductCard } from '@/entities/product'` works in a test file.
- `import { ProductCard } from './entities/product'` works from the app root.

**Files touched**:
- `src/entities/product/index.ts` (modify)

### T010: Run quality gates

**Purpose**: Ensure all code passes the project's quality gates.

**Steps**:

1. Run `npm run lint`:
   - Fix any ESLint errors (e.g., unused imports, missing dependencies).
   - Ensure React hooks rules pass (though this component has no hooks).

2. Run `npm run lint:arch`:
   - Fix any FSD architecture violations (e.g., importing from `features/` or `widgets/`).
   - Ensure the component only imports from `shared/` layers.

3. Run `npm run build`:
   - TypeScript type-checking (`tsc -b`) must pass.
   - Vite build must succeed.
   - No build errors.

**Validation**:
- All three commands exit with code 0.

**Files touched**:
- None (validation only, but may reveal files to fix).

## Definition of Done

- [ ] ProductCard renders correctly for all three states (default, sale, skeleton)
- [ ] Sale price is displayed in `text-error-600` with strikethrough list price in `text-neutral-500`
- [ ] Non-sale price is displayed in `text-neutral-900`
- [ ] Skeleton state uses `animate-pulse` + `bg-neutral-200` and has `aria-busy="true"`
- [ ] Component is responsive across desktop, tablet, and mobile
- [ ] Image uses `loading="lazy"` for performance
- [ ] Component tree is shallow (≤ 3 levels of nesting)
- [ ] `ProductCard` is exported from `src/entities/product/index.ts`
- [ ] `npm run lint` passes
- [ ] `npm run lint:arch` passes
- [ ] `npm run build` passes
- [ ] Storybook stories render correctly for all three states

## Risks

| Risk | Mitigation |
|------|------------|
| Image aspect ratio inconsistent | Use `aspect-square` + `object-cover` on a container |
| Layout shift on image load | Use `aspect-square` container so space is reserved |
| Skeleton causes layout shift | Match skeleton structure exactly to loaded card |
| Color contrast fails WCAG | Use `text-neutral-900` on `bg-white` for primary text; `text-error-600` for sale price |
| Tailwind class not found | Use only tokens from `theme.css` (e.g., `neutral-900`, `brand-600`, `error-600`) |

## Reviewer Guidance

- Verify the component follows T-025 conventions (pure presentation, props-only, no hooks)
- Check that all visual properties use design tokens (no hardcoded hex colors or px values)
- Confirm the sale price display is visually distinct and clearly communicates the discount
- Verify accessibility attributes (alt text, aria-busy, semantic HTML)
- Check that `npm run lint`, `npm run lint:arch`, and `npm run build` all pass
- Verify the component is exported from `entities/product/index.ts`
- Confirm the skeleton state prevents layout shift by matching the loaded card's structure

## Activity Log

- 2026-06-30T16:02:29Z – user – Implemented and reviewed manually
