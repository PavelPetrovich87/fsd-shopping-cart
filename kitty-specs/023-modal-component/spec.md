# Specification: Modal Component

## Feature Overview

Create a reusable, accessible Modal (dialog) component for displaying content above the main application layer. The Modal provides a semi-transparent backdrop, a dismissible card container, focus management, keyboard navigation, and enter/exit animations.

The component must be generic — any content (text, forms, confirmations) can be rendered inside it — while visually matching the Penpot design specification for T-024.

**Source Ticket**: T-024 (Tier 5 — Design System)

---

## Intent Summary

**Confirmed Intent**: Build a generic, reusable Modal dialog component with backdrop, close controls, focus trap, ESC dismissal, and fade/scale animations. The component serves as a container for arbitrary content and follows the Penpot design tokens and visual specification extracted from the project's design file.

**Friendly Title**: Modal Component

**Mission Type**: software-dev

---

## User Scenarios & Testing

### Scenario 1: Open and view modal content
**Actor**: End user  
**Flow**: User triggers a modal → sees a semi-transparent backdrop with a centered white card containing the content.  
**Expected**: Modal is clearly visible, main page content is obscured but still visible through the backdrop.

### Scenario 2: Close via backdrop click
**Actor**: End user  
**Flow**: User clicks anywhere outside the modal card (on the backdrop) → modal closes with exit animation.  
**Expected**: Modal dismisses smoothly, focus returns to the element that triggered it.

### Scenario 3: Close via close button
**Actor**: End user  
**Flow**: User clicks the "×" close button in the top-right corner of the modal card → modal closes.  
**Expected**: Modal dismisses, focus returns to trigger element.

### Scenario 4: Close via ESC key
**Actor**: End user  
**Flow**: User presses the Escape key while the modal is open → modal closes.  
**Expected**: Modal dismisses immediately on keydown, focus returns to trigger element.

### Scenario 5: Keyboard focus trapping
**Actor**: End user using keyboard only  
**Flow**: User opens modal → presses Tab repeatedly → focus cycles only through focusable elements inside the modal. Shift+Tab cycles backwards.  
**Expected**: Focus never leaves the modal while it is open. Focus is initially placed on the first focusable element (or the modal itself if none).

### Scenario 6: Animation experience
**Actor**: End user  
**Flow**: User opens/closes modal → observes visual transition.  
**Expected**: On open: backdrop fades in, card scales up from slightly smaller size + fades in. On close: reverse animation. Animation feels responsive (≤300ms).

---

## Functional Requirements

| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-001 | Modal renders above all other content with a semi-transparent backdrop overlay covering the full viewport. | Must | Draft |
| FR-002 | Clicking the backdrop dismisses the modal. | Must | Draft |
| FR-003 | Modal card contains a "×" close button in the top-right corner that dismisses the modal on click. | Must | Draft |
| FR-004 | Pressing the Escape key dismisses the modal. | Must | Draft |
| FR-005 | Focus is trapped inside the modal while it is open — Tab/Shift+Tab cycles only through focusable elements within the modal. | Must | Draft |
| FR-006 | When the modal opens, focus is moved to the first focusable element inside the modal (or the modal container itself if no focusable children exist). | Must | Draft |
| FR-007 | When the modal closes, focus is restored to the element that triggered the modal (if that element is still in the DOM). | Must | Draft |
| FR-008 | Modal supports enter animation: backdrop fades in (opacity 0→1), card scales up (scale <1→1) and fades in simultaneously. | Must | Draft |
| FR-009 | Modal supports exit animation: backdrop fades out, card scales down and fades out simultaneously. | Must | Draft |
| FR-010 | Modal accepts arbitrary content via children/slot pattern — it is a generic container, not limited to confirmation dialogs. | Must | Draft |
| FR-011 | Modal is accessible to screen readers: root element has `role="dialog"` and `aria-modal="true"`. | Must | Draft |
| FR-012 | Modal supports `aria-labelledby` linking to a title element inside the modal for screen reader announcement. | Should | Draft |
| FR-013 | Modal supports programmatic open/close control via an `open` boolean prop and an `onClose` callback. | Must | Draft |
| FR-014 | Modal optionally accepts a `title` prop that renders as a styled heading inside the card. | Should | Draft |

## Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|---|---|---|---|
| NFR-001 | Enter and exit animations complete within 300ms. | ≤300ms | Draft |
| NFR-002 | Modal renders without causing layout shift on the underlying page. | Zero CLS | Draft |
| NFR-003 | Focus trap and keyboard navigation work correctly with standard HTML focusable elements (buttons, links, inputs, textareas, selects). | 100% coverage | Draft |
| NFR-004 | Modal is fully usable with keyboard only (no mouse required). | Pass | Draft |
| NFR-005 | Component is compatible with React Server Components where applicable; client-side APIs (focus, animations) are isolated. | Pass | Draft |

## Constraints

| ID | Constraint | Status |
|---|---|---|
| C-001 | Visual styling must match the Penpot design: backdrop `#0a0a0a` at 70% opacity, card `#ffffff`, card border-radius `8px`, card padding `24px`, internal gap `32px`. | Draft |
| C-002 | All colors, spacing, typography, and shadows must use the project's existing design token system (T-017). | Draft |
| C-003 | Close button and action buttons inside modal examples must reuse the existing Button component (T-019). | Draft |
| C-004 | Helper/tooltip content inside the modal must reuse the existing Tooltip component (T-022). | Draft |
| C-005 | Component must follow FSD architecture: located in `shared/ui/modal/`, no domain logic, only presentation. | Draft |
| C-006 | Component must include Storybook stories covering all states (open, closed, with title, without title, with long content). | Draft |

---

## Success Criteria

1. **Functionality**: Users can open and close the modal via all four methods (backdrop click, × button, ESC key, programmatic toggle).
2. **Accessibility**: Focus trapping and restoration work correctly; screen readers announce the modal as a dialog.
3. **Animation**: Enter/exit animations are visually smooth and complete within 300ms.
4. **Reusability**: The Modal component renders arbitrary child content without modification — it is not hardcoded to the confirmation dialog shown in Penpot.
5. **Design Fidelity**: The default modal appearance matches the Penpot design specification (colors, spacing, border radius, shadows).
6. **Documentation**: Storybook stories exist demonstrating open/close states and various content configurations.

---

## Key Entities

| Entity | Role | Attributes |
|---|---|---|
| Modal | Root container component | `open`, `onClose`, `title`, `children`, `className` |
| Backdrop | Full-viewport overlay | Semi-transparent, clickable, animated |
| ModalCard | White content container | Rounded corners, padding, shadow, animated |
| CloseButton | Dismiss trigger | Icon button, positioned top-right |

---

## Assumptions

1. The project uses React 19, TypeScript 5.9, and Tailwind CSS v4 (per AGENTS.md).
2. The design token system (T-017) is complete and available in `shared/ui/tokens/`.
3. The Button component (T-019) is complete and available in `shared/ui/`.
4. The Tooltip component (T-022) is complete and available in `shared/ui/`.
5. Animation will be implemented using a CSS-first approach (transitions/keyframes) or a lightweight animation library, keeping bundle impact minimal.
6. The modal renders via a portal to avoid z-index and overflow clipping issues.

---

## Dependencies

| Dependency | Ticket | Status |
|---|---|---|
| Design Token System | T-017 | Complete |
| Button Component | T-019 | Complete |
| Tooltip Component | T-022 | Complete |

---

## Out of Scope

1. Drag-to-move or resizable modal behavior.
2. Multiple stacked modals (z-index layering between simultaneous modals).
3. Mobile-specific gestures (e.g., swipe down to dismiss).
4. Modal size variants (sm/md/lg) — the default size follows the Penpot design; size customization can be added later.
5. Built-in form validation logic inside the modal — forms are passed as children, validation belongs to the consumer.
