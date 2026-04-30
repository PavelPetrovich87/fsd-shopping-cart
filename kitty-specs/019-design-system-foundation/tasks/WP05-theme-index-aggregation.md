---
work_package_id: WP05
title: Theme Index & TypeScript Aggregation
dependencies:
- WP01
- WP02
- WP03
- WP04
requirement_refs:
- C-003
- FR-010
- FR-014
- NFR-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
created_at: '2026-04-30T12:20:17Z'
subtasks:
- T017
- T018
- T019
- T020
history: []
authoritative_surface: src/shared/ui/tokens/index.ts
execution_mode: code_change
owned_files:
- src/shared/ui/tokens/index.ts
tags: []
agent: "kilocode:minimax-m2.7:fsd-implementer:implementer"
shell_pid: "53382"
---

# WP05 — Theme Index & TypeScript Aggregation

## Objective

Create `src/shared/ui/tokens/index.ts` that re-exports all token modules, defines the combined `Theme` interface, and exports the `theme` aggregation object for programmatic access.

## Context

WP05 is the integration point for all token modules. It depends on WP01–WP04 completing first (all token module files must exist). The `Theme` interface aggregates all token categories so components can import a single `theme` object instead of multiple individual modules.

This WP does NOT create new tokens — it only aggregates and re-exports existing ones.

## Detailed Guidance Per Subtask

### T017 — Define Theme Interface

**Purpose:** Define the `Theme` interface aggregating all token categories.

**Steps:**

1. Create `src/shared/ui/tokens/index.ts`

2. Import all token types from their modules:
   ```typescript
   import type {
     PrimitiveColors,
     SemanticColors,
     ComponentColors,
   } from './colors';
   import type {
     FontFamily,
     TypographySizeScale,
     FontWeightScale,
     LineHeightScale,
   } from './typography';
   import type { SpacingScale } from './spacing';
   import type { RadiusScale } from './radius';
   import type { ShadowScale } from './shadows';
   import type { Breakpoints } from './breakpoints';
   import type { ZIndexScale } from './z-index';
   ```

3. Define the `Theme` interface:
   ```typescript
   export interface Theme {
     colors: {
       primitive: PrimitiveColors;
       semantic: SemanticColors;
       component: ComponentColors;
     };
     typography: {
       fontFamily: FontFamily;
       fontSizes: TypographySizeScale;
       fontWeights: FontWeightScale;
       lineHeights: LineHeightScale;
       letterSpacing: string;
     };
     spacing: SpacingScale;
     radius: RadiusScale;
     shadows: ShadowScale;
     breakpoints: Breakpoints;
     zIndex: ZIndexScale;
   }
   ```

4. Export the `Theme` interface

**Files:**
- `src/shared/ui/tokens/index.ts` (new file, ~35 lines)

**Validation:**
- [ ] `Theme` interface is defined
- [ ] All token categories are included
- [ ] TypeScript compiles without errors

---

### T018 — Create Combined Theme Object

**Purpose:** Create the `theme` const object that aggregates all token consts.

**Steps:**

1. Add imports for all token consts:
   ```typescript
   import {
     primitiveColors,
     semanticColors,
     componentColors,
   } from './colors';
   import {
     fontFamily,
     fontSizes,
     fontWeights,
     lineHeights,
     letterSpacing,
   } from './typography';
   import { spacing } from './spacing';
   import { radius } from './radius';
   import { shadows } from './shadows';
   import { breakpoints } from './breakpoints';
   import { zIndex } from './z-index';
   ```

2. Define the `theme` const object:
   ```typescript
   export const theme: Theme = {
     colors: {
       primitive: primitiveColors,
       semantic: semanticColors,
       component: componentColors,
     },
     typography: {
       fontFamily,
       fontSizes,
       fontWeights,
       lineHeights,
       letterSpacing,
     },
     spacing,
     radius,
     shadows,
     breakpoints,
     zIndex,
   };
   ```

3. Export the `theme` const

**Files:**
- `src/shared/ui/tokens/index.ts` (update, ~30 lines)

**Validation:**
- [ ] `theme` const is defined and exported
- [ ] All token categories are included
- [ ] TypeScript compiles without errors

---

### T019 — Re-Export All Token Modules

**Purpose:** Re-export all individual token modules and types for convenient access.

**Steps:**

1. Add re-exports at the bottom of `index.ts`:
   ```typescript
   export type { PrimitiveColors, SemanticColors, ComponentColors } from './colors';
   export { primitiveColors, semanticColors, componentColors } from './colors';

   export type { FontFamily, TypographySizeScale, FontWeightScale, LineHeightScale } from './typography';
   export { fontFamily, fontSizes, fontWeights, lineHeights, letterSpacing } from './typography';

   export type { SpacingScale } from './spacing';
   export { spacing } from './spacing';

   export type { RadiusScale } from './radius';
   export { radius } from './radius';

   export type { ShadowScale } from './shadows';
   export { shadows } from './shadows';

   export type { Breakpoints } from './breakpoints';
   export { breakpoints } from './breakpoints';

   export type { ZIndexScale } from './z-index';
   export { zIndex } from './z-index';
   ```

2. This allows consumers to either:
   - Import individual token modules: `import { primitiveColors } from '@/shared/ui/tokens'`
   - Import the aggregated theme: `import { theme } from '@/shared/ui/tokens'`

**Files:**
- `src/shared/ui/tokens/index.ts` (update, ~30 lines)

**Validation:**
- [ ] All token modules are re-exported
- [ ] Both types and consts are re-exported
- [ ] TypeScript compiles without errors

---

### T020 — Verify Index.ts Compiles

**Purpose:** Verify `index.ts` compiles without errors and all types resolve correctly.

**Steps:**

1. Run type check: `npx tsc --noEmit src/shared/ui/tokens/index.ts`

2. Verify all imports resolve (no "cannot find module" errors)

3. Run full project build: `npm run build`

4. Run lint: `npm run lint`

5. Run architecture lint: `npm run lint:arch`

**Files:**
- `src/shared/ui/tokens/index.ts` (verification)

**Validation:**
- [ ] All imports resolve
- [ ] `Theme` interface is complete
- [ ] `theme` const is properly typed
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run lint:arch` exits 0

---

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution worktrees:** Allocated per computed lane from `lanes.json`
- **WP05 is Lane 5** — depends on WP01–WP04 (all token modules must exist)

## Dependencies

- **WP01** (colors.ts) — must be complete
- **WP02** (typography.ts) — must be complete
- **WP03** (spacing, radius, breakpoints, z-index) — must be complete
- **WP04** (shadows.ts) — must be complete

## Risks

**Type resolution will fail if any token module has a type error** — must fix upstream first. If WP01–WP04 pass their build checks, WP05 should compile cleanly.

## Test Strategy

Not explicitly requested. The aggregated theme is validated through TypeScript compilation.

## Definition of Done

| # | Criterion |
|---|-----------|
| 1 | `Theme` interface aggregates all 7 token categories |
| 2 | `theme` const object contains all token categories |
| 3 | All individual token modules are re-exported (types + consts) |
| 4 | Components can import `theme` for programmatic access |
| 5 | Components can import individual tokens for tree-shaking |
| 6 | `npm run build` exits 0 |
| 7 | `npm run lint` exits 0 |
| 8 | `npm run lint:arch` exits 0 |

## Reviewer Guidance

Verify that:
1. `Theme` interface includes all token categories (colors, typography, spacing, radius, shadows, breakpoints, zIndex)
2. `theme` const has all properties correctly typed
3. All re-exports are present (both types and values)
4. TypeScript compilation succeeds with no errors
5. `npm run build` exits 0 after implementation

## Activity Log

- 2026-04-30T12:44:52Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=53382 – Started implementation via action command
- 2026-04-30T12:45:39Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=53382 – Ready for review: theme index aggregation
