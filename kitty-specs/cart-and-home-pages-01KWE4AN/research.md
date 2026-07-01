# Research: Cart and Home Pages

**Mission**: cart-and-home-pages-01KWE4AN  
**Date**: 2026-07-01

## Discovery Summary

This mission is a pure frontend composition task. No backend research or API design is needed. Research focused on verifying existing widget interfaces, design references, and FSD layer conventions.

## Existing Widget Interfaces

### ProductCard (src/entities/product/ui/ProductCard/ProductCard.tsx)

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

- Lives in `entities/product/ui/` (not `widgets/` as originally assumed in T-031).
- Supports loading skeleton state via `isLoading`.
- Handles sale pricing (strikethrough list price + red sale price).
- Uses `Money.fromCents().format()` for formatting.

### CartList (src/widgets/cart/cart-list/cart-list.tsx)

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
- All callback props are required except `onEmptyStateAction` and `disabled`.
- `CartListItem.price` is a **string** (already formatted), not cents.

### OrderSummary (src/widgets/cart/order-summary/order-summary.tsx)

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
- Coupon input and checkout button are composed inside the widget.
- `discount` and `shipping` are optional; omitted rows are not rendered.

## Design Reference Verification

- **Penpot file**: `shopping-cart-section-figma` connected and accessible.
- **CartPage boards**: Desktop (1440×1328), Tablet (768×1764), Mobile (375×2620).
- **ProductCard board**: `product` (319×436) — used as the reference for card dimensions and internal spacing.
- **HomePage**: No dedicated Penpot board exists. Grid layout will be derived from standard responsive patterns (Tailwind grid classes).

## Mock Data Decision

- **Location**: `src/shared/mocks/products.ts` (user-selected Option A).
- **Rationale**: Shared across the app. Future features (T-029, T-030) may reuse the same mock set. FSD `shared/mocks/` is a valid location for demo/test data.
- **Shape**: Matches `ProductCardProps` exactly: `skuId`, `name`, `imageUrl`, `listPriceCents`, `salePriceCents`.
- **Quantity**: At least 6 records as per FR-004.

## Responsive Breakpoint Mapping

| Viewport | Tailwind Prefix | CartPage Layout | HomePage Grid |
|---|---|---|---|
| Desktop (≥1024px) | `lg:` | Two-column side-by-side | `grid-cols-3` |
| Tablet (≥768px) | `md:` | Single stacked column | `grid-cols-2` |
| Mobile (<768px) | default | Single stacked column | `grid-cols-1` |

## FSD Layer Rules

- `pages/` may import from `widgets`, `features`, `entities`, `shared`.
- `pages/` may NOT import from other `pages/`.
- Barrel exports (`index.ts`) are required for each page slice.
- `src/pages/index.ts` must re-export all public page components.

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| ProductCard lives in `entities/` not `widgets/` | Update plan references; HomePage imports from `@/entities/product` |
| CartList requires mandatory callbacks | CartPage must provide noop handlers or real handlers wired to cart state |
| No HomePage Penpot design | Use sensible defaults; validate visually with Storybook |

## Alternatives Considered

- **Mock data in `src/pages/home/lib/`**: Rejected per user preference (Option A).
- **No mock data, inline array**: Rejected because it violates DRY if reused elsewhere.
