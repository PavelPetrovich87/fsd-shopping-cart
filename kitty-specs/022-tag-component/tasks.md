# Tasks: Tag Component

## Subtask Index

| ID | Description | WP | Parallel |
|---|---|---|---|
| T001 | Create `src/shared/ui/tag/tag.tsx` with Tag component, TagProps interface, neutral styling, and optional dismiss button | WP01 | No | [D] |
| T002 | Create `src/shared/ui/tag/tag.stories.tsx` with CSF3 stories (Default, With Dismiss, Long Text) | WP01 | No | [D] |
| T003 | Create `src/shared/ui/tag/index.ts` exporting Tag and TagProps | WP01 | No | [D] |
| T004 | Update `src/shared/ui/index.ts` to re-export Tag from shared UI public API | WP01 | No | [D] |
| T005 | Run `npm run lint` and fix any ESLint errors | WP01 | No | [D] |
| T006 | Run `npm run lint:arch` and fix any FSD architecture violations | WP01 | No | [D] |
| T007 | Run `npm run build` and fix any TypeScript or Vite build errors | WP01 | No | [D] |

---

## Work Packages

### WP01: Implement Tag Component

**Goal**: Create the Tag UI component with neutral styling, optional dismiss action, and Storybook stories.

**Priority**: P1 — Core deliverable

**Included Subtasks**:
- [x] T001 Create `src/shared/ui/tag/tag.tsx` with Tag component, TagProps interface, neutral styling, and optional dismiss button
- [x] T002 Create `src/shared/ui/tag/tag.stories.tsx` with CSF3 stories (Default, With Dismiss, Long Text)
- [x] T003 Create `src/shared/ui/tag/index.ts` exporting Tag and TagProps
- [x] T004 Update `src/shared/ui/index.ts` to re-export Tag from shared UI public API
- [x] T005 Run `npm run lint` and fix any ESLint errors
- [x] T006 Run `npm run lint:arch` and fix any FSD architecture violations
- [x] T007 Run `npm run build` and fix any TypeScript or Vite build errors

**Implementation Sketch**:
1. Create `src/shared/ui/tag/` directory and write `tag.tsx`
2. Write `tag.stories.tsx` with 3 CSF3 stories
3. Write `index.ts` for public API
4. Update `src/shared/ui/index.ts`
5. Run quality gates in sequence: lint → lint:arch → build

**Dependencies**: None

**Parallel Opportunities**: None (single WP, sequential tasks)

**Risks**:
- ESLint `no-restricted-syntax` rule may flag `className` usage inside component — use the spread trick if needed for internal elements
- `src/shared/ui/index.ts` may have merge conflicts if another mission touched it

**Estimated Prompt Size**: ~450 lines

**Prompt File**: [`tasks/WP01-tag-component.md`](tasks/WP01-tag-component.md)
