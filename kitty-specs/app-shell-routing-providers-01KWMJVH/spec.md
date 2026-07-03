# Feature Specification: App Shell — Routing & Providers

**Feature Branch**: `kitty/mission-app-shell-routing-providers-01KWMJVH`
**Created**: 2026-07-03
**Status**: Draft
**Input**: User description: "T-029"
**Mission type**: software-dev

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Shopper buys a product (Priority: P1)

A shopper lands on the Home page, sees a grid of products, and adds one to their cart by clicking the add-to-cart button on a product card. The cart icon in the header immediately updates to show a badge with the item count, without a full page reload. The shopper then navigates to the Cart page via the header link, reviews the item, and completes checkout. On successful checkout they see a brief "Order placed" confirmation and the cart is cleared.

**Why this priority**: This is the core revenue path. Every other story is auxiliary if a shopper cannot add a product, see it in the cart, and check out. It exercises the full vertical: routing, the AddToCart use case, reactive cart-icon updates, CartPage composition, the InitiateCheckout use case, the CheckoutInitiated → ReserveStock subscription, and the success confirmation.

**Independent Test**: Can be fully tested by opening the app, clicking add-to-cart on a product on Home, observing the badge count go to 1, navigating to /cart, clicking Checkout, and confirming the order-placed message appears and the cart empties. Delivers a complete, demonstrable shopping flow.

**Acceptance Scenarios**:

1. **Given** the shopper has the app open on the Home page with an empty cart, **When** they click "Add to cart" on a product card, **Then** the cart icon badge updates to "1" within the same render cycle (no navigation, no reload) and the product appears in the cart.
2. **Given** the shopper has added at least one item and is on the Cart page, **When** they click the Checkout button, **Then** a brief "Order placed" confirmation is shown, the cart icon badge returns to zero, and the cart page returns to the empty state.
3. **Given** the shopper is on the Cart page after a successful checkout, **When** they click the "continue shopping" / empty-state action, **Then** they are navigated back to the Home page.

---

### User Story 2 - Shopper navigates between pages (Priority: P2)

A shopper uses the header navigation to move between the Home (product grid) and Cart pages. The URL changes accordingly so that browser back/forward buttons work and the page can be linked or bookmarked.

**Why this priority**: Without working navigation the app is unusable, but it is secondary to US-1 because the add-to-cart flow is the value driver; navigation is the connective tissue. It is independently testable on its own.

**Independent Test**: Can be tested by opening the app at "/", clicking the "Cart" link in the header, confirming the URL becomes "/cart" and the Cart page renders, clicking the browser back button, confirming the URL returns to "/" and the Home page renders, then using the forward button to return to "/cart".

**Acceptance Scenarios**:

1. **Given** the shopper is on the Home page at URL "/", **When** they click the "Cart" navigation link in the header, **Then** the URL changes to "/cart", the Cart page renders, and no full page reload occurs.
2. **Given** the shopper arrived at "/cart" via the header link, **When** they press the browser back button, **Then** the URL returns to "/" and the Home page renders.
3. **Given** the shopper types an unknown URL path into the address bar, **When** the path does not match "/" or "/cart", **Then** they are redirected to the Home page (the default route).

---

### User Story 3 - Shopper manages cart contents and coupons (Priority: P3)

A shopper on the Cart page changes item quantities, removes items, applies a coupon code, and removes an applied coupon. Each interaction updates the order summary and the cart icon badge in real time as the underlying cart aggregate changes.

**Why this priority**: Cart management is essential to a usable cart page but presupposes US-1 (something in the cart) and US-2 (a working cart page). It is independently testable once at least one item exists.

**Independent Test**: Can be tested by adding an item (or seeding one), navigating to /cart, incrementing and decrementing its quantity, removing it, applying a coupon code, and removing the coupon — confirming the subtotal/discount/total and badge update after each action.

**Acceptance Scenarios**:

1. **Given** the shopper is on the Cart page with at least one item, **When** they increment the item's quantity, **Then** the order summary totals recompute (subtotal, shipping, total), and the cart icon badge count increases by one.
2. **Given** the shopper has an item in the cart, **When** they apply a valid coupon code, **Then** a discount line appears in the order summary and the total decreases; **When** they then remove the coupon, **Then** the discount line disappears and the total returns to its pre-coupon value.
3. **Given** the shopper removes the last item from the cart, **Then** the cart page transitions to the empty state and the cart icon badge disappears (returns to zero / hidden).

---

### Edge Cases

- **Out-of-stock on add**: When a shopper clicks add-to-cart for a product whose stock is exhausted, the AddToCart use case returns an InsufficientStock error. The cart icon badge must not change, and the product card must communicate that the item is unavailable (e.g., the add-to-cart button is disabled or shows an "out of stock" state). No item is added to the cart.
- **Stock conflict at checkout**: When the shopper clicks Checkout but one or more items have insufficient stock at that moment (race condition), the existing StockConflictModal opens listing the affected items, their requested and available quantities. The cart is not cleared.
- **Empty-cart checkout attempt**: The Checkout button is disabled when the cart is empty, so this path is unreachable via normal interaction. If the InitiateCheckout use case returns `empty_cart` by any means, it is treated as a no-op (no error surfaced).
- **Invalid cart state at checkout**: If the cart is not in an Active state when checkout is attempted (a rare race), the failure is logged via the diagnostics subscription and surfaced as a no-op to the user (no destructive action).
- **Direct navigation to /cart with an empty cart**: The shopper sees the empty state with a clear "return to shopping" action that navigates to "/".
- **Browser refresh on /cart**: The cart state lives in memory only; a refresh returns the cart to empty. This is expected behavior for this mission (persistence is out of scope).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide app-level wiring that exposes a single shared event bus and the three repository adapters (cart, stock, coupon) to the rest of the application through a dependency-injection mechanism.
- **FR-002**: The system MUST provide client-side routing so that the URL "/" displays the Home page and the URL "/cart" displays the Cart page, with the browser back/forward buttons functioning normally.
- **FR-003**: The system MUST render a global header on every page containing navigation between Home and Cart and a cart icon that displays the live number of distinct items in the cart.
- **FR-004**: The cart icon badge MUST update immediately (within the same render cycle, no reload) whenever the number of distinct items in the cart changes, whether the change originates on the Home page or the Cart page.
- **FR-005**: The Home page MUST allow a shopper to add a product to their cart, and the add action MUST be processed through the AddToCart use case using the injected cart repository, stock repository, and event bus.
- **FR-006**: The Cart page MUST receive all of its data (items, totals, applied coupon, etc.) by deriving it from the live cart aggregate, and MUST NOT parse previously-formatted display strings to reconstruct numeric values.
- **FR-007**: Each Cart page interaction (increment, decrement, remove item, apply coupon, remove coupon, checkout) MUST be wired to its corresponding use case (ChangeCartItemQuantity, RemoveFromCart, ApplyCoupon, RemoveCoupon, InitiateCheckout), invoked with the injected dependencies.
- **FR-008**: The system MUST subscribe to the CheckoutInitiated domain event and, when it fires, reserve/deplete stock for each line item in the cart through the stock repository.
- **FR-009**: The system MUST subscribe to cart domain events with a diagnostics-only handler (logging only, no business logic) that can be added or removed without changing observable behavior.
- **FR-010**: When checkout succeeds, the system MUST show a brief "Order placed" confirmation to the shopper and clear the cart; when checkout reports a stock conflict, the system MUST open the existing stock-conflict modal listing the affected items.
- **FR-011**: The system MUST treat an out-of-stock condition on add-to-cart as a no-add: the cart icon badge must not change, and the unavailable product must be reflected on its product card (disabled add button or visible "out of stock" indicator).
- **FR-012**: When the cart becomes empty (initial state or after the last item is removed), the Cart page MUST show an empty-state message with a primary action that navigates the shopper back to the Home page.

### Non-Functional Requirements

| ID      | Requirement              | Threshold                                                                                                                                                  | Status |
| ------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| NFR-001 | Responsive layout        | Header, navigation, cart icon, and routed page content MUST reflow gracefully at desktop (≥1024px), tablet (768px), and mobile (375px) viewport widths.   | Draft  |
| NFR-002 | Perceived responsiveness | After any cart change, the cart icon badge and order summary MUST reflect the new state in under 100 ms (one render cycle, no full reload).                | Draft  |
| NFR-003 | Navigation latency       | Switching between Home and Cart via header links MUST be perceived as instantaneous (under 200 ms, no full page load).                                     | Draft  |
| NFR-004 | Architecture isolation   | The application shell MUST pass the project's architecture linter with no violations; the app layer imports only from lower FSD layers.                    | Draft  |
| NFR-005 | No behavior regression   | The existing project unit-test suite MUST continue to pass unchanged; this mission adds wiring, not behavioral changes to lower layers.                    | Draft  |
| NFR-006 | First-content usefulness | On a normal network, every routed page MUST display meaningful content within 2 seconds of navigation.                                                    | Draft  |
| NFR-007 | Single-instance invariant| A developer inspecting the running app MUST be able to confirm that exactly one event bus and one of each repository adapter exist for the session lifetime. | Draft  |

### Key Entities *(include if feature involves data)*

- **App Shell / AppProviders**: The composition root that constructs (once) and exposes the shared event bus and the three repository adapters to the rest of the application. Owns dependency-injection lifetime.
- **Layout / Header**: The persistent global chrome (header with navigation links and the cart icon) that wraps every routed page.
- **Cart Icon (badge)**: A header element bound to the live cart; displays the distinct-item count and updates reactively as the cart changes.
- **Cart Container**: The bridge component that reads the live cart, derives the presentational Cart page's props (using the Money value object for all currency), and wires each Cart page callback to its use case.
- **Home Container**: The bridge component that wires the Home page's product cards to the AddToCart use case via the injected dependencies.
- **Checkout Subscription**: The app-level subscription that turns a CheckoutInitiated event into actual stock reservations through the stock repository.
- **Diagnostics Subscription**: A separable, no-business-logic subscription that logs cart domain events for observability.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A shopper can complete the full purchase flow — add a product on Home, navigate to Cart, check out — in under 30 seconds and with no more than 4 clicks beyond typing, on a desktop viewport.
- **SC-002**: The cart icon badge reflects the correct distinct-item count within one render cycle of any cart change (perceived as instantaneous by a human user, i.e., under 100 ms after the underlying state update).
- **SC-003**: Browser navigation (back, forward, manual URL entry) works for "/" and "/cart" without errors and without requiring a full page reload.
- **SC-004**: 100% of the Cart page's displayed currency values are derived from the cart aggregate via the Money value object, with no string-to-number parsing of previously-formatted display strings anywhere in the application shell.
- **SC-005**: All existing project quality gates (lint, architecture lint, type-check/build, and the existing unit-test suite) pass with zero errors and zero warnings after the mission's changes.
- **SC-006**: A developer inspecting the running application confirms that exactly one event bus instance and exactly one of each repository adapter exist for the lifetime of the session, shared by every consumer (no per-render instantiation).

## Constraints *(C-###)*

| ID    | Constraint                     | Detail                                                                                                                                                                                                       | Status |
| ----- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| C-001 | FSD layer isolation            | The app layer may import only from pages, widgets, features, entities, and shared. It MUST NOT be imported by any of those layers.                                                                          | Draft  |
| C-002 | Single event bus instance      | Exactly one event bus MUST exist for the application's lifetime; the dependency-injection mechanism MUST NOT create a new instance per render or per consumer.                                              | Draft  |
| C-003 | No string parsing of prices    | All currency values rendered by the Cart page MUST originate from Money-based computations on the cart aggregate, never from parsing display strings.                                                       | Draft  |
| C-004 | Preserve existing page contracts | The public props contract of the presentational Cart page and the Home page module boundary (established in the prior pages mission) MUST remain unchanged; this mission only supplies their props.        | Draft  |
| C-005 | No new third-party dependencies | The project's dependency manifest MUST NOT gain new entries; everything required (routing library, state library) is already present.                                                                       | Draft  |
| C-006 | Worktree-based implementation  | Per project workflow rules, all code changes for this mission MUST occur inside the allocated worktree via the lane-based implement workflow, never by direct edits to the main checkout.                   | Draft  |
| C-007 | No new design tokens or primitives | This mission introduces no new design tokens, typography, or shared UI primitives; the header and cart icon MUST be composed from existing primitives and tokens.                                         | Draft  |

## Assumptions

- All dependency tickets are complete and their public exports are stable: the event bus and its API; the three repository ports; the mock and zustand repository adapters; the cart/coupon/checkout use cases; the presentational Cart and Home pages; the existing stock-conflict modal; the existing empty-state component; the existing product card component.
- The cart state lives entirely in memory for the lifetime of the session; persistence across browser refreshes is out of scope and a refresh returning the cart to empty is acceptable.
- The Home page's product data already comes from the existing shared mock fixtures; this mission wires the add-to-cart action but does not change how products are sourced.
- The routing library required for client-side navigation is already a project dependency; no installation is needed.
- The cart icon badge reflects the count of distinct items (line items) in the cart, not the sum of their quantities. (If the sum-of-quantities interpretation is preferred, this should be revisited during planning.)
- All cart domain events are emitted by the existing use cases and aggregates; this mission only subscribes to them at the app layer — it does not introduce new events.

## Dependencies

- The async domain event bus and its publish/subscribe API (prior event-bus work).
- The three repository port interfaces and their mock/zustand adapter implementations (prior ports and adapter work).
- The AddToCart, ChangeCartItemQuantity, RemoveFromCart, ApplyCoupon, RemoveCoupon, and InitiateCheckout use cases (prior feature work).
- The presentational Cart and Home pages, including the Cart page's full props contract (prior pages work).
- The existing product card, empty-state, and stock-conflict modal components (prior UI work).
- The Money value object (prior shared foundation work).

## Design Reference

**Penpot file**: `shopping-cart-section-figma` (`4cba8d8d-63bf-80c5-8007-e20e604c26a0`), page `Design` (`6af293a7-f75e-808e-8007-e20dfb265d42`).

**What the Penpot file actually contains (verified live via the Penpot MCP at specify time):** the shopping cart section in three states — Initial, Coupon added, and Empty — across three breakpoints — Desktop (1440×1328), Tablet (768×1764), and Mobile (375×2620). The relevant top-level boards are:

| State        | Breakpoint | Board ID                              | Dimensions    |
| ------------ | ---------- | ------------------------------------- | ------------- |
| Initial      | Desktop    | `adca1647-3a67-5b77-82fc-8e4decb02840` | 1440 × 1328   |
| Initial      | Tablet     | `2de2c526-ba9c-5d9f-994b-ca145e4258af` | 768 × 1764    |
| Initial      | Mobile     | `f3f6e736-7482-5342-849c-28f0537c7eea` | 375 × 2620    |
| Coupon added | Desktop    | `21a2973c-e2c8-5069-990e-c4f579335bed` | 1440 × 1328   |
| Coupon added | Tablet     | `0c95ae63-fbac-57a5-9e6c-9cac8dbe0116` | 768 × 1894    |
| Coupon added | Mobile     | `37cb7aac-63ee-557f-8fd7-0193abd777ba` | 375 × 2794    |
| Empty        | Desktop    | `612f03d1-67a1-550c-a0eb-2d085042830e` | 1440 × 768    |
| Empty        | Tablet     | `34eb38bc-78b8-52ae-9396-bebf9a1eaf83` | 768 × 1024    |
| Empty        | Mobile     | `7ba73f6b-d17c-579a-b8f3-0bd690116400` | 375 × 812     |

**Supported viewport resolutions**: Desktop 1440px, Tablet 768px, Mobile 375px.

**Layout behavior**: All boards document the cart section body (cart rows on the left/top, order summary on the right/bottom, stacked on tablet and mobile). The Cart page composition and responsive reflow are therefore grounded in these designs.

**Gaps the design does NOT cover (must be inferred during implementation):**

- **No global header, navbar, or cart icon** exists anywhere in the Penpot file. The 66 elements named "header"/"header container" are all interior section labels within cart rows, not top-of-page chrome. The header layout, cart icon glyph, badge placement, and responsive collapse behavior MUST be designed during implementation, following standard e-commerce patterns and the project's existing design tokens.
- **No Home page or product grid** exists in this file. The Home page's responsive product grid layout is inherited unchanged from the prior pages mission and is not re-specified here. (Note: the prior pages mission's spec referenced a product-card Penpot component ID that does not exist in this file's library — the file contains only one component, "Section shopping cart." That reference appears to have been carried over without verification; it should not be relied upon.)
- **No success/confirmation state** for checkout exists in the design. The "Order placed" confirmation UI MUST be designed during implementation using existing primitives (e.g., a brief inline message or toast), consistent with the design tokens.

These inferred elements MUST be re-verified against Penpot at the start of the implement lane. If the design has been updated to include header/nav/cart-icon boards, those IDs replace the inferred approach.
