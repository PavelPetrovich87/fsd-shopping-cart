# Tasks: Tooltip Component

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|----|----------|
| T001 | Install `@radix-ui/react-tooltip` dependency | WP01 | [P] |
| T002 | Implement `tooltip.tsx` with Radix primitives and design tokens | WP01 | — |
| T003 | Create `tooltip.stories.tsx` with CSF3 stories for all 4 positions | WP02 | — |
| T004 | Create `index.ts` public API export | WP01 | [P] |
| T005 | Update `src/shared/ui/index.ts` to re-export Tooltip | WP02 | — |
| T006 | Run quality gates: lint, lint:arch, build | WP02 | — |

---

## WP01: Component Foundation

**Goal:** Install dependency, implement the Tooltip component with Radix primitives, and expose the public API.

**Priority:** P0 (blocks WP02)

**Success Criteria:**
- `@radix-ui/react-tooltip` installed
- `src/shared/ui/tooltip/tooltip.tsx` exists with compound component (Tooltip, TooltipTrigger, TooltipContent)
- Design tokens applied (bg-neutral-950, text-neutral-50, rounded-md, shadow-medium)
- Arrow component styled to match background
- Zero-trust styling: no `className` prop on root element
- `src/shared/ui/tooltip/index.ts` exports component and types

**Included Subtasks:**
- [ ] T001 Install `@radix-ui/react-tooltip` dependency
- [ ] T002 Implement `tooltip.tsx` with Radix primitives and design tokens
- [ ] T004 Create `index.ts` public API export

**Implementation Sketch:**
1. Run `npm install @radix-ui/react-tooltip`
2. Create `src/shared/ui/tooltip/tooltip.tsx`:
   - Import `* as TooltipPrimitive` from `@radix-ui/react-tooltip`
   - Create `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent` compound components
   - Style TooltipContent with Tailwind tokens: `bg-neutral-950 text-neutral-50 rounded-md shadow-medium px-3 py-2 text-xs font-medium`
   - Add CSS transitions for opacity and transform
   - Export type-safe props
3. Create `src/shared/ui/tooltip/index.ts` with named exports

**Parallel Opportunities:** T001 and T004 could be done in parallel with T002, but T002 must complete before the component compiles.

**Dependencies:** None

**Risks:**
- Radix tooltip may require additional CSS for arrow positioning. Mitigation: use Radix's built-in `TooltipArrow` primitive.

---

## WP02: Stories & Integration

**Goal:** Create Storybook stories for all tooltip positions and integrate the component into the shared UI public API.

**Priority:** P1

**Success Criteria:**
- `src/shared/ui/tooltip/tooltip.stories.tsx` covers all 4 positions (top, bottom, left, right)
- `src/shared/ui/index.ts` re-exports Tooltip
- All quality gates pass (lint, lint:arch, build)

**Included Subtasks:**
- [ ] T003 Create `tooltip.stories.tsx` with CSF3 stories for all 4 positions
- [ ] T005 Update `src/shared/ui/index.ts` to re-export Tooltip
- [ ] T006 Run quality gates: lint, lint:arch, build

**Implementation Sketch:**
1. Create `src/shared/ui/tooltip/tooltip.stories.tsx`:
   - CSF3 format: `export default satisfies Meta<typeof Tooltip>`
   - Stories: Default (top), Bottom, Left, Right, WithCustomContent, LongText
   - Each story wraps a trigger button + tooltip content
   - Use `play` function for hover interaction testing
2. Update `src/shared/ui/index.ts`: add `export * from './tooltip'`
3. Run quality gates and fix any issues

**Parallel Opportunities:** T003 and T005 can be done in parallel.

**Dependencies:** WP01 (component must exist before stories can import it)

**Risks:**
- Storybook may not render Radix portal correctly. Mitigation: use standard Storybook decorators.

---

## Size Validation

| WP | Subtasks | Est. Lines | Status |
|----|----------|-----------|--------|
| WP01 | 3 | ~350 | ✅ Ideal |
| WP02 | 3 | ~400 | ✅ Ideal |

**All WPs within ideal range (3-7 subtasks, 200-500 lines).**
