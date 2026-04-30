# Tasks — 020-input-field-component

## Branch Strategy

- **Current branch at workflow start**: `main`
- **Planning/base branch for this feature**: `main`
- **Completed changes must merge into**: `main`

---

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|-----|----------|
| T001 | Create `src/shared/ui/input-field/` directory with component folder structure | WP01 | ✗ |
| T002 | Create `InputField.tsx` with default state (label, hint, placeholder, controlled/uncontrolled value) | WP01 | ✗ |
| T003 | Implement error state (border `#ef4444`, error message display, aria-describedby) | WP01 | ✗ |
| T004 | Implement focus state (border `#000000`, outline ring, `:focus-visible`) | WP01 | ✗ |
| T005 | Implement disabled state (reduced opacity, `aria-disabled`, non-editable) | WP01 | ✗ |
| T006 | Create CSF3 story file with all states: default, focus, error, disabled | WP01 | ✗ |
| T007 | Verify component against Penpot design tokens (colors, radius, typography) | WP01 | ✓ |
| T008 | Run `npm run lint` and `npm run build` to verify no errors | WP01 | ✓ |

---

## Work Packages

### WP01 — Input Field Component Implementation

**Summary**: Implement the InputField component with all states, stories, and design token integration.

**Goal**: Deliver a production-ready InputField component in `src/shared/ui/input-field/` that:
- Renders a labeled text input with optional hint text
- Supports default, focus, error, and disabled states
- Uses design tokens from Penpot (`#fafafa` bg, `#e5e5e5` border, `#404040` label, `#737373` hint, 4px radius)
- Exports via `index.ts` for clean public API
- Includes CSF3 stories for all states
- Passes lint and typecheck

**Priority**: P0 (MVP)

**Success Criteria**:
- [ ] Component renders in all states (default, focus, error, disabled)
- [ ] Design tokens match Penpot specification
- [ ] Stories in CSF3 format with controls for all props
- [ ] Clean export via `index.ts`
- [ ] Passes `npm run lint` and `npm run build`

**Independent Test**: Story in browser shows all states correctly rendered

**Included Subtasks**:
- [ ] T001 Create `src/shared/ui/input-field/` directory with component folder structure
- [ ] T002 Create `InputField.tsx` with default state (label, hint, placeholder, controlled/uncontrolled value)
- [ ] T003 Implement error state (border `#ef4444`, error message display, aria-describedby)
- [ ] T004 Implement focus state (border `#000000`, outline ring, `:focus-visible`)
- [ ] T005 Implement disabled state (reduced opacity, `aria-disabled`, non-editable)
- [ ] T006 Create CSF3 story file with all states: default, focus, error, disabled
- [ ] T007 Verify component against Penpot design tokens (colors, radius, typography)
- [ ] T008 Run `npm run lint` and `npm run build` to verify no errors

**Implementation Sketch**:
1. Create directory `src/shared/ui/input-field/`
2. Write `InputField.tsx` using local `cn` utility and Tailwind classes
3. Use CVA for state variant management (optional, or direct conditional classes)
4. Implement state-specific styling based on design tokens
5. Create `InputField.stories.tsx` with `Default`, `WithLabel`, `WithHint`, `Error`, `Disabled` stories
6. Export from `index.ts`
7. Verify build

**Parallel Opportunities**:
- T007 (verify) can run concurrently with T008 (build) after component is complete
- Story creation (T006) can happen once component structure (T002-T005) is finalized

**Dependencies**: None

**Risks**:
- Font (Noto Sans) loading assumed to be global — may need font-face declaration if not already loaded
- Color tokens in spec use hex (`#fafafa`, `#e5e5e5`) but Tailwind uses HSL from existing token system — use closest semantic token or add custom utility

**Estimated Prompt Size**: ~450 lines

---

## Notes

- This is a **trivial feature** (single UI component) — all work fits in WP01
- No multi-phase planning needed
- Technology stack: React 19 + TypeScript + Tailwind CSS v4 + CSF3 stories
- Component location follows existing patterns (`src/shared/ui/shadcn/<component>/`)
- Design tokens from Penpot need mapping to Tailwind CSS token system

---

## Next Command

Run `/spec-kitty.analyze` for requirements quality checklist, then proceed to implementation with `/spec-kitty.implement`.

Alternatively, run implementation directly:
```bash
spec-kitty next --agent <agent> --mission 020-input-field-component
```