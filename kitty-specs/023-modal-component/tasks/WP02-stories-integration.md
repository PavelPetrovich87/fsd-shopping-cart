---
work_package_id: WP02
title: Stories & Integration
dependencies:
- WP01
requirement_refs:
- C-006
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T009
- T010
- T011
history: []
authoritative_surface: src/shared/ui/modal/
execution_mode: code_change
owned_files:
- src/shared/ui/modal/modal.stories.tsx
- src/shared/ui/index.ts
tags: []
agent: "kilo"
shell_pid: "4019"
---

# WP02: Stories & Integration

## Objective

Create Storybook stories for all Modal states and integrate the component into the shared UI public API.

## Branch Strategy

- **Planning branch:** `main`
- **Final merge target:** `main`
- **Execution:** This WP is executed in its own worktree allocated by spec-kitty lanes.

## Context

Final WP. Stories demonstrate component behavior and serve as visual regression tests. Integration makes Modal available project-wide.

## Subtasks

### T009: Create `modal.stories.tsx`

**Purpose:** Document and test Modal component with CSF3 stories.

**Steps:**
1. Create `src/shared/ui/modal/modal.stories.tsx`
2. Import Modal and existing Button component for trigger
3. Create stories:
   - **Open:** Modal open with title and sample content
   - **Without Title:** Modal open without title prop
   - **With Long Content:** Modal with scrollable long text
   - **With Form Content:** Modal containing input fields and buttons
   - **Confirmation Dialog:** Modal styled like Penpot design (title + description + Yes/Cancel)
   - **Closed:** Modal in closed state
4. Use `args` for controls: `open`, `title`
5. Use `play` function for interaction testing

**Files:**
- `src/shared/ui/modal/modal.stories.tsx` (new, ~100-150 lines)

**Validation:**
- [ ] All 6 stories render in Storybook
- [ ] Controls work for `open` and `title`
- [ ] Confirmation dialog story matches Penpot design

---

### T010: Update `src/shared/ui/index.ts`

**Purpose:** Integrate Modal into the shared UI public API.

**Steps:**
1. Open `src/shared/ui/index.ts`
2. Add `export * from './modal'`

**Files:**
- `src/shared/ui/index.ts` (modified)

**Validation:**
- [ ] Modal importable from `@/shared/ui`

---

### T011: Run quality gates

**Purpose:** Verify all project quality checks pass.

**Steps:**
1. Run `npm run lint`
2. Run `npm run lint:arch`
3. Run `npm run build`
4. Fix any issues

**Validation:**
- [ ] `npm run lint` passes with 0 errors
- [ ] `npm run lint:arch` passes with 0 errors
- [ ] `npm run build` passes with 0 errors

## Definition of Done

- [ ] All subtasks complete
- [ ] Stories render correctly in Storybook
- [ ] Modal is importable from `@/shared/ui`
- [ ] All quality gates pass

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Storybook may not handle portal rendering | Low | Use standard Storybook setup |
| Integration may cause circular imports | Low | Verify with lint:arch |

## Reviewer Guidance

- Verify all stories show correct visual states
- Check Confirmation dialog story matches Penpot colors/sizing
- Run `npm run lint:arch` for FSD violations

## Activity Log

- 2026-05-05T07:56:42Z – kilo – shell_pid=4019 – Started implementation via action command
- 2026-05-05T08:23:24Z – kilo – shell_pid=4019 – Ready for review: Stories and integration complete
