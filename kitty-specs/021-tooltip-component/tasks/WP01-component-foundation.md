---
work_package_id: WP01
title: Component Foundation
dependencies: []
requirement_refs:
- FR-001
- FR-003
- FR-004
- FR-007
- FR-008
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T001
- T002
- T004
history: []
authoritative_surface: src/shared/ui/tooltip/
execution_mode: code_change
owned_files:
- src/shared/ui/tooltip/tooltip.tsx
- src/shared/ui/tooltip/index.ts
- package.json
- package-lock.json
tags: []
agent: "kilo:kimi-for-coding::implementer"
shell_pid: "5702"
---

# WP01: Component Foundation

## Objective

Install `@radix-ui/react-tooltip`, implement the Tooltip compound component with design tokens, and expose the public API.

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution:** This WP is executed in its own worktree allocated by spec-kitty lanes.

## Context

This is **T-022: Tooltip Component** from the Shopping Cart design system. The tooltip is a shared UI component used across all FSD layers. It must follow:
- **FSD architecture:** Lives in `shared/ui` (no business logic)
- **Story-first UI:** Component is implemented after/with stories
- **Zero-trust styling:** No `className` prop on root element
- **Token law:** Only existing design tokens, no arbitrary values

## Design Reference (from Penpot)

- **Container:** 123×38 px (including arrow)
- **Content area:** 123×32 px, `border-radius: 8px` (`--radius-md`)
- **Background:** `#0a0a0a` → `bg-neutral-950`
- **Text:** `#ffffff` → `text-neutral-50`
- **Font:** Noto Sans, 12px (`text-xs`), weight 500 (`font-medium`)
- **Arrow:** ~17×8.5 px, same color as background
- **Shadow:** `shadow-medium` token
- **Z-index:** `400`

## Subtasks

### T001: Install `@radix-ui/react-tooltip`

**Purpose:** Add the Radix Tooltip primitive to project dependencies.

**Steps:**
1. Run `npm install @radix-ui/react-tooltip`
2. Verify installation succeeded by checking `package.json`
3. Run `npm run build` to ensure no TypeScript errors from the new package

**Files:**
- `package.json` (updated)
- `package-lock.json` (updated)

**Validation:**
- [ ] `@radix-ui/react-tooltip` appears in `package.json` dependencies
- [ ] `npm run build` passes after installation

---

### T002: Implement `tooltip.tsx`

**Purpose:** Create the Tooltip compound component wrapping Radix primitives with design tokens.

**Steps:**
1. Create directory `src/shared/ui/tooltip/` if it doesn't exist
2. Create `src/shared/ui/tooltip/tooltip.tsx`:

   **Component Structure:**
   - `TooltipProvider` — context provider (re-export from Radix)
   - `Tooltip` — root component (re-export from Radix)
   - `TooltipTrigger` — trigger element wrapper (re-export from Radix)
   - `TooltipContent` — styled floating content with arrow

   **Styling Requirements:**
   - Content wrapper: `z-[400] overflow-hidden rounded-md bg-neutral-950 px-3 py-2 text-xs font-medium text-neutral-50 shadow-medium`
   - Arrow: same background color as content (`bg-neutral-950` or `fill-neutral-950`)
   - Transition: animate opacity and transform (e.g., `data-[state=instant-open]:animate-none data-[state=delayed-open]:data-[side=bottom]:animate-slide-in-fade data-[state=delayed-open]:data-[side=left]:animate-slide-in-fade ...`)
   - Position props: `sideOffset=4`

   **TypeScript:**
   - Extend Radix types where appropriate
   - Export `TooltipProps`, `TooltipContentProps`, `TooltipTriggerProps`
   - Use React 19 ref-as-prop pattern (no forwardRef needed)

   **Zero-trust constraint:**
   - No `className` prop accepted by `TooltipContent`
   - Consumers control behavior through `side`, `align`, `open`, `defaultOpen` props only

3. Ensure the component follows existing patterns from `src/shared/ui/shadcn/button.tsx` and `src/shared/ui/input-field/input-field.tsx`

**Files:**
- `src/shared/ui/tooltip/tooltip.tsx` (new, ~80-120 lines)

**Validation:**
- [ ] Component compiles without TypeScript errors
- [ ] All 4 Radix subcomponents exported (Provider, Tooltip, Trigger, Content)
- [ ] Content has correct styling tokens
- [ ] Arrow matches background color
- [ ] No `className` prop leak
- [ ] Follows React 19 ref pattern

**Edge Cases:**
- Content too long: wrap with `max-w-xs` or let Radix handle overflow
- Missing Provider: Radix throws — document requirement in code comments

---

### T004: Create `index.ts`

**Purpose:** Expose the public API for the tooltip slice.

**Steps:**
1. Create `src/shared/ui/tooltip/index.ts`
2. Re-export all components and types from `tooltip.tsx`

```typescript
export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './tooltip'
export type {
  TooltipProps,
  TooltipContentProps,
  TooltipTriggerProps,
} from './tooltip'
```

**Files:**
- `src/shared/ui/tooltip/index.ts` (new, ~10 lines)

**Validation:**
- [ ] All components and types exported
- [ ] No default export (named exports only per FSD convention)

## Definition of Done

- [ ] All subtasks complete
- [ ] `npm run lint` passes
- [ ] `npm run lint:arch` passes
- [ ] `npm run build` passes
- [ ] Component can be imported from `@/shared/ui/tooltip`

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Radix arrow may need `fill` instead of `bg` | Low | Test arrow rendering and adjust CSS |
| Transition animations may conflict with Tailwind v4 | Low | Use simple opacity/transform transitions |

## Reviewer Guidance

- Verify zero-trust: search for `className` in `tooltip.tsx` — should not appear in public props
- Verify token usage: no arbitrary values like `text-[12px]` or `bg-[#0a0a0a]`
- Check that Radix Provider is documented/re-exported

## Activity Log

- 2026-05-04T12:38:07Z – kilo:kimi-for-coding::implementer – shell_pid=5702 – Started implementation via action command
- 2026-05-04T12:43:30Z – kilo:kimi-for-coding::implementer – shell_pid=5702 – Ready for review: Tooltip component with Radix primitives, design tokens, zero-trust styling
