---
work_package_id: WP07
title: Token Storybook Stories
dependencies:
- WP05
requirement_refs:
- C-003
- FR-012
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
created_at: '2026-04-30T12:20:17Z'
subtasks:
- T024
- T025
- T026
history: []
authoritative_surface: src/shared/ui/tokens/tokens.stories.tsx
execution_mode: code_change
owned_files:
- src/shared/ui/tokens/tokens.stories.tsx
tags: []
agent: "kilocode:minimax-m2.7:fsd-implementer:implementer"
shell_pid: "53382"
---

# WP07 — Token Storybook Stories

## Objective

Create `src/shared/ui/tokens/tokens.stories.tsx` with Storybook stories that visually display all token categories — color swatches, typography specimens, spacing rulers, radius cards, and shadow samples.

## Context

WP07 creates visual regression stories for the design token system. Stories are written in CSF3 format using `@storybook/react-vite`. Each story category displays tokens visually so designers and developers can verify token values match the Penpot style guide.

WP07 depends on WP05 (index.ts with all re-exports) being complete.

## Detailed Guidance Per Subtask

### T024 — Color Swatch Stories

**Purpose:** Create stories that display color swatches for the primitive palette and semantic tokens.

**Steps:**

1. Create `src/shared/ui/tokens/tokens.stories.tsx`

2. Import tokens from `index.ts`:
   ```typescript
   import type { Meta } from '@storybook/react';
   import { primitiveColors, semanticColors } from './index';

3. Create color swatch component for primitive colors:
   ```typescript
   const PrimitiveColorsStory: Meta<typeof PrimitiveColorsStory> = {
     title: 'Design Tokens/Colors/Primitive',
     component: () => {
       const entries = Object.entries(primitiveColors) as [string, string][];
       return (
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', padding: '2rem' }}>
           {entries.map(([name, hsl]) => (
             <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <div
                 style={{
                   width: '100%',
                   height: '4rem',
                   borderRadius: '0.5rem',
                   backgroundColor: hsl,
                   border: '1px solid hsl(0 0% 90%)',
                 }}
               />
               <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{name}</span>
               <span style={{ fontSize: '0.625rem', color: 'hsl(0 0% 45%)', fontFamily: 'monospace' }}>{hsl}</span>
             </div>
           ))}
         </div>
       );
     },
   };
   ```

4. Create similar story for semantic colors (background, foreground, primary, etc.):
   - Display the color as a swatch
   - Show the token name
   - Show the HSL value
   - Include foreground text on the swatch where appropriate to show contrast

**Files:**
- `src/shared/ui/tokens/tokens.stories.tsx` (new file, ~80 lines for colors section)

**Validation:**
- [ ] Primitive colors story shows all 16 colors
- [ ] Semantic colors story shows all 19 contexts
- [ ] Each swatch has a label with the token name
- [ ] HSL values are displayed

---

### T025 — Typography Specimen Stories

**Purpose:** Create stories showing typography scale — all font sizes and weights.

**Steps:**

1. Add typography stories to `tokens.stories.tsx`:
   ```typescript
   import { fontSizes, fontWeights, lineHeights, fontFamily } from './index';

2. Create typography size story:
   ```typescript
   const TypographySizesStory: Meta<typeof TypographySizesStory> = {
     title: 'Design Tokens/Typography/Sizes',
     component: () => {
       const entries = Object.entries(fontSizes) as [string, string][];
       return (
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
           {entries.map(([name, size]) => (
             <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: '2rem' }}>
               <span style={{ width: '4rem', fontSize: '0.75rem', color: 'hsl(0 0% 45%)' }}>{name}</span>
               <span style={{ fontSize: size, fontFamily: fontFamily.notoSans }}>
                 The quick brown fox jumps over the lazy dog
               </span>
             </div>
           ))}
         </div>
       );
     },
   };
   ```

3. Create font weights story:
   - Display text at each font weight (400, 500, 600, 700)
   - Show the weight name and numeric value

4. Create line heights story:
   - Display the same text at different line heights
   - Show the line height value

**Files:**
- `src/shared/ui/tokens/tokens.stories.tsx` (update, ~60 lines for typography section)

**Validation:**
- [ ] Font sizes story shows all 10 sizes (xs through 6xl)
- [ ] Font weights story shows all 4 weights (400, 500, 600, 700)
- [ ] Typography uses 'Noto Sans' font family
- [ ] Rem values are displayed

---

### T026 — Spacing Rulers, Radius Cards, Shadow Samples

**Purpose:** Create stories showing spacing rulers, radius visual cards, and shadow display samples.

**Steps:**

1. Add spacing ruler story:
   ```typescript
   import { spacing } from './index';

   const SpacingStory: Meta<typeof SpacingStory> = {
     title: 'Design Tokens/Spacing',
     component: () => {
       const entries = Object.entries(spacing) as [string, string][];
       return (
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
           {entries.map(([name, value]) => {
             const px = parseFloat(value) * 16;
             return (
               <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <span style={{ width: '3rem', fontSize: '0.75rem', color: 'hsl(0 0% 45%)' }}>{name}</span>
                 <div
                   style={{
                     width: `${px}px`,
                     height: '1rem',
                     backgroundColor: 'hsl(245 58% 51%)',
                     borderRadius: '2px',
                   }}
                 />
                 <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{value}</span>
               </div>
             );
           })}
         </div>
       );
     },
   };
   ```

2. Add radius story:
   - Show divs with different border radius values applied
   - Each div should be clearly labeled with the radius token name and value

3. Add shadow story:
   - Show divs with each shadow applied
   - Display the shadow name and box-shadow value
   - Use `white` background so shadows are visible

4. Create the default export:
   ```typescript
   export default {
     title: 'Design Tokens',
     parameters: { docs: { description: { component: 'Visual reference for all design tokens' } } },
   };
   ```

**Files:**
- `src/shared/ui/tokens/tokens.stories.tsx` (update, ~80 lines for spacing/radius/shadow section)

**Validation:**
- [ ] Spacing rulers show all 13 values with proportional widths
- [ ] Radius cards show all 5 radius values visually
- [ ] Shadow samples show all 5 shadow tokens with shadows applied
- [ ] All stories are accessible and have descriptive titles

---

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution worktrees:** Allocated per computed lane from `lanes.json`
- **WP07 is Lane 7** — depends on WP05 (index.ts with all re-exports)

## Dependencies

- **WP05** (index.ts) — must be complete before WP07 can reference imports

## Parallel Opportunities

Stories are independent of each other once the framework is set up.

## Test Strategy

Not explicitly requested. Stories themselves are the visual regression test.

## Definition of Done

| # | Criterion |
|---|-----------|
| 1 | Color swatch stories display all 16 primitive colors |
| 2 | Color swatch stories display all 19 semantic color contexts |
| 3 | Typography specimen stories show all font sizes (xs–6xl) |
| 4 | Typography specimen stories show font weights (400, 500, 600, 700) |
| 5 | Spacing rulers show all 13 spacing values with proportional widths |
| 6 | Radius cards show all 5 radius values visually |
| 7 | Shadow samples show all 5 shadow tokens with shadows applied |
| 8 | All stories use CSF3 format compatible with @storybook/react-vite |
| 9 | Stories import from `./index` (aggregated theme) |

## Risks

None — purely visual output with no business logic.

## Reviewer Guidance

Verify that:
1. All token categories are represented in stories
2. Stories visually match the Penpot style guide values
3. Stories use CSF3 format
4. Imports come from `./index` (not individual files directly)
5. Stories have descriptive titles for easy navigation in Storybook

## Activity Log

- 2026-04-30T12:46:03Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=53382 – Started implementation via action command
- 2026-04-30T12:48:09Z – kilocode:minimax-m2.7:fsd-implementer:implementer – shell_pid=53382 – Ready for review: Storybook token stories
