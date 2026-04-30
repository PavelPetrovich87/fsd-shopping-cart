---
work_package_id: WP01
title: Color Token Foundation
dependencies: []
requirement_refs:
- C-001
- C-003
- C-004
- FR-001
- FR-002
- FR-003
- NFR-001
- NFR-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-019-design-system-foundation
base_commit: 4e2fc7cc62e0bb545ba52df85999f493d90cbd8b
created_at: '2026-04-30T12:39:28.098588+00:00'
subtasks:
- T001
- T002
- T003
shell_pid: '53382'
history: []
authoritative_surface: src/shared/ui/tokens/colors.ts
execution_mode: code_change
owned_files:
- src/shared/ui/tokens/colors.ts
tags: []
---

# WP01 — Color Token Foundation

## Objective

Build the complete color token system at `src/shared/ui/tokens/colors.ts` — primitive palette in HSL, semantic context maps, and component-specific state tokens. This is the foundation for all downstream UI components.

## Context

All primitive color values come from the Penpot design file (extracted 2026-04-30). The spec (Section 4) documents every extracted value with hex → HSL conversion. No values are invented. Derived values are documented as derived in the spec.

The existing `theme.css` already has a partial implementation using hex values — this WP creates the authoritative TypeScript source of truth.

## Detailed Guidance Per Subtask

### T001 — Primitive Color Palette (HSL)

**Purpose:** Create `colors.ts` and export the complete primitive color palette as HSL strings.

**Steps:**

1. Create `src/shared/ui/tokens/colors.ts`

2. Define the `PrimitiveColors` TypeScript interface with all 16 primitive color keys:
   - `brand-700`: `hsl(245 58% 51%)` (#4338ca)
   - `brand-600`: derived from brand (darker)
   - `brand-100`: `hsl(230 100% 97%)` (#eef2ff)
   - `neutral-950`: `hsl(0 0% 4%)` (#0a0a0a)
   - `neutral-900`: `hsl(0 0% 9%)` (#171717)
   - `neutral-800`: `hsl(0 0% 25%)` (#404040)
   - `neutral-700`: `hsl(0 0% 32%)` (#525252)
   - `neutral-600`: `hsl(0 0% 45%)` (#737373)
   - `neutral-500`: `hsl(0 0% 64%)` (#a3a3a3)
   - `neutral-400`: `hsl(0 0% 83%)` (#d4d4d4)
   - `neutral-300`: `hsl(220 9% 89%)` (#e5e7eb)
   - `neutral-200`: `hsl(0 0% 96%)` (#f5f5f5)
   - `neutral-100`: `hsl(0 0% 98%)` (#fafafa)
   - `neutral-50`: `hsl(0 0% 100%)` (#ffffff)
   - `error-600`: `hsl(0 72% 50%)` (#dc2626)
   - `brand-primary-emphasize`: `hsl(244 55% 41%)` (#3730a3)

3. Use exact HSL strings — do NOT convert to other formats. Each entry should look like:
   ```typescript
   brand700: 'hsl(245 58% 51%)',
   ```

4. Define `interface PrimitiveColors` with all 16 keys typed as strings

5. Export `const primitiveColors: PrimitiveColors`

**Files:**
- `src/shared/ui/tokens/colors.ts` (new file, ~50 lines)

**Validation:**
- [ ] All 16 colors are present
- [ ] All values are HSL strings (format: `hsl(H S% L%)`)
- [ ] No hex values in the primitive palette
- [ ] TypeScript compiles without errors

---

### T002 — Semantic Color Token Maps

**Purpose:** Add semantic tokens that map primitive colors to usage contexts (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring).

**Steps:**

1. In `colors.ts`, define `SemanticColors` interface:
   ```typescript
   interface SemanticColors {
     background: string;
     foreground: string;
     card: string;
     cardForeground: string;
     popover: string;
     popoverForeground: string;
     primary: string;
     primaryForeground: string;
     secondary: string;
     secondaryForeground: string;
     muted: string;
     mutedForeground: string;
     accent: string;
     accentForeground: string;
     destructive: string;
     destructiveForeground: string;
     border: string;
     input: string;
     ring: string;
   }
   ```

2. Populate `semanticColors` const mapping each context to an HSL value:
   - `background`: `neutral-50` (white)
   - `foreground`: `neutral-900` (dark)
   - `card`: `neutral-50`
   - `cardForeground`: `neutral-900`
   - `popover`: `neutral-50`
   - `popoverForeground`: `neutral-900`
   - `primary`: `brand-700` (indigo-700)
   - `primaryForeground`: `neutral-50` (white)
   - `secondary`: `neutral-100`
   - `secondaryForeground`: `neutral-900`
   - `muted`: `neutral-100`
   - `mutedForeground`: `neutral-600`
   - `accent`: `neutral-100`
   - `accentForeground`: `neutral-900`
   - `destructive`: `error-600` (red-600)
   - `destructiveForeground`: `neutral-50`
   - `border`: `neutral-300`
   - `input`: `neutral-100`
   - `ring`: `brand-700`

3. Note: Semantic tokens reference primitive tokens by value, not by reference — the HSL strings are duplicated to maintain CSS custom property compatibility.

**Files:**
- `src/shared/ui/tokens/colors.ts` (update, ~40 additional lines)

**Validation:**
- [ ] All 19 semantic color keys are present
- [ ] All values are HSL strings
- [ ] No hex values in semantic tokens
- [ ] TypeScript compiles without errors

---

### T003 — Component Color Tokens

**Purpose:** Add component-specific state tokens for button and input focus/error states.

**Steps:**

1. In `colors.ts`, define `ComponentColors` interface:
   ```typescript
   interface ComponentColors {
     buttonFocusRing: string;
     buttonErrorRing: string;
     inputFocus: string;
     inputError: string;
   }
   ```

2. Populate `componentColors` const:
   - `buttonFocusRing`: `hsl(245 59% 55%)` — indigo focus ring shadow color (used in `0 0 0 4px rgba(68,76,231,0.12)`)
   - `buttonErrorRing`: `hsl(0 72% 50%)` — same as destructive for consistency
   - `inputFocus`: `hsl(245 59% 55%)` — indigo focus (matches button focus)
   - `inputError`: `hsl(0 72% 50%)` — red error (matches destructive)

3. These tokens represent the color *values* used in box-shadow expressions. They allow components to reference the exact color separately from the shadow structure.

**Files:**
- `src/shared/ui/tokens/colors.ts` (update, ~20 additional lines)

**Validation:**
- [ ] All 4 component color keys are present
- [ ] All values are HSL strings
- [ ] TypeScript compiles without errors
- [ ] All exports (PrimitiveColors, semanticColors, componentColors) are accessible from index.ts

---

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution worktrees:** Allocated per computed lane from `lanes.json`
- **WP01 is Lane 1** — no dependencies, implements first

## Test Strategy

Not explicitly requested in this feature. Visual regression is covered by WP07 (Storybook stories).

## Definition of Done

| # | Criterion |
|---|-----------|
| 1 | `colors.ts` exports `PrimitiveColors` interface and `primitiveColors` const with all 16 colors as HSL strings |
| 2 | `colors.ts` exports `SemanticColors` interface and `semanticColors` const with all 19 context mappings as HSL strings |
| 3 | `colors.ts` exports `ComponentColors` interface and `componentColors` const with all 4 state tokens as HSL strings |
| 4 | No hex values appear in any token export |
| 5 | All token names follow kebab-case convention (e.g., `brand700`, `neutral950`) |
| 6 | TypeScript compiles without errors (`npm run build` exits 0) |
| 7 | ESLint passes (`npm run lint` exits 0) |
| 8 | FSD architecture lint passes (`npm run lint:arch` exits 0) |

## Risks

None — all values are fully specified by Penpot.

## Reviewer Guidance

Verify that:
1. Every color in the spec's primitive palette (Section 4) has a corresponding entry
2. All semantic contexts from shadcn/ui design system are covered
3. All HSL strings are correctly formatted
4. No hex values leaked in
5. `npm run build` exits 0 after implementation
