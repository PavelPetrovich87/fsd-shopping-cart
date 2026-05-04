# Specification: Tooltip Component

## Overview

Build a reusable `Tooltip` component for the shared UI design system. The tooltip provides contextual help text on hover (desktop) and long-press (mobile), with an arrow pointing to the trigger element.

## Intent Summary

Create an accessible tooltip component supporting 4 arrow positions (top, bottom, left, right), hover and long-press triggers, and full ARIA compliance. The component uses design tokens from the existing token system and follows the story-first development workflow.

## User Scenarios & Testing

### Scenario 1: Desktop Hover
- User hovers over an info icon next to a form field
- Tooltip appears above the icon with explanatory text
- User moves mouse away — tooltip disappears

### Scenario 2: Mobile Long-Press
- User long-presses a disabled button on mobile
- Tooltip appears explaining why the button is disabled
- User taps elsewhere — tooltip disappears

### Scenario 3: Keyboard Focus
- User tabs to a form field with a tooltip
- Tooltip appears on focus
- User tabs away — tooltip disappears

### Scenario 4: Multiple Positions
- Content above viewport edge → tooltip appears below (bottom position)
- Content near left edge → tooltip appears to the right (right position)

## Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | Tooltip supports 4 arrow positions: top, bottom, left, right | Must | Open |
| FR-002 | Tooltip triggers on hover (desktop) and long-press (mobile) | Must | Open |
| FR-003 | Tooltip content is accessible via `role="tooltip"` and `aria-describedby` | Must | Open |
| FR-004 | Tooltip uses design tokens for background, text, shadow, and border radius | Must | Open |
| FR-005 | Tooltip shows/hides with CSS transition animation | Should | Open |
| FR-006 | Tooltip supports keyboard focus as trigger | Should | Open |
| FR-007 | Tooltip arrow visually points to the trigger element | Must | Open |
| FR-008 | Tooltip supports custom content (text, React nodes) | Must | Open |

## Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|----|-------------|-----------|--------|
| NFR-001 | First contentful paint not impacted by tooltip | No layout shift > 0.1 Cumulative Layout Shift | Open |
| NFR-002 | Tooltip appears within 100ms of trigger | < 100ms from hover to visible | Open |
| NFR-003 | Works in light and dark mode | Inherits theme via semantic tokens | Open |

## Constraints

| ID | Constraint | Status |
|----|-----------|--------|
| C-001 | Zero-trust styling: no `className` prop on root element | Open |
| C-002 | Use existing design tokens only — no arbitrary values | Open |
| C-003 | Storybook stories must cover all 4 positions + all trigger states | Open |
| C-004 | Must pass ESLint + Steiger + build checks | Open |

## Key Entities

- **Tooltip**: The floating label component
- **TooltipTrigger**: The element that triggers tooltip visibility
- **TooltipContent**: The floating container with text and arrow
- **TooltipArrow**: Visual arrow pointing to trigger

## Design Reference

Extracted from Penpot design file:
- **Container**: 123×38 px (including arrow)
- **Content area**: 123×32 px, `border-radius: 8px` (`--radius-md`)
- **Background**: `#0a0a0a` → `bg-neutral-950`
- **Text**: `#ffffff` → `text-neutral-50`
- **Font**: Noto Sans, 12px (`text-xs`), weight 500 (`font-medium`)
- **Arrow**: ~17×8.5 px, same color as background
- **Shadow**: `shadow-medium` token
- **Z-index**: `--z-tooltip: 400`

## Acceptance Criteria

- [ ] All 4 positions implemented (top, bottom, left, right)
- [ ] Accessible: uses `role="tooltip"`, `aria-describedby`
- [ ] Uses design tokens for colors and shadow
- [ ] Storybook stories for all positions
- [ ] Hover trigger on desktop, long-press on mobile

## Dependencies

- T-017 (Design System Foundation) — design tokens
- T-019 (Button) — base component patterns

## Assumptions

- Tooltip will use `@radix-ui/react-tooltip` as the underlying primitive for positioning and accessibility, styled with design tokens.
- Mobile long-press will be implemented via touch event handlers with 500ms threshold.
- CSS transitions for show/hide will use the existing animation tokens.
