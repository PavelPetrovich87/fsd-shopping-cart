# Tasks: 016-design-tokens

**Mission**: 016-design-tokens  
**Created**: 2026-04-17  
**Branch**: `main` (direct commit)

---

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|----|----------|
| T001 | Create directory `src/shared/ui/tokens/` | WP01 | No | [D] |
| T002 | Write primitive color tokens (14 tokens) | WP01 | No | [D] |
| T003 | Write semantic shadcn color tokens (22 tokens) | WP01 | No | [D] |
| T004 | Write typography tokens (1 family + 10 sizes + 4 weights) | WP01 | No | [D] |
| T005 | Write spacing tokens (9 values) | WP01 | No | [D] |
| T006 | Write border radius tokens (2 values) | WP01 | No | [D] |

---

## Work Packages

### WP01: Create theme.css

**Summary**: Create `src/shared/ui/tokens/theme.css` with full `@theme` block containing all design tokens from Penpot.

**Goal**: Single CSS file with all design tokens (colors, typography, spacing, border radius) in one `@theme` block.

**Priority**: 1 (Foundation)

**Success Criteria**:
- File exists at `src/shared/ui/tokens/theme.css`
- Contains valid `@theme { ... }` block
- All 14 primitive color tokens present
- All 22 semantic shadcn color tokens present
- All 10 font sizes (xs–6xl) present
- All 4 font weights present
- All 9 spacing values present
- Both border radius tokens present
- Section comments included

**Independent Test**: File can be imported in Vite dev server without errors.

**Implementation Sequence**:
1. Create directory structure
2. Write `@theme` block with section comments
3. Populate primitive colors
4. Populate semantic colors
5. Populate typography tokens
6. Populate spacing tokens
7. Populate border radius tokens

**Subtasks**:
- [x] T001 Create directory `src/shared/ui/tokens/`
- [x] T002 Write primitive color tokens (14 tokens)
- [x] T003 Write semantic shadcn color tokens (22 tokens)
- [x] T004 Write typography tokens (1 family + 10 sizes + 4 weights)
- [x] T005 Write spacing tokens (9 values)
- [x] T006 Write border radius tokens (2 values)

**Risks**: None — trivial single-file deliverable.

**Dependencies**: None.

**Estimated Prompt Size**: ~300 lines

---

## Prompt Files

| WP | File |
|----|------|
| WP01 | `kitty-specs/016-design-tokens/tasks/WP01-create-theme-css.md` |