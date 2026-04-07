# Project Plan: Harness Engineering

## What This Project Is

A **learning project** for studying **Harness Engineering** — the discipline of building self-enforcing repositories where AI agents (and humans) produce correct code through tooling constraints, not memorization or good intentions.

The shopping cart app is just the test payload. The real product is the **harness**: the combination of linters, type checks, architecture validators, CI pipelines, and conventions that make it structurally impossible to write incorrect code without immediate feedback.

### Core Principle

> Every rule must be binary (violated or not), syntax-verifiable, and locally checkable. If a rule can't be enforced by a tool, it's a guideline at best.

### Who Is Building This

Pavel (Senior Software Engineer) — researching how to design environments that force any agent to converge on correct output. The collaboration model: Pavel drives architecture decisions and research, Claude critiques, implements boilerplate, and validates.

---

## 6-Day Curriculum

### Day 1: Theory ✅

Studied Harness Engineering concepts: self-enforcing repos, machine-enforceable rules, the difference between a harness and documentation.

### Day 2: Scaffold ✅

Built the FSD (Feature-Sliced Design) project skeleton:

- **FSD folder structure** — `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/` with proper segments (`ui/`, `model/`, `api/`, `lib/`, `config/`)
- **ARCHITECTURE.md** — layer hierarchy, slice isolation rules, data flow, dependency graph (Mermaid), definition of done
- **CONVENTIONS.md** — machine-enforceable rules only. Every rule tagged with its enforcement tool (`[steiger]`, `[eslint]`, `[prettier]`, `[review]`, `[ci-custom]`)
- **AGENTS.md** — vendor-agnostic instructions for AI coding agents. Root-level + per-layer AGENTS.md files with layer-specific context
- **README.md** — project overview, quick start, commands
- **Path alias** `@/` → `src/` configured in Vite + TypeScript

**Key artifacts:**

- `src/` — FSD folder tree with `entities/product/` and `features/shopping-cart/` slices
- `ARCHITECTURE.md`, `CONVENTIONS.md`, `AGENTS.md` — the three pillars of harness documentation
- Per-layer `AGENTS.md` files in each `src/<layer>/`

### Day 3: Linting + Automation ✅

Built the automated enforcement layer — three lines of defense:

**Steiger (FSD architecture linter):**

- `steiger.config.ts` — FSD recommended rules, `insignificant-slice` disabled (empty project)
- Enforces: no-higher-level-imports, no-cross-imports, public-api, segments-by-purpose
- Command: `npm run lint:arch`

**ESLint 9 (flat config):**

- `import/no-default-export` — named exports only (CONVENTIONS 2.1)
- `react/no-unstable-nested-components` — no nested components (CONVENTIONS 2.3)
- `no-restricted-imports` with `../../*` pattern — import locality (CONVENTIONS 1.4)
- `no-restricted-syntax` for `className` in custom `shared/ui/` (CONVENTIONS 3.2)
- Exceptions: config files allowed `export default`, `shared/ui/shadcn/` exempted from className ban
- Command: `npm run lint`

**Automation pipeline (Defense in Depth):**

1. **Pre-commit** (Husky + lint-staged): ESLint on staged `.ts/.tsx` files + Prettier formatting. ~1-3 seconds.
2. **Pre-push** (Husky): Steiger + TypeScript build on whole project. ~5-15 seconds.
3. **CI** (GitHub Actions): Clean-room `npm ci` → Prettier check → ESLint → Steiger → build. ~30-60 seconds.

**Key artifacts:**

- `.husky/pre-commit`, `.husky/pre-push`
- `.github/workflows/ci.yml`
- `docs/automation-pipeline.md` — detailed docs with diagrams and scenarios
- `eslint.config.js`, `steiger.config.ts`

### Day 4: Tailwind + shadcn ✅

Integrated styling toolchain:

**Tailwind CSS v4:**

- CSS-first config (no `tailwind.config.js`) — `@import 'tailwindcss'` in `src/index.css`
- `@tailwindcss/vite` plugin
- Utility-first convention (CONVENTIONS 3.1)

**Prettier + tailwind class sorting:**

- `prettier-plugin-tailwindcss` — automatic class ordering
- `.prettierrc.json` — single quotes, no semicolons, trailing commas
- `npm run format` / `npm run format:check`
- Integrated into lint-staged (pre-commit) and CI

**shadcn/ui:**

- Configured for FSD paths: `components.json` → `@/shared/ui/shadcn/`
- `cn()` utility in `shared/lib/utils.ts` (clsx + tailwind-merge)
- Button component as first shadcn component (cva variants)
- Dependencies: `class-variance-authority`, `clsx`, `tailwind-merge`, `@base-ui/react`, `lucide-react`

**Zero-trust styling (pragmatic approach):**

- Directory split: `shared/ui/shadcn/` (className allowed) vs `shared/ui/*.tsx` (className forbidden by ESLint)
- shadcn components use `cva` + TypeScript union types as their harness
- Custom components use ESLint `no-restricted-syntax` to ban `className`
- Documented in CONVENTIONS.md 3.2

**Key artifacts:**

- `src/shared/ui/shadcn/button.tsx` — first shadcn component
- `src/shared/lib/utils.ts` — `cn()` utility
- `components.json` — shadcn CLI config pointing to FSD paths
- `.prettierrc.json`, `.prettierignore`

### Day 4.5: Storybook ✅

**Goal:** Add a component registry that agents can use to discover available UI primitives. Storybook also opens the door to visual feedback loops (Week 4 of the 7-week plan).

**What needs to be done:**

1. **Install Storybook** — `npx storybook@latest init`. It will detect Vite + React and configure itself. Verify it runs with `npm run storybook`.
2. **Configure for FSD** — stories live next to components. For `shared/ui/shadcn/button.tsx`, create `shared/ui/shadcn/button.stories.tsx`. For custom components in `shared/ui/`, same pattern.
3. **Write first story** — a story for the Button component showcasing all variants (default, outline, secondary, ghost, destructive, link) and sizes (xs, sm, default, lg, icon). This becomes the visual contract.
4. **Add `storybook` and `build-storybook` scripts** to `package.json`.
5. **ESLint exception** — story files (`*.stories.tsx`) need `export default` (Storybook's CSF format requires it). Add to the existing config files exception in `eslint.config.js`.
6. **Steiger** — `.stories.tsx` files inside slice folders may trigger warnings. Test and add ignores to `steiger.config.ts` if needed.
7. **Optional: Storybook MCP** — if time permits, configure the Storybook MCP server so agents can query the component registry from context. This is the "component inventory as context" pattern from Week 3 of the 7-week plan.

**Why this matters for the harness:**

- Agents can discover what UI components exist without scanning files
- Stories serve as visual documentation that agents can reference
- Opens path to visual regression testing (Chromatic/Percy) — the visual feedback loop from Week 4
- Storybook MCP (future) gives agents structured component API data instead of raw source code

**Estimated effort:** ~15 minutes for basic setup, ~30 minutes with stories and ESLint config.

### Day 4.6: Storybook Harness Integration ✅

Added Storybook as a harness layer:

- **Story-First Convention** — AGENTS.md: story before component, CSF3 format, bug-first pattern
- **build-storybook as CI gate** — `.github/workflows/ci.yml` and `.husky/pre-push` now run Storybook build
- **ESLint exceptions** — `.storybook/` configs and `*.stories.tsx` files exempt from `no-default-export`

**Key artifacts:**

- `src/shared/AGENTS.md` — story-first + bug-first conventions
- `AGENTS.md` (root) — workflow updated with Storybook steps
- `.github/workflows/ci.yml` — `build-storybook` step added
- `.husky/pre-push` — `build-storybook` appended after build

### Day 5: Architecture Validator ⏳

**Goal:** Make documentation executable. The dependency graph in `ARCHITECTURE.md` must match actual imports in the codebase. Any divergence fails CI.

**What needs to be done:**

1. **Create `scripts/validate-architecture.ts`** — the core validator script:
   - Parse the Mermaid `graph TD` block from `ARCHITECTURE.md` using regex or a simple parser. Extract edges (e.g., `shopping-cart --> product` means shopping-cart depends on product).
   - Scan all `.ts/.tsx` files in `src/`. For each file, extract import paths. Map each import to its layer/slice (e.g., `@/entities/product` → `entities/product`, `../model/store` → same slice).
   - Build an actual dependency graph: which slices import from which slices.
   - Compare intended graph (from ARCHITECTURE.md) vs actual graph (from imports).
   - Report two types of errors:
     - **Undocumented dependency:** an import exists in code but the edge is missing from ARCHITECTURE.md. Example: `features/shopping-cart` imports `shared/config` but the graph doesn't show that edge.
     - **Stale documentation:** an edge exists in ARCHITECTURE.md but no actual import backs it up. Example: graph shows `product --> shared/lib` but product never imports from shared/lib.
   - Exit with code 1 if any errors found, code 0 if graph matches reality.

2. **Handle edge cases:**
   - Intra-slice imports (relative `./` and `../`) should NOT appear in the cross-slice graph.
   - `shared` layer segments (`shared/ui`, `shared/lib`, etc.) should appear as separate nodes in the slice-level graph.
   - Layer-level graph (the generic `features --> entities --> shared` one) should be validated separately from the slice-level graph.
   - Empty slices (with only `.gitkeep` and `index.ts`) should not trigger stale-edge errors.

3. **Add npm script:** `"validate:arch": "npx tsx scripts/validate-architecture.ts"` in package.json. Install `tsx` as devDependency if not already present.

4. **Add to CI pipeline:** New step in `.github/workflows/ci.yml` after Steiger, before build:

   ```yaml
   - name: Validate architecture graph
     run: npm run validate:arch
   ```

5. **Add to pre-push hook:** Append `npm run validate:arch` to `.husky/pre-push` (runs after Steiger, before build).

6. **Update CONVENTIONS.md:** Change `[ci-custom]` tags on §4.1 and §4.2 to reference the actual script and command.

7. **Test with intentional violations:**
   - Add a fake import in `features/shopping-cart` → `features/some-other` (cross-slice). Verify the script catches it.
   - Add a fake edge in ARCHITECTURE.md that has no backing import. Verify the script catches it.
   - Remove edges and verify undocumented-dependency detection works.

**Why this matters:** This is the capstone of the harness. Steiger catches FSD rule violations, ESLint catches code patterns, but `validate-architecture.ts` catches **architectural drift** — when the codebase slowly diverges from the intended design. It turns ARCHITECTURE.md from a wish-list into an executable contract.

**Referenced in:**

- CONVENTIONS.md §4.1 (every slice has public API) — `[ci-custom]` tag
- CONVENTIONS.md §4.2 (graph matches imports) — `[ci-custom]` tag
- ARCHITECTURE.md "Definition of Done" and "Repository Intelligence Graph"

**Estimated effort:** ~1-2 hours for the script + integration + testing.

### Day 6: Agent Test Drive ⏳

**Goal:** Validate the entire harness by having an AI agent build real features in the shopping cart, guided only by the repo's documentation and tooling.

**What needs to be done:**

1. **Prepare the test scenario** — write a clear feature brief (as a user would give to an agent):
   - "Implement a product listing page that displays products from a mock API"
   - "Add an 'Add to Cart' button on each product card"
   - "Create a cart page showing added items with quantities and total"

2. **Clean the slate** — the agent should start with the current scaffolding (empty slices, no application code). Remove the Vite template from `App.tsx` and replace with a minimal router or placeholder.

3. **Run the agent** — give a fresh Claude Code session (or another agent) access to the repo. The agent should:
   - Read AGENTS.md and ARCHITECTURE.md to understand the project
   - Implement the features following FSD conventions
   - Run `npm run lint`, `npm run lint:arch`, `npm run build` after each change
   - Self-correct based on linter/build errors

4. **Observe and document:**
   - Did the agent read AGENTS.md before writing code?
   - Did it follow the FSD layer hierarchy?
   - Did it create proper public APIs (index.ts)?
   - Where did the harness catch mistakes? (Which linter, which rule?)
   - Where did the harness fail to catch mistakes? (Gaps to fix)
   - How many iterations did the agent need to produce clean code?

5. **Tighten the harness** — based on observed failures, add new rules/constraints:
   - If the agent put a component in the wrong layer → improve AGENTS.md guidance
   - If the agent used wrong import patterns → tighten ESLint rules
   - If the agent created files outside FSD structure → add Steiger rules or folder constraints

6. **Run a second agent** — repeat with a different agent (GPT, Cursor, etc.) to verify the harness is vendor-agnostic, not Claude-specific.

**Success criteria:** An agent with no prior FSD knowledge, reading only the repo's docs and tool output, produces architecturally correct code on the first or second try.

**What to measure:**

- First-attempt success rate (% of files that pass all linters on first write)
- Self-correction rate (how many lint→fix cycles before green)
- Harness coverage (% of agent mistakes caught by automated tools vs found in manual review)

**Estimated effort:** ~2-3 hours including observation, documentation, and harness tightening.

---

## Current State (as of 2026-04-07)

### All checks pass

```
npm run format:check  ✅  Prettier
npm run lint          ✅  ESLint
npm run lint:arch     ✅  Steiger
npm run build         ✅  TypeScript + Vite
```

### File structure

```
src/
├── app/
│   ├── AGENTS.md
│   └── index.ts
├── pages/
│   └── AGENTS.md
├── widgets/
│   └── AGENTS.md
├── features/
│   ├── AGENTS.md
│   └── shopping-cart/
│       ├── ui/.gitkeep
│       ├── model/.gitkeep
│       └── index.ts
├── entities/
│   ├── AGENTS.md
│   └── product/
│       ├── ui/.gitkeep
│       ├── model/.gitkeep
│       └── index.ts
└── shared/
    ├── AGENTS.md
    ├── ui/
    │   ├── shadcn/
    │   │   └── button.tsx
    │   └── index.ts
    ├── lib/
    │   ├── utils.ts       (cn() utility)
    │   └── index.ts
    ├── api/
    │   └── index.ts
    └── config/
        └── index.ts
```

### Enforcement layers

| Layer            | Tool                       | Config                     | Command                                   |
| ---------------- | -------------------------- | -------------------------- | ----------------------------------------- |
| Code quality     | ESLint 9 flat config       | `eslint.config.js`         | `npm run lint`                            |
| FSD architecture | Steiger                    | `steiger.config.ts`        | `npm run lint:arch`                       |
| Formatting       | Prettier + TW plugin       | `.prettierrc.json`         | `npm run format:check`                    |
| Type safety      | TypeScript 5.9             | `tsconfig.app.json`        | `npm run build`                           |
| Pre-commit       | Husky + lint-staged        | `.husky/pre-commit`        | auto on `git commit`                      |
| Pre-push         | Husky                      | `.husky/pre-push`          | auto on `git push`                        |
| CI               | GitHub Actions             | `.github/workflows/ci.yml` | auto on push/PR                           |
| Storybook gate   | Storybook build            | `.storybook/`              | `npm run build-storybook` (pre-push + CI) |
| Arch validation  | `validate-architecture.ts` | TBD (Day 5)                | TBD                                       |

---

## Future Tasks (Beyond 6-Day Curriculum)

These were identified during development but deferred as non-blocking:

- **@x cross-reference pattern** — a convention for entity cross-imports when entities need to reference each other (e.g., `CartItem` references `Product`). FSD forbids cross-slice imports, but entities often need to reference each other's types. The `@x` pattern (from FSD community) allows explicit, documented cross-references. Needs: convention definition, Steiger config, ESLint rule or exception.

- **Naming conventions** — PascalCase for components, camelCase for functions/variables, UPPER_CASE for constants, kebab-case for file names. Can be enforced by ESLint (`@typescript-eslint/naming-convention`). Needs: rule config, exceptions for third-party patterns, update CONVENTIONS.md.

- **Complexity/size conventions** — max file length (~200 lines), max function length (~30 lines), max component props (~7). Enforced by ESLint (`max-lines`, `max-lines-per-function`, custom rule for props). Needs: agree on thresholds, configure rules, update CONVENTIONS.md.

- **Visual regression testing** — Chromatic or Percy integrated with Storybook. Takes screenshots of stories on every PR, compares against baselines, flags visual diffs. Catches layout/styling failures invisible to unit tests. Needs: Storybook first (Day 4.5), then Chromatic/Percy setup, CI integration.

- **Design tokens (3-layer)** — primitive (`red-6`), semantic (`color-feedback-error`), intent ("used for destructive action warnings"). Agents with intent-labeled tokens make better component decisions. Needs: token system design, Tailwind theme integration, documentation.

- **Figma MCP** — connects Figma Dev Mode to agent context. Agents receive structured design data (node trees, variant info, layout constraints, token references) instead of screenshots. Needs: Figma account with Dev Mode, MCP server config.

---

## Key Design Decisions

### Why FSD?

FSD provides a strict, layer-based architecture with clear import rules. Every rule is binary and can be enforced by tooling (Steiger). This makes it ideal for harness engineering — the architecture itself becomes a machine-checkable specification.

### Why Steiger + ESLint (not just one)?

Steiger understands FSD semantics (layers, slices, segments). ESLint understands code patterns (exports, imports, React). Together they cover both architectural and code-level rules. Neither alone is sufficient.

### Why three automation layers (pre-commit, pre-push, CI)?

Defense in depth. Pre-commit is fast but limited (per-file). Pre-push catches project-wide issues. CI catches environment issues. Each is a fallback for the previous.

### Why shadcn with directory split?

shadcn components use `className` by design (via `cn()` + `cva`). Our zero-trust convention bans `className` on custom components. Solution: `shared/ui/shadcn/` for library components (className allowed), `shared/ui/*.tsx` for custom components (className banned by ESLint). The harness is the directory boundary.

### Why pragmatic over strict zero-trust?

We considered stripping `className` from all shadcn components. Decided against it: `cva` + TypeScript union types already provide a strict contract. Fighting the library adds friction without meaningful safety gain. The real risk is custom components with open `className` — that's what ESLint enforces.

---

## Documentation Map

| File                          | Purpose                                              |
| ----------------------------- | ---------------------------------------------------- |
| `ARCHITECTURE.md`             | Intended architecture, layer rules, dependency graph |
| `CONVENTIONS.md`              | Machine-enforceable rules with enforcement tags      |
| `AGENTS.md`                   | AI agent instructions (root + per-layer)             |
| `CLAUDE.md`                   | Claude Code-specific project instructions            |
| `docs/automation-pipeline.md` | Defense-in-depth pipeline docs with scenarios        |
| `docs/PLAN.md`                | This file — project status, curriculum, decisions    |
| `docs/reading-list.md`        | Study materials for Weeks 2–4 of the 7-week plan     |
