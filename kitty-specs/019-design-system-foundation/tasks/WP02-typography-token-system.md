---
work_package_id: WP02
title: Typography Token System
dependencies:
- WP01
requirement_refs:
- C-003
- C-004
- FR-004
- NFR-002
- NFR-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
created_at: '2026-04-30T12:20:17Z'
subtasks:
- T004
- T005
- T006
- T007
history: []
authoritative_surface: src/shared/ui/tokens/typography.ts
execution_mode: code_change
owned_files:
- src/shared/ui/tokens/typography.ts
tags: []
agent: "kilocode:minimax-m2.7:fsd-implementer:implementer"
shell_pid: "53382"
---

# WP02 — Typography Token System

## Objective

Create `src/shared/ui/tokens/typography.ts` defining the complete typography scale — font family, sizes (xs–5xl), weights, line-heights, letter-spacing — all in rem units with explicit TypeScript interfaces.

## Context

All typography values are extracted from the Penpot design file (extracted 2026-04-30). The spec (Section 4) documents observed font sizes (12px–48px), weights (400, 500), and line-heights. The full requested scale extends these with derived values for completeness.

- Font family: **Noto Sans** (assumed available via project's font-loading strategy)
- All sizes are expressed in **rem** units (not px) per NFR-002
- Font weights 600 and 700 are **derived** (not observed in Penpot) for future component needs, documented as such

## Detailed Guidance Per Subtask

### T004 — Font Family

**Purpose:** Define the `FontFamily` interface and const with 'Noto Sans' as the primary font.

**Steps:**

1. Create `src/shared/ui/tokens/typography.ts`

2. Define `FontFamily` interface:
   ```typescript
   interface FontFamily {
     notoSans: string;
     fallback: string;
   }
   ```

3. Define `fontFamily` const:
   ```typescript
   const fontFamily: FontFamily = {
     notoSans: "'Noto Sans', system-ui, sans-serif",
     fallback: "system-ui, sans-serif",
   };
   ```

4. Export both

**Files:**
- `src/shared/ui/tokens/typography.ts` (new file, ~15 lines)

**Validation:**
- [ ] `fontFamily.notoSans` contains 'Noto Sans'
- [ ] TypeScript compiles without errors

---

### T005 — Typography Size Scale

**Purpose:** Define the complete typography size scale from xs through 5xl in rem units.

**Steps:**

1. In `typography.ts`, define `TypographySizeScale` interface:
   ```typescript
   interface TypographySizeScale {
     xs: string;    // 0.75rem (12px)
     sm: string;    // 0.875rem (14px)
     base: string;  // 1rem (16px)
     lg: string;    // 1.125rem (18px)
     xl: string;    // 1.25rem (20px)
     '2xl': string; // 1.5rem (24px)
     '3xl': string; // 1.875rem (30px)
    '4xl': string; // 2.25rem (36px)
    '5xl': string; // 3rem (48px)
    '6xl': string; // 4.5rem (72px) — derived for completeness
  }
   ```

2. Define `fontSizes` const:
   ```typescript
   const fontSizes: TypographySizeScale = {
     xs: '0.75rem',
     sm: '0.875rem',
     base: '1rem',
     lg: '1.125rem',
     xl: '1.25rem',
     '2xl': '1.5rem',
     '3xl': '1.875rem',
     '4xl': '2.25rem',
     '5xl': '3rem',
     '6xl': '4.5rem',
   };
   ```

3. Note: `2xl` through `5xl` map directly to observed Penpot values. `xs`, `sm`, `base`, `lg`, `xl` are the standard scale. `6xl` is derived for completeness.

**Files:**
- `src/shared/ui/tokens/typography.ts` (update, ~30 additional lines)

**Validation:**
- [ ] All 10 size keys present
- [ ] All values are in rem format
- [ ] TypeScript compiles without errors

---

### T006 — Font Weight, Line-Height, Letter-Spacing Scales

**Purpose:** Define font weight, line-height, and letter-spacing scales.

**Steps:**

1. In `typography.ts`, define `FontWeightScale` interface:
   ```typescript
   interface FontWeightScale {
     normal: number;    // 400
     medium: number;    // 500
     semibold: number;  // 600 (derived)
    bold: number;       // 700 (derived)
  }
   ```

2. Define `LineHeightScale` interface:
   ```typescript
   interface LineHeightScale {
     tight: string;      // 1.0 (observed)
     snug: string;       // 1.11 (observed)
     normal: string;     // 1.2 (observed)
     relaxed: string;    // 1.33 (observed)
     loose: string;      // 1.5 (observed)
  }
   ```

3. Define `fontWeights` const:
   ```typescript
   const fontWeights: FontWeightScale = {
     normal: 400,
     medium: 500,
     semibold: 600,
     bold: 700,
   };
   ```

4. Define `lineHeights` const:
   ```typescript
   const lineHeights: LineHeightScale = {
     tight: '1.0',
     snug: '1.11',
     normal: '1.2',
     relaxed: '1.33',
     loose: '1.5',
   };
   ```

5. Define `letterSpacing` const (observed: 0, not varied):
   ```typescript
   const letterSpacing: string = '0';
   ```

6. Export all interfaces and consts

**Files:**
- `src/shared/ui/tokens/typography.ts` (update, ~40 additional lines)

**Validation:**
- [ ] All font weight keys present (normal, medium, semibold, bold)
- [ ] All line-height keys present (tight, snug, normal, relaxed, loose)
- [ ] `letterSpacing` is '0'
- [ ] TypeScript compiles without errors

---

### T007 — Export Typed Typography Constants

**Purpose:** Ensure all typography exports are properly typed and the module is ready for re-export from `index.ts`.

**Steps:**

1. Verify all interfaces and consts are exported at the bottom of `typography.ts`:
   ```typescript
   export type { FontFamily, TypographySizeScale, FontWeightScale, LineHeightScale };
   export { fontFamily, fontSizes, fontWeights, lineHeights, letterSpacing };
   ```

2. Add a top-level export aggregation if helpful:
   ```typescript
   export interface TypographyTokens {
     fontFamily: FontFamily;
     fontSizes: TypographySizeScale;
     fontWeights: FontWeightScale;
     lineHeights: LineHeightScale;
     letterSpacing: string;
  }
   ```

3. Verify the file compiles independently: `npx tsc --noEmit src/shared/ui/tokens/typography.ts`

**Files:**
- `src/shared/ui/tokens/typography.ts` (update, ~10 additional lines)

**Validation:**
- [ ] All exports are properly typed
- [ ] Module can be imported without errors
- [ ] `npm run build` exits 0

---

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution worktrees:** Allocated per computed lane from `lanes.json`
- **WP02 is Lane 2** — no dependencies, can parallelize with WP01

## Test Strategy

Not explicitly requested in this feature. Typography specimens will be displayed in WP07 Storybook stories.

## Definition of Done

| # | Criterion |
|---|-----------|
| 1 | `typography.ts` exports `FontFamily` with 'Noto Sans' as primary |
| 2 | `fontSizes` covers xs (0.75rem) through 5xl (3rem) plus 6xl (4.5rem) |
| 3 | `fontWeights` includes 400, 500, 600, 700 |
| 4 | `lineHeights` covers tight (1.0) through loose (1.5) |
| 5 | `letterSpacing` is '0' (observed value, not varied) |
| 6 | All values use rem units exclusively (NFR-002) |
| 7 | All exports are typed with explicit interfaces |
| 8 | `npm run build` exits 0 |
| 9 | `npm run lint` exits 0 |
| 10 | `npm run lint:arch` exits 0 |

## Risks

None — all values are documented in spec.md.

## Reviewer Guidance

Verify that:
1. Font sizes cover the full range xs–6xl with correct rem values
2. All font weights 400–700 are present (600 and 700 are derived, documented)
3. All line heights match the values documented in spec.md Section 4
4. Letter-spacing is '0' (not varied in design)
5. All exports are typed
6. `npm run build` exits 0 after implementation

## Activity Log

- 2026-04-30T12:41:02Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=53382 – Started implementation via action command
