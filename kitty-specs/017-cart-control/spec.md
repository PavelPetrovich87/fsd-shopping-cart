# Cart Control Component

## Feature Description

A reusable `CartControl` molecule for `shared/ui/` that combines a quantity selector with increment/decrement buttons and a remove button with externally-controlled confirmation state.

The component is stateless — it receives current quantity, min/max bounds, and a `confirmingRemove` flag through props. All state changes are emitted as callbacks to the parent.

## User Scenarios & Testing

### Scenario 1: Adjust quantity in cart

**Given** a shopper viewing the cart
**When** they click "−" or "+" next to a cart item
**Then** the quantity updates within the allowed min/max bounds
**And** the decrement button is disabled at minimum quantity
**And** the increment button is disabled at maximum quantity

### Scenario 2: Remove item from cart

**Given** a shopper viewing the cart
**When** they click the remove button
**Then** the component emits `onRequestRemove`
**And** the parent switches the component to confirmation mode
**And** a "Confirm remove?" label with "Yes" / "Cancel" buttons appears
**When** the shopper clicks "Yes"
**Then** the component emits `onConfirmRemove`
**When** the shopper clicks "Cancel"
**Then** the component emits `onCancelRemove`

### Scenario 3: Disabled cart control

**Given** a cart operation is in progress
**When** the parent passes `disabled={true}`
**Then** all buttons are non-interactive
**And** the quantity display remains visible

## Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| FR-001 | Display current quantity as a read-only number between decrement and increment buttons | `draft` |
| FR-002 | Emit `onDecrement` callback when "−" button is clicked | `draft` |
| FR-003 | Emit `onIncrement` callback when "+" button is clicked | `draft` |
| FR-004 | Disable "−" button when `quantity <= min` | `draft` |
| FR-005 | Disable "+" button when `quantity >= max` | `draft` |
| FR-006 | Emit `onRequestRemove` when remove button is clicked | `cancelled` — remove button is a separate Penpot element; parent layer owns this callback |
| FR-007 | When `confirmingRemove={true}`, show confirmation UI with "Confirm remove?" text and "Yes"/"Cancel" actions | `cancelled` — confirmation modal is a separate Penpot element; parent layer owns this state |
| FR-008 | Emit `onConfirmRemove` when "Yes" is clicked in confirmation mode | `cancelled` — parent layer owns confirm action |
| FR-009 | Emit `onCancelRemove` when "Cancel" is clicked in confirmation mode | `cancelled` — parent layer owns cancel action |
| FR-010 | Disable all interactive elements when `disabled={true}` | `draft` |

## Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|---|---|---|---|
| NFR-001 | All buttons must have accessible names for screen readers | 100% of buttons have `aria-label` | `draft` |
| NFR-002 | Component must be keyboard navigable | All actions reachable via Tab + Enter/Space | `draft` |
| NFR-003 | Storybook stories cover all states and interactions | Stories exist for Default, AtMinimum, AtMaximum, Disabled, ConfirmRemove, and Interaction variants | `draft` |

## Constraints

| ID | Constraint | Status |
|---|---|---|
| C-001 | Component must live in `shared/ui/cart-control/` following the existing `shared/ui/` convention | `draft` |
| C-002 | Must use the existing `Button` component from `@/shared/ui` | `draft` |
| C-003 | Must follow story-first convention: write stories before implementing the component | `draft` |
| C-004 | Must pass Storybook a11y checks (`test: 'error'` mode) | `draft` |
| C-005 | No domain logic or state management inside the component — pure presentational | `draft` |

## Success Criteria

- CartControl renders correctly in Storybook across all defined states
- `npm run test:storybook` passes with no a11y violations
- All button actions emit the correct callbacks
- Component is keyboard accessible and screen-reader friendly
- Chromatic visual regression captures all states as baselines

## Key Entities

| Entity | Description |
|---|---|
| CartControl | Presentational UI component for quantity control and item removal |
| CartControlProps | Component props contract: quantity, min, max, disabled, confirmingRemove, and all callback handlers |

## Assumptions

- The parent (feature/widget layer) owns all business state: cart data, stock limits, and confirmation flags
- The existing `Button` component in `@/shared/ui` supports the required variants (default, outline, ghost) and sizes
- Quantity is always an integer ≥ 1

## Dependencies

- `T-018` (Design Tokens) — design tokens must be available for colors, spacing, typography
- `T-019` (Button Component) — `Button` must be available in `@/shared/ui`
- `@/shared/ui` public API must export `Button`

## Out of Scope

- Stock validation logic (owned by feature layer)
- Cart state management (owned by entities/features)
- Toast notifications or error messages (owned by feature layer)
- MSW mocking (CartControl has no network dependencies)
