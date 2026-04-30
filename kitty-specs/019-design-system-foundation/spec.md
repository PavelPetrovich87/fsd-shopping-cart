# Design System Foundation

## 1. Mission Overview

**Type:** software-dev  
**Slug:** 019-design-system-foundation  
**Created:** 2026-04-30

### Intent Summary

Build a complete, code-first design token system that becomes the single source of truth for all UI components in the shopping cart application. This mission audits the Penpot design file, extracts all visual values (colors, typography, spacing, shadows, elevation), and codifies them into a layered token architecture: primitive → semantic → component. The output must be directly consumable by React components, documented for developers, and verifiable via visual regression stories.

This work unblocks all downstream UI tickets (T-019 Button, T-022 Tooltip, T-023 Tag, T-024 Modal, T-025 Entity UI, and beyond).

---

## 2. User Scenarios & Testing

### Scenario: Developer Consumes a Token

**Given** a developer is styling a new component  
**When** they open the token directory  
**Then** they can import the exact color, spacing, or shadow value they need from a typed module or CSS custom property

### Scenario: Designer-Developer Handoff

**Given** a designer updates a color in the Penpot file  
**When** the development team audits the change  
**Then** they can locate the corresponding primitive token by name and update a single source of truth that cascades to all components

### Scenario: Visual Regression of Tokens

**Given** a reviewer opens Storybook  
**When** they navigate to the Design Tokens stories  
**Then** they see swatches for colors, specimens for typography, and rulers for spacing that match the Penpot style guide exactly

### Scenario: Responsive Layout

**Given** a component uses breakpoint tokens  
**When** the viewport width changes  
**Then** the component adapts at the documented widths without hard-coding pixel values

---

## 3. Requirements

### Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001 | Define a three-layer token taxonomy: primitive (raw values), semantic (contextual mappings), and component (specific widget values) | Pending |
| FR-002 | Extract the complete primitive color palette from Penpot and export each color as an HSL string | Pending |
| FR-003 | Map primitive colors to semantic tokens for background, foreground, surface, border, primary, secondary, muted, accent, and destructive contexts | Pending |
| FR-004 | Define a typography scale covering font family, sizes (xs through 5xl), weights (400–700), line-heights, and letter-spacing in rem units | Pending |
| FR-005 | Define a spacing scale on a 4px base grid with values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128 | Pending |
| FR-006 | Define border radius tokens: sm=4px, md=8px, lg=12px, xl=16px, full=9999px | Pending |
| FR-007 | Define shadow/elevation tokens: subtle, medium, large, focus-ring, and error-ring | Pending |
| FR-008 | Define responsive breakpoint tokens: sm, md, lg, xl | Pending |
| FR-009 | Define a z-index scale: dropdown, sticky, modal, tooltip, toast | Pending |
| FR-010 | Export all tokens as typed TypeScript constants with explicit interfaces | Pending |
| FR-011 | Emit all tokens as CSS custom properties in a single stylesheet | Pending |
| FR-012 | Create Storybook stories that visually display color swatches, typography specimens, and spacing rulers | Pending |
| FR-013 | Write a README documenting token layers, naming conventions, and usage rules | Pending |
| FR-014 | Provide a combined theme object that aggregates all token categories for programmatic access | Pending |
| FR-015 | Replace any existing outdated token stylesheet so there is exactly one CSS source of truth | Pending |

### Non-Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-001 | All color tokens must be HSL strings; no raw hex values in semantic or component tokens | Pending |
| NFR-002 | Typography values must use rem units exclusively | Pending |
| NFR-003 | Spacing scale must have no gaps and align to a 4px grid | Pending |
| NFR-004 | Token names must be kebab-case and follow the `category-purpose-variant` convention | Pending |
| NFR-005 | The CSS custom property file and TypeScript modules must compile without errors when the project is built | Pending |

### Constraints

| ID | Constraint | Status |
|----|------------|--------|
| C-001 | All primitive colors must derive from the audited Penpot design file; values must not be invented | Pending |
| C-002 | The token directory must live at `src/shared/ui/tokens/` | Pending |
| C-003 | The output must remain compatible with the existing React 19 / TypeScript 5.9 / Tailwind CSS v4 stack | Pending |
| C-004 | No external design-token management libraries (e.g., Style Dictionary) may be introduced | Pending |
| C-005 | Shadow and focus-ring values observed in Penpot must be preserved exactly in the token definitions | Pending |

---

## 4. Source Values from Penpot

### Colors (Primitive Palette)

All colors were extracted from the Penpot library and style-guide swatches on 2026-04-30.

#### Brand
| Penpot Name | Hex | HSL Equivalent | Tailwind Ref |
|-------------|-----|----------------|--------------|
| brand | #4338ca | hsl(245 58% 51%) | indigo-700 |
| brand-primary-emphasize | #3730a3 | hsl(244 55% 41%) | indigo-800 |
| brand-subtle / Badge | #eef2ff | hsl(230 100% 97%) | indigo-50 |

#### Neutral
| Penpot Name | Hex | HSL Equivalent | Tailwind Ref |
|-------------|-----|----------------|--------------|
| primary (dark) | #171717 | hsl(0 0% 9%) | neutral-900 |
| text-title | #404040 | hsl(0 0% 25%) | neutral-800 |
| secondary | #525252 | hsl(0 0% 32%) | neutral-700 |
| text-hint / text-placeholder | #737373 | hsl(0 0% 45%) | neutral-600 |
| disabled (text) | #a3a3a3 | hsl(0 0% 64%) | neutral-500 |
| Rectangle 9 | #d4d4d4 | hsl(0 0% 83%) | neutral-400 |
| secondary (light) / tag | #e5e7eb | hsl(220 9% 89%) | neutral-200 |
| Title | #f5f5f5 | hsl(0 0% 96%) | neutral-100 |
| Cart Control / Input / background | #fafafa | hsl(0 0% 98%) | neutral-50 |
| White / Content | #ffffff | hsl(0 0% 100%) | white |

#### Special
| Penpot Name | Hex | HSL Equivalent | Tailwind Ref |
|-------------|-----|----------------|--------------|
| error / text-error | #dc2626 | hsl(0 72% 50%) | red-600 |
| Modal, Popup / Tooltip shape | #0a0a0a | hsl(0 0% 4%) | neutral-950 |

### Typography

- **Font family**: Noto Sans
- **Sizes observed** (px → rem): 12/0.75, 14/0.875, 16/1, 18/1.125, 24/1.5, 30/1.875, 36/2.25, 48/3
- **Weights observed**: 400, 500
- **Line-heights observed**: 1.0, 1.11, 1.2, 1.33, 1.5, 1.56, 1.43
- **Letter-spacing**: 0 (not varied in design)

### Shadows

- **Button default**: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- **Button focus-ring**: `0 0 0 4px rgba(68,76,231,0.12)`
- **Tooltip**: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`
- **Card / Content**: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)`
- **Input focus**: `0 0 0 1px #444ce7, 0 1px 2px rgba(16,24,40,0.05), 0 0 0 4px rgba(68,76,231,0.12)`
- **Input error**: `0 0 0 1px #d92d20, 0 0 0 4px rgba(217,45,32,0.12)`

### Border Radius (Penpot Token Set)

| Token | Value |
|-------|-------|
| rounded | 4px |
| rounded-lg | 8px |

### Spacing Observed in Layouts

4px, 8px, 10px, 12px, 15px, 16px, 32px, 36px, 64px

---

## 5. Design Decisions

### Decision 1: HSL as the Canonical Color Format

**Context:** The ticket requires HSL strings. Penpot provides hex values and HSL labels on swatches.

**Resolution:** Primitive colors are stored as HSL strings. Hex values may be used as source references in comments or documentation, but all exported token values are HSL.

### Decision 2: Extending the Border Radius Scale

**Context:** Penpot only defines `rounded=4px` and `rounded-lg=8px`. The ticket requires `sm=4px, md=8px, lg=12px, xl=16px, full=9999px`.

**Resolution:** Accept `sm` and `md` from Penpot. Derive `lg`, `xl`, and `full` as standard increments (12px, 16px, 9999px) consistent with common design-system conventions, documented as derived.

### Decision 3: Spacing Scale Completeness

**Context:** Penpot shows gaps in spacing (no 20px, 24px, 40px, 48px, 80px, 96px, 128px observed). The ticket specifies a complete 4px grid.

**Resolution:** Build the full 4px grid as specified in the ticket. Document which values were observed in Penpot vs. derived to complete the scale.

### Decision 4: Shadow Token Naming

**Context:** Multiple shadow combinations exist for buttons, tooltips, cards, and inputs.

**Resolution:** Group into generic elevation tokens (`subtle`, `medium`, `large`) and state-specific tokens (`focus-ring`, `error-ring`). Button default shadow maps to `subtle`. Tooltip and card map to `medium` and `large` respectively.

---

## 6. Output Structure

```
src/shared/ui/tokens/
├── colors.ts              # Primitive + semantic color maps (HSL)
├── typography.ts          # Font sizes, weights, families, line-heights
├── spacing.ts             # Spacing scale
├── radius.ts              # Border radius tokens
├── shadows.ts             # Shadow/elevation tokens
├── breakpoints.ts         # Responsive breakpoints
├── z-index.ts             # Z-index scale
├── index.ts               # Combined theme object + re-exports
├── theme.css              # CSS custom properties (single source of truth)
├── README.md              # Token usage documentation
└── tokens.stories.tsx     # Storybook stories for all token categories
```

---

## 7. Assumptions

1. **Font loading**: "Noto Sans" is assumed to be available via the project's font-loading strategy (e.g., Google Fonts or self-hosted). The token system references the family name only.
2. **Shadow derivation**: Shadow values for `subtle`, `medium`, and `large` are mapped from the most representative Penpot shapes (button, tooltip, card). Input-specific shadows are mapped to `focus-ring` and `error-ring`.
3. **Breakpoint values**: The ticket specifies `sm, md, lg, xl` without explicit pixel values. Standard responsive breakpoints (640px, 768px, 1024px, 1280px) are assumed.
4. **Missing font weights**: Penpot only uses 400 and 500, but the ticket specifies a range up to 700. Weights 600 and 700 are included in the scale as derived values for future component needs.
5. **Gradient colors**: Two gradient swatches exist in Penpot (swatches 10 and 4). They are documented but not codified as solid primitive tokens because they are linear gradients between neutral-50 and neutral-100/300 ranges.

---

## 8. Key Entities

- **Primitive Token:** A raw, context-free design value (e.g., `hsl(245 58% 51%)`).
- **Semantic Token:** A value mapped to a usage context (e.g., `primary` maps to brand indigo-700).
- **Component Token:** A value specific to a component state (e.g., `button-focus-ring` maps to the indigo focus shadow).
- **Theme Object:** A typed TypeScript aggregation of all token categories for programmatic consumption.
- **CSS Custom Property:** A `--*` variable emitted in `theme.css` for runtime styling.

---

## 9. Success Criteria

| # | Criterion |
|---|-----------|
| 1 | Every color in the Penpot primitive palette has a corresponding HSL token |
| 2 | Semantic tokens cover all contexts required by shadcn/ui and the design system (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring) |
| 3 | Typography scale covers all sizes observed in Penpot (12px–48px) plus the full requested range (xs–5xl) |
| 4 | Spacing scale has 13 values with no gaps, all multiples of 4px |
| 5 | Border radius has 5 values (sm, md, lg, xl, full) |
| 6 | Shadow tokens include at least 3 elevation levels + 2 state rings |
| 7 | Breakpoint tokens include 4 widths |
| 8 | Z-index tokens include 5 layers |
| 9 | Storybook displays visual references for colors, typography, and spacing |
| 10 | README explains the 3 token layers and provides usage examples |
| 11 | All TypeScript exports are typed with explicit interfaces |
| 12 | Project lint, architecture lint, and build commands exit with code 0 |
