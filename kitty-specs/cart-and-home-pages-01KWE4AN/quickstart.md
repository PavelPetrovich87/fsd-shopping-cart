# Quickstart: Cart and Home Pages

**Mission**: cart-and-home-pages-01KWE4AN  
**Date**: 2026-07-01

## Prerequisites

- Node.js and dependencies installed (`npm install` already done).
- Existing widgets compile and tests pass (`npm run test:unit` — 181 tests passing).
- Familiarity with FSD layer rules (pages import only from widgets, features, entities, shared).

## Project Structure

New files to create:

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
└── shared/
    └── mocks/
        └── products.ts
```

## Implementation Order

1. **Create `src/shared/mocks/products.ts`**
   - Define `MockProduct` interface.
   - Export `mockProducts` array with at least 6 records.
   - Use placeholder image URLs if local assets are unavailable.

2. **Create `src/pages/home/ui/home-page.tsx`**
   - Import `ProductCard` from `@/entities/product`.
   - Import `mockProducts` from `@/shared/mocks/products`.
   - Render a responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
   - Map `mockProducts` to `ProductCard` components.

3. **Create `src/pages/home/index.ts`**
   - Export `HomePage` component as the public API of the home page slice.

4. **Create `src/pages/cart/ui/cart-page.tsx`**
   - Import `CartList` and `OrderSummary` from `@/widgets/cart`.
   - Compose them in a two-column responsive layout (`lg:flex-row`, `flex-col` on mobile).
   - Provide mandatory callback props (noop or wired to parent handlers).
   - `CartList` auto-handles empty state; no extra conditional needed in the page.

5. **Create `src/pages/cart/index.ts`**
   - Export `CartPage` component as the public API of the cart page slice.

6. **Create `src/pages/index.ts`**
   - Re-export `CartPage` and `HomePage` from their respective slices.

7. **Wire into `src/pages/App.tsx` (or router)**
   - Import `CartPage` and `HomePage` from `@/pages`.
   - Replace or augment the existing `App.tsx` content to render both pages (e.g., conditionally or as a simple demo layout).

8. **Run quality gates**
   - `npm run lint` — ESLint + React rules.
   - `npm run lint:arch` — Steiger FSD validation.
   - `npm run test:unit` — All tests must pass.
   - `npm run build` — TypeScript + Vite build must succeed.

## Common Pitfalls

- **Importing from wrong layers**: Pages must NOT import from other pages. Always import from `widgets`, `features`, `entities`, or `shared`.
- **Missing callback props**: `CartList` requires `onIncrement`, `onDecrement`, and `onRemove`. Provide at least noop handlers if the parent doesn't yet wire real state.
- **Image placeholders**: If local image assets don't exist, use a placeholder service URL or inline SVG. Do not let broken images break the layout.
- **Responsive breakpoints**: The Penpot design specifies 1440px/768px/375px. Tailwind's `lg` breakpoint is 1024px, which is close enough. Use `lg:` and `md:` prefixes consistently.

## Storybook

If you want to preview pages in isolation before wiring them into the app:

- Create `src/pages/cart/ui/cart-page.stories.tsx` and `src/pages/home/ui/home-page.stories.tsx`.
- Use `mockProducts` for the HomePage story.
- Use an empty array and a populated array for the CartPage stories (empty state + filled state).

## Next Step

Run `/spec-kitty.tasks` to generate work packages from this plan.
