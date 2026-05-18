# Research: CartRow and EmptyState Entity UI

**Feature**: CartRow and EmptyState Entity UI
**Mission**: 024-entity-ui-cartrow-emptystate
**Date**: 2026-05-18

---

## Phase 0 Research Summary

No outstanding unknowns required research. All technology choices, dependencies, and design patterns are predetermined by the existing project infrastructure.

---

## Dependency Verification

| Dependency | Status | Location | Notes |
|---|---|---|---|
| Design Token System (T-017) | Complete | `src/shared/ui/tokens/` | Full primitive + semantic tokens, CSS custom properties, Storybook stories |
| Button Component (T-019) | Complete | `src/shared/ui/shadcn/button.tsx` | Variants: default, outline, secondary, ghost, destructive, link. Sizes: default, xs, sm, lg, icon-* |
| CartControl Component (T-021) | Complete | `src/shared/ui/shadcn/cart-control/cart-control.tsx` | Props: quantity, min, max, disabled, onIncrement, onDecrement. ARIA accessible |
| Cart Aggregate (T-004) | Complete | `src/entities/cart/model/` | CartItem: skuId, name, unitPriceCents, quantity, createdAt |
| ProductVariant Aggregate (T-005) | Complete | `src/entities/product/model/` | ProductVariant: skuId, totalOnHand, sold, reservations |
| Product Fixtures (T-003) | Complete | `src/shared/api/fixtures/products.ts` | 6 products with imageUrl, description, category |

---

## Data Model Research

### Finding: CartItem lacks presentation fields

**Observation**: The current `CartItem` entity (T-004) stores only cart-domain data: `skuId`, `name`, `unitPriceCents`, `quantity`, `createdAt`. The CartRow design requires `imageUrl`, `description`, and variant `specs`.

**Decision**: Widget layer enriches CartItem with Product data before rendering. CartItem remains unchanged. See `data-model.md` for the prop interface design.

**Rationale**:
- Keeps CartItem as a cart-domain value object (DDD aggregate boundary)
- Avoids bloating the cart with presentation concerns
- Follows FSD layer rules: widgets compose entities, entities remain independent
- Allows CartRow to be reusable across different data sources

---

## Technology Verification

| Technology | Version | Verified |
|---|---|---|
| React | 19 | Yes - project uses React 19 with JSX transform |
| TypeScript | 5.9 | Yes - strict mode enabled |
| Tailwind CSS | v4 | Yes - uses CSS-based configuration |
| Vite | 8 | Yes - build tool |
| Storybook | Latest | Yes - CSF3 format, existing stories confirm |
| ESLint | 9 (flat config) | Yes - flat config in `eslint.config.js` |
| Steiger | Latest | Yes - FSD linter configured |

---

## Design System Patterns

### Button Usage Pattern

```tsx
import { Button } from '@/shared/ui/shadcn/button'

// For EmptyState primary action
<Button variant="default" size="default" onClick={...}>
  {label}
</Button>

// For EmptyState secondary action
<Button variant="outline" size="default" onClick={...}>
  {label}
</Button>

// For CartRow remove button
<Button variant="ghost" size="sm" onClick={onRemove}>
  Remove
</Button>
```

### CartControl Usage Pattern

```tsx
import { CartControl } from '@/shared/ui/shadcn/cart-control'

<CartControl
  quantity={quantity}
  min={minQuantity}
  max={maxQuantity}
  disabled={disabled}
  onIncrement={onIncrement}
  onDecrement={onDecrement}
/>
```

---

## Accessibility Patterns

CartControl already implements:
- `role="group"` with `aria-label="Quantity selector"`
- `aria-label` on increment/decrement buttons
- `aria-live="polite"` on quantity display

CartRow must add:
- `alt` text on product image (use product name)

EmptyState uses Button accessibility (inherited from Base UI primitive).

---

## Conclusion

All research questions are resolved. No external research was needed. The project has mature design system foundations and all entity models required for this feature. Proceed to implementation.
