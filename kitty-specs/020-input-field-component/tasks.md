# Tasks — 020-input-field-component

## Branch Strategy

- **Current branch at workflow start**: `main`
- **Planning/base branch for this feature**: `main`
- **Completed changes must merge into**: `main`

---

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|-----|----------|
| T001 | Create `src/shared/ui/input-field/` directory with component folder structure | WP01 | ✗ | [D] |
| T002 | Implement `input-field.tsx` with label, hint, placeholder, icon, and all 8 Penpot states | WP01 | ✗ | [D] |
| T003 | Implement icon switching logic (`CircleHelp` / `AlertCircle` from lucide-react) | WP01 | ✗ | [D] |
| T004 | Create `index.ts` exports for clean public API | WP01 | ✗ | [D] |
| T005 | Create CSF3 story file with all 8 Penpot states | WP01 | ✗ | [D] |
| T006 | Verify component against Penpot design tokens (colors, radius, typography, icon colors) | WP01 | ✓ | [D] |
| T007 | Run `npm run lint` and `npm run build` to verify no errors | WP01 | ✓ | [D] |

---

## Work Packages

### WP01 — Input Field Component Implementation

**Summary**: Implement the InputField component with all 8 Penpot states, inline icons, stories, and design token integration.

**Goal**: Deliver a production-ready InputField component in `src/shared/ui/input-field/` that:
- Renders a labeled text input with optional hint text and inline icon
- Supports all 8 Penpot states: Normal, Error, Filled, Error filled, Focused, Error focused, Disabled, Success
- Uses design tokens mapped to project Tailwind classes (`neutral-*`, `error-*`)
- Switches icons based on state (`CircleHelp` default, `AlertCircle` on error)
- Exports via `index.ts` for clean public API
- Includes CSF3 stories for all 8 states
- Passes lint and typecheck

**Priority**: P0 (MVP)

**Success Criteria**:
- [x] Component renders in all 8 Penpot states (Normal, Error, Filled, Error filled, Focused, Error focused, Disabled, Success)
- [x] Design tokens match Penpot specification (no inferred/guessed values)
- [x] Inline icon switches correctly (`CircleHelp` ↔ `AlertCircle`)
- [x] Border behavior: `#e5e5e5` default, `#f5f5f5` filled, none on focus/disabled
- [x] Hint color: `#737373` default, `#dc2626` on error
- [x] Input text color: `#737373` placeholder, `#a3a3a3` filled, `#171717` focused
- [x] Stories in CSF3 format with controls for all props
- [ ] Clean export via `index.ts`
- [ ] Passes `npm run lint` and `npm run build`

**Independent Test**: Story in browser shows all 8 states correctly rendered with correct colors, borders, and icons

**Included Subtasks**:
- [x] T001 Create `src/shared/ui/input-field/` directory with component folder structure
- [x] T002 Implement `input-field.tsx` with label, hint, placeholder, icon, and all 8 Penpot states
- [x] T003 Implement icon switching logic (`CircleHelp` / `AlertCircle` from lucide-react)
- [x] T004 Create `index.ts` exports for clean public API
- [x] T005 Create CSF3 story file with all 8 Penpot states
- [x] T006 Verify component against Penpot design tokens (colors, radius, typography, icon colors)
- [x] T007 Run `npm run lint` and `npm run build` to verify no errors

**Implementation Sketch**:
1. Create directory `src/shared/ui/input-field/`
2. Write `input-field.tsx` using `cn` utility and Tailwind semantic classes
3. Import icons from `lucide-react`: `CircleHelp` (default), `AlertCircle` (error)
4. Implement conditional border logic:
   - `disabled || focus-within` → no border
   - `value` present + no focus + no error → `border-neutral-200`
   - Default → inline `borderColor: '#e5e5e5'`
5. Implement conditional text colors:
   - Placeholder → `placeholder:text-neutral-600`
   - Value (unfocused) → `text-neutral-500`
   - Value (focused) → `text-neutral-950`
6. Implement conditional hint color:
   - `error` → `text-error-600`
   - Default → `text-neutral-600`
7. Implement icon switching:
   - `error` → `<AlertCircle className="text-error-600" />`
   - Default → `<CircleHelp className="text-neutral-500" />`
8. Create `input-field.stories.tsx` with 8 stories
9. Export from `index.ts`
10. Verify build

**Parallel Opportunities**:
- T006 (verify) can run concurrently with T007 (build) after component is complete
- Story creation (T005) can happen once component structure (T002-T003) is finalized

**Dependencies**: None

**Risks**:
- Font (Noto Sans) loading assumed to be global — may need font-face declaration if not already loaded
- Border removal on focus may fail WCAG 2.1 focus visibility — add `focus-visible:ring` as safety net
- `lucide-react` icons may not match Penpot icons exactly — use closest semantic equivalents

**Estimated Prompt Size**: ~450 lines

---

## Notes

- This is a **trivial feature** (single UI component) — all work fits in WP01
- No multi-phase planning needed
- Technology stack: React 19 + TypeScript + Tailwind CSS v4 + CSF3 stories
- Component location follows existing patterns (`src/shared/ui/<component>/`)
- Design tokens from Penpot are mapped to existing project Tailwind tokens (no arbitrary values)

---

## Next Command

Run `/spec-kitty.analyze` for requirements quality checklist, then proceed to implementation with `/spec-kitty.implement`.

Alternatively, run implementation directly:
```bash
spec-kitty next --agent <agent> --mission 020-input-field-component
```
