# Cart and Home Pages

## Description

Create two page-level compositions: a **Cart page** that displays the shopping cart and order summary, and a **Home page** that showcases a responsive grid of product cards with mock data. Both pages must compose existing widgets, features, entities, and shared components without importing from other pages.

## Scope

### In Scope
- CartPage layout (two-column desktop, stacked mobile).
- HomePage responsive product grid.
- Static mock product data for the HomePage grid.
- Empty-state handling on the CartPage.

### Out of Scope
- App shell routing, navigation, header, or footer (deferred to T-029).
- Dynamic data fetching or backend integration.
- Checkout flow beyond the existing CheckoutButton widget.

## Assumptions
- The `CartList`, `OrderSummary`, `CartRow`, `EmptyState`, and `ProductCard` widgets are already implemented and available.
- The HomePage will use static mock product data to demonstrate the grid; dynamic data wiring is deferred to T-029.
- No dedicated HomePage design exists in the current Penpot file; the grid layout will be inferred from the `ProductCard` component design and standard responsive patterns.

## User Scenarios & Testing

| ID | Scenario | Acceptance Criteria |
| --- | --- | --- |
| US-001 | Shopper opens the Cart page | The cart items are listed alongside an order summary with subtotal, discount, shipping, and total. |
| US-002 | Shopper with an empty cart opens the Cart page | An empty-state message is shown with a primary action to return to shopping. |
| US-003 | Shopper opens the Home page | A grid of product cards is displayed, each showing an image, name, price, and an add-to-cart button. |
| US-004 | Shopper resizes the browser window | The Cart page reflows from two columns to a single stacked column; the Home page grid adjusts columns accordingly. |

## Functional Requirements

| ID | Requirement | Status |
| --- | --- | --- |
| FR-001 | CartPage must display a list of cart items alongside an order summary. | Draft |
| FR-002 | CartPage must use a two-column layout on desktop and a stacked layout on mobile. | Draft |
| FR-003 | HomePage must display a responsive grid of product cards. | Draft |
| FR-004 | HomePage must be populated with at least six mock products so the grid is visually complete. | Draft |
| FR-005 | Both pages must import only from widgets, features, entities, and shared layers. | Draft |
| FR-006 | CartPage must show an empty-state message when the cart contains no items. | Draft |

## Non-Functional Requirements

| ID | Requirement | Threshold | Status |
| --- | --- | --- | --- |
| NFR-001 | Page render time | Pages must display meaningful content within 2 seconds under normal network conditions. | Draft |
| NFR-002 | Responsive layout | Layout must adapt gracefully to viewport widths of 1440px, 768px, and 375px. | Draft |

## Constraints

| ID | Constraint | Status |
| --- | --- | --- |
| C-001 | Mock data only | HomePage product data is static mock data; no backend integration. | Draft |
| C-002 | Design reference | CartPage must match the existing Penpot design; HomePage layout is derived from the ProductCard component. | Draft |
| C-003 | Layer isolation | Pages must compose only from lower-level widgets, features, entities, and shared components; they must not import from other pages. | Draft |

## Success Criteria

1. Cart page renders a two-column layout on desktop and a single stacked column on mobile.
2. Home page renders a responsive grid containing at least six mock product cards.
3. Both pages import only from allowed layers and satisfy all project quality gates.

## Key Entities

- **CartPage** — page composition that renders the cart list and order summary.
- **HomePage** — page composition that renders the product grid.
- **ProductCard** — widget that displays product image, name, price, and add-to-cart button.
- **CartList** — widget that displays the list of cart items.
- **OrderSummary** — widget that displays cost breakdown and checkout action.
- **EmptyState** — widget shown when the cart is empty.

## Design Reference

- **Penpot file name**: `shopping-cart-section-figma`
- **Penpot file ID**: `4cba8d8d-63bf-80c5-8007-e20e604c26a0`
- **Penpot page name**: `Design`
- **Penpot page ID**: `6af293a7-f75e-808e-8007-e20dfb265d42`

### Relevant Boards / Components

| Element | Board / Component Name | ID | Dimensions |
| --- | --- | --- | --- |
| CartPage (Desktop) | Section shopping cart | `ca0875c7-efac-5814-8fbd-2cd5f0cacfaa` | 1440 × 1328 |
| CartPage (Tablet) | Section shopping cart | `2de2c526-ba9c-5d9f-994b-ca145e4258af` | 768 × 1764 |
| CartPage (Mobile) | Section shopping cart | `f3f6e736-7482-5342-849c-28f0537c7eea` | 375 × 2620 |
| ProductCard | product | `5373ed43-ff34-58f6-82d9-1afec89deec1` | 319 × 436 |

### Supported Viewport Resolutions

- Desktop: 1440px width
- Tablet: 768px width
- Mobile: 375px width

### Layout Behavior at Each Breakpoint

- **Desktop (1440px)**: CartPage uses a side-by-side two-column layout (product list left, order summary right). HomePage uses a multi-column product grid.
- **Tablet (768px)**: CartPage stacks vertically (product list top, order summary bottom). HomePage uses a two-column product grid.
- **Mobile (375px)**: CartPage stacks vertically. HomePage uses a single-column product grid.

## Dependencies

- T-025 (CartRow, EmptyState) — Done
- T-027 (CartList, OrderSummary) — Done
- T-031 (ProductCard) — Done
