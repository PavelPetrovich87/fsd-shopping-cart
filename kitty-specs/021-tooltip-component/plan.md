# Implementation Plan: Tooltip Component

## Branch Contract

- **Current branch at plan start:** `main`
- **Planning/base branch:** `main`
- **Final merge target:** `main`
- **Branch matches target:** ✅

## Technical Context

- **Stack:** React 19, TypeScript 5.9, Tailwind CSS v4, Vite 8, Storybook
- **Component library approach:** shadcn/ui first + design tokens
- **Accessibility primitive:** `@radix-ui/react-tooltip` (already used in project ecosystem)
- **Styling rules:** Zero-trust (no `className` prop), token-only values, no arbitrary CSS
- **Testing approach:** Story-first (CSF3) with Vitest Browser Mode
- **FSD layer:** `shared/ui` — business-agnostic, reusable across all layers

## Charter Check

- Charter unavailable (DIRECTIVE_035 unresolved) — proceeding with project conventions from AGENTS.md and skills
- No conflicts with FSD architecture: component lives in `shared/ui/tooltip/`
- No conflicts with story-first workflow: stories created before/during component

## Design Decisions

### Decision 1: Use @radix-ui/react-tooltip
- **Rationale:** Provides robust positioning (collision detection, viewport boundary handling), full ARIA support, keyboard navigation, and uncontrolled/controlled state management out of the box.
- **Alternatives considered:** 
  - Custom implementation with Floating UI — rejected: adds complexity for a small component, Radix already wraps Floating UI
  - Pure CSS hover — rejected: no collision detection, poor mobile support, no focus management

### Decision 2: Story-first development
- **Rationale:** Project mandate from `story-first-ui` skill. Stories serve as visual regression guards and documentation.
- **Stories to create:** Default, Top, Bottom, Left, Right, With Custom Content, Long Text

### Decision 3: Token mapping from Penpot
- Background: `bg-neutral-950` (#0a0a0a)
- Text: `text-neutral-50` (#ffffff)
- Border radius: `rounded-md` (8px)
- Font: `text-xs font-medium` (12px / 500)
- Shadow: `shadow-medium`
- Z-index: inline style for `z-index: 400` (no Tailwind token for tooltip z-index)

## File Structure

```
src/shared/ui/tooltip/
├── tooltip.tsx           # Component implementation
├── tooltip.stories.tsx   # Storybook stories
├── index.ts              # Public API export
```

Plus update:
- `src/shared/ui/index.ts` — re-export Tooltip

## Implementation Steps

### Step 1: Install dependency
```bash
npm install @radix-ui/react-tooltip
```

### Step 2: Write tooltip.tsx
- Create compound component structure: `Tooltip`, `TooltipTrigger`, `TooltipContent`
- Wrap Radix primitives with design token styles
- Implement arrow with same background color
- Add CSS transitions for opacity/transform
- Ensure no `className` prop leaks (zero-trust)
- Export type-safe props interface

### Step 3: Write tooltip.stories.tsx
- CSF3 format with `satisfies Meta<typeof Tooltip>`
- Stories: Default (top), Bottom, Left, Right
- Use a trigger button as anchor element in each story
- Add play function for hover interaction testing

### Step 4: Write index.ts
- Export component and subcomponents
- Export types

### Step 5: Update src/shared/ui/index.ts
- Add Tooltip export

### Step 6: Quality gates
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
|------|--------|------------|
| Radix tooltip may conflict with existing z-index system | Low | Use explicit z-index: 400 from tokens |
| Mobile long-press not supported by Radix | Medium | Add custom touch event handlers with 500ms threshold |
| Arrow positioning in edge cases | Low | Radix handles collision detection automatically |

## Dependencies

- `@radix-ui/react-tooltip` — accessibility and positioning primitive
- Existing design tokens from `src/shared/ui/tokens/`

## Out of Scope

- Tooltip with interactive content (forms, buttons inside) — covered by Radix, but not explicitly tested
- Multi-line rich content with complex formatting — basic React node support is enough
- Animation customization beyond default CSS transition — use project animation tokens
