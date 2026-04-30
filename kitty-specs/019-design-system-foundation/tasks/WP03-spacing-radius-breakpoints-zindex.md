---
work_package_id: WP03
title: Spacing, Radius, Breakpoints, Z-Index
dependencies: []
requirement_refs:
- C-003
- C-004
- FR-005
- FR-006
- FR-008
- FR-009
- NFR-003
- NFR-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
created_at: '2026-04-30T12:20:17Z'
subtasks:
- T008
- T009
- T010
- T011
- T012
history: []
authoritative_surface: src/shared/ui/tokens/
execution_mode: code_change
owned_files:
- src/shared/ui/tokens/spacing.ts
- src/shared/ui/tokens/radius.ts
- src/shared/ui/tokens/breakpoints.ts
- src/shared/ui/tokens/z-index.ts
tags: []
agent: "kilocode:minimax-m2.7:fsd-implementer:implementer"
shell_pid: "53382"
---

# WP03 — Spacing, Radius, Breakpoints, Z-Index

## Objective

Create four foundational token modules in `src/shared/ui/tokens/`:
- `spacing.ts` — 4px base grid with 13 values
- `radius.ts` — border radius scale (5 values)
- `breakpoints.ts` — responsive breakpoint widths
- `z-index.ts` — z-index layering scale

These four modules are **independent files** and can be created in parallel.

## Context

These four token categories are foundational scale modules. They follow strict conventions:
- **Spacing**: 4px base grid, no gaps, all values in rem
- **Radius**: Derived from Penpot values (sm=4px, md=8px) plus standard increments (lg=12px, xl=16px, full=9999px)
- **Breakpoints**: Standard responsive widths (sm=640, md=768, lg=1024, xl=1280)
- **Z-index**: Five layers for common UI patterns

All values are either from Penpot (documented) or standard conventions (documented as derived).

## Detailed Guidance Per Subtask

### T008 — Spacing Scale

**Purpose:** Create `spacing.ts` with the complete 4px base grid scale (13 values).

**Steps:**

1. Create `src/shared/ui/tokens/spacing.ts`

2. Define `SpacingScale` interface:
   ```typescript
   interface SpacingScale {
     '1': string;  // 0.25rem (4px)
    '2': string;  // 0.5rem (8px)
    '3': string;  // 0.75rem (12px)
    '4': string;  // 1rem (16px)
    '5': string;  // 1.25rem (20px)
    '6': string;  // 1.5rem (24px)
    '8': string;  // 2rem (32px)
    '10': string; // 2.5rem (40px)
    '12': string; // 3rem (48px)
    '16': string; // 4rem (64px)
    '20': string; // 5rem (80px)
    '24': string; // 6rem (96px)
    '32': string; // 8rem (128px)
  }
   ```

3. Define `spacing` const:
   ```typescript
   const spacing: SpacingScale = {
    '1': '0.25rem',   // 4px — observed in Penpot
    '2': '0.5rem',    // 8px — observed in Penpot
    '3': '0.75rem',   // 12px — observed in Penpot
    '4': '1rem',      // 16px — observed in Penpot
    '5': '1.25rem',   // 20px — derived (4px grid)
    '6': '1.5rem',    // 24px — derived (4px grid)
    '8': '2rem',      // 32px — observed in Penpot
    '10': '2.5rem',   // 40px — derived (4px grid)
    '12': '3rem',     // 48px — derived (4px grid)
    '16': '4rem',     // 64px — observed in Penpot
    '20': '5rem',     // 80px — derived (4px grid)
    '24': '6rem',     // 96px — derived (4px grid)
    '32': '8rem',     // 128px — derived (4px grid)
  };
   ```

4. Note which values were directly observed in Penpot vs. derived to complete the 4px grid

5. Export both interface and const

**Files:**
- `src/shared/ui/tokens/spacing.ts` (new file, ~40 lines)

**Validation:**
- [ ] 13 values present (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128)
- [ ] All values are multiples of 4px (in rem)
- [ ] No gaps in the scale
- [ ] TypeScript compiles without errors

---

### T009 — Border Radius Scale

**Purpose:** Create `radius.ts` with border radius tokens: sm, md, lg, xl, full.

**Steps:**

1. Create `src/shared/ui/tokens/radius.ts`

2. Define `RadiusScale` interface:
   ```typescript
   interface RadiusScale {
    sm: string;   // 0.25rem (4px) — from Penpot rounded
    md: string;   // 0.5rem (8px) — from Penpot rounded-lg
    lg: string;   // 0.75rem (12px) — derived standard increment
    xl: string;   // 1rem (16px) — derived standard increment
    full: string; // 9999px — standard full-round
  }
   ```

3. Define `radius` const:
   ```typescript
   const radius: RadiusScale = {
    sm: '0.25rem',  // 4px — Penpot 'rounded'
    md: '0.5rem',   // 8px — Penpot 'rounded-lg'
    lg: '0.75rem',  // 12px — derived (standard increment)
    xl: '1rem',     // 16px — derived (standard increment)
    full: '9999px', // standard full-round
  };
   ```

4. Export both interface and const

**Files:**
- `src/shared/ui/tokens/radius.ts` (new file, ~20 lines)

**Validation:**
- [ ] All 5 radius keys present (sm, md, lg, xl, full)
- [ ] sm=4px, md=8px match Penpot
- [ ] lg=12px, xl=16px, full=9999px are documented as derived
- [ ] TypeScript compiles without errors

---

### T010 — Responsive Breakpoints

**Purpose:** Create `breakpoints.ts` with responsive breakpoint widths.

**Steps:**

1. Create `src/shared/ui/tokens/breakpoints.ts`

2. Define `Breakpoints` interface:
   ```typescript
   interface Breakpoints {
    sm: string;  // 640px
    md: string;  // 768px
    lg: string;  // 1024px
    xl: string;  // 1280px
  }
   ```

3. Define `breakpoints` const:
   ```typescript
   const breakpoints: Breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  };
   ```

4. These are standard breakpoints used in responsive CSS. Document as standard conventions.

5. Export both interface and const

**Files:**
- `src/shared/ui/tokens/breakpoints.ts` (new file, ~20 lines)

**Validation:**
- [ ] All 4 breakpoint keys present (sm, md, lg, xl)
- [ ] Values are standard responsive widths
- [ ] TypeScript compiles without errors

---

### T011 — Z-Index Scale

**Purpose:** Create `z-index.ts` with the z-index layering scale.

**Steps:**

1. Create `src/shared/ui/tokens/z-index.ts`

2. Define `ZIndexScale` interface:
   ```typescript
   interface ZIndexScale {
    dropdown: number;
    sticky: number;
    modal: number;
    tooltip: number;
    toast: number;
  }
   ```

3. Define `zIndex` const:
   ```typescript
   const zIndex: ZIndexScale = {
    dropdown: 100,
    sticky: 200,
    modal: 300,
    tooltip: 400,
    toast: 500,
  };
   ```

4. These values follow common z-index conventions where higher numbers represent higher stacking layers. Document as standard conventions.

5. Export both interface and const

**Files:**
- `src/shared/ui/tokens/z-index.ts` (new file, ~20 lines)

**Validation:**
- [ ] All 5 z-index keys present (dropdown, sticky, modal, tooltip, toast)
- [ ] Values increase appropriately (dropdown < sticky < modal < tooltip < toast)
- [ ] TypeScript compiles without errors

---

### T012 — Verify All WP03 Modules Compile

**Purpose:** After creating all four modules, verify each one compiles independently and collectively.

**Steps:**

1. Run `npx tsc --noEmit` on each file individually:
   ```bash
   npx tsc --noEmit src/shared/ui/tokens/spacing.ts
   npx tsc --noEmit src/shared/ui/tokens/radius.ts
   npx tsc --noEmit src/shared/ui/tokens/breakpoints.ts
   npx tsc --noEmit src/shared/ui/tokens/z-index.ts
   ```

2. Run full project build: `npm run build`

3. Run lint: `npm run lint`

4. Run architecture lint: `npm run lint:arch`

**Validation:**
- [ ] All four modules compile without errors individually
- [ ] Full project build succeeds
- [ ] Lint passes
- [ ] Architecture lint passes

---

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution worktrees:** Allocated per computed lane from `lanes.json`
- **WP03 is Lane 3** — no dependencies, can parallelize with WP01/WP02

## Parallel Opportunities

**T008, T009, T010, T011 are [P] — fully parallelizable** as independent files. Each module is a separate file with no cross-references.

## Test Strategy

Not explicitly requested. Visual display of spacing, radius, and z-index is covered by WP07 Storybook stories.

## Definition of Done

| # | Criterion |
|---|-----------|
| 1 | `spacing.ts` exports 13 values on 4px grid (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px) |
| 2 | `radius.ts` exports sm=4px, md=8px, lg=12px, xl=16px, full=9999px |
| 3 | `breakpoints.ts` exports sm=640, md=768, lg=1024, xl=1280 |
| 4 | `z-index.ts` exports dropdown=100, sticky=200, modal=300, tooltip=400, toast=500 |
| 5 | All tokens use rem for spacing/radius, px for breakpoints, numbers for z-index |
| 6 | All token names follow kebab-case convention |
| 7 | `npm run build` exits 0 |
| 8 | `npm run lint` exits 0 |
| 9 | `npm run lint:arch` exits 0 |

## Risks

None — all values are either Penpot-documented or standard conventions.

## Reviewer Guidance

Verify that:
1. Spacing scale has no gaps (all 13 values present)
2. All values are multiples of 4px
3. Border radius values match Penpot for sm/md, documented as derived for lg/xl/full
4. Breakpoint values are standard responsive widths
5. Z-index values are in correct stacking order
6. `npm run build` exits 0 after implementation

## Activity Log

- 2026-04-30T12:42:33Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=53382 – Started implementation via action command
