# Quickstart: Product Card

**Mission**: product-card-01KW2695  
**Date**: 2026-06-26

## Development Environment

- **Node.js**: 20+ (project requirement)
- **Package manager**: npm (or pnpm if preferred)
- **Dev server**: `npm run dev` (Vite)
- **Test runner**: `npm run test` (Vitest Browser Mode)
- **Storybook**: `npm run storybook` (or `npx storybook dev -p 6006`)

## Getting Started

### 1. Verify the project runs

```bash
npm run dev
```

Vite should start on `http://localhost:5173/` (or configured port).

### 2. Run Storybook

```bash
npm run storybook
```

Storybook should start on `http://localhost:6006/`.

### 3. Run tests

```bash
npm run test
```

Vitest Browser Mode runs the test suite.

## Component Location

The `ProductCard` component lives at:

```
src/entities/product/ui/ProductCard/
├── ProductCard.tsx
├── ProductCard.stories.tsx
└── index.ts
```

## Implementation Order

1. **Storybook stories first**: Create `ProductCard.stories.tsx` with three stories:
   - Default (no sale)
   - Sale (strikethrough + highlighted price)
   - Skeleton (loading state)

2. **Implement the component**: Write `ProductCard.tsx` with the props interface from `data-model.md`.

3. **Export from entity**: Add the component export to `src/entities/product/index.ts`.

4. **Verify**: Run `npm run lint`, `npm run lint:arch`, and `npm run build`. All must pass.

## Fixtures

Product data for stories comes from `src/shared/api/fixtures/products.ts`. Use fixtures that have both `listPriceCents` and `salePriceCents` to test the sale variant.
