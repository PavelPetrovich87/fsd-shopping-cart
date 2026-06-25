---
schema_version: 1
artifact_type: spec-kitty.analysis-report
command: /spec-kitty.analyze
mission_slug: cart-and-order-summary-widgets-01KVZK46
mission_id: 01KVZK46SYN5KG0N5JP5BXGKTN
generated_at: '2026-06-25T15:25:49.886905+00:00'
analyzer_agent: kilo
input_artifacts:
  spec.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/cart-and-order-summary-widgets-01KVZK46/spec.md
    sha256: 7c3baf1e647c42ed4070f6fef459f3d3ec5c80b09437c589cd0e4c84fbceaf21
  plan.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/cart-and-order-summary-widgets-01KVZK46/plan.md
    sha256: f87ab7aaf9ebfc749d02ceab6a776fa021ce9b88db146ef63a070715de4f4124
  tasks.md:
    path: /Users/user/work/fsd-shopping-cart/kitty-specs/cart-and-order-summary-widgets-01KVZK46/tasks.md
    sha256: f9a078015ceca877de9e28ab21ca121f7f12bd0825886cccdaff43c26cf7ccf5
  charter:
    path: /Users/user/work/fsd-shopping-cart/.kittify/charter/charter.md
    sha256: f32ac3d17fdc264c47940a263643ab6eb42bdbdc54e3f7e9c91af316a4e6a14c
verdict: unknown
issue_counts:
  critical:
  medium:
  high:
  info:
  low:
findings: []
---

# Pre-implementation Analysis: T-027 Cart and Order Summary Widgets

## Mission Summary
Build two new widgets under `src/widgets/cart/`:
- `CartList` — renders cart line items, empty state, and coupon input.
- `OrderSummary` — renders subtotal, discount, shipping, tax, and total with a checkout CTA.

Both widgets must be presentational, receiving data via props, and be composable through a public `cart/index.ts` barrel. The deliverables must satisfy FSD rules, Tailwind token law, Storybook stories, and the Penpot design reference already captured in the spec.

## Existing Code Relevant to the Mission

### Domain / State (read-only for widgets)
- `src/entities/cart/model/cart.ts` / `cart-item.ts` / `types.ts` — cart aggregate, item shape, cart events.
- `src/entities/cart/api/zustand-cart-repository.ts` — runtime cart store (widgets will not import this; pages/features wire it).
- `src/shared/lib/money.ts` — money value object for formatting.
- `src/shared/lib/event-bus.ts` — event bus (not needed inside presentational widgets).

### Reusable UI Primitives
- `src/shared/ui/shadcn/button.tsx` — primary CTA, outline, ghost variants.
- `src/shared/ui/shadcn/cart-control.tsx` — quantity stepper (± buttons).
- `src/shared/ui/input-field.tsx` — text input with error state.
- `src/shared/ui/tag.tsx` — applied coupon tag with dismiss.
- `src/shared/ui/modal.tsx` — confirmation modal.

### Existing Cart Sub-components
- `src/entities/cart/ui/cart-row/cart-row.tsx` — line item layout (image, specs, quantity, remove, price). Accepts primitive props only.
- `src/entities/cart/ui/empty-state/empty-state.tsx` — empty cart placeholder.
- `src/features/cart-actions/ui/quantity-selector/quantity-selector.tsx` — thin wrapper over `CartControl` with stock-aware bounds.
- `src/features/cart-actions/ui/remove-button/remove-button.tsx` — remove-with-confirmation modal.
- `src/features/apply-coupon/ui/coupon-input/coupon-input.tsx` — coupon tag / input / apply button.
- `src/features/checkout/ui/checkout-button/checkout-button.tsx` — checkout CTA.

No `src/widgets/` directory exists yet; this mission creates the `widgets` layer for the cart page.

## Proposed File Structure

```
src/widgets/cart/
├── index.ts                      # public API: CartList, OrderSummary, types
├── model/
│   └── types.ts                  # CartListItem, OrderSummaryMoney, CartListProps, OrderSummaryProps
├── cart-list/
│   ├── cart-list.tsx             # CartList component
│   ├── cart-list.stories.tsx     # Storybook stories
│   └── index.ts                  # public re-export
└── order-summary/
    ├── order-summary.tsx         # OrderSummary component
    ├── order-summary.stories.tsx # Storybook stories
    └── index.ts                  # public re-export
```

## Implementation Notes

1. **Presentational-only rule**
   - `CartList` and `OrderSummary` import only from `shared/ui`, `entities/cart/ui`, and `features/*` UI layers.
   - They do NOT import `entities/cart/api/*` or any state/store directly.
   - Callback props (`onIncrement`, `onDecrement`, `onRemove`, `onApplyCoupon`, `onRemoveCoupon`, `onCheckout`) are passed from the parent page/feature.

2. **Money formatting**
   - Use `formatMoney` from `src/shared/lib/money.ts` or pre-formatted strings passed as props.
   - The widgets accept already-formatted strings to keep them decoupled from money logic.

3. **Composition**
   - `CartList` composes `CartRow` for each item and `EmptyState` when `items.length === 0`.
   - `CartList` may include `CouponInput` below the item list; coupon state is controlled by parent via props.
   - `OrderSummary` composes `CheckoutButton` and renders money rows.

4. **Responsive layout**
   - Mobile: stacked, full-width.
   - Tablet/Desktop: side-by-side or contained card as decided by the parent page.
   - Use Tailwind responsive prefixes (`md:`, `lg:`) and design-token classes.

5. **FSD import rules**
   - `widgets/cart` can import from lower layers (`shared`, `entities`, `features`).
   - `widgets/cart` must not be imported by `entities` or `features`.
   - Barrel files re-export only public members.

6. **Testing / stories**
   - Each widget gets CSF3 stories in its folder.
   - MSW is not required (presentational props).
   - No unit tests for pure rendering unless business logic emerges.

## Risks and Open Questions

- **Widget layer dependency direction**: `features/apply-coupon` and `features/checkout` UI components will be imported into `widgets/cart`. This is allowed (widgets > features). Need to verify Steiger accepts it.
- **Type duplication**: `CartListItem` will closely resemble `CartItem` from entities. Keep widget types minimal and parent-agnostic (e.g., pre-computed `priceLabel`, `imageUrl`).
- **Empty-state actions**: `EmptyState` requires `primaryAction` and optional `secondaryAction`; parent page provides callbacks and labels.
- **Coupon input placement**: The spec places coupon input inside `CartList`. Ensure `CouponInput` props align with widget props.
- **Design tokens**: All colors/spacing must come from existing Tailwind tokens or `src/shared/ui/tokens/*`. No arbitrary hex values except where the design system already permits them.

## Suggested WP Execution Order

1. **WP01** — Create `src/widgets/cart/model/types.ts` and folder skeleton.
2. **WP02** — Implement `CartList` + stories.
3. **WP03** — Implement `OrderSummary` + stories.
4. **WP04** — Wire public barrel `src/widgets/cart/index.ts`, add integration story/page, run lint/lint:arch/build.

WP02 and WP03 can run in parallel after WP01; WP04 is sequential.
