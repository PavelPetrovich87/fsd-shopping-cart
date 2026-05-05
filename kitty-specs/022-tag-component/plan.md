# Implementation Plan: Tag Component

## Branch Contract

- **Current branch at plan start:** `main`
- **Planning/base branch:** `main`
- **Final merge target:** `main`
- **Branch matches target:** ✅

## Technical Context

- **Stack:** React 19, TypeScript 5.9, Tailwind CSS v4, Vite 8, Storybook
- **Component library approach:** Design tokens first (no external UI library needed for this component)
- **Accessibility:** Inline SVG dismiss icon with focusable button, keyboard activation via Enter/Space
- **Styling rules:** Zero-trust (no `className` prop), token-only values, no arbitrary CSS
- **Testing approach:** Story-first (CSF3)
- **FSD layer:** `shared/ui` — business-agnostic, reusable across all layers
- **Focus behavior:** Only the "×" dismiss button is focusable (Option B confirmed by user)

## Charter Check

- Charter unavailable (DIRECTIVE_035 unresolved) — proceeding with project conventions from `AGENTS.md` and skills
- No conflicts with FSD architecture: component lives in `shared/ui/tag/`
- No conflicts with story-first workflow: stories created alongside component
- No conflicts with zero-trust styling: component has no `className` prop

## Design Decisions

### Decision 1: Pure React component (no Radix)
- **Rationale:** Tag is a purely presentational component. It needs no positioning logic, no portal, no complex state management. A simple `div` with Tailwind tokens is sufficient.
- **Alternatives considered:**
  - `@radix-ui/react-slot` — rejected: overkill for a static label
  - shadcn Badge primitive — rejected: not installed in the project, and the design doesn't match shadcn defaults

### Decision 2: Inline SVG for dismiss icon
- **Rationale:** The × icon from Penpot is a simple 10.6×10.6px path. Inlining avoids adding an icon library dependency (Lucide, Heroicons, etc.) for a single 2-line SVG path.
- **Accessibility:** The dismiss button will be a `<button>` element with `aria-label="Remove [label text]"` and keyboard activation.

### Decision 3: Token mapping from Penpot
- Background: `bg-neutral-200` (#e5e7eb)
- Text: `text-neutral-900` (#171717)
- Border radius: `rounded-sm` (4px)
- Font: `text-sm font-medium` (14px / 500)
- Height: `h-7` (28px)
- Dismiss icon: `text-neutral-900` (same as text)
- Dismiss button touch target: `w-5 h-5` (20×20px)

### Decision 4: No size variants
- **Rationale:** User confirmed single default size. All dimensions come directly from Penpot design.

## File Structure

```
src/shared/ui/tag/
├── tag.tsx           # Component implementation
├── tag.stories.tsx   # Storybook stories
├── index.ts          # Public API export
```

Plus update:
- `src/shared/ui/index.ts` — re-export Tag

## Implementation Steps

### Step 1: Write tag.tsx
- Create `Tag` component accepting `children` and optional `onDismiss` props
- Container: `h-7` (28px), `rounded-sm` (4px), `bg-neutral-200`, inline-flex layout
- Text: `text-sm font-medium text-neutral-900`
- Padding: horizontal padding scaled to content (e.g., `px-3` or `px-2.5`)
- Dismiss button (conditional): rendered only when `onDismiss` is provided
  - `<button>` element with `type="button"`
  - `aria-label` derived from children text: `"Remove {label}"`
  - Inline SVG × path, `w-5 h-5` touch target, `text-neutral-900`
  - Keyboard: Enter/Space invokes `onDismiss`
  - No `className` prop on public API
- Export `TagProps` interface

### Step 2: Write tag.stories.tsx
- CSF3 format with `satisfies Meta<typeof Tag>`
- Stories:
  - **Default**: Tag with plain text label
  - **With Dismiss**: Tag with `onDismiss` action handler
  - **Long Text**: Tag with longer label to verify padding/scaling
- Use `fn()` from `@storybook/test` for action logging (if available) or inline handler

### Step 3: Write index.ts
- Export `Tag` component
- Export `TagProps` type

### Step 4: Update src/shared/ui/index.ts
- Add `Tag` re-export

### Step 5: Quality gates
```bash
npm run lint
npm run lint:arch
npm run build
```

## Quality Gates

| Gate | Command | Must Pass |
|------|---------|-----------|
| ESLint | `npm run lint` | ✅ |
| FSD Architecture | `npm run lint:arch` | ✅ |
| TypeScript + Build | `npm run build` | ✅ |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Dismiss button too small on mobile | Low | 20×20px touch target meets WCAG minimum; padding around icon increases hit area |
| `aria-label` not localized | Low | Acceptable for story-first phase; i18n handled at widget/page layer |
| Tag text overflows on very long labels | Low | Use `truncate` or `whitespace-nowrap` with max-width if needed |

## Dependencies

- Existing design tokens from `src/shared/ui/tokens/`
- No new npm packages required

## Out of Scope

- Color variants (`success`, `error`, `warning`, `info`) — Penpot design has only neutral
- Size variants (`sm`/`md`/`lg`) — user confirmed single size
- Animated dismiss transition
- Drag-to-reorder or other interactive tag behaviors
- i18n for `aria-label`
