# Tasks — 019-design-system-foundation

**Feature:** 019-design-system-foundation
**Generated:** 2026-04-30T12:20:17Z
**Branch:** main → main
**Mission slug:** 019-design-system-foundation

---

## Subtask Index

| ID | Description | WP | Parallel | Status |
|----|-------------|-----|----------|--------|
| T001 | Create colors.ts — primitive color palette in HSL | WP01 | | [D] |
| T002 | Add semantic color token maps (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring) | WP01 | | [D] |
| T003 | Add component color tokens (button-focus-ring, button-error-ring, input-focus, input-error) | WP01 | | [D] |
| T004 | Create typography.ts — font family and TypeScript interface | WP02 | | [D] |
| T005 | Define typography size scale (xs through 5xl in rem) | WP02 | | [D] |
| T006 | Define font weight, line-height, and letter-spacing scales | WP02 | | [D] |
| T007 | Export typed typography constants and interfaces | WP02 | | [D] |
| T008 | Create spacing.ts — 4px base grid scale (13 values: 4–128px) | WP03 | [P] | [ ] |
| T009 | Create radius.ts — border radius scale (sm, md, lg, xl, full) | WP03 | [P] | [ ] |
| T010 | Create breakpoints.ts — responsive breakpoints (sm=640, md=768, lg=1024, xl=1280) | WP03 | [P] | [ ] |
| T011 | Create z-index.ts — z-index scale (dropdown, sticky, modal, tooltip, toast) | WP03 | [P] | [ ] |
| T012 | Verify all WP03 token modules compile without errors | WP03 | | [ ] |
| T013 | Create shadows.ts — shadow TypeScript interface | WP04 | | [ ] |
| T014 | Define elevation tokens (subtle, medium, large) from Penpot | WP04 | | [ ] |
| T015 | Define state ring tokens (focus-ring, error-ring) from Penpot | WP04 | | [ ] |
| T016 | Verify shadows.ts exports with correct types and compiles | WP04 | | [ ] |
| T017 | Define Theme interface aggregating all token categories | WP05 | | [ ] |
| T018 | Create combined theme object with all token re-exports | WP05 | | [ ] |
| T019 | Export Theme interface and theme constant from index.ts | WP05 | | [ ] |
| T020 | Verify index.ts compiles and all types resolve correctly | WP05 | | [ ] |
| T021 | Emit all primitive and semantic CSS custom properties in theme.css | WP06 | | [ ] |
| T022 | Emit spacing, radius, shadow, breakpoint, and z-index CSS variables | WP06 | | [ ] |
| T023 | Replace existing partial theme.css with complete token CSS | WP06 | | [ ] |
| T024 | Create tokens.stories.tsx with color swatch stories | WP07 | | [ ] |
| T025 | Add typography specimen stories (font sizes, weights, families) | WP07 | | [ ] |
| T026 | Add spacing rulers and radius/shadow visual display stories | WP07 | | [ ] |
| T027 | Write README.md documenting token layers, naming conventions, usage | WP08 | | [ ] |

---

## Work Packages

### WP01 — Color Token Foundation

**Goal:** Build the complete color token system — primitive palette in HSL, semantic context maps, and component-specific state tokens.

**Priority:** P0 (foundation — unblocks all UI work)

**Success Criteria:**
- [x] T001: colors.ts exports `PrimitiveColors` interface and `primitiveColors` const with all 16 colors as HSL strings
- [x] T002: semantic color map covers all shadcn/ui contexts (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring)
- [x] T003: component tokens for button/input focus and error rings are present

**Implementation Sketch:**
1. Create `src/shared/ui/tokens/colors.ts`
2. Define `PrimitiveColors` TypeScript interface
3. Populate `primitiveColors` const with all Penpot-extracted colors as HSL strings (see spec.md Section 4)
4. Add `SemanticColors` interface mapping contextual keys to HSL values
5. Add `ComponentColors` interface for widget-specific state tokens
6. Export all interfaces and consts

**Dependencies:** None

**Risks:** None — colors are fully specified by Penpot

**Estimated Prompt Size:** ~250 lines

**Prompt File:** `tasks/WP01-color-token-foundation.md`

---

### WP02 — Typography Token System

**Goal:** Define the complete typography scale — font family, sizes (xs–5xl), weights, line-heights, letter-spacing — all in rem units with explicit TypeScript interfaces.

**Priority:** P0 (foundation — unblocks all UI work)

**Success Criteria:**
- [x] T004: `typography.ts` exports `FontFamily` with 'Noto Sans' as primary
- [x] T005: typography size scale covers xs (0.75rem) through 5xl (3rem)
- [x] T006: weights include 400, 500, 600, 700; line-heights are provided; letter-spacing is 0
- [x] T007: All typography constants are typed and exported

**Implementation Sketch:**
1. Create `src/shared/ui/tokens/typography.ts`
2. Define `FontFamily` interface and `fontFamily` const
3. Define `TypographySizeScale` interface and `fontSizes` const
4. Define `FontWeightScale` interface and `fontWeights` const
5. Define `LineHeightScale` and `LetterSpacing` consts
6. Export all interfaces and consts

**Dependencies:** None (independent of WP01)

**Parallel Opportunities:** [P] — typography.ts is independent of colors.ts

**Risks:** None — all values are documented in spec.md Section 4

**Estimated Prompt Size:** ~350 lines

**Prompt File:** `tasks/WP02-typography-token-system.md`

---

### WP03 — Spacing, Radius, Breakpoints, Z-Index

**Goal:** Create four foundational token modules — spacing (4px grid), radius (border scale), breakpoints (responsive widths), and z-index (layering).

**Priority:** P0 (foundation — unblocks all UI work)

**Success Criteria:**
- [ ] T008: spacing.ts exports 13 values on 4px grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
- [ ] T009: radius.ts exports sm=4px, md=8px, lg=12px, xl=16px, full=9999px
- [ ] T010: breakpoints.ts exports sm=640, md=768, lg=1024, xl=1280
- [ ] T011: z-index.ts exports dropdown, sticky, modal, tooltip, toast
- [ ] T012: All four modules compile without errors

**Implementation Sketch:**
1. Create `src/shared/ui/tokens/spacing.ts` — `SpacingScale` interface + `spacing` const
2. Create `src/shared/ui/tokens/radius.ts` — `RadiusScale` interface + `radius` const
3. Create `src/shared/ui/tokens/breakpoints.ts` — `Breakpoints` interface + `breakpoints` const
4. Create `src/shared/ui/tokens/z-index.ts` — `ZIndexScale` interface + `zIndex` const
5. Verify each module independently

**Dependencies:** None (all independent foundational tokens)

**Parallel Opportunities:** [P] — all four modules are independent files and can be created in parallel

**Risks:** Low — all values are standard conventions or fully documented in spec.md

**Estimated Prompt Size:** ~400 lines

**Prompt File:** `tasks/WP03-spacing-radius-breakpoints-zindex.md`

---

### WP04 — Shadow Token System

**Goal:** Define shadow/elevation tokens — subtle, medium, large for elevation; focus-ring and error-ring for state — from Penpot values.

**Priority:** P1 (needed after colors/spacing, before component integration)

**Success Criteria:**
- [ ] T013: shadows.ts exports `ShadowScale` interface
- [ ] T014: `subtle` maps to button default shadow, `medium` to tooltip shadow, `large` to card/content shadow
- [ ] T015: `focus-ring` maps to indigo focus ring, `error-ring` maps to red error ring
- [ ] T016: shadows.ts compiles without errors

**Implementation Sketch:**
1. Create `src/shared/ui/tokens/shadows.ts`
2. Define `ShadowToken` and `ShadowScale` interfaces
3. Populate `shadows` const with five shadow tokens using exact Penpot values (see spec.md Section 4)
4. Use CSS-compatible box-shadow string format for each token

**Dependencies:** None (independent)

**Parallel Opportunities:** [P] — shadows.ts is independent of other WP03 files

**Risks:** None — all shadow values are extracted directly from Penpot

**Estimated Prompt Size:** ~300 lines

**Prompt File:** `tasks/WP04-shadow-token-system.md`

---

### WP05 — Theme Index & TypeScript Aggregation

**Goal:** Create `index.ts` that re-exports all token modules, defines the combined `Theme` interface, and exports the `theme` aggregation object.

**Priority:** P1 (depends on all token modules being complete)

**Success Criteria:**
- [ ] T017: `Theme` interface aggregates `PrimitiveColors`, `SemanticColors`, `ComponentColors`, typography, spacing, radius, shadows, breakpoints, z-index
- [ ] T018: `theme` const object contains all five token categories
- [ ] T019: index.ts re-exports all individual token modules and the Theme interface
- [ ] T020: index.ts compiles without errors

**Implementation Sketch:**
1. Create `src/shared/ui/tokens/index.ts`
2. Import and re-export all token modules (colors, typography, spacing, radius, shadows, breakpoints, z-index)
3. Define `Theme` interface combining all token categories
4. Create `theme` const object
5. Verify compilation

**Dependencies:** WP01, WP02, WP03, WP04 (all token modules must exist)

**Risks:** Type resolution will fail if any token module has a type error — must fix upstream first

**Estimated Prompt Size:** ~300 lines

**Prompt File:** `tasks/WP05-theme-index-aggregation.md`

---

### WP06 — CSS Custom Properties

**Goal:** Emit complete CSS custom properties in `theme.css` covering all token categories. Replace the existing partial `theme.css`.

**Priority:** P1 (CSS is needed for runtime theming; must replace existing file)

**Success Criteria:**
- [ ] T021: All primitive and semantic color CSS variables are present (--color-*, --background, --foreground, etc.)
- [ ] T022: Spacing, radius, shadow, breakpoint, and z-index CSS variables are present
- [ ] T023: The existing partial theme.css is replaced with the complete version

**Implementation Sketch:**
1. Read the existing `src/shared/ui/tokens/theme.css`
2. Replace it with a complete `@theme { ... }` block containing all CSS custom properties
3. Use the same `--*` naming convention as the existing partial file for compatibility
4. Ensure all tokens from all categories are included

**Dependencies:** WP01, WP02, WP03, WP04

**Risks:** Must not lose any existing token mappings — verify complete coverage against spec.md requirements

**Estimated Prompt Size:** ~300 lines

**Prompt File:** `tasks/WP06-css-custom-properties.md`

---

### WP07 — Token Storybook Stories

**Goal:** Create `tokens.stories.tsx` that visually displays all token categories — color swatches, typography specimens, spacing rulers, radius cards, and shadow samples.

**Priority:** P2 (documentation/verification — needed for visual regression)

**Success Criteria:**
- [ ] T024: Color swatch stories for primitive palette and semantic tokens
- [ ] T025: Typography specimen stories showing all font sizes and weights
- [ ] T026: Spacing rulers, radius visual cards, and shadow display samples

**Implementation Sketch:**
1. Create `src/shared/ui/tokens/tokens.stories.tsx`
2. Import all token exports from `index.ts`
3. Create CSF3 stories for each category:
   - `ColorsStories` — grid of colored swatches with labels
   - `TypographyStories` — font size specimens with labels showing rem values
   - `SpacingStories` — visual rulers showing spacing values
   - `RadiusStories` — rounded div cards
   - `ShadowStories` — div cards with shadow applied
4. Export stories from the file

**Dependencies:** WP05 (requires `index.ts` re-exports)

**Parallel Opportunities:** [P] — story files are independent

**Risks:** None — purely visual output; no business logic

**Estimated Prompt Size:** ~350 lines

**Prompt File:** `tasks/WP07-token-storybook-stories.md`

---

### WP08 — README Documentation

**Goal:** Write the token README documenting the three-layer architecture, naming conventions, and usage examples for both TypeScript and CSS custom properties.

**Priority:** P2 (documentation — important for developer handoff)

**Success Criteria:**
- [ ] T027: README explains primitive, semantic, and component token layers with examples

**Implementation Sketch:**
1. Create `src/shared/ui/tokens/README.md`
2. Document the three-layer token taxonomy
3. Show TypeScript import examples for each token category
4. Show CSS custom property usage examples
5. Document naming conventions (kebab-case, category-purpose-variant)
6. Note which values are Penpot-derived vs. derived from standard conventions

**Dependencies:** All token files

**Risks:** None

**Estimated Prompt Size:** ~150 lines

**Prompt File:** `tasks/WP08-readme-documentation.md`

---

## Summary

| WP | Title | Subtasks | Estimated Lines | Priority |
|----|-------|----------|-----------------|----------|
| WP01 | Color Token Foundation | T001–T003 (3) | ~250 | P0 |
| WP02 | Typography Token System | T004–T007 (4) | ~350 | P0 |
| WP03 | Spacing, Radius, Breakpoints, Z-Index | T008–T012 (5) | ~400 | P0 |
| WP04 | Shadow Token System | T013–T016 (4) | ~300 | P1 |
| WP05 | Theme Index & TypeScript Aggregation | T017–T020 (4) | ~300 | P1 |
| WP06 | CSS Custom Properties | T021–T023 (3) | ~300 | P1 |
| WP07 | Token Storybook Stories | T024–T026 (3) | ~350 | P2 |
| WP08 | README Documentation | T027 (1) | ~150 | P2 |

**Total:** 27 subtasks across 8 work packages

**MVP Scope:** WP01–WP04 (all P0/P1 foundational token modules)
