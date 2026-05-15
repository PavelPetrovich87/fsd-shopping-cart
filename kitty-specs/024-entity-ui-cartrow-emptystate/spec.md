# Specification: CartRow and EmptyState Entity UI

## Feature Overview

Create two entity-level presentation components for the shopping cart: `CartRow` and `EmptyState`.

`CartRow` displays a single cart item with product details (image, name, variant specs, description, price), an embedded quantity selector, and a remove button. It is a pure presentation component that receives all data and callbacks via props.

`EmptyState` displays a friendly message when the cart contains no items, including an icon, title, description, and one or two action buttons to guide the user forward.

Both components must visually match the Penpot design specification and reuse existing design system foundations.

**Source Ticket**: T-025 (Tier 5 — Entity UI)

---

## Intent Summary

**Confirmed Intent**: Build two pure presentation components — `CartRow` and `EmptyState` — in the `entities/cart/ui/` layer. CartRow renders a single cart line item with image, details, price, quantity controls, and removal. EmptyState renders the zero-items cart message with icon, text, and action buttons. Both follow the Penpot design specification and reuse existing design tokens and base components.

**Friendly Title**: CartRow and EmptyState Entity UI

**Mission Type**: software-dev

---

## User Scenarios & Testing

### Scenario 1: View a cart item
**Actor**: End user
**Flow**: User views their cart → sees a row for each item with product image, name, selected variant specs, description, price, and quantity.
**Expected**: Each cart item is clearly displayed with all relevant product information readable at a glance.

### Scenario 2: Change item quantity
**Actor**: End user
**Flow**: User clicks the "+" or "−" buttons next to the quantity in a CartRow → quantity updates, subtotal recalculates.
**Expected**: Quantity changes immediately, "−" button disables at quantity = 1, "+" button disables at maximum stock.

### Scenario 3: Remove an item
**Actor**: End user
**Flow**: User clicks the "Remove" button on a CartRow → item is removed from the cart.
**Expected**: Item disappears from the cart list; if it was the last item, EmptyState appears.

### Scenario 4: View empty cart
**Actor**: End user
**Flow**: User navigates to cart with no items → sees EmptyState with cart icon, "Your cart is empty" title, descriptive text, and an "Explore products" button.
**Expected**: Message is visually prominent and actionable; user understands the cart is empty and knows how to continue shopping.

### Scenario 5: Responsive cart row
**Actor**: End user on mobile device
**Flow**: User views cart on a narrow screen → CartRow adapts to vertical layout with image on top.
**Expected**: Layout reflows gracefully; all information remains readable and controls remain tappable.

---

## Functional Requirements

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-001 | CartRow displays a product image thumbnail. | Must | Draft |
| FR-002 | CartRow displays the product name as a prominent heading. | Must | Draft |
| FR-003 | CartRow displays variant specs (e.g., color, size) as labeled key-value pairs. | Must | Draft |
| FR-004 | CartRow displays a product description text. | Must | Draft |
| FR-005 | CartRow displays the unit price formatted as currency. | Must | Draft |
| FR-006 | CartRow displays the current quantity. | Must | Draft |
| FR-007 | CartRow includes increment and decrement controls for quantity adjustment. | Must | Draft |
| FR-008 | CartRow includes a Remove button to remove the item from the cart. | Must | Draft |
| FR-009 | CartRow emits `onIncrement`, `onDecrement`, and `onRemove` callbacks when user interacts with controls. | Must | Draft |
| FR-010 | CartRow disables decrement control when quantity equals the minimum (1). | Must | Draft |
| FR-011 | CartRow disables increment control when quantity equals the maximum stock. | Must | Draft |
| FR-012 | CartRow supports a disabled state where all interactive controls are non-operational. | Should | Draft |
| FR-013 | EmptyState displays a cart icon in a circular container. | Must | Draft |
| FR-014 | EmptyState displays a title heading. | Must | Draft |
| FR-015 | EmptyState displays a descriptive message below the title. | Must | Draft |
| FR-016 | EmptyState displays a primary action button with a label and click handler. | Must | Draft |
| FR-017 | EmptyState optionally displays a secondary action button with a label and click handler. | Should | Draft |
| FR-018 | EmptyState emits `onPrimaryAction` and `onSecondaryAction` callbacks when respective buttons are clicked. | Must | Draft |
| FR-019 | Both components accept all data via props only — no direct store or repository access. | Must | Draft |

## Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|---|---|---|---|
| NFR-001 | Components render without causing layout shift on the parent container. | Zero CLS | Draft |
| NFR-002 | CartRow responsive layout transitions between desktop (horizontal) and mobile (vertical) at the designated breakpoint. | Pass at sm/md/lg breakpoints | Draft |
| NFR-003 | All interactive controls in CartRow are keyboard accessible (Tab navigation, Enter/Space activation). | Pass | Draft |
| NFR-004 | EmptyState action buttons are keyboard accessible and focusable. | Pass | Draft |
| NFR-005 | CartRow image includes appropriate alt text for screen readers. | Pass | Draft |
| NFR-006 | Quantity controls announce changes to assistive technology. | Pass | Draft |
| NFR-007 | Components are compatible with React Server Components where applicable; client-side interactions are isolated. | Pass | Draft |

## Constraints

| ID | Constraint | Status |
|---|---|---|
| C-001 | Visual styling must match the Penpot design: CartRow desktop 800×200 horizontal layout, mobile vertical layout; EmptyState 488×432 with 48×48 circular icon. | Draft |
| C-002 | All colors, spacing, typography, and shadows must use the project's existing design token system (T-017). | Draft |
| C-003 | CartRow quantity controls must reuse the existing CartControl component (T-021). | Draft |
| C-004 | EmptyState action buttons must reuse the existing Button component (T-019). | Draft |
| C-005 | CartRow Remove button must reuse the existing Button component (T-019). | Draft |
| C-006 | Components must follow FSD architecture: located in `entities/cart/ui/`, no domain logic, only presentation. | Draft |
| C-007 | Components must include Storybook stories covering all states and interactions (story-first convention). | Draft |
| C-008 | CartRow image must use border-radius 8px per Penpot design. | Draft |

---

## Success Criteria

1. **Functionality**: CartRow renders all product details, quantity controls, and remove button; EmptyState renders icon, title, description, and action buttons.
2. **Interactivity**: CartRow callbacks fire correctly on increment, decrement, and remove; EmptyState callbacks fire on button clicks.
3. **Accessibility**: All controls are keyboard navigable; images have alt text; quantity changes are announced to screen readers.
4. **Responsiveness**: CartRow layout adapts between desktop (horizontal) and mobile (vertical) without information loss or overlap.
5. **Design Fidelity**: Both components match the Penpot design specification (colors, spacing, typography, layout proportions).
6. **Documentation**: Storybook stories exist for CartRow (default, min quantity, max quantity, disabled) and EmptyState (default, with secondary action).
7. **Purity**: Components receive all data via props; no direct imports from stores, repositories, or feature layers.

---

## Key Entities

| Entity | Role | Attributes |
|---|---|---|
| CartRow | Single cart item presentation | `imageUrl`, `name`, `specs`, `description`, `price`, `quantity`, `min`, `max`, `disabled`, `onIncrement`, `onDecrement`, `onRemove` |
| EmptyState | Zero-items cart message | `icon`, `title`, `description`, `primaryAction` (label, onClick), `secondaryAction?` (label, onClick) |

---

## Assumptions

1. The project uses React 19, TypeScript 5.9, and Tailwind CSS v4 (per AGENTS.md).
2. The design token system (T-017) is complete and available in `shared/ui/tokens/`.
3. The Button component (T-019) is complete and available in `shared/ui/shadcn/button.tsx`.
4. The CartControl component (T-021) is complete and available in `shared/ui/shadcn/cart-control/`.
5. Product images are served as URLs and loaded via standard `<img>` tags.
6. Currency formatting is handled by the consumer or a shared utility; CartRow receives pre-formatted price strings or uses the existing Money value object (T-001).
7. The `ProductCard` component referenced in the original T-025 ticket belongs to T-026 and is explicitly out of scope for this mission.

---

## Dependencies

| Dependency | Ticket | Status |
|---|---|---|
| Design Token System | T-017 | Complete |
| Button Component | T-019 | Complete |
| CartControl Component | T-021 | Complete |
| Cart Aggregate | T-004 | Complete |
| ProductVariant Aggregate | T-005 | Complete |

---

## Out of Scope

1. `ProductCard` component — belongs to T-026 (StockConflictModal / Feature UI).
2. Business logic for stock checking, coupon application, or checkout — these belong to feature layers.
3. Real-time price updates or inventory synchronization — CartRow displays static data passed via props.
4. Drag-and-drop reordering of cart items.
5. Swipe-to-delete gesture on mobile.
6. Image lazy loading optimization (can be added later).
7. Skeleton or loading states for CartRow (assumes data is available when rendered).
