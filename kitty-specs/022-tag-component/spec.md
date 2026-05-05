# Mission Specification: Tag Component

## Feature Overview

A reusable **Tag** (badge/pill) UI component for the design system. Tags display categorical labels or metadata. The component uses a single neutral color scheme derived from the Penpot design and supports an optional dismiss action. Purely presentational with no domain logic dependencies.

**Scope includes**:
1. Tag React component with neutral styling
2. Optional dismiss "×" button with accessible interaction
3. Storybook stories for default and dismiss states

**Derived from**: Penpot design file (`Design` page, selected Tag shape) and Ticket T-023 (`docs/TICKETS.md`, adjusted to match design).

---

## User Scenarios & Testing

### Scenario 1: Display a Label Tag
> As a user, I want to see a compact label next to content so I can identify categories or filters.

**Flow**:
1. User views a page with tags (e.g., category labels on a product)
2. Tag renders with neutral background and readable text
3. Tag text is clearly visible against its background

### Scenario 2: Dismiss a Removable Tag
> As a user, I want to remove a filter or label by clicking its dismiss button.

**Flow**:
1. User sees a tag with a "×" dismiss button
2. User clicks the dismiss button
3. Tag triggers `onDismiss` callback
4. Parent component handles removal (e.g., removes filter)

### Scenario 3: Keyboard Accessibility for Dismiss
> As a keyboard user, I want to dismiss a tag using keyboard interaction.

**Flow**:
1. User tabs to focus the dismiss button
2. Pressing Enter or Space activates dismissal
3. Focus moves to a sensible next element

---

## Functional Requirements

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-001 | The Tag displays text content passed via a `children` prop | Must | Open |
| FR-002 | An optional `onDismiss` prop, when provided, renders a "×" dismiss button on the right side of the tag | Must | Open |
| FR-003 | Clicking the dismiss button invokes the `onDismiss` callback with no arguments | Must | Open |
| FR-004 | The dismiss button is keyboard-accessible: focusable, activatable via Enter/Space | Must | Open |
| FR-005 | Tag text uses Noto Sans font family, 14px size (sm), weight 500 (medium) per Penpot design spec | Must | Open |
| FR-006 | Tag height is fixed at 28px with horizontal padding scaled to content; border radius is 4px (sm) | Must | Open |
| FR-007 | Tag background uses `neutral-200` and text uses `neutral-900` per Penpot design | Must | Open |

## Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|---|---|---|---|
| NFR-001 | Component renders correctly in Storybook with zero runtime errors | Zero runtime errors | Open |
| NFR-002 | Component meets WCAG 2.1 AA contrast requirements (minimum 4.5:1 for text on background) | >= 4.5:1 contrast ratio | Open |
| NFR-003 | Component bundle size increase is minimal (no heavy external dependencies beyond existing design system) | No new npm packages | Open |

## Constraints

| ID | Constraint | Status |
|---|---|---|
| C-001 | Component must be implemented in `src/shared/ui/tag/` following FSD `shared/ui` layer conventions | Open |
| C-002 | No `className` prop on public API (zero-trust styling rule per FSD UI constraints) | Open |
| C-003 | All colors must reference design tokens (`src/shared/ui/tokens/`); no hardcoded hex values in component source | Open |
| C-004 | Dismiss button uses an inline SVG × icon; no external icon library dependency | Open |
| C-005 | Storybook stories use CSF3 format with `satisfies Meta<typeof Tag>` | Open |
| C-006 | Component must be re-exported from `src/shared/ui/index.ts` | Open |

---

## Success Criteria

1. Tag renders in Storybook with correct neutral colors matching Penpot design
2. Dismiss button appears only when `onDismiss` is provided and triggers callback on click/keyboard activation
3. `npm run lint`, `npm run lint:arch`, and `npm run build` pass without errors
4. Component is importable via `import { Tag } from '@/shared/ui'`

---

## Key Entities

| Entity | Type | Description |
|---|---|---|
| Tag | UI Component | Presentational badge component with optional dismiss support |
| TagProps | Interface | `{ onDismiss?: () => void; children: ReactNode }` |

---

## Assumptions

1. **Single variant**: The Penpot design contains only a neutral-colored tag. This mission implements only that design; no additional color variants are in scope.
2. **No size variants**: As confirmed by the user, the Tag component has a single default size; no `sm`/`md`/`lg` sizing is required.
3. **Dismiss icon**: The × icon from Penpot is a simple vector path (~10.6×10.6px). An equivalent inline SVG will be used.

---

## Design Reference

### Penpot Tag
- **Shape**: Board, 144×28px
- **Background**: `#e5e7eb` (neutral-200)
- **Border radius**: 4px
- **Stroke**: `#e5e5e5` 0.5px (artifact; no border token needed)
- **Text**: Noto Sans, 14px, weight 500, `#171717` (neutral-900)
- **Dismiss icon**: × path, 10.6×10.6px, `#000000`
- **Layout**: text content left-aligned, dismiss button right-aligned with 20×20px touch target

### Token Mapping
| Property | Token |
|---|---|
| Background | `bg-neutral-200` |
| Text color | `text-neutral-900` |
| Border radius | `rounded-sm` (4px) |
| Font size | `text-sm` (14px) |
| Font weight | `font-medium` (500) |
| Dismiss icon | Inline SVG, `text-neutral-900` |
