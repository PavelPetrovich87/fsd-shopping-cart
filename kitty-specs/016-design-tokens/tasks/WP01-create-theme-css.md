---
work_package_id: WP01
title: Create theme.css with design tokens
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-006
- FR-007
- FR-008
- FR-009
- FR-010
- FR-011
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
history:
- date: '2026-04-17T13:57:10Z'
  action: created
  detail: Work package created
authoritative_surface: src/shared/ui/tokens/
execution_mode: code_change
owned_files:
- src/shared/ui/tokens/theme.css
tags: []
---

# WP01: Create theme.css with design tokens

## Objective

Create `src/shared/ui/tokens/theme.css` containing a Tailwind v4 `@theme` block with all design tokens extracted from Penpot design system. This is the foundation file for the entire design system — all subsequent components (Button, Input, Card, etc.) will consume tokens from this file.

## Context

The Penpot design system has been analyzed and all raw values extracted:

- **14 primitive color tokens**: brand colors, neutral grays, error red
- **22 semantic shadcn/ui tokens**: primary, secondary, destructive, border, etc.
- **Typography**: Noto Sans font family, 10 sizes (12–72px), 4 weights
- **Spacing**: 9 values mapped to Tailwind numeric scale (1, 2, 2.5, 3, 4, 8, 9, 16)
- **Border radius**: 2 values (4px, 8px)

User confirmed: **Include section comments** (`/* === ... === */`) for readability.

## Branch Strategy

**IMPORTANT**: Execution worktrees are allocated per computed lane from `lanes.json`. When implementing this WP:

1. Run `spec-kitty agent action implement WP01 --agent <name>` from the project root
2. The `finalize-tasks` step has already computed the lane and set `branch_name` in the runtime
3. Agent should use the workspace path and branch provided by the lane resolution, NOT assume `main`
4. Do NOT commit directly to `main` during implementation — work in the allocated worktree

---

## Subtasks

### T001: Create directory `src/shared/ui/tokens/`

**Purpose**: Ensure the output directory exists before writing the CSS file.

**Steps**:
1. Create the directory structure: `src/shared/ui/tokens/`
2. No files needed yet — the CSS file is created in T002–T006

**Validation**:
- [ ] Directory `src/shared/ui/tokens/` exists (or is created)

---

### T002: Write primitive color tokens (14 tokens)

**Purpose**: Define raw color values extracted directly from Penpot library colors and shape fills.

**Steps**:
Write these tokens inside the `@theme { ... }` block under a `/* === PRIMITIVE COLOR TOKENS === */` comment:

```css
/* === PRIMITIVE COLOR TOKENS === */
--color-brand-700: #3730a3;
--color-brand-600: #4338ca;
--color-brand-100: #eef2ff;
--color-neutral-950: #0a0a0a;
--color-neutral-900: #171717;
--color-neutral-800: #404040;
--color-neutral-700: #525252;
--color-neutral-600: #737373;
--color-neutral-500: #a3a3a3;
--color-neutral-400: #d4d4d4;
--color-neutral-300: #e5e7eb;
--color-neutral-200: #f5f5f5;
--color-neutral-100: #fafafa;
--color-neutral-50: #ffffff;
--color-error-600: #dc2626;
```

**Source mappings** (for reference):
- `--color-brand-600`: from Penpot "brand" (#4338ca)
- `--color-brand-700`: from Penpot "brand-primary-emphasize" (#3730a3)
- `--color-brand-100`: from Penpot "brand-subtle" / "Badge" (#eef2ff)
- `--color-neutral-950`: from Penpot "Modal, Popup / Tooltip" shape (#0a0a0a)
- `--color-neutral-900`: from Penpot "primary (dark)" (#171717)
- `--color-neutral-800`: derived from --neutral-900 (darker for titles)
- `--color-neutral-700`: from Penpot "secondary" (#525252)
- `--color-neutral-600`: from Penpot "text-hint / text-placeholder" (#737373)
- `--color-neutral-500`: from Penpot "disabled" (#a3a3a3)
- `--color-neutral-400`: from Penpot "Rectangle 9" (#d4d4d4)
- `--color-neutral-300`: from Penpot "secondary" / "tag" (#e5e7eb)
- `--color-neutral-200`: from Penpot "Title" (#f5f5f5)
- `--color-neutral-100`: from Penpot "Cart Control / Input / Content / background" (#fafafa)
- `--color-neutral-50`: from Penpot "White" (#ffffff)
- `--color-error-600`: from Penpot "error" / "text-error" (#dc2626)

**Validation**:
- [ ] All 14 primitive color tokens present with correct hex values
- [ ] No tokens invented beyond this list

---

### T003: Write semantic shadcn color tokens (22 tokens)

**Purpose**: Map primitive tokens to shadcn/ui semantic naming conventions for component consumption.

**Steps**:
Write these tokens inside the `@theme { ... }` block under a `/* === SHADCN SEMANTIC COLOR TOKENS === */` comment:

```css
/* === SHADCN SEMANTIC COLOR TOKENS === */
--background: #ffffff;
--foreground: #171717;
--card: #ffffff;
--card-foreground: #171717;
--popover: #ffffff;
--popover-foreground: #171717;
--primary: #4338ca;
--primary-foreground: #ffffff;
--secondary: #fafafa;
--secondary-foreground: #171717;
--muted: #fafafa;
--muted-foreground: #737373;
--accent: #fafafa;
--accent-foreground: #171717;
--destructive: #dc2626;
--destructive-foreground: #ffffff;
--border: #e5e7eb;
--input: #fafafa;
--ring: #4338ca;
```

**Note**: Some tokens (--card, --popover, --accent) are not explicitly in Penpot but are required by shadcn/ui. They are derived from nearest primitives as documented in spec.md Decision 2.

**Validation**:
- [ ] All 22 semantic tokens present
- [ ] --primary maps to --color-brand-600 (#4338ca)
- [ ] --destructive maps to --color-error-600 (#dc2626)
- [ ] --foreground uses --neutral-900 (#171717)
- [ ] --background uses --neutral-50 (#ffffff)

---

### T004: Write typography tokens (1 family + 10 sizes + 4 weights)

**Purpose**: Define font-related design tokens from Penpot typography library.

**Steps**:
Write these tokens inside the `@theme { ... }` block under a `/* === TYPOGRAPHY TOKENS === */` comment:

```css
/* === TYPOGRAPHY TOKENS === */
--font-family: "Noto Sans", system-ui, sans-serif;
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;
--font-size-4xl: 2.25rem;
--font-size-5xl: 3rem;
--font-size-6xl: 4.5rem;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

**Source mappings**:
- Font family: "Noto Sans" from Penpot (only font specified)
- Font sizes: From Penpot typography library (12px→0.75rem, 14px→0.875rem, etc.)
- Font weights: From Penpot typography (400, 500, 600, 700)

**Out of scope** (not in Penpot, not creating):
- Line height tokens
- Letter-spacing tokens (all values = 0 in Penpot)

**Validation**:
- [ ] Font family is "Noto Sans", system-ui, sans-serif
- [ ] All 10 font sizes present (xs through 6xl)
- [ ] All 4 font weights present (normal, medium, semibold, bold)
- [ ] Font sizes in rem, weights in numeric value (not string)

---

### T005: Write spacing tokens (9 values)

**Purpose**: Define spacing scale derived from Penpot flex layout gaps and shape dimensions.

**Steps**:
Write these tokens inside the `@theme { ... }` block under a `/* === SPACING TOKENS === */` comment:

```css
/* === SPACING TOKENS === */
--spacing-1: 0.25rem;
--spacing-2: 0.5rem;
--spacing-2.5: 0.625rem;
--spacing-3: 0.75rem;
--spacing-4: 1rem;
--spacing-8: 2rem;
--spacing-9: 2.25rem;
--spacing-16: 4rem;
```

**Source mappings** (Penpot px → Tailwind scale → CSS rem):
- 4px → --spacing-1 → 0.25rem
- 8px → --spacing-2 → 0.5rem
- 10px → --spacing-2.5 → 0.625rem
- 12px → --spacing-3 → 0.75rem
- 15px → --spacing-4 → 1rem
- 16px → --spacing-4 → 1rem (same as 15px)
- 32px → --spacing-8 → 2rem
- 36px → --spacing-9 → 2.25rem
- 64px → --spacing-16 → 4rem

**Note**: --spacing-2.5 is non-standard Tailwind but present in actual layouts. Use decimal (0.625rem) not word (2.5).

**Validation**:
- [ ] All 9 spacing values present
- [ ] --spacing-2.5 uses 0.625rem (not "2.5")
- [ ] Values derived from actual Penpot layouts (no invented values)

---

### T006: Write border radius tokens (2 values)

**Purpose**: Define border radius from Penpot token set "2. Radius/Mode 1".

**Steps**:
Write these tokens inside the `@theme { ... }` block under a `/* === RADIUS TOKENS === */` comment:

```css
/* === RADIUS TOKENS === */
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
```

**Source mappings** (from Penpot "2. Radius/Mode 1"):
- "rounded" (4px) → --radius-sm → 0.25rem
- "rounded-lg" (8px) → --radius-md → 0.5rem

**Note**: Only 2 radius tokens in Penpot. Not creating additional radius tokens (no --radius-lg, --radius-xl, etc.).

**Validation**:
- [ ] Both radius tokens present
- [ ] --radius-sm = 0.25rem (4px)
- [ ] --radius-md = 0.5rem (8px)
- [ ] No additional radius tokens created

---

## Complete File Structure

The final `src/shared/ui/tokens/theme.css` should look like:

```css
/* === PRIMITIVE COLOR TOKENS === */
--color-brand-700: #3730a3;
--color-brand-600: #4338ca;
--color-brand-100: #eef2ff;
--color-neutral-950: #0a0a0a;
--color-neutral-900: #171717;
--color-neutral-800: #404040;
--color-neutral-700: #525252;
--color-neutral-600: #737373;
--color-neutral-500: #a3a3a3;
--color-neutral-400: #d4d4d4;
--color-neutral-300: #e5e7eb;
--color-neutral-200: #f5f5f5;
--color-neutral-100: #fafafa;
--color-neutral-50: #ffffff;
--color-error-600: #dc2626;

/* === SHADCN SEMANTIC COLOR TOKENS === */
--background: #ffffff;
--foreground: #171717;
--card: #ffffff;
--card-foreground: #171717;
--popover: #ffffff;
--popover-foreground: #171717;
--primary: #4338ca;
--primary-foreground: #ffffff;
--secondary: #fafafa;
--secondary-foreground: #171717;
--muted: #fafafa;
--muted-foreground: #737373;
--accent: #fafafa;
--accent-foreground: #171717;
--destructive: #dc2626;
--destructive-foreground: #ffffff;
--border: #e5e7eb;
--input: #fafafa;
--ring: #4338ca;

/* === TYPOGRAPHY TOKENS === */
--font-family: "Noto Sans", system-ui, sans-serif;
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;
--font-size-4xl: 2.25rem;
--font-size-5xl: 3rem;
--font-size-6xl: 4.5rem;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* === SPACING TOKENS === */
--spacing-1: 0.25rem;
--spacing-2: 0.5rem;
--spacing-2.5: 0.625rem;
--spacing-3: 0.75rem;
--spacing-4: 1rem;
--spacing-8: 2rem;
--spacing-9: 2.25rem;
--spacing-16: 4rem;

/* === RADIUS TOKENS === */
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
```

**NOTE**: This is a `@theme` block, NOT a `@layer` block. Do NOT wrap in `@layer base` or any other wrapper. Just the raw `@theme { ... }` block with its contents.

---

## Definition of Done

- [ ] File exists at `src/shared/ui/tokens/theme.css`
- [ ] Contains valid `@theme { ... }` block (no `@layer`, no wrapper)
- [ ] All section comments present (PRIMITIVE, SHADCN, TYPOGRAPHY, SPACING, RADIUS)
- [ ] All 14 primitive color tokens present
- [ ] All 22 semantic tokens present
- [ ] All 10 font sizes present (xs–6xl)
- [ ] All 4 font weights present
- [ ] All 9 spacing values present
- [ ] Both border radius tokens present
- [ ] No invented values (all traceable to Penpot)
- [ ] File can be imported in Vite dev server without errors

---

## Risks

None — this is a single CSS file with no logic, no integration points, and no branching complexity.

---

## Reviewer Guidance

When reviewing this WP, verify:

1. **File location**: `src/shared/ui/tokens/theme.css` (not another path)
2. **@theme block**: Single `@theme { ... }` block, no `@layer base` or other wrappers
3. **Token counts**:
   - 14 primitive colors (brand, neutral, error)
   - 22 semantic tokens (background, primary, destructive, etc.)
   - 10 font sizes (xs through 6xl)
   - 4 font weights (normal, medium, semibold, bold)
   - 9 spacing values (1, 2, 2.5, 3, 4, 8, 9, 16)
   - 2 radius values (sm, md)
4. **No invented values**: All hex/rgb values match Penpot exactly
5. **Comments included**: Section headers for each token group
6. **CSS validity**: No syntax errors (property names, values, punctuation)

---

## Implementation Command

After creating the worktree and entering the workspace:

```bash
spec-kitty agent action implement WP01 --agent <name>
```

Where `<name>` is the agent identifier (e.g., `sonnet`, `opus`, `Explore`).

## Activity Log

- 2026-04-17T14:04:53Z – unknown – Ready for review
- 2026-04-17T14:06:39Z – unknown – Review passed
- 2026-04-17T14:07:32Z – unknown – Implementation complete
