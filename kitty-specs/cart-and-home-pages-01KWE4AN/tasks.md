# Tasks: Cart and Home Pages

**Mission**: cart-and-home-pages-01KWE4AN  
**Date**: 2026-07-01  
**Feature Dir**: `/Users/user/work/fsd-shopping-cart/kitty-specs/cart-and-home-pages-01KWE4AN`

## Subtask Index

| ID | Description | WP | Parallel |
|---|---|---|---|
| T001 | Create `src/shared/mocks/products.ts` with typed mock data (6+ products) | WP01 | [P] |
| T002 | Create `src/pages/home/ui/home-page.tsx` — responsive grid of ProductCards | WP01 | [P] |
| T003 | Create `src/pages/home/index.ts` — barrel export for HomePage | WP01 | [P] |
| T004 | Create `src/pages/home/ui/home-page.stories.tsx` — Storybook stories with mock data | WP01 | [P] |
| T005 | Create `src/pages/cart/ui/cart-page.tsx` — two-column layout with CartList + OrderSummary | WP02 | [P] |
| T006 | Create `src/pages/cart/index.ts` — barrel export for CartPage | WP02 | [P] |
| T007 | Create `src/pages/cart/ui/cart-page.stories.tsx` — empty + populated states | WP02 | [P] |
| T008 | Create `src/pages/index.ts` — barrel re-export for all pages | WP03 | — |
| T009 | Update `src/pages/App.tsx` to render pages (demo composition) | WP03 | — |
| T010 | Run quality gates: lint, lint:arch, test:unit, build | WP03 | — |

## Work Packages

### WP01 — Home Page & Mock Data

**Goal**: Provide static mock products and implement the HomePage responsive grid.
**Priority**: High (enables US-003, US-004)
**Dependencies**: None (T-031 ProductCard already done)
**Estimated Prompt Size**: ~350 lines
**Parallel**: Safe to execute in parallel with WP02.

- [ ] T001 Create `src/shared/mocks/products.ts` with typed mock data (6+ products) (WP01)
- [ ] T002 Create `src/pages/home/ui/home-page.tsx` — responsive grid of ProductCards (WP01)
- [ ] T003 Create `src/pages/home/index.ts` — barrel export for HomePage (WP01)
- [ ] T004 Create `src/pages/home/ui/home-page.stories.tsx` — Storybook stories with mock data (WP01)

**Implementation Notes**:
- Mock product interface must match `ProductCardProps` exactly: `skuId`, `name`, `imageUrl`, `listPriceCents`, `salePriceCents`.
- Use `https://placehold.co/400x400?text=<product>` for placeholder images.
- At least 3 products should have `salePriceCents !== null` to exercise the sale price UI.
- HomePage grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with `gap-6` and `max-w-6xl mx-auto px-4 py-8` container.
- Add a semantic `<h1>` heading above the grid (e.g., "Products").
- No Add-to-Cart button in ProductCard yet (T-030); just render the card as-is.
- Barrel export must only export the `HomePage` component.

### WP02 — Cart Page

**Goal**: Implement the CartPage as a stateless composition of CartList and OrderSummary.
**Priority**: High (enables US-001, US-002, US-004)
**Dependencies**: None (T-025, T-027 already done)
**Estimated Prompt Size**: ~300 lines
**Parallel**: Safe to execute in parallel with WP01.

- [ ] T005 Create `src/pages/cart/ui/cart-page.tsx` — two-column layout with CartList + OrderSummary (WP02)
- [ ] T006 Create `src/pages/cart/index.ts` — barrel export for CartPage (WP02)
- [ ] T007 Create `src/pages/cart/ui/cart-page.stories.tsx` — empty + populated states (WP02)

**Implementation Notes**:
- CartPage is a presentational component. It receives all data and callbacks via props.
- Layout matches the existing Penpot design: `mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3`.
- CartList occupies `lg:col-span-2` (order-2 on mobile, order-1 on desktop).
- OrderSummary occupies the remaining column (order-1 on mobile, order-2 on desktop).
- CartList auto-renders EmptyState when items array is empty — no extra conditional needed.
- All CartList callback props (`onIncrement`, `onDecrement`, `onRemove`) are **required** — pass them through from CartPage props.
- OrderSummary callback props (`onApplyCoupon`, `onRemoveCoupon`, `onCheckout`) are also **required** — pass them through.
- Barrel export must only export the `CartPage` component.
- Stories must show two states: (a) empty cart (auto-empty-state) and (b) populated cart with interactive handlers.

### WP03 — Public APIs, App Wiring & Quality Gates

**Goal**: Wire pages into the app entry point and validate all quality gates.
**Priority**: High (enables FR-005, success criteria 3)
**Dependencies**: WP01, WP02
**Estimated Prompt Size**: ~250 lines
**Parallel**: Must run after WP01 and WP02.

- [x] T008 Create `src/pages/index.ts` — barrel re-export for all pages (WP03)
- [x] T009 Update `src/pages/App.tsx` to render pages (demo composition) (WP03)
- [x] T010 Run quality gates: lint, lint:arch, test:unit, build (WP03)

**Implementation Notes**:
- `src/pages/index.ts` must re-export `CartPage` from `@/pages/cart` and `HomePage` from `@/pages/home`.
- Do NOT create circular imports: `pages/index.ts` must not import from individual pages that re-import from `pages/`.
- Update `src/pages/App.tsx` to replace the boilerplate Vite starter content with a simple composition that renders the pages.
- Since routing is T-029, keep App.tsx simple: either render HomePage by default, or add a simple toggle state to switch between HomePage and CartPage for demo purposes.
- If App.tsx needs state to demo CartPage, keep it minimal and local to App.tsx (App.tsx is allowed to hold demo state).
- Run all quality gates in sequence: `npm run lint`, `npm run lint:arch`, `npm run test:unit`, `npm run build`. Fix any errors before marking complete.
- Ensure no Steiger FSD violations: pages must not import from other pages; all imports must be from lower layers.
