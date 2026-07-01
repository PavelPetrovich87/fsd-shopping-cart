---
work_package_id: WP01
title: Home Page & Mock Data
dependencies: []
requirement_refs:
- C-001
- C-002
- FR-003
- FR-004
- NFR-002
tracker_refs: []
planning_base_branch: kitty/mission-cart-and-home-pages-01KWE4AN
merge_target_branch: kitty/mission-cart-and-home-pages-01KWE4AN
branch_strategy: Planning artifacts for this mission were generated on kitty/mission-cart-and-home-pages-01KWE4AN. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into kitty/mission-cart-and-home-pages-01KWE4AN unless the human explicitly redirects the landing branch.
subtasks:
- T001
- T002
- T003
- T004
agent: "kilo:kimi-k2.7-code::implementer"
shell_pid: "70422"
history:
- date: '2026-07-01'
  agent: kilo
  action: created
  event: WP01 prompt generated
authoritative_surface: src/pages/home/
create_intent:
- src/shared/mocks/products.ts
- src/pages/home/ui/home-page.tsx
- src/pages/home/index.ts
- src/pages/home/ui/home-page.stories.tsx
execution_mode: code_change
owned_files:
- src/shared/mocks/**
- src/pages/home/**
tags: []
---

# WP01 — Home Page & Mock Data

## Objective

Create a static typed mock product dataset and implement the HomePage as a responsive grid of ProductCard widgets. Provide Storybook stories for visual regression testing.

## Context

- **Mission**: cart-and-home-pages-01KWE4AN
- **Feature Dir**: `/Users/user/work/fsd-shopping-cart/kitty-specs/cart-and-home-pages-01KWE4AN`
- **Spec**: [spec.md](spec.md) — FR-003, FR-004, NFR-002, C-001, C-002
- **Research**: [research.md](research.md) — ProductCard interface, responsive breakpoints, FSD rules
- **Plan**: [plan.md](plan.md) — IC-02, IC-03

### Existing Widget Interface

`ProductCard` lives in `src/entities/product/ui/ProductCard/ProductCard.tsx`:

```typescript
interface ProductCardProps {
  skuId: string
  name: string
  imageUrl: string
  listPriceCents: number
  salePriceCents: number | null
  isLoading?: boolean
}
```

- Uses `Money.fromCents()` for formatting.
- Renders a loading skeleton when `isLoading=true`.
- Displays sale price in red (`text-error-600`) with strikethrough list price when `salePriceCents !== null`.

### Responsive Breakpoints (from research.md)

| Viewport | Tailwind Prefix | HomePage Grid Columns |
|---|---|---|
| Desktop (≥1024px) | `lg:` | `grid-cols-3` |
| Tablet (≥768px) | `md:` | `grid-cols-2` |
| Mobile (<768px) | default | `grid-cols-1` |

### FSD Rules

- `pages/home/` may import from `entities`, `widgets`, `features`, `shared`.
- `pages/home/` may NOT import from other `pages/`.
- `shared/mocks/` is the correct location for static demo data.
- Barrel exports (`index.ts`) are required for each slice.

## Subtasks

### T001 — Create `src/shared/mocks/products.ts`

**Purpose**: Provide a typed, static dataset of at least 6 products for the HomePage grid.

**Steps**:
1. Create the directory `src/shared/mocks/` if it doesn't exist.
2. Create `src/shared/mocks/products.ts`.
3. Define the `MockProduct` interface to match `ProductCardProps`:
   ```typescript
   export interface MockProduct {
     skuId: string
     name: string
     imageUrl: string
     listPriceCents: number
     salePriceCents: number | null
   }
   ```
4. Export `mockProducts: MockProduct[]` with at least 6 records.
5. Use `https://placehold.co/400x400?text=<Product+Name>` for placeholder images (e.g., `https://placehold.co/400x400?text=Headphones`).
6. Ensure at least 3 products have `salePriceCents !== null` to exercise the sale price rendering.
7. Use realistic product names and varied prices (range $19.99 to $149.99).

**Validation**:
- [ ] File compiles with no TypeScript errors.
- [ ] Array has 6 or more items.
- [ ] At least 3 items have non-null `salePriceCents`.
- [ ] All items have unique `skuId` values.

### T002 — Create `src/pages/home/ui/home-page.tsx`

**Purpose**: Implement the HomePage as a responsive grid of ProductCards.

**Steps**:
1. Create `src/pages/home/ui/` directory if it doesn't exist.
2. Create `src/pages/home/ui/home-page.tsx`.
3. Import `ProductCard` from `@/entities/product` (path alias resolves to `src/entities/product`).
4. Import `mockProducts` from `@/shared/mocks/products`.
5. Define the `HomePage` component:
   ```tsx
   export function HomePage() {
     return (
       <main className="mx-auto max-w-6xl px-4 py-8">
         <h1 className="mb-6 text-2xl font-bold text-neutral-900">
           Products
         </h1>
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
           {mockProducts.map((product) => (
             <ProductCard key={product.skuId} {...product} />
           ))}
         </div>
       </main>
     )
   }
   ```
6. Use semantic HTML: `<main>` as the root element, `<h1>` for the page title.
7. Ensure the grid uses Tailwind classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with `gap-6`.
8. Container: `mx-auto max-w-6xl px-4 py-8`.
9. The heading should be visible and styled with `text-2xl font-bold text-neutral-900 mb-6`.

**Validation**:
- [ ] Component renders without errors in a browser.
- [ ] All 6 mock products are displayed as cards.
- [ ] Grid shows 3 columns on desktop (≥1024px), 2 on tablet (≥768px), 1 on mobile (<768px).
- [ ] Products with sale prices show red sale price + strikethrough list price.
- [ ] No imports from other `pages/` slices.

### T003 — Create `src/pages/home/index.ts`

**Purpose**: Export the HomePage as the public API of the `pages/home` slice.

**Steps**:
1. Create `src/pages/home/index.ts`.
2. Export only the `HomePage` component:
   ```typescript
   export { HomePage } from './ui/home-page'
   ```
3. Do NOT export internal files (e.g., the stories file).

**Validation**:
- [ ] `import { HomePage } from '@/pages/home'` works from outside the slice.
- [ ] Only `HomePage` is exported (no story files or internal components).

### T004 — Create `src/pages/home/ui/home-page.stories.tsx`

**Purpose**: Provide Storybook stories for the HomePage composition.

**Steps**:
1. Create `src/pages/home/ui/home-page.stories.tsx`.
2. Follow the existing Storybook pattern in the project (check `src/entities/product/ui/ProductCard/ProductCard.stories.tsx` for the exact import style and CSF3 format).
3. Import `HomePage` from `./home-page`.
4. Define a default meta export with `title: 'Pages/HomePage'` and `tags: ['autodocs']`.
5. Create a `Default` story that renders `HomePage` with no args (it uses `mockProducts` internally).
6. Create a `Loading` story that renders `HomePage` with a `isLoading` prop — but wait, HomePage doesn't currently accept `isLoading`. Skip this or note it for future enhancement. Just provide the `Default` story.

**Validation**:
- [ ] Storybook renders the HomePage story without errors.
- [ ] All 6 product cards are visible in the story.
- [ ] Story matches the CSF3 format used elsewhere in the project.

## Edge Cases & Risks

- **Empty mock array**: Prevented by T001 validation (must have ≥6 items).
- **ProductCard import path**: Verify the actual export path of `ProductCard`. It lives in `src/entities/product/ui/ProductCard/ProductCard.tsx`. Check if `src/entities/product/index.ts` exports it; if not, you may need to import from `@/entities/product/ui/ProductCard/ProductCard` directly.
- **Image placeholders**: If `placehold.co` is blocked by CSP, the cards will show broken images. This is acceptable for mock data; the layout should still hold.

## Definition of Done

- All 4 subtasks are implemented and individually validated.
- `npm run lint` passes with no errors in the new files.
- `npm run lint:arch` passes with no FSD violations in the new files.
- No files outside `src/shared/mocks/` and `src/pages/home/` are modified.

## Reviewer Guidance

- Verify that `src/pages/home/` does not import from any other `pages/` slice.
- Check that the grid breakpoints match the Penpot design dimensions (Desktop 1440px, Tablet 768px, Mobile 375px).
- Confirm that at least 6 mock products exist and at least 3 have sale prices.
- Check that barrel export only exposes the `HomePage` component.

## Activity Log

- 2026-07-01T07:17:38Z – kilo:kimi-k2.7-code::implementer – shell_pid=70422 – Assigned agent via action command
