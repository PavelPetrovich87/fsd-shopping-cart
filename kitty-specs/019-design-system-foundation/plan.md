# Design System Foundation — Implementation Plan

**Mission:** 019-design-system-foundation  
**Spec:** `kitty-specs/019-design-system-foundation/spec.md`  
**Branch:** current `main` → merge into `main` (`branch_matches_target: true`)  
**Generated:** 2026-04-30T12:09:58Z

---

## 1. Technical Context

### What's building

A code-first design token system at `src/shared/ui/tokens/` consisting of:

- **TypeScript token modules** (`colors.ts`, `typography.ts`, `spacing.ts`, `radius.ts`, `shadows.ts`, `breakpoints.ts`, `z-index.ts`, `index.ts`)
- **CSS custom properties** (`theme.css`) as the single CSS source of truth
- **Storybook stories** (`tokens.stories.tsx`) for visual regression of all token categories
- **README.md** documenting token layers and usage

### Source of truth

All primitive color values come from the Penpot design file. The spec's Section 4 documents every extracted value with hex → HSL conversion. No values are invented — all derived values (e.g., full spacing scale, font weights 600/700, radius `lg/xl/full`) are documented as derived.

### Key decisions confirmed

| Decision | Resolution |
|----------|------------|
| Color format | HSL strings for all token exports; hex in comments for reference only |
| Border radius scale | `sm=4px, md=8px` from Penpot; `lg=12px, xl=16px, full=9999px` derived as standard increments |
| Spacing scale | Full 4px grid built as specified; gaps in Penpot (20, 24, 40, 48, 80, 96, 128) documented as derived |
| Breakpoint values | Standard: `sm=640px, md=768px, lg=1024px, xl=1280px` |
| Font weights | 400, 500 from Penpot; 600, 700 added as derived for future component needs |
| Shadow grouping | Generic elevation (`subtle`, `medium`, `large`) + state rings (`focus-ring`, `error-ring`) |
| Gradient swatches | Two gradient swatches in Penpot (neutral-50 → neutral-100/300) are documented but not codified as solid tokens |

### Observed gaps in Penpot (documented as derived)

- Spacing values not observed: 20, 24, 40, 48, 80, 96, 128px
- Font weights 600, 700
- Border radius `lg`, `xl`, `full`
- Breakpoint pixel values
- Z-index scale

### Existing file to replace

`src/shared/ui/tokens/theme.css` — current file is partial (hex values, incomplete) and will be fully replaced.

---

## 2. Charter Check

**Directive `DIRECTIVE_035` (Lane-based worktrees):** All code changes for this mission must go through spec-kitty worktrees. Work packages will be created via `/spec-kitty.tasks` and implemented via `spec-kitty agent action implement <WP-ID>`. Direct edits to `main` are prohibited.

**Directive `DIRECTIVE_031` (Bounded context alignment):** Token names use flat `category-purpose-variant` kebab-case strings. No ambiguous overloaded terminology — all tokens map directly to a named Penpot source or a documented derivation.

**Directive `DIRECTIVE_003` (Decision capture):** All non-obvious decisions (derived values, format choices, grouping rationale) are captured in Section 1 above and in the spec.md Design Decisions section.

**Directive `DIRECTIVE_032` (Terminology alignment):** Key terms used in this mission:
- "token" = a named design value (primitive, semantic, or component)
- "primitive" = raw context-free value (e.g., `hsl(245 58% 51%)`)
- "semantic" = context-mapped value (e.g., `primary` maps to the brand indigo)
- "component" = widget-specific value (e.g., `button-focus-ring`)
- "theme object" = the aggregated TypeScript export combining all token categories

---

## 3. Gate Evaluation

| Gate | Status | Notes |
|------|--------|-------|
| Spec committed to target branch | ✅ PASS | spec.md on `main` |
| No unresolved FR/NFR questions | ✅ PASS | All requirements have concrete resolutions |
| No planning questions unanswered | ✅ PASS | Breakpoint values confirmed as standard |
| Charter conflicts with spec | ✅ PASS | No conflicts; charter is orthogonal to design-token work |
| Governance context resolved | ⚠️ WARN | DIRECTIVE_035 referenced in charter but not yet in `doctrine/directives/shipped/` — see note below |

**Governance note:** Charter context reports "Governance: unresolved" due to `DIRECTIVE_035` not found in `doctrine/directives/shipped/`. This is a charter-to-doctrine alignment issue, not a planning blocker. The directive intent (lane-based worktrees) is clear and will be followed.

---

## 4. Output Structure

All files live at `src/shared/ui/tokens/`:

```
src/shared/ui/tokens/
├── colors.ts           # Primitive palette (HSL) + semantic maps
├── typography.ts       # Font family, sizes (xs–5xl), weights, line-heights, letter-spacing
├── spacing.ts          # 4px-grid scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
├── radius.ts            # sm=4, md=8, lg=12, xl=16, full=9999
├── shadows.ts           # subtle, medium, large, focus-ring, error-ring
├── breakpoints.ts       # sm=640, md=768, lg=1024, xl=1280
├── z-index.ts           # dropdown, sticky, modal, tooltip, toast
├── index.ts             # Combined Theme interface + object + re-exports
├── theme.css            # CSS custom properties (single source of truth)
├── README.md            # Token layers, naming, usage examples
└── tokens.stories.tsx   # Storybook: color swatches, type specimens, spacing rulers
```

---

## 5. Execution Approach

### Phase 1: Data model & tokens

All token files are plain TypeScript constant objects with typed interfaces. No class hierarchy, no factory functions, no runtime validation — just typed exports.

Each token module exports:
1. A TypeScript `interface` for the token type (e.g., `SpacingScale`)
2. A `const` object with all values
3. Re-export in `index.ts`

### Phase 2: CSS custom properties

`theme.css` is a flat list of `--color-*`, `--spacing-*`, `--radius-*`, etc. CSS custom properties. Generated from the same TypeScript constants to avoid drift.

### Phase 3: Storybook stories

`tokens.stories.tsx` uses `@storybook/react-vite` with CSF3. Each story category (colors, typography, spacing, shadows, radius, breakpoints, z-index) is a separate story file exported from the main entry.

### Phase 4: README

Explains the three token layers, naming conventions, and provides import examples for both TypeScript modules and CSS custom properties.

---

## 6. Work Package Breakdown

Tasks will be generated by `/spec-kitty.tasks`. Estimated WP structure:

| WP | Content |
|----|---------|
| WP-1 | `colors.ts` — primitive palette + semantic maps |
| WP-2 | `typography.ts` — font scale |
| WP-3 | `spacing.ts` + `radius.ts` + `breakpoints.ts` + `z-index.ts` |
| WP-4 | `shadows.ts` — elevation + state rings |
| WP-5 | `index.ts` — Theme interface + combined export |
| WP-6 | `theme.css` — all CSS custom properties |
| WP-7 | `tokens.stories.tsx` — visual swatches + specimens |
| WP-8 | `README.md` — documentation |

---

## 7. Quality Assurance

Verification via project commands:
```bash
npm run lint          # ESLint
npm run lint:arch     # Steiger FSD linter
npm run build         # tsc -b + vite build
```

All three must exit code 0. Visual regression confirmed via Storybook stories.

---

**Branch contract:** Planning started on `main`. Completed work merges into `main`. (`branch_matches_target: true`)
