# Implementation Plan: Modal Component

**Branch**: `main` | **Date**: 2026-05-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/kitty-specs/023-modal-component/spec.md`

## Summary

Implement a reusable, accessible Modal dialog component for the FSD shopping cart project. The Modal provides a backdrop overlay, a dismissible card container, focus trapping, keyboard navigation (ESC), and smooth enter/exit animations (fade + scale). The component is generic — arbitrary content can be rendered inside via children — while matching the Penpot design extracted for T-024.

**Technical approach**: Build as a `shared/ui` component following FSD conventions. Use Tailwind CSS for styling with design tokens. Implement focus management via a custom hook. Use CSS transitions for animations. Provide Storybook stories for visual regression and documentation.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19  
**Primary Dependencies**: Tailwind CSS v4, Vite 8, Storybook (CSF3), Vitest (browser mode)  
**Storage**: N/A  
**Testing**: Vitest browser mode + Storybook visual stories  
**Target Platform**: Web (modern browsers: Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (FSD architecture)  
**Performance Goals**: Animation completes ≤300ms; zero layout shift on open/close  
**Constraints**: Must use existing design tokens (T-017); must reuse Button (T-019) and Tooltip (T-022); FSD `shared/ui` layer only — no domain logic  
**Scale/Scope**: Single reusable component; 4 work packages

## Charter Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] No unresolved governance directives block this feature
- [x] Feature scope fits within a single mission (one component)
- [x] Dependencies (T-017, T-019, T-022) are complete

## Project Structure

### Documentation (this feature)

```
kitty-specs/023-modal-component/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Work packages (Phase 2)
```

### Source Code (repository root)

```
src/shared/ui/modal/
├── modal.tsx            # Modal component (root + backdrop + card + close button)
├── modal.stories.tsx    # Storybook stories (open, closed, with title, long content)
└── index.ts             # Public API export

src/shared/ui/index.ts   # Updated to re-export Modal
```

**Structure Decision**: Single `shared/ui/modal/` slice following the established FSD pattern used by `input-field/`, `tooltip/`, and other UI components. No model/api/lib segments needed — this is a pure presentation component.

## Work Package Overview

| WP | Name | Scope | Est. Complexity |
|---|---|---|---|
| WP1 | Modal Structure & Styling | Component shell, backdrop, card, close button, Tailwind styling per Penpot | Medium |
| WP2 | Interaction & Accessibility | Backdrop click, ESC, close button, focus trap, focus restoration, aria | Medium |
| WP3 | Animations | Enter (fade-in + scale-up) and exit (fade-out + scale-down) CSS transitions | Small |
| WP4 | Stories & Integration | Storybook stories, export from `shared/ui/index.ts`, visual regression coverage | Small |

## Dependency Graph

```
WP1 (Structure)
  └── WP2 (Interaction)
        └── WP3 (Animations)
              └── WP4 (Stories)
```

All WPs are sequential — each builds on the previous.

## Complexity Tracking

No charter violations. Feature stays within a single `shared/ui` slice, uses existing dependencies, and introduces no new infrastructure.
