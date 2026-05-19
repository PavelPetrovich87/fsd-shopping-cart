---
work_package_id: WP03
title: Checkout UI Components
dependencies: []
requirement_refs:
- C-001
- C-002
- C-003
- FR-019
- FR-020
- FR-021
- FR-022
- FR-023
- FR-024
- FR-025
- NFR-001
- NFR-002
- NFR-003
- NFR-005
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T011
- T012
- T013
- T014
- T015
- T016
history:
- timestamp: '2026-05-19T11:59:19Z'
  event: created
  author: spec-kitty.tasks
authoritative_surface: src/features/checkout/
execution_mode: code_change
owned_files:
- src/features/checkout/ui/checkout-button/**
- src/features/checkout/ui/stock-conflict-modal/**
- src/features/checkout/index.ts
tags: []
---

# WP03: Checkout UI Components

## Objective

Implement two interactive feature-level UI components for checkout: **CheckoutButton** and **StockConflictModal**. CheckoutButton triggers the checkout process and disables itself when the cart is empty or inactive. StockConflictModal displays stock mismatch information when checkout validation fails, with two distinct variants for multi-product conflicts and single-product empty-cart scenarios.

## Context

- **Stack**: React 19, TypeScript 5.9, Tailwind CSS v4, Storybook (react-vite), Vitest Browser Mode
- **Architecture**: FSD. Components must import only from lower layers (`shared/`, `entities/`)
- **Base components available**: `Button` (shared/ui), `Modal` (shared/ui)
- **Existing use cases**: `InitiateCheckout` in `src/features/checkout/model/`
- **Entity types**: `StockConflict` from `src/features/checkout/model/result-types.ts`
- **Cart state**: `CartState.Active` from `src/entities/cart/`

## Branch Strategy

- Planning/base branch: `main`
- Final merge target: `main`
- Implementation command: `spec-kitty agent action implement WP03 --agent <name>`

---

## Subtask T011: Create CheckoutButton Component

**Purpose**: Build a checkout button that triggers the checkout action and disables itself appropriately.

**Files to create**:
- `src/features/checkout/ui/checkout-button/checkout-button.tsx`
- `src/features/checkout/ui/checkout-button/index.ts`

**Interface**:
```typescript
export interface CheckoutButtonProps {
  disabled?: boolean
  onCheckout: () => void
}
```

**Implementation steps**:
1. Import `Button` from `@/shared/ui/shadcn/button`
2. Render a `Button` with:
   - Label text: `"Checkout"`
   - `variant="default"` (primary action)
   - `size="lg"` (or appropriate size for a prominent CTA)
   - `disabled={disabled}`
   - `onClick={onCheckout}`
3. The `disabled` prop is passed from the parent, which determines whether the cart is empty or not in an active state (FR-020)

**Accessibility**:
- The button is keyboard accessible (Button component handles this)
- When disabled, the button has `disabled` attribute and `aria-disabled="true"` (Button/underlying base-ui handles this)

**Validation**:
- [ ] Component file exists and exports `CheckoutButton` + `CheckoutButtonProps`
- [ ] Index.ts re-exports from component file
- [ ] No store imports in the component
- [ ] TypeScript compiles without errors

---

## Subtask T012: Create CheckoutButton Stories

**Purpose**: Provide visual documentation for CheckoutButton states.

**File to create**: `src/features/checkout/ui/checkout-button/checkout-button.stories.tsx`

**Stories to include**:
1. **Enabled** — `disabled=false`, button is clickable
2. **DisabledEmptyCart** — `disabled=true`, simulates empty cart state
3. **DisabledInactive** — `disabled=true`, simulates cart not in active state

**Implementation notes**:
- Use CSF3 format
- `meta.title` should be `'Features/Checkout/CheckoutButton'`

**Validation**:
- [ ] All 3 stories render without errors
- [ ] Disabled stories show the button in a visually disabled state

---

## Subtask T013: Create StockConflictModal Component

**Purpose**: Build a modal that displays stock conflicts returned by the InitiateCheckout use case.

**Files to create**:
- `src/features/checkout/ui/stock-conflict-modal/stock-conflict-modal.tsx`
- `src/features/checkout/ui/stock-conflict-modal/index.ts`

**Interface**:
```typescript
export interface StockConflictModalProps {
  open: boolean
  conflicts: Array<{
    skuId: string
    productName: string
    requestedQuantity: number
    availableQuantity: number
    imageUrl?: string
  }>
  onAcknowledge: () => void
}
```

**Two visual variants** (computed from props, not a separate prop):

1. **Multi-product variant** (`conflicts.length > 1` OR (`conflicts.length === 1` and `availableQuantity > 0`)):
   - Modal title: `"Change of stock"`
   - Body: list of product cards showing:
     - Product name
     - Old quantity (requestedQuantity)
     - Arrow indicator (→)
     - New available quantity (availableQuantity)
     - Optional product image (use a placeholder if imageUrl is not provided)
   - Footer: single `"Ok"` button that calls `onAcknowledge` (FR-023)

2. **Single-product empty-cart variant** (`conflicts.length === 1` and `availableQuantity === 0`):
   - Modal title: `"Change of stock"`
   - Body: same product card as above
   - Additional message: `"Since there are no more items in your cart, you will be brought back to cart"`
   - Footer: `"Go back to cart"` button that calls `onAcknowledge` (FR-024)

**Implementation steps**:
1. Import `Modal` from `@/shared/ui/modal` and `Button` from `@/shared/ui/shadcn/button`
2. Determine the variant based on `conflicts` array
3. Render `Modal` with:
   - `open={open}`
   - `onClose={onAcknowledge}` (both variants acknowledge/close)
   - `title="Change of stock"`
4. Inside the modal body:
   - Map over `conflicts` to render product cards
   - Each card shows: product name, requested quantity, arrow, available quantity
   - For the single-product empty-cart variant, add the additional message paragraph after the product card
5. Footer buttons:
   - Multi-product: `<Button onClick={onAcknowledge}>Ok</Button>`
   - Single empty-cart: `<Button onClick={onAcknowledge}>Go back to cart</Button>`

**Product card layout suggestion**:
```
<div className="flex items-center gap-3 rounded border p-3">
  {imageUrl && <img src={imageUrl} alt={productName} className="size-12 rounded object-cover" />}
  <div className="flex-1">
    <p className="font-medium">{productName}</p>
    <p className="text-sm text-neutral-600">
      {requestedQuantity} → {availableQuantity}
    </p>
  </div>
</div>
```

If no `imageUrl` is provided, skip the image or use a placeholder div:
```
<div className="flex size-12 items-center justify-center rounded bg-neutral-100">
  <span className="text-xs text-neutral-400">IMG</span>
</div>
```

**Accessibility (NFR-002)**:
- Modal has correct ARIA semantics (handled by Modal component)
- Product images have `alt={productName}`

**Responsive (NFR-005)**:
- Modal content should fit within 320px viewport width
- Use `max-w-sm` or similar constraint (Modal already sets this)

**Validation**:
- [ ] Component file exists and exports `StockConflictModal` + `StockConflictModalProps`
- [ ] Index.ts re-exports from component file
- [ ] No store imports in the component
- [ ] TypeScript compiles without errors

---

## Subtask T014: Create StockConflictModal Stories

**Purpose**: Provide visual documentation for both StockConflictModal variants.

**File to create**: `src/features/checkout/ui/stock-conflict-modal/stock-conflict-modal.stories.tsx`

**Stories to include**:
1. **MultiProduct** — `open=true`, 2+ conflicts with varying quantities
2. **SingleProduct** — `open=true`, 1 conflict where availableQuantity > 0
3. **SingleProductEmptyCart** — `open=true`, 1 conflict where availableQuantity === 0 (shows special message and "Go back to cart" button)
4. **WithImages** — `open=true`, conflicts include `imageUrl` props

**Example conflict data**:
```typescript
const multiProductConflicts = [
  { skuId: 'sku-1', productName: 'Classic T-Shirt', requestedQuantity: 3, availableQuantity: 1, imageUrl: 'https://placehold.co/48' },
  { skuId: 'sku-2', productName: 'Running Shoes', requestedQuantity: 2, availableQuantity: 0, imageUrl: 'https://placehold.co/48' },
]

const singleProductConflict = [
  { skuId: 'sku-1', productName: 'Classic T-Shirt', requestedQuantity: 3, availableQuantity: 1 },
]

const emptyCartConflict = [
  { skuId: 'sku-1', productName: 'Classic T-Shirt', requestedQuantity: 3, availableQuantity: 0 },
]
```

**Implementation notes**:
- Use CSF3 format
- `meta.title` should be `'Features/Checkout/StockConflictModal'`
- Use a wrapper with `useState` for the Closed story if desired, but the primary stories should show the modal open

**Validation**:
- [ ] All 4 stories render without errors in Storybook
- [ ] SingleProductEmptyCart shows the additional message and "Go back to cart" button
- [ ] MultiProduct shows "Ok" button and multiple product cards

---

## Subtask T015: Update checkout Feature Index

**Purpose**: Expose the new UI components through the feature slice's public API.

**File to edit**: `src/features/checkout/index.ts`

**Changes**:
1. Add re-exports:
   ```typescript
   export { CheckoutButton } from './ui/checkout-button'
   export type { CheckoutButtonProps } from './ui/checkout-button'
   export { StockConflictModal } from './ui/stock-conflict-modal'
   export type { StockConflictModalProps } from './ui/stock-conflict-modal'
   ```
2. Keep all existing model exports intact

**Validation**:
- [ ] Both components can be imported from `@/features/checkout`
- [ ] No circular imports introduced

---

## Subtask T016: Quality Gates

**Purpose**: Verify all code passes static analysis and type-checking.

**Commands to run** (from repo root):
```bash
npm run lint
npm run lint:arch
npm run build
```

**Fix any errors**:
- ESLint errors: fix code style, unused imports, accessibility issues
- Steiger (FSD) errors: verify no cross-layer violations
- TypeScript/build errors: fix type mismatches

**Validation**:
- [ ] `npm run lint` exits 0
- [ ] `npm run lint:arch` exits 0
- [ ] `npm run build` exits 0

---

## Definition of Done

- [ ] CheckoutButton triggers checkout on click (FR-019)
- [ ] CheckoutButton is disabled when cart is empty or inactive (FR-020)
- [ ] StockConflictModal displays on stock conflicts (FR-021)
- [ ] Modal shows affected products with old/new quantities (FR-022)
- [ ] Multi-product variant has "Ok" acknowledge button (FR-023)
- [ ] Single-product empty-cart variant has special message and "Go back to cart" button (FR-024)
- [ ] All components have visual stories covering every state (FR-025)
- [ ] Components import only from lower layers per FSD rules (C-003)
- [ ] All quality gates pass

## Risks & Reviewer Guidance

1. **StockConflict type alignment**: The component's `conflicts` prop should match the `StockConflict` interface from `src/features/checkout/model/result-types.ts` (which has `skuId`, `productName`, `requestedQuantity`, `availableQuantity`). The component adds an optional `imageUrl` field. Verify alignment.
2. **Variant logic correctness**: The single-product empty-cart variant must ONLY trigger when `conflicts.length === 1 && conflicts[0].availableQuantity === 0`. All other cases (including single product with availableQuantity > 0) use the multi-product variant with the "Ok" button.
3. **Modal close behavior**: Both variants close the modal when the action button is clicked. The Modal also supports ESC, backdrop click, and × button for closing. This is acceptable per FR-023/FR-024 which say "acknowledge" — any close method is an acknowledgment.
4. **Product image placeholders**: If `imageUrl` is not provided, use a simple placeholder div. Do not introduce new image loading dependencies.
5. **FSD layer violations**: Ensure `checkout/ui/` does NOT import from other feature slices. Only `shared/` and `entities/` are allowed.
6. **Responsive testing**: Verify the modal content fits within 320px width. The product cards should not overflow.
