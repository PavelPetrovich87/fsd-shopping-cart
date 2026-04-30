---
work_package_id: WP04
title: Shadow Token System
dependencies: []
requirement_refs:
- C-003
- C-005
- FR-007
- NFR-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
created_at: '2026-04-30T12:20:17Z'
subtasks:
- T013
- T014
- T015
- T016
history: []
authoritative_surface: src/shared/ui/tokens/shadows.ts
execution_mode: code_change
owned_files:
- src/shared/ui/tokens/shadows.ts
tags: []
agent: "kilocode:minimax-m2.7:fsd-implementer:implementer"
shell_pid: "53382"
---

# WP04 — Shadow Token System

## Objective

Create `src/shared/ui/tokens/shadows.ts` defining shadow/elevation tokens — generic elevation tokens (`subtle`, `medium`, `large`) and state-specific tokens (`focus-ring`, `error-ring`) — using the exact Penpot values.

## Context

Shadow values are extracted directly from Penpot shapes (button, tooltip, card). The spec (Section 4) documents:
- Button default: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- Button focus-ring: `0 0 0 4px rgba(68,76,231,0.12)`
- Tooltip: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`
- Card/Content: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)`
- Input focus: `0 0 0 1px #444ce7, 0 1px 2px rgba(16,24,40,0.05), 0 0 0 4px rgba(68,76,231,0.12)`
- Input error: `0 0 0 1px #d92d20, 0 0 0 4px rgba(217,45,32,0.12)`

These group into elevation levels and state rings. The grouping is documented in spec.md Decision 4.

## Detailed Guidance Per Subtask

### T013 — Shadow TypeScript Interface

**Purpose:** Define the `ShadowScale` and `ShadowToken` interfaces for `shadows.ts`.

**Steps:**

1. Create `src/shared/ui/tokens/shadows.ts`

2. Define `ShadowToken` type as a string (CSS box-shadow format):
   ```typescript
   type ShadowToken = string;
   ```

3. Define `ShadowScale` interface:
   ```typescript
   interface ShadowScale {
     subtle: ShadowToken;      // Button default — light elevation
     medium: ShadowToken;    // Tooltip — medium elevation
     large: ShadowToken;      // Card/Content — high elevation
     focusRing: ShadowToken;  // Indigo focus ring for buttons/inputs
     errorRing: ShadowToken;  // Red error ring for inputs
   }
   ```

4. Export both types

**Files:**
- `src/shared/ui/tokens/shadows.ts` (new file, ~15 lines)

**Validation:**
- [ ] `ShadowToken` and `ShadowScale` interfaces are defined
- [ ] TypeScript compiles without errors

---

### T014 — Elevation Tokens (subtle, medium, large)

**Purpose:** Define the three elevation shadow tokens mapped from Penpot shapes.

**Steps:**

1. In `shadows.ts`, add `shadows` const:
   ```typescript
   const shadows: ShadowScale = {
     subtle: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
     medium: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
     large: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
     // ... state rings added in T015
   };
   ```

2. Mapping from Penpot:
   - `subtle` = Button default shadow (observed in Penpot)
   - `medium` = Tooltip shadow (observed in Penpot)
   - `large` = Card/Content shadow (observed in Penpot)

3. Preserve the exact values from Penpot — do not round or simplify

**Files:**
- `src/shared/ui/tokens/shadows.ts` (update, ~10 lines)

**Validation:**
- [ ] All three elevation values match Penpot exactly
- [ ] Format is valid CSS box-shadow
- [ ] TypeScript compiles without errors

---

### T015 — State Ring Tokens (focus-ring, error-ring)

**Purpose:** Add the focus-ring and error-ring tokens to the `shadows` const.

**Steps:**

1. Update the `shadows` const to include:
   ```typescript
   const shadows: ShadowScale = {
     subtle: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
     medium: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
     large: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
     focusRing: '0 0 0 4px rgba(68,76,231,0.12)',
     errorRing: '0 0 0 4px rgba(217,45,32,0.12)',
   };
   ```

2. Mapping from Penpot:
   - `focusRing` = Button focus-ring and Input focus (same indigo ring)
   - `errorRing` = Input error ring (red)

3. Note: The focus ring color `rgba(68,76,231,0.12)` is the indigo tint used in the design. The state ring tokens are separate from elevation tokens because they are used for `:focus` and `:error` states, not elevation.

**Files:**
- `src/shared/ui/tokens/shadows.ts` (update, ~5 lines)

**Validation:**
- [ ] `focusRing` value matches `0 0 0 4px rgba(68,76,231,0.12)` (Penpot)
- [ ] `errorRing` value matches `0 0 0 4px rgba(217,45,32,0.12)` (Penpot)
- [ ] TypeScript compiles without errors
- [ ] All 5 shadow tokens are exported

---

### T016 — Verify Shadows Compile

**Purpose:** Verify `shadows.ts` compiles without errors and all exports are correct.

**Steps:**

1. Run type check: `npx tsc --noEmit src/shared/ui/tokens/shadows.ts`

2. Verify exports at bottom of file:
   ```typescript
   export type { ShadowToken, ShadowScale };
   export { shadows };
   ```

3. Run full project build: `npm run build`

4. Run lint: `npm run lint`

5. Run architecture lint: `npm run lint:arch`

**Files:**
- `src/shared/ui/tokens/shadows.ts` (update, exports verification)

**Validation:**
- [ ] All exports are correct
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run lint:arch` exits 0

---

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution worktrees:** Allocated per computed lane from `lanes.json`
- **WP04 is Lane 4** — no dependencies, can parallelize with WP01–WP03

## Test Strategy

Not explicitly requested. Shadow display is covered by WP07 Storybook stories.

## Definition of Done

| # | Criterion |
|---|-----------|
| 1 | `shadows.ts` exports `ShadowToken` type and `ShadowScale` interface |
| 2 | `subtle` maps to button default shadow |
| 3 | `medium` maps to tooltip shadow |
| 4 | `large` maps to card/content shadow |
| 5 | `focusRing` maps to indigo `0 0 0 4px rgba(68,76,231,0.12)` |
| 6 | `errorRing` maps to red `0 0 0 4px rgba(217,45,32,0.12)` |
| 7 | All shadow values preserve exact Penpot values (C-005) |
| 8 | `npm run build` exits 0 |
| 9 | `npm run lint` exits 0 |
| 10 | `npm run lint:arch` exits 0 |

## Risks

None — all shadow values are directly extracted from Penpot.

## Reviewer Guidance

Verify that:
1. All 5 shadow values match Penpot exactly (no rounding or simplification)
2. `focusRing` matches `0 0 0 4px rgba(68,76,231,0.12)` from spec.md
3. `errorRing` matches `0 0 0 4px rgba(217,45,32,0.12)` from spec.md
4. Elevation tokens use the correct Penpot mappings (subtle→button, medium→tooltip, large→card)
5. `npm run build` exits 0 after implementation

## Activity Log

- 2026-04-30T12:43:34Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=53382 – Started implementation via action command
- 2026-04-30T12:44:36Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=53382 – Ready for review: shadow token system
