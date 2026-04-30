---
work_package_id: WP06
title: CSS Custom Properties
dependencies:
- WP01
- WP02
- WP03
- WP04
requirement_refs:
- C-002
- C-003
- FR-011
- FR-015
- NFR-001
- NFR-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
created_at: '2026-04-30T12:20:17Z'
subtasks:
- T021
- T022
- T023
history: []
authoritative_surface: src/shared/ui/tokens/theme.css
execution_mode: code_change
owned_files:
- src/shared/ui/tokens/theme.css
tags: []
agent: "kilocode:minimax-m2.7:fsd-implementer:implementer"
shell_pid: "64393"
---

# WP06 — CSS Custom Properties

## Objective

Emit complete CSS custom properties in `src/shared/ui/tokens/theme.css` covering all token categories. Replace the existing partial `theme.css` with a complete version that matches the Penpot design tokens exactly.

## Context

The existing `theme.css` is a partial implementation using hex values. This WP replaces it with a complete `@theme` block containing all CSS custom properties for all token categories.

This WP depends on WP01–WP04 being complete so all token values are available to reference.

## Detailed Guidance Per Subtask

### T021 — Emit Primitive and Semantic Color CSS Variables

**Purpose:** Replace `theme.css` with complete color CSS custom properties.

**Steps:**

1. Read the existing `src/shared/ui/tokens/theme.css` to understand the current structure

2. Create the new `theme.css` with `@theme` block containing all primitive and semantic color tokens

3. Primitive colors (--color-*):
   ```css
   /* === PRIMITIVE COLOR TOKENS === */
   --color-brand-700: hsl(245 58% 51%);
   --color-brand-600: hsl(245 59% 55%);
   --color-brand-100: hsl(230 100% 97%);
   --color-brand-primary-emphasize: hsl(244 55% 41%);
   --color-neutral-950: hsl(0 0% 4%);
   --color-neutral-900: hsl(0 0% 9%);
   --color-neutral-800: hsl(0 0% 25%);
   --color-neutral-700: hsl(0 0% 32%);
   --color-neutral-600: hsl(0 0% 45%);
   --color-neutral-500: hsl(0 0% 64%);
   --color-neutral-400: hsl(0 0% 83%);
   --color-neutral-300: hsl(220 9% 89%);
   --color-neutral-200: hsl(0 0% 96%);
   --color-neutral-100: hsl(0 0% 98%);
   --color-neutral-50: hsl(0 0% 100%);
   --color-error-600: hsl(0 72% 50%);
   ```

4. Semantic colors (--background, --foreground, etc.):
   ```css
   /* === SHADCN SEMANTIC COLOR TOKENS === */
   --background: hsl(0 0% 100%);
   --foreground: hsl(0 0% 9%);
   --card: hsl(0 0% 100%);
   --card-foreground: hsl(0 0% 9%);
   --popover: hsl(0 0% 100%);
   --popover-foreground: hsl(0 0% 9%);
   --primary: hsl(245 58% 51%);
   --primary-foreground: hsl(0 0% 100%);
   --secondary: hsl(0 0% 98%);
   --secondary-foreground: hsl(0 0% 9%);
   --muted: hsl(0 0% 98%);
   --muted-foreground: hsl(0 0% 45%);
   --accent: hsl(0 0% 98%);
   --accent-foreground: hsl(0 0% 9%);
   --destructive: hsl(0 72% 50%);
   --destructive-foreground: hsl(0 0% 100%);
   --border: hsl(220 9% 89%);
   --input: hsl(0 0% 98%);
   --ring: hsl(245 58% 51%);
   ```

5. Use the same naming convention as the existing partial file for compatibility

**Files:**
- `src/shared/ui/tokens/theme.css` (replace existing file, ~50 lines)

**Validation:**
- [ ] All primitive colors present as HSL
- [ ] All semantic colors present as HSL
- [ ] No hex values in color tokens (NFR-001)

---

### T022 — Emit Spacing, Radius, Shadow, Breakpoint, and Z-Index CSS Variables

**Purpose:** Add all remaining token category CSS variables to `theme.css`.

**Steps:**

1. Add spacing variables:
   ```css
   /* === SPACING TOKENS === */
   --spacing-1: 0.25rem;   /* 4px */
   --spacing-2: 0.5rem;    /* 8px */
   --spacing-3: 0.75rem;  /* 12px */
   --spacing-4: 1rem;     /* 16px */
   --spacing-5: 1.25rem;  /* 20px */
   --spacing-6: 1.5rem;   /* 24px */
   --spacing-8: 2rem;     /* 32px */
   --spacing-10: 2.5rem;  /* 40px */
   --spacing-12: 3rem;    /* 48px */
   --spacing-16: 4rem;    /* 64px */
   --spacing-20: 5rem;    /* 80px */
   --spacing-24: 6rem;    /* 96px */
   --spacing-32: 8rem;    /* 128px */
   ```

2. Add radius variables:
   ```css
   /* === RADIUS TOKENS === */
   --radius-sm: 0.25rem;  /* 4px */
   --radius-md: 0.5rem;   /* 8px */
   --radius-lg: 0.75rem;  /* 12px */
   --radius-xl: 1rem;     /* 16px */
   --radius-full: 9999px;
   ```

3. Add shadow variables:
   ```css
   /* === SHADOW TOKENS === */
   --shadow-subtle: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
   --shadow-medium: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
   --shadow-large: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
   --shadow-focus-ring: 0 0 0 4px rgba(68,76,231,0.12);
   --shadow-error-ring: 0 0 0 4px rgba(217,45,32,0.12);
   ```

4. Add breakpoint and z-index (these are typically used in JS/CSS, not CSS custom properties, but include for completeness):
   ```css
   /* === BREAKPOINT TOKENS (reference only — use in JS/CSS media queries) === */
   /* --breakpoint-sm: 640px; */
   /* --breakpoint-md: 768px; */
   /* --breakpoint-lg: 1024px; */
   /* --breakpoint-xl: 1280px; */

   /* === Z-INDEX TOKENS (reference only — use in CSS) === */
   /* --z-dropdown: 100; */
   /* --z-sticky: 200; */
   /* --z-modal: 300; */
   /* --z-tooltip: 400; */
   /* --z-toast: 500; */
   ```

   Note: Breakpoint and z-index tokens are typically used programmatically (JS) or in CSS media queries/notices, not as CSS custom properties. Include as comments for reference documentation.

**Files:**
- `src/shared/ui/tokens/theme.css` (update, ~50 additional lines)

**Validation:**
- [ ] All spacing values present (13 total)
- [ ] All radius values present (5 total)
- [ ] All shadow values present (5 total) with exact Penpot values

---

### T023 — Replace Existing Partial theme.css

**Purpose:** The existing partial `theme.css` must be fully replaced with the complete version.

**Steps:**

1. Verify the new `theme.css` contains ALL tokens from all categories

2. Compare against the existing partial file to ensure no existing token mappings are lost

3. The complete file should have:
   - All primitive colors (16)
   - All semantic colors (19)
   - All spacing values (13)
   - All radius values (5)
   - All shadow values (5)
   - Total: ~38+ CSS custom property declarations

4. Remove any partial/hex-based tokens from the old file

5. Verify the new file is valid CSS (no syntax errors)

**Files:**
- `src/shared/ui/tokens/theme.css` (full replacement)

**Validation:**
- [ ] Existing partial file is fully replaced
- [ ] No hex values remain in color tokens
- [ ] All tokens from all categories are present
- [ ] File is valid CSS syntax

---

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution worktrees:** Allocated per computed lane from `lanes.json`
- **WP06 is Lane 6** — depends on WP01–WP04 (all token values must be available)

## Dependencies

- **WP01** (colors) — must be complete
- **WP02** (typography) — must be complete (typography tokens for CSS)
- **WP03** (spacing, radius, breakpoints, z-index) — must be complete
- **WP04** (shadows) — must be complete

## Risks

Must not lose any existing token mappings — verify complete coverage against spec.md requirements.

## Test Strategy

Not explicitly requested. Visual verification comes from WP07 Storybook stories which consume the CSS.

## Definition of Done

| # | Criterion |
|---|-----------|
| 1 | All primitive color CSS variables present as HSL (16 total) |
| 2 | All semantic color CSS variables present as HSL (19 total) |
| 3 | All spacing CSS variables present (13 total) |
| 4 | All radius CSS variables present (5 total) |
| 5 | All shadow CSS variables present with exact Penpot values (5 total) |
| 6 | No hex values in any CSS custom property |
| 7 | Existing partial `theme.css` is fully replaced |
| 8 | CSS is valid syntax |

## Reviewer Guidance

Verify that:
1. All tokens from all categories are present in `theme.css`
2. All color values are HSL (no hex)
3. Shadow values match Penpot exactly
4. No existing token mappings were lost from the partial file
5. The file uses `@theme` block format consistent with the existing file

## Activity Log

- 2026-04-30T12:45:53Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=64393 – Started implementation via action command
- 2026-04-30T12:47:50Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=64393 – Ready for review: CSS custom properties
- 2026-04-30T12:54:17Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=64393 – Review passed: All 16 primitive + 19 semantic color CSS vars as HSL, 13 spacing, 5 radius, 5 shadow tokens (exact Penpot), typography tokens, breakpoint/z-index comments. No hex. Build passes.
- 2026-04-30T13:28:57Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=64393 – Approved pre-merge, now tracking restored after revert fix.
