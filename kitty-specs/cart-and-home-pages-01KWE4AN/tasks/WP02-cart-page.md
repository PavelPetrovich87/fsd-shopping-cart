---
work_package_id: WP02
title: Cart Page
dependencies: []
requirement_refs:
- C-002
- C-003
- FR-001
- FR-002
- FR-006
- NFR-002
tracker_refs: []
planning_base_branch: kitty/mission-cart-and-home-pages-01KWE4AN
merge_target_branch: kitty/mission-cart-and-home-pages-01KWE4AN
branch_strategy: Planning artifacts for this mission were generated on kitty/mission-cart-and-home-pages-01KWE4AN. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into kitty/mission-cart-and-home-pages-01KWE4AN unless the human explicitly redirects the landing branch.
subtasks:
- T005
- T006
- T007
history:
- date: '2026-07-01'
  agent: kilo
  action: created
  event: WP02 prompt generated
authoritative_surface: src/pages/cart/
create_intent:
- src/pages/cart/ui/cart-page.tsx
- src/pages/cart/index.ts
- src/pages/cart/ui/cart-page.stories.tsx
execution_mode: code_change
owned_files:
- src/pages/cart/**
tags: []
---

# WP02 — Cart Page

## Objective

Implement the CartPage as a stateless, responsive composition of the CartList and OrderSummary widgets. Provide Storybook stories demonstrating both empty and populated cart states.

## Context

- **Mission**: cart-and-home-pages-01KWE4AN
- **Feature Dir**: `/Users/user/work/fsd-shopping-cart/kitty-specs/cart-and-home-pages-01KWE4AN`
- **Spec**: [spec.md](spec.md) — FR-001, FR-002, FR-006, NFR-002, C-002, C-003
- **Research**: [research.md](research.md) — CartList and OrderSummary interfaces, responsive breakpoints, FSD rules
- **Plan**: [plan.md](plan.md) — IC-01

### Existing Widget Interfaces

**CartList** (`src/widgets/cart/cart-list/cart-list.tsx`):
```typescript
interface CartListProps {
  items: CartListItem[]
  emptyStateTitle?: string
  emptyStateDescription?: string
  emptyStateActionLabel?: string
  onEmptyStateAction?: () => void
  onIncrement: (skuId: string) => void
  onDecrement: (skuId: string) => void
  onRemove: (skuId: string) => void
  disabled?: boolean
}
```
- Auto-renders `EmptyState` when `items.length === 0`.
- `onIncrement`, `onDecrement`, `onRemove` are **required**.
- `CartListItem.price` is a pre-formatted string.

**OrderSummary** (`src/widgets/cart/order-summary/order-summary.tsx`):
```typescript
interface OrderSummaryProps {
  subtotal: string
  discount?: string
  shipping?: string
  total: string
  appliedCoupon?: AppliedCoupon
  couponError?: string
  isCouponLoading?: boolean
  onApplyCoupon: (code: string) => void
  onRemoveCoupon: () => void
  onCheckout: () => void
  isCheckoutDisabled?: boolean
}
```
- All monetary values are pre-formatted strings.
- `onApplyCoupon`, `onRemoveCoupon`, `onCheckout` are **required**.
- Coupon and checkout widgets are composed internally.

### Reference Layout (from existing story)

The existing `src/widgets/cart/cart-page.stories.tsx` already demonstrates the correct layout:

```tsx
<div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
  <div className="order-2 lg:order-1 lg:col-span-2">
    <CartList ... />
  </div>
  <div className="order-1 lg:order-2">
    <OrderSummary ... />
  </div>
</div>
```

- CartList is `order-2` on mobile (appears below summary), `order-1` on desktop (appears on left, spans 2 columns).
- OrderSummary is `order-1` on mobile (appears above cart), `order-2` on desktop (appears on right).
- Container: `mx-auto grid max-w-6xl gap-6 px-4 py-8`.
- Desktop breakpoint: `lg:grid-cols-3` with `lg:col-span-2` for the cart list.

### Responsive Breakpoints (from research.md)

| Viewport | Tailwind Prefix | CartPage Layout |
|---|---|---|
| Desktop (≥1024px) | `lg:` | Two-column side-by-side (CartList left, OrderSummary right) |
| Tablet (≥768px) | `md:` | Single stacked column (OrderSummary above CartList) |
| Mobile (<768px) | default | Single stacked column (OrderSummary above CartList) |

### FSD Rules

- `pages/cart/` may import from `widgets`, `features`, `entities`, `shared`.
- `pages/cart/` may NOT import from other `pages/`.
- Barrel exports (`index.ts`) are required.

## Subtasks

### T005 — Create `src/pages/cart/ui/cart-page.tsx`

**Purpose**: Implement the CartPage as a stateless composition of CartList and OrderSummary.

**Steps**:
1. Create `src/pages/cart/ui/` directory if it doesn't exist.
2. Create `src/pages/cart/ui/cart-page.tsx`.
3. Import `CartList` from `@/widgets/cart/cart-list` and `OrderSummary` from `@/widgets/cart/order-summary`.
4. Import the necessary types from `@/widgets/cart/model/types`:
   ```typescript
   import type { CartListItem, AppliedCoupon } from '@/widgets/cart/model/types'
   ```
5. Define the `CartPageProps` interface that exposes all data and callbacks needed by the composed widgets:
   ```typescript
   interface CartPageProps {
     items: CartListItem[]
     subtotal: string
     discount?: string
     shipping?: string
     total: string
     appliedCoupon?: AppliedCoupon
     couponError?: string
     isCouponLoading?: boolean
     onIncrement: (skuId: string) => void
     onDecrement: (skuId: string) => void
     onRemove: (skuId: string) => void
     onApplyCoupon: (code: string) => void
     onRemoveCoupon: () => void
     onCheckout: () => void
     onEmptyStateAction?: () => void
     isCheckoutDisabled?: boolean
   }
   ```
6. Implement the `CartPage` component:
   ```tsx
   export function CartPage({
     items,
     subtotal,
     discount,
     shipping,
     total,
     appliedCoupon,
     couponError,
     isCouponLoading,
     onIncrement,
     onDecrement,
     onRemove,
     onApplyCoupon,
     onRemoveCoupon,
     onCheckout,
     onEmptyStateAction,
     isCheckoutDisabled,
   }: CartPageProps) {
     return (
       <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
         <div className="order-2 lg:order-1 lg:col-span-2">
           <CartList
             items={items}
             onIncrement={onIncrement}
             onDecrement={onDecrement}
             onRemove={onRemove}
             onEmptyStateAction={onEmptyStateAction}
           />
         </div>
         <div className="order-1 lg:order-2">
           <OrderSummary
             subtotal={subtotal}
             discount={discount}
             shipping={shipping}
             total={total}
             appliedCoupon={appliedCoupon}
             couponError={couponError}
             isCouponLoading={isCouponLoading}
             onApplyCoupon={onApplyCoupon}
             onRemoveCoupon={onRemoveCoupon}
             onCheckout={onCheckout}
             isCheckoutDisabled={isCheckoutDisabled}
           />
         </div>
       </main>
     )
   }
   ```
7. Use semantic HTML: `<main>` as the root element.
8. The layout must match the existing Penpot design: the exact Tailwind classes shown above.

**Validation**:
- [ ] Component renders without errors when provided with valid props.
- [ ] Two-column layout on desktop (≥1024px): CartList left, OrderSummary right.
- [ ] Single stacked column on mobile (<768px): OrderSummary above CartList.
- [ ] CartList auto-renders EmptyState when `items` is empty.
- [ ] All required CartList and OrderSummary callbacks are passed through.
- [ ] No imports from other `pages/` slices.

### T006 — Create `src/pages/cart/index.ts`

**Purpose**: Export the CartPage as the public API of the `pages/cart` slice.

**Steps**:
1. Create `src/pages/cart/index.ts`.
2. Export only the `CartPage` component and its props type:
   ```typescript
   export { CartPage } from './ui/cart-page'
   export type { CartPageProps } from './ui/cart-page'
   ```
3. Do NOT export internal files (e.g., the stories file).

**Validation**:
- [ ] `import { CartPage, type CartPageProps } from '@/pages/cart'` works from outside the slice.
- [ ] Only `CartPage` and `CartPageProps` are exported.

### T007 — Create `src/pages/cart/ui/cart-page.stories.tsx`

**Purpose**: Provide Storybook stories demonstrating both empty and populated cart states.

**Steps**:
1. Create `src/pages/cart/ui/cart-page.stories.tsx`.
2. Follow the existing CSF3 Storybook pattern in the project (check `src/widgets/cart/cart-page.stories.tsx` for exact import style and format).
3. Import `CartPage` from `./cart-page`.
4. Import `CartListItem` type from `@/widgets/cart/model/types`.
5. Define a helper function `createCartItems()` that returns a sample `CartListItem[]` array (use 2-3 items, similar to the existing cart-page story).
6. Define a wrapper component `CartPageStory` that uses React `useState` to manage items, coupon state, and computed totals locally (similar to the existing widget story).
7. The wrapper should implement:
   - `handleIncrement`: increment quantity up to `maxQuantity`.
   - `handleDecrement`: decrement quantity down to `minQuantity`.
   - `handleRemove`: filter out the item.
   - `handleApplyCoupon`: apply "SAVE20" coupon, reject others with error.
   - `handleRemoveCoupon`: clear coupon.
   - `handleCheckout`: no-op (console.log or alert).
   - `subtotal`: computed from item prices × quantities.
   - `discount`: applied coupon value.
   - `shipping`: fixed "$12.00" when items exist.
   - `total`: subtotal − discount + shipping.
8. Define the meta export:
   ```typescript
   const meta = {
     title: 'Pages/CartPage',
     tags: ['autodocs'],
   } satisfies Meta
   ```
9. Create two stories:
   - `Default`: renders `CartPageStory` with initial items.
   - `Empty`: renders `CartPageStory` with an empty initial items array.

**Validation**:
- [ ] Storybook renders both stories without errors.
- [ ] `Default` story shows cart items and a functioning order summary.
- [ ] `Empty` story shows the EmptyState widget with title, description, and action button.
- [ ] Coupon "SAVE20" applies correctly in the Default story.
- [ ] Invalid coupon shows error message.
- [ ] Increment/decrement/remove buttons work in the story wrapper.

## Edge Cases & Risks

- **CartList callback requirements**: `onIncrement`, `onDecrement`, `onRemove` are required. If the parent doesn't provide them, TypeScript will error. The CartPage passes them through, so this is handled at the parent level.
- **OrderSummary callback requirements**: Same for `onApplyCoupon`, `onRemoveCoupon`, `onCheckout`.
- **Price parsing in story wrapper**: The existing widget story parses prices from strings. Follow the same pattern for computing subtotal/total in the story wrapper. Note that `CartListItem.price` is a string that may contain sale info (e.g., `"$149.00 $129.00"`). Use the last numeric token as the effective price.
- **Empty state auto-handling**: CartList automatically renders EmptyState when `items.length === 0`. Do NOT add an extra conditional in CartPage.

## Definition of Done

- All 3 subtasks are implemented and individually validated.
- `npm run lint` passes with no errors in the new files.
- `npm run lint:arch` passes with no FSD violations in the new files.
- No files outside `src/pages/cart/` are modified.

## Reviewer Guidance

- Verify that `src/pages/cart/` does not import from any other `pages/` slice.
- Check that the responsive layout matches the Penpot design breakpoints (Desktop 1440px two-column, Mobile 375px stacked).
- Confirm that the EmptyState story renders correctly when items are empty.
- Check that the CartPage props type is exported from the barrel file.
- Verify that all required widget callbacks are passed through without omission.
