---
work_package_id: WP01
title: ProductCard Foundation & Stories
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-007
tracker_refs: []
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this mission were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T001
- T002
- T003
- T004
- T005
history: []
authoritative_surface: src/entities/product/ui/ProductCard/
create_intent: []
execution_mode: code_change
owned_files:
- src/entities/product/ui/ProductCard/**
- src/entities/product/ui/.gitkeep
tags: []
---

# WP01: ProductCard Foundation & Stories

## Objective

Establish the ProductCard component foundation, verify existing utilities, and create Storybook stories following the story-first convention. This WP produces the scaffolding, types, and story files that WP02 will implement against.

## Context

This is a **pure presentation component** in the `entities/product` layer of a Feature-Sliced Design (FSD) React application. The component must:
- Live in `src/entities/product/ui/ProductCard/`
- Use only `shared/` layer imports (no `features/` or `widgets/` imports)
- Follow the story-first convention: stories exist before the component implementation
- Use design tokens from `src/shared/ui/tokens/` for all visual properties
- Be strictly presentational — no store access, no business logic

## Branch Strategy

- **Planning base branch**: `main`
- **Final merge target**: `main`
- **Execution**: Run `spec-kitty agent action implement WP01 --agent <name>` to allocate a worktree. The worktree will be created from the `main` branch.
- **Commit target**: All changes must be committed to the worktree branch, then merged to `main`.

## Technical Context

- **Stack**: React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, shadcn/ui, Storybook 8
- **Design tokens**: Available via `@theme` in `src/shared/ui/tokens/theme.css` (e.g., `text-neutral-900`, `bg-brand-600`, `shadow-subtle`, `rounded-lg`)
- **Money utility**: `shared/lib/money.ts` exports `Money` class with `Money.fromCents(cents).format()` → e.g., `"$29.99"`
- **Fixtures**: `shared/api/fixtures/products.ts` exports `Product[]` with `skuId`, `name`, `description`, `imageUrl`, `listPriceCents`, `salePriceCents`, `category`
- **Entity UI conventions**: Follow T-025 (CartRow, EmptyState) patterns:
  - Components live in `src/entities/{entity}/ui/{component-name}/`
  - Barrel export via `index.ts`
  - Stories use CSF3 with `satisfies Meta<typeof Component>`
  - Story title: `entities/{entity}/{ComponentName}`
  - Use `tags: ['autodocs']`

## Subtasks

### T001: Verify `Money` utility supports ProductCard formatting

**Purpose**: Confirm the existing `Money` class from `shared/lib/money.ts` can format cents into display strings like "$29.99".

**Steps**:
1. Read `src/shared/lib/money.ts` to verify the `format()` method exists and works as expected.
2. Verify `src/shared/lib/index.ts` exports `Money`.
3. If `Money` is not suitable, create a simple `centsToDollars(cents: number): string` helper in `src/shared/lib/` and export it from `index.ts`.

**Validation**:
- `Money.fromCents(2999).format()` returns "$29.99" (or equivalent currency format)
- `Money.fromCents(5999).format()` returns "$59.99"

**Files touched**:
- `src/shared/lib/money.ts` (read-only)
- `src/shared/lib/index.ts` (read-only, or write if adding helper)

### T002: Verify fixtures have sale and non-sale variants

**Purpose**: Ensure `shared/api/fixtures/products.ts` has at least one product with `salePriceCents: null` and one with `salePriceCents: number` for story coverage.

**Steps**:
1. Read `src/shared/api/fixtures/products.ts`.
2. Confirm at least one product has `salePriceCents: null` (e.g., SHIRT-001, WATCH-001, HAT-001).
3. Confirm at least one product has `salePriceCents: number` (e.g., JEANS-001, SHOE-001, BAG-001).

**Validation**:
- At least 2 non-sale products and at least 2 sale products exist in fixtures.

**Files touched**:
- `src/shared/api/fixtures/products.ts` (read-only)

### T003: Define `ProductCardProps` interface

**Purpose**: Define the strict props interface for the ProductCard component.

**Steps**:
1. Create `src/entities/product/ui/ProductCard/ProductCard.tsx`.
2. Define the interface:

```typescript
export interface ProductCardProps {
  skuId: string
  name: string
  imageUrl: string
  listPriceCents: number
  salePriceCents: number | null
  isLoading?: boolean
}
```

3. Add a placeholder component skeleton (not yet implemented):

```typescript
export function ProductCard({
  skuId,
  name,
  imageUrl,
  listPriceCents,
  salePriceCents,
  isLoading = false,
}: ProductCardProps) {
  // TODO: implement in WP02
  return null
}
```

**Validation**:
- TypeScript compiles without errors.
- All required fields are present.

**Files touched**:
- `src/entities/product/ui/ProductCard/ProductCard.tsx` (new file)

### T004: Create barrel export `index.ts`

**Purpose**: Create the barrel export for the ProductCard component directory.

**Steps**:
1. Create `src/entities/product/ui/ProductCard/index.ts`.
2. Export the component and its props:

```typescript
export { ProductCard } from './ProductCard'
export type { ProductCardProps } from './ProductCard'
```

3. Remove `src/entities/product/ui/.gitkeep` if it exists (the directory now has real files).

**Validation**:
- Import works: `import { ProductCard } from '@/entities/product/ui/ProductCard'`

**Files touched**:
- `src/entities/product/ui/ProductCard/index.ts` (new file)
- `src/entities/product/ui/.gitkeep` (delete if exists)

### T005: Create Storybook stories

**Purpose**: Create CSF3 stories for default, sale, and skeleton states using fixtures from `shared/api/fixtures/products.ts`.

**Steps**:
1. Create `src/entities/product/ui/ProductCard/ProductCard.stories.tsx`.
2. Use the T-025 story conventions:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ProductCard } from './ProductCard'
import { productsData } from '@/shared/api/fixtures/products'

const meta = {
  title: 'entities/product/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ProductCard>

export default meta
type Story = StoryObj<typeof meta>
```

3. Create three stories:
   - **Default**: Use a non-sale product (e.g., `productsData[0]` — SHIRT-001, `salePriceCents: null`)
   - **Sale**: Use a sale product (e.g., `productsData[1]` — JEANS-001, `salePriceCents: 4499`)
   - **Skeleton**: Set `isLoading: true` with any product data (or minimal data)

4. For each story, map the `Product` fixture fields to `ProductCardProps`:

```typescript
const defaultProduct = productsData[0]
export const Default: Story = {
  args: {
    skuId: defaultProduct.skuId,
    name: defaultProduct.name,
    imageUrl: defaultProduct.imageUrl,
    listPriceCents: defaultProduct.listPriceCents,
    salePriceCents: defaultProduct.salePriceCents,
  },
}
```

**Validation**:
- Stories compile without TypeScript errors.
- Storybook starts and shows the stories in the sidebar under `entities/product/ProductCard`.
- All three stories (Default, Sale, Skeleton) render without errors.

**Files touched**:
- `src/entities/product/ui/ProductCard/ProductCard.stories.tsx` (new file)

## Definition of Done

- [ ] `ProductCardProps` interface is defined and exported
- [ ] Barrel export `index.ts` exists and re-exports the component and props
- [ ] Storybook stories exist for Default, Sale, and Skeleton states
- [ ] Stories use fixtures from `shared/api/fixtures/products.ts`
- [ ] Storybook starts without errors and all stories are visible
- [ ] TypeScript compiles (`npx tsc --noEmit` or `npm run build` passes)
- [ ] No lint errors (`npm run lint` passes)

## Risks

| Risk | Mitigation |
|------|------------|
| `Money` utility doesn't format as expected | Verify early in T001; fallback to simple `centsToDollars` helper |
| Fixtures missing required data shape | Verify in T002; add fixtures if needed |
| Storybook fails to start | Check for missing dependencies; ensure `@storybook/react` is configured |

## Reviewer Guidance

- Verify `ProductCardProps` matches the spec exactly (FR-001 through FR-004)
- Check that stories use the correct fixture data
- Confirm story-first convention is followed (stories exist before full implementation)
- Ensure no business logic is present in the component placeholder

## Activity Log

- 2026-06-30T16:02:02Z – user – Implemented and reviewed manually
