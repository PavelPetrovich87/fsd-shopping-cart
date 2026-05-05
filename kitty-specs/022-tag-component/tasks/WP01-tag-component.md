---
work_package_id: WP01
title: Implement Tag Component
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-006
- FR-007
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-022-tag-component
base_commit: 1c6d3673242e7e1ee07a625c216f2a7d8fb694aa
created_at: '2026-05-05T07:44:39.007800+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
- T007
shell_pid: "5702"
history: []
authoritative_surface: src/shared/ui/tag/
execution_mode: code_change
owned_files:
- src/shared/ui/tag/**
- src/shared/ui/index.ts
tags: []
agent: "kilo:kimi-for-coding::implementer"
---

# WP01: Implement Tag Component

## Objective

Implement the `Tag` component in `src/shared/ui/tag/` following the Penpot design spec and project conventions. The component is a neutral-colored label/badge with an optional dismiss "×" button. All quality gates must pass.

## Context

### Stack
- React 19, TypeScript 5.9, Tailwind CSS v4, Vite 8, Storybook
- Design tokens in `src/shared/ui/tokens/` (HSL values, CSS custom properties)
- FSD architecture with `shared/ui` layer
- Zero-trust styling: **no `className` prop on public API**

### Design Spec (from Penpot)
| Property | Value | Token |
|---|---|---|
| Background | `#e5e7eb` | `bg-neutral-200` |
| Text color | `#171717` | `text-neutral-900` |
| Height | 28px | `h-7` |
| Border radius | 4px | `rounded-sm` |
| Font | Noto Sans 14px / 500 | `text-sm font-medium` |
| Dismiss icon | × path, 10.6×10.6px, black | Inline SVG, `text-neutral-900` |
| Dismiss touch target | 20×20px | `w-5 h-5` |

### Existing Token Reference (`src/shared/ui/tokens/theme.css`)
```css
--color-neutral-200: hsl(0 0% 96%);
--color-neutral-900: hsl(0 0% 9%);
--radius-sm: 0.25rem;
--font-size-sm: 0.875rem;
--font-weight-medium: 500;
```

### Existing Files to Reference
- `src/shared/ui/tooltip/tooltip.tsx` — reference for zero-trust styling pattern (spread trick for internal className)
- `src/shared/ui/button/button.stories.tsx` — reference for CSF3 story format
- `src/shared/ui/index.ts` — where to add the re-export

## Subtasks

### T001: Create `src/shared/ui/tag/tag.tsx`

**Purpose**: Implement the Tag component with neutral styling and optional dismiss button.

**Requirements**:
1. Create directory `src/shared/ui/tag/` if it doesn't exist
2. Define `TagProps` interface:
   ```ts
   interface TagProps {
     children: React.ReactNode;
     onDismiss?: () => void;
   }
   ```
3. Implement `Tag` component:
   - Container: `<span>` or `<div>` with `inline-flex items-center` layout
   - Styling (use Tailwind utility classes mapped to tokens):
     - `h-7` (28px height)
     - `rounded-sm` (4px radius)
     - `bg-neutral-200`
     - `text-sm font-medium text-neutral-900`
     - Horizontal padding: `px-2.5` or `px-3` (test which looks closest to Penpot's 144×28px proportions)
     - `gap-1` between text and dismiss button
   - Text content: render `children`
   - Dismiss button (conditional, only when `onDismiss` provided):
     - `<button type="button">` element
     - `aria-label` dynamically set to `"Remove {children}"` (extract text from children if string, otherwise use generic "Remove tag")
     - `w-5 h-5` touch target
     - `inline-flex items-center justify-center`
     - `rounded-sm` for focus ring consistency
     - Inline SVG × icon:
       ```svg
       <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
       ```
       Use `text-neutral-900` on the button so SVG inherits color via `currentColor`
     - On click: invoke `onDismiss`
     - On keydown: if Enter or Space, invoke `onDismiss` and `preventDefault`
     - Focus styles: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-600` (or use project's standard focus ring token)
   - **No `className` prop** on the public Tag component (zero-trust rule)
   - For internal elements needing className manipulation, use the spread trick: `{...{ className: cn(...) }}` if needed
4. Export `Tag` and `TagProps`

**Validation**:
- [ ] Component renders without errors
- [ ] `onDismiss` button only appears when prop is provided
- [ ] Dismiss button is keyboard-activatable (Enter/Space)
- [ ] No `className` in TagProps interface
- [ ] All colors reference tokens (no hardcoded hex)

### T002: Create `src/shared/ui/tag/tag.stories.tsx`

**Purpose**: Write CSF3 Storybook stories for the Tag component.

**Requirements**:
1. Import `Meta`, `StoryObj` from `@storybook/react`
2. Import `Tag` from `./tag`
3. Define meta:
   ```ts
   const meta = {
     title: 'UI/Tag',
     component: Tag,
     tags: ['autodocs'],
   } satisfies Meta<typeof Tag>;
   ```
4. Create stories:
   - **Default**: `<Tag>Label</Tag>` — plain tag without dismiss
   - **With Dismiss**: `<Tag onDismiss={fn()}>Removable</Tag>` — tag with dismiss button; use `fn()` from `@storybook/test` for action logging if available, otherwise use a simple inline handler that logs to console
   - **Long Text**: `<Tag>Very long tag label that tests padding</Tag>` — verifies text doesn't overflow awkwardly
5. Export `meta` and stories

**Validation**:
- [ ] All 3 stories render in Storybook without errors
- [ ] With Dismiss story shows the × button
- [ ] CSF3 format with `satisfies Meta<typeof Tag>`

### T003: Create `src/shared/ui/tag/index.ts`

**Purpose**: Public API export for the Tag slice.

**Requirements**:
```ts
export { Tag } from './tag';
export type { TagProps } from './tag';
```

**Validation**:
- [ ] `import { Tag, type TagProps } from '@/shared/ui/tag'` works

### T004: Update `src/shared/ui/index.ts`

**Purpose**: Re-export Tag from the shared UI public API.

**Requirements**:
1. Add to `src/shared/ui/index.ts`:
   ```ts
   export { Tag } from './tag';
   export type { TagProps } from './tag';
   ```
2. Place alphabetically near other component exports (after `InputField`, before `Tooltip` or similar)

**Validation**:
- [ ] `import { Tag } from '@/shared/ui'` works
- [ ] No circular import issues

### T005: Run `npm run lint`

**Purpose**: Ensure code passes ESLint checks.

**Requirements**:
1. Run `npm run lint` from project root
2. Fix any errors:
   - `no-restricted-syntax` (className ban) — ensure no `className` prop on public API
   - Import order issues
   - TypeScript type issues
   - Any other ESLint violations

**Validation**:
- [ ] `npm run lint` exits with code 0

### T006: Run `npm run lint:arch`

**Purpose**: Ensure FSD architecture rules are satisfied.

**Requirements**:
1. Run `npm run lint:arch` from project root
2. Fix any violations:
   - Ensure `shared/ui/tag/` only imports from `shared/` layers
   - Ensure no cross-feature imports
   - Ensure public API pattern (index.ts re-exports)

**Validation**:
- [ ] `npm run lint:arch` exits with code 0

### T007: Run `npm run build`

**Purpose**: Ensure TypeScript compilation and Vite bundling succeed.

**Requirements**:
1. Run `npm run build` from project root
2. Fix any errors:
   - TypeScript type errors in new files
   - Missing exports
   - Vite bundling issues

**Validation**:
- [ ] `npm run build` exits with code 0

## Branch Strategy

- **Planning/base branch**: `main`
- **Final merge target**: `main`
- **Execution**: Run `spec-kitty agent action implement WP01 --agent <name>` to create a worktree and implement this WP
- The worktree will be created under `.worktrees/022-tag-component-lane-a/`

## Test Strategy

- Storybook stories serve as visual regression and interaction tests
- No unit tests required for this purely presentational component (per project convention for `shared/ui`)
- Manual verification: check that dismiss button is focusable and activatable via keyboard

## Definition of Done

- [ ] `src/shared/ui/tag/tag.tsx` exists and implements all requirements
- [ ] `src/shared/ui/tag/tag.stories.tsx` exists with 3 CSF3 stories
- [ ] `src/shared/ui/tag/index.ts` exports Tag and TagProps
- [ ] `src/shared/ui/index.ts` re-exports Tag
- [ ] `npm run lint` passes
- [ ] `npm run lint:arch` passes
- [ ] `npm run build` passes
- [ ] Component matches Penpot design dimensions and colors
- [ ] No `className` prop on public API

## Risks

| Risk | Mitigation |
|---|---|
| ESLint `no-restricted-syntax` flags internal `className` usage | Use spread trick `{...{ className: cn(...) }}` for internal elements only |
| `src/shared/ui/index.ts` merge conflict with parallel missions | Check latest main before editing; resolve alphabetically |
| Dismiss button `aria-label` with non-string children | Handle gracefully: use generic "Remove tag" if children is not a string |

## Reviewer Guidance

- Verify Tag matches Penpot: 28px height, neutral-200 bg, neutral-900 text, 4px radius
- Verify dismiss button only renders when `onDismiss` is provided
- Verify no `className` prop in public API
- Verify all colors come from design tokens
- Verify stories render correctly in Storybook
- Verify `npm run lint`, `npm run lint:arch`, `npm run build` all pass

## Activity Log

- 2026-05-05T07:44:52Z – kilo:kimi-for-coding::implementer – shell_pid=5702 – Assigned agent via action command
