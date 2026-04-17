# Implementation Plan: 016-design-tokens

**Branch**: `main` | **Date**: 2026-04-17 | **Spec**: `kitty-specs/016-design-tokens/spec.md`

---

## Summary

Create a single CSS file at `src/shared/ui/tokens/theme.css` containing a Tailwind v4 `@theme` block with all design tokens extracted from Penpot design system. Tokens cover: 14 primitive colors, 22 semantic shadcn/ui colors, 10 font sizes, 4 font weights, 9 spacing values, and 2 border radius values. All values trace directly to Penpot with no invented data.

---

## Branch Strategy

Current branch at workflow start: `main`  
Planning/base branch for this feature: `main`  
Final merge target for completed changes: `main`  
`branch_matches_target`: **true** ✓

All changes commit directly to `main`.

---

## Technical Context

### Feature Overview

Create a single CSS file at `src/shared/ui/tokens/theme.css` containing a Tailwind v4 `@theme` block with all design tokens extracted from Penpot design system. Tokens cover:

- **Colors**: 14 primitive tokens + 22 semantic shadcn/ui tokens
- **Typography**: 1 font family, 10 font sizes, 4 font weights
- **Spacing**: 9 values mapped to Tailwind numeric scale
- **Border radius**: 2 values (--radius-sm, --radius-md)

### Extracted Values Summary

| Category | Count | Source |
|----------|-------|--------|
| Primitive colors | 14 | Penpot library colors & shape fills |
| Semantic colors | 22 | shadcn/ui mapping |
| Font sizes | 10 | Penpot typography (12–72px) |
| Font weights | 4 | Penpot typography (400, 500, 600, 700) |
| Spacing values | 9 | Penpot flex layout gaps |
| Border radius | 2 | Penpot token set "2. Radius/Mode 1" |

### Output File

- **Path**: `src/shared/ui/tokens/theme.css`
- **Format**: Single `@theme { ... }` block
- **Comments**: Section headers included (`/* === ... === */`)
- **No invented values**: All tokens traceable to Penpot exact hex/rgb values

### Constraints

| Constraint | Value |
|------------|-------|
| Output file | `src/shared/ui/tokens/theme.css` |
| All tokens in single @theme block | Yes |
| No @layer block | Yes |
| Tailwind v4 compatible | Yes |
| shadcn/ui semantic token names | Yes |
| Comments included | Yes (Option A confirmed by user) |

### Out of Scope

- Shadow tokens (none found in Penpot)
- Line height tokens (not specified in Penpot)
- Letter-spacing tokens (all values = 0 in Penpot)
- Component implementation (T-019 Button Component)

---

## Charter Check

**Status**: Skipped — No charter.md found at `.kittify/charter/charter.md`.

---

## Gates

| Gate | Status | Notes |
|------|--------|-------|
| Spec validated (requirements.md) | ✓ PASS | All 11 FR + 6 NFR + 3 C verified |
| No outstanding clarifications | ✓ PASS | User confirmed: use comments (Option A) |
| Branch strategy confirmed | ✓ PASS | Direct commit to main |

---

## Project Structure

### Implementation Artifacts

```
kitty-specs/016-design-tokens/
├── spec.md              # Specification (already created)
├── requirements.md      # Validation checklist (already created)
├── plan.md              # This file (created by /spec-kitty.plan)
└── meta.json            # Mission identity (already created)
```

### Source Code Output

```
src/shared/ui/tokens/
└── theme.css    # Single @theme block with all design tokens
```

---

## Planning Questions Summary

| # | Question | Why It Matters | Answer |
|---|----------|----------------|--------|
| 1 | Comments in @theme block? | Readability vs clean output | **A) With comments** — Section headers for each token group |

**All questions answered. No further interrogation needed.**

---

## Engineering Alignment

Create `src/shared/ui/tokens/theme.css` with a commented `@theme` block containing:

- 14 primitive color tokens (--color-brand-*, --color-neutral-*, --color-error-*)
- 22 semantic shadcn tokens (--primary, --background, --foreground, etc.)
- 10 font sizes (--font-size-xs through --font-size-6xl)
- 4 font weights (--font-weight-normal/semibold etc.)
- 9 spacing values (--spacing-1 through --spacing-16)
- 2 border radius (--radius-sm, --radius-md)

All derived from exact Penpot hex/rgb values. Comments included per user preference.

---

## Complexity Assessment

**Trivial** — Single CSS file, no logic, no integration points. No research phase required.