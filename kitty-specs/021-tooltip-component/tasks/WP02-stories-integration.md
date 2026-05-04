---
work_package_id: WP02
title: Stories & Integration
dependencies:
- WP01
requirement_refs:
- FR-002
- FR-005
- FR-006
planning_base_branch: main
merge_target_branch: main
branch_strategy: 'Current branch at workflow start: main. Planning/base branch for this feature: main. Completed changes must merge into main.'
subtasks:
- T003
- T005
- T006
history: []
authoritative_surface: src/shared/ui/
execution_mode: code_change
owned_files:
- src/shared/ui/tooltip/tooltip.stories.tsx
- src/shared/ui/index.ts
tags: []
---

# WP02: Stories & Integration

## Objective

Create Storybook stories for all tooltip positions, integrate the component into the shared UI public API, and pass all quality gates.

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution:** This WP is executed in its own worktree allocated by spec-kitty lanes.
- **Dependencies:** WP01 (component files must exist before stories can import them)

## Context

This WP depends on WP01 being complete. The `src/shared/ui/tooltip/tooltip.tsx` and `src/shared/ui/tooltip/index.ts` files must exist and export the compound component.

**Story-first workflow:** Stories are written in CSF3 format and serve as visual regression guards. Each story must be deterministic and not rely on real network requests.

## Subtasks

### T003: Create `tooltip.stories.tsx`

**Purpose:** Build Storybook stories covering all tooltip positions and use cases.

**Steps:**
1. Create `src/shared/ui/tooltip/tooltip.stories.tsx`
2. Import the Tooltip compound component from `./tooltip` or `./index`
3. Use CSF3 format:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>
```

4. Create the following stories:

   **Story: Default (Top)**
   - Trigger: Button with text "Hover me"
   - Content: "This is a tooltip"
   - Position: default (top)

   **Story: Bottom**
   - Same trigger/content
   - `side="bottom"` on TooltipContent

   **Story: Left**
   - Same trigger/content
   - `side="left"` on TooltipContent

   **Story: Right**
   - Same trigger/content
   - `side="right"` on TooltipContent

   **Story: With Custom Content**
   - Content includes an icon + bold text + regular text
   - Demonstrates React node support (FR-008)

   **Story: Long Text**
   - Content with a longer sentence (~80 chars)
   - Tests text wrapping behavior

5. Add `play` function to Default story for interaction testing:
   - Hover over trigger
   - Verify tooltip appears
   - Move mouse away
   - Verify tooltip disappears

**Files:**
- `src/shared/ui/tooltip/tooltip.stories.tsx` (new, ~120-180 lines)

**Validation:**
- [ ] CSF3 format with `satisfies Meta<typeof Tooltip>`
- [ ] TooltipProvider decorator wraps all stories
- [ ] Stories cover: top, bottom, left, right, custom content, long text
- [ ] `play` function tests hover interaction
- [ ] No real network requests or random data
- [ ] Stories render without errors in Storybook

**Edge Cases:**
- Missing Provider decorator: Radix throws — decorator ensures Provider is always present
- Content overflow: test with long text story

---

### T005: Update `src/shared/ui/index.ts`

**Purpose:** Integrate Tooltip into the shared UI public API.

**Steps:**
1. Open `src/shared/ui/index.ts`
2. Add: `export * from './tooltip'`
3. Ensure no duplicate exports or naming conflicts

**Files:**
- `src/shared/ui/index.ts` (updated, ~1 line added)

**Validation:**
- [ ] Tooltip exports available from `@/shared/ui`
- [ ] No naming conflicts with existing exports
- [ ] `npm run build` passes after update

---

### T006: Run Quality Gates

**Purpose:** Ensure all project quality checks pass.

**Steps:**
1. Run `npm run lint`
   - Fix any ESLint errors in tooltip files
2. Run `npm run lint:arch`
   - Fix any FSD architecture violations (e.g., wrong imports)
3. Run `npm run build`
   - Fix any TypeScript compilation errors
4. If custom Tailwind classes used (e.g., `z-[400]`), verify in built CSS:
   ```bash
   grep 'z-\[400\]' dist/assets/index-*.css
   ```

**Validation:**
- [ ] `npm run lint` exits with code 0
- [ ] `npm run lint:arch` exits with code 0
- [ ] `npm run build` exits with code 0
- [ ] No warnings treated as errors

**Common Issues & Fixes:**
- ESLint: `no-restricted-syntax` violation for `className` → ensure no className prop in tooltip.tsx
- Steiger: cross-slice import → ensure imports are only from `@/shared/ui` or local files
- TypeScript: missing type export → add to index.ts

## Definition of Done

- [ ] All subtasks complete
- [ ] All quality gates pass (lint, lint:arch, build)
- [ ] Tooltip importable from `@/shared/ui`
- [ ] Storybook stories render correctly

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Storybook may not resolve `@/` alias | Low | Verify storybook config matches existing stories |
| Provider decorator may cause double Provider | Low | Check if stories also import Provider manually |

## Reviewer Guidance

- Verify stories cover all 4 positions (top, bottom, left, right)
- Check CSF3 format compliance
- Verify `npm run lint`, `npm run lint:arch`, `npm run build` all pass
- Check that Tooltip is re-exported from `src/shared/ui/index.ts`
