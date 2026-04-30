---
work_package_id: WP08
title: README Documentation
dependencies: []
requirement_refs:
- C-003
- FR-013
- NFR-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-019-design-system-foundation
base_commit: 4e2fc7cc62e0bb545ba52df85999f493d90cbd8b
created_at: '2026-04-30T12:48:22.451854+00:00'
subtasks:
- T027
shell_pid: '53382'
history: []
authoritative_surface: src/shared/ui/tokens/README.md
execution_mode: code_change
owned_files:
- src/shared/ui/tokens/README.md
tags: []
---

# WP08 — README Documentation

## Objective

Create `src/shared/ui/tokens/README.md` documenting the three-layer token architecture, naming conventions, and usage examples for both TypeScript modules and CSS custom properties.

## Context

The README is the developer-facing documentation for the design token system. It should enable a developer to understand:
1. The three-layer token taxonomy (primitive, semantic, component)
2. Naming conventions (kebab-case, category-purpose-variant)
3. How to consume tokens in TypeScript components
4. How to use CSS custom properties from `theme.css`

## Detailed Guidance Per Subtask

### T027 — Write README Documentation

**Purpose:** Create comprehensive README documenting token layers, naming conventions, and usage.

**Steps:**

1. Create `src/shared/ui/tokens/README.md`

2. Document the three-layer token taxonomy:
   ```markdown
   ## Token Layers

   This design token system uses a three-layer architecture:

   ### 1. Primitive Tokens
   Raw, context-free design values. These are the source of truth for all derived tokens.

   Example: `brand-700: hsl(245 58% 51%)` — the raw indigo color

   ### 2. Semantic Tokens
   Contextual mappings of primitive tokens to usage contexts.

   Example: `primary: brand-700` — maps the brand color to the primary action context

   ### 3. Component Tokens
   Widget-specific tokens for component states.

   Example: `button-focus-ring` — the indigo focus ring shadow used on buttons
   ```

3. Document naming conventions:
   ```markdown
   ## Naming Conventions

   All token names follow `category-purpose-variant` kebab-case format:

   - **Category**: color, typography, spacing, radius, shadow, breakpoint, z-index
   - **Purpose**: descriptive context (primary, background, foreground)
   - **Variant**: optional modifier (sm, md, lg, full)

   Examples:
   - `color-brand-700` — brand color at 700 intensity
   - `color-neutral-950` — neutral color at 950 intensity
   - `spacing-4` — 4rem spacing (4 × 16px base)
   - `radius-sm` — small border radius (4px)
   ```

4. Document TypeScript usage:
   ```markdown
   ## TypeScript Usage

   Import individual token modules:

   ```typescript
   import { primitiveColors, semanticColors } from '@/shared/ui/tokens';
   import { spacing } from '@/shared/ui/tokens';
   import { fontSizes, fontWeights } from '@/shared/ui/tokens';

   // Use in styled components or inline styles
   const buttonStyle = {
     backgroundColor: semanticColors.primary,
     padding: spacing['4'],
     fontSize: fontSizes.sm,
   };
   ```

   Or import the aggregated theme object:

   ```typescript
   import { theme } from '@/shared/ui/tokens';

   // Access all tokens through the theme object
   const buttonStyle = {
     backgroundColor: theme.colors.semantic.primary,
     padding: theme.spacing['4'],
   };
   ```
   ```

5. Document CSS custom property usage:
   ```markdown
   ## CSS Custom Property Usage

   Import `theme.css` in your application entry point:

   ```typescript
   // main.tsx or App.tsx
   import '@/shared/ui/tokens/theme.css';
   ```

   Use CSS custom properties in your styles:

   ```css
   .button {
     background-color: var(--primary);
     padding: var(--spacing-4);
     font-size: var(--font-size-sm);
     border-radius: var(--radius-md);
     box-shadow: var(--shadow-subtle);
   }
   ```

6. Document which values are Penpot-derived vs. derived:
   ```markdown
   ## Value Sources

   **Penpot-extracted values** (exact):
   - All primitive colors from the Penpot style guide
   - Button, tooltip, card, and input shadow values
   - Border radius sm (4px) and md (8px)

   **Derived values** (standard conventions):
   - Spacing: 20, 24, 40, 48, 80, 96, 128px (4px grid)
   - Border radius: lg (12px), xl (16px), full (9999px)
   - Font weights: 600, 700 (added for future component needs)
   - Z-index scale (standard layering conventions)
   ```

7. Document the module structure:
   ```markdown
   ## File Structure

   ```
   src/shared/ui/tokens/
   ├── colors.ts        # Primitive + semantic color tokens
   ├── typography.ts   # Font sizes, weights, families
   ├── spacing.ts       # Spacing scale (4px grid)
   ├── radius.ts       # Border radius tokens
   ├── shadows.ts      # Shadow/elevation tokens
   ├── breakpoints.ts  # Responsive breakpoint widths
   ├── z-index.ts      # Z-index layering scale
   ├── index.ts        # Theme aggregation + re-exports
   ├── theme.css       # CSS custom properties
   └── README.md        # This file
   ```
   ```

**Files:**
- `src/shared/ui/tokens/README.md` (new file, ~120 lines)

**Validation:**
- [ ] README explains all three token layers with examples
- [ ] Naming conventions are documented
- [ ] TypeScript import examples are provided
- [ ] CSS custom property usage is documented
- [ ] Value sources (Penpot vs. derived) are noted
- [ ] File structure is documented

---

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution worktrees:** Allocated per computed lane from `lanes.json`
- **WP08 is Lane 8** — no dependencies (can run independently)

## Dependencies

None (independent)

## Test Strategy

Not applicable — documentation only.

## Definition of Done

| # | Criterion |
|---|-----------|
| 1 | README explains primitive, semantic, and component token layers with examples |
| 2 | Naming conventions (kebab-case, category-purpose-variant) are documented |
| 3 | TypeScript import examples are provided (individual modules and theme object) |
| 4 | CSS custom property usage with `theme.css` is documented |
| 5 | Value sources (Penpot-derived vs. standard conventions) are noted |
| 6 | File structure is documented |
| 7 | README is readable and accessible to developers |

## Risks

None — documentation only.

## Reviewer Guidance

Verify that:
1. All three token layers are clearly explained
2. Naming conventions are documented with examples
3. Code examples are correct and usable
4. File structure matches the actual output structure
5. The README is helpful for onboarding developers
