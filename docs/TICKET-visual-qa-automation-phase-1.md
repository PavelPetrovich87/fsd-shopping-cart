# TICKET: Visual QA Automation — Phase 1 (Integrated Level)

## Metadata

| Field    | Value                                                                                    |
| -------- | ---------------------------------------------------------------------------------------- |
| Priority | High                                                                                     |
| Status   | Open                                                                                     |
| Timeline | 1–2 weeks                                                                                |
| Owner    | Frontend Team                                                                            |
| Stack    | React 19 + TypeScript + Tailwind CSS v4 + Storybook 10 + Chromatic + Penpot + Playwright |
| Phase    | 1 / 3                                                                                    |

---

## Description

This project already has a solid visual foundation: Storybook with 14+ component stories, Chromatic CI for snapshot diffing, a three-layer design-token system in TypeScript/CSS, and a local Penpot design file (`figma/shopping-cart-section-figma.penpot`). **Phase 1 closes the gap between design and code by giving the AI agent direct read access to both sources.**

Once Phase 1 is complete, an AI agent will be able to:

- Read a component frame from Penpot (padding, font-size, colors, radius)
- Read the corresponding Storybook story and its current CSS
- Fix visual mismatches using the project's design tokens

Phase 2 will add numeric diff computation with Playwright; Phase 3 will run the full loop inside CI/GitHub Actions.

---

## What Is Already in Place

| Asset                       | State | Location                                                               |
| --------------------------- | ----- | ---------------------------------------------------------------------- |
| Storybook 10 (React+Vite)   | Ready | `.storybook/`, 14 `.stories.tsx` files                                 |
| Chromatic                   | Ready | `chromatic` npm script + `.github/workflows/chromatic.yml`             |
| Playwright                  | Ready | `devDependency` (drives `@vitest/browser-playwright`)                  |
| Design tokens (TS + CSS)    | Ready | `src/shared/ui/tokens/` (colors, typography, spacing, radius, shadows) |
| Penpot design file          | Ready | `figma/shopping-cart-section-figma.penpot`                             |
| GitHub Actions CI           | Ready | `.github/workflows/ci.yml` + `chromatic.yml`                           |
| FSD architecture + lint     | Ready | `steiger`, `eslint`                                                    |
| Storybook build in pre-push | Ready | `.husky/pre-push` already runs `npm run build-storybook`               |

---

## Harness Analysis

The project uses **Vitest Browser Mode + Playwright** as its test harness (`vite.config.ts`). This harness is currently configured for:

- Running Storybook stories as browser tests (`@storybook/addon-vitest`)
- Accessibility assertions (`@storybook/addon-a11y` with `test: 'error'`)
- MSW-based API mocking in stories

**What the harness CAN do today:**

- `npm run test:storybook` — runs all stories in headless Chromium via Playwright
- `npm run build-storybook` — produces a static Storybook build (already in pre-push hook)
- Chromatic CI captures snapshots on push/PR (`.github/workflows/chromatic.yml`)

**What the harness CANNOT do today (gaps blocking Visual QA Phase 1):**

| Gap                                        | Impact                                                                                                              | Location / Evidence                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **No local screenshot capture**            | Playwright drives Vitest but only executes tests; it does not save story screenshots to disk for AI comparison      | `vite.config.ts` — `instances: [{ browser: 'chromium' }]` with no screenshot hooks |
| **No `test:visual` script**                | No unified command to run visual regression locally; Chromatic requires `$CHROMATIC_PROJECT_TOKEN` which is CI-only | `package.json` — only `test:unit` and `test:storybook` exist                       |
| **No component-to-frame mapping**          | AI agent must guess which Penpot frame corresponds to which story                                                   | No `component-map.json` or similar registry anywhere                               |
| **No Penpot frame export script**          | Cannot programmatically export PNG/SVG from the local `.penpot` file for side-by-side comparison                    | `figma/shopping-cart-section-figma.penpot` exists but no export harness            |
| **No screenshot diff utility**             | Cannot compare a Storybook render vs a Penpot export and generate an annotated diff image                           | No `scripts/` for image processing                                                 |
| **No viewport matrix**                     | Chromatic only captures at default viewport; no multi-breakpoint visual tests                                       | `.storybook/preview.ts` has no viewport config                                     |
| **No static Storybook screenshot harness** | No script to build → serve → capture specific story screenshots at known URLs                                       | `npm run build-storybook` exists but no capture step after it                      |

**Conclusion:** Before the AI agent can perform the Phase 1 loop (read Penpot → compare with Storybook → fix → verify), the harness must be extended with screenshot capture, comparison, and mapping utilities. These harness changes are infrastructure and should be implemented first.

---

## What Must Be Added

| Asset                           | State       | Why It Is Needed                                                                  |
| ------------------------------- | ----------- | --------------------------------------------------------------------------------- |
| **Visual QA harness utilities** | **Missing** | Screenshot capture, Penpot export, diff generation, component-to-frame mapping    |
| Penpot MCP Server               | **Missing** | AI agent cannot read design values from Penpot                                    |
| Storybook MCP (Chromatic AI)    | **Missing** | AI agent cannot query stories/parameters programmatically                         |
| W3C Design Tokens JSON          | **Missing** | Current tokens are TS modules + CSS; AI needs a single machine-readable JSON file |
| Token sync script               | **Missing** | Manual export from Penpot → JSON → code is error-prone                            |
| Hardcoded-value lint rule       | **Missing** | Engineers still write raw `px`/`rem`/`hsl()` values outside the token system      |
| AI prompt template docs         | **Missing** | No reusable prompt for annotated-screenshot fixes                                 |
| Visual QA examples folder       | **Missing** | No before/after archive for the team to learn from                                |

---

## Definition of Done

- [ ] Visual QA harness utilities exist: screenshot capture, Penpot frame export, diff generation, and component-to-frame mapping registry.
- [ ] `npm run test:visual` executes local visual regression tests (screenshot compare) and exits 0 on pass / non-zero on diff.
- [ ] Penpot MCP Server is installed and the AI agent can read frame properties (padding, font-size, colors) from the local Penpot file.
- [ ] Storybook MCP (Chromatic) is connected; the AI agent can list stories and read component parameters.
- [ ] Design tokens are exported from Penpot into **W3C Community Group format (JSON)** and saved as `src/styles/design-tokens.json`.
- [ ] `npm run sync:tokens` script updates the W3C JSON from Penpot and regenerates the Tailwind-compatible token modules.
- [ ] A lint rule (stylelint or ESLint custom rule) blocks hardcoded spacing/color/typography values in component files.
- [ ] The AI agent successfully fixes **3+ real visual bugs** using annotated screenshots and the W3C token file.
- [ ] `docs/ai-prompt-templates.md` exists and contains the annotated-screenshot prompt template.
- [ ] `docs/visual-qa-examples/` contains before/after screenshots for each fixed bug.

---

## Task 1: Build the Visual QA Harness Foundation

**Goal:** Extend the existing test harness so the AI agent can capture, compare, and diff screenshots locally without relying solely on Chromatic CI.

**Context:** The project already has Vitest Browser Mode + Playwright (`vite.config.ts`) and Chromatic CI. However, there is no local mechanism to (a) save a screenshot of a Storybook story, (b) export a frame from the local `.penpot` file, or (c) compare the two and produce an annotated diff. This task builds those utilities.

**Steps:**

1. [ ] Create `scripts/visual-test/` directory with the following utilities:
   - `capture-story-screenshot.ts` — Builds static Storybook (`npm run build-storybook`), serves it on a local port, uses Playwright to navigate to a specific story URL (`iframe.html?id=...`), and saves a PNG screenshot. Must support viewport overrides (desktop, tablet, mobile).
   - `export-penpot-frame.ts` — Exports a named frame from `figma/shopping-cart-section-figma.penpot` as PNG using the Penpot CLI exporter (or `penpot-mcp` if available). This is the fallback when MCP is not yet connected.
   - `generate-diff.ts` — Takes two PNG paths (story screenshot + Penpot frame export), computes a pixel diff, draws red rectangles around changed regions, and saves an annotated output image.
2. [ ] Create `scripts/visual-test/component-map.json` — a registry mapping:
   ```json
   {
     "shared-ui-button--primary": {
       "penpotFrame": "Button/Primary",
       "componentFile": "src/shared/ui/shadcn/button.tsx"
     }
   }
   ```
   Seed it with all 14 existing stories.
3. [ ] Add npm scripts:
   - `"test:visual"`: Run the full visual regression suite (capture all mapped stories, export corresponding Penpot frames, compare, fail on diff > threshold).
   - `"test:visual:update"`: Update the local baseline screenshots (accept current Storybook renders as the new baseline).
   - `"storybook:screenshot"`: Capture screenshots of all stories in `component-map.json` and save to `.visual-test/baselines/`.
4. [ ] Update `.storybook/preview.ts` to add a `viewport` parameter with breakpoints (desktop 1280×720, tablet 768×1024, mobile 375×667) so the harness can target consistent viewports.
5. [ ] Verify: running `npm run storybook:screenshot` produces PNG files in `.visual-test/baselines/` for every mapped story.

**Acceptance Criteria:**

> `npm run storybook:screenshot` successfully captures PNG screenshots of all mapped stories. `npm run test:visual` compares Storybook screenshots against Penpot exports and produces annotated diff images in `.visual-test/diffs/`. The harness exits with code 0 when no diffs exceed the threshold, and non-zero when they do.

---

## Task 2: Install & Configure Penpot MCP Server

**Goal:** Give the AI agent read access to the Penpot design file through Model Context Protocol.

**Context:** The project already has `figma/shopping-cart-section-figma.penpot`. The empty mission `022-penpot-mcp-connection-checker` was created earlier but never implemented — this task replaces it. **If MCP connection fails, the harness from Task 1 (`export-penpot-frame.ts`) serves as a fallback.**

**Steps:**

1. [ ] Clone or add `penpot-mcp` (https://github.com/penpot/penpot-mcp) as a dev-dependency or sub-process.
2. [ ] Configure the MCP server with the local Penpot file path (`figma/shopping-cart-section-figma.penpot`) or a Penpot cloud instance + API token.
3. [ ] Register the MCP server in the agent's client configuration (Cursor MCP settings / Claude Desktop / Kilo MCP registry).
4. [ ] Verify: run a test query such as "Read the frame `Button/Primary` from the Penpot file and return padding, font-size, and color values."
5. [ ] Document the configuration in `docs/penpot-mcp.md`. Include a note about the Task 1 fallback harness.

**Acceptance Criteria:**

> The AI agent executes the query: "Read frame `Button/Primary` from the Penpot file and return padding, font-size, colors" and receives values that match the existing `src/shared/ui/tokens/` definitions.

---

## Task 3: Install & Configure Storybook MCP (Chromatic)

**Goal:** Give the AI agent programmatic access to Storybook stories and their args/parameters.

**Context:** Storybook 10 is already configured with `@chromatic-com/storybook` addon. Chromatic MCP is the official bridge for AI agents.

**Steps:**

1. [ ] Install `@chromatic-com/storybook-mcp` (or the latest Chromatic MCP package).
2. [ ] Connect it to the same agent client used for Penpot MCP.
3. [ ] Verify: the agent can list all stories and read the args of a specific story (e.g., `shared-ui-button--primary`).
4. [ ] Verify cross-tool usage: the agent can compare a Penpot frame with a Storybook story in a single prompt.

**Acceptance Criteria:**

> The AI agent executes the query: "Show me the args for story `shared-ui-button--primary` in Storybook and compare its `backgroundColor` with the Penpot frame `Button/Primary`" and produces a correct diff.

---

## Task 4: Export Design Tokens to W3C JSON + Add Sync Script

**Goal:** Create a machine-readable, W3C-standard token file that the AI agent can reference during fixes.

**Context:** Tokens currently live as TypeScript objects (`src/shared/ui/tokens/*.ts`) and CSS custom properties (`theme.css`). The legacy `figma/design-tokens/dist/tokens.json` contains only 2 radius tokens and is outdated. The project uses **Tailwind CSS v4** with `@theme` blocks.

**Steps:**

1. [ ] Export the full token set from Penpot into W3C Design Tokens Community Group format (JSON).
2. [ ] Save the file as `src/styles/design-tokens.json`.
3. [ ] Create `scripts/sync-tokens.ts` (or `sync-tokens.js`) that:
   - Reads `src/styles/design-tokens.json`
   - Regenerates `src/shared/ui/tokens/*.ts` and `src/shared/ui/tokens/theme.css`
   - Keeps existing TypeScript interfaces intact
4. [ ] Add npm script: `"sync:tokens": "tsx scripts/sync-tokens.ts"`
5. [ ] Run the script and verify the existing stories still render correctly.

**Acceptance Criteria:**

> `src/styles/design-tokens.json` exists, follows the W3C token format, contains all primitive + semantic + component tokens, and `npm run sync:tokens` regenerates the TypeScript/CSS sources without breaking Storybook builds.

---

## Task 5: Lint Rule Against Hardcoded Values

**Goal:** Enforce token usage so the AI agent (and humans) never have to guess whether a raw value is intentional.

**Context:** No stylelint or custom ESLint rule currently blocks raw `px`, `rem`, `hsl()`, or hex values in component styles. Tailwind v4 utility classes are preferred, but inline styles and arbitrary values still appear.

**Steps:**

1. [ ] Install `stylelint` + `stylelint-config-standard` (or add a custom ESLint rule if the project prefers to stay stylelint-free).
2. [ ] Configure the rule to flag hardcoded values for:
   - `color` / `background-color` (require token/CSS var)
   - `padding` / `margin` (require token/CSS var)
   - `font-size` / `line-height` (require token/CSS var)
   - `border-radius` (require token/CSS var)
   - `box-shadow` (require token/CSS var)
3. [ ] Add exceptions for `0`, `1px` borders, and animation durations.
4. [ ] Add the lint step to `npm run lint` (or as a separate `npm run lint:styles`).
5. [ ] Fix all existing violations in `src/shared/ui/` and `src/entities/`.

**Acceptance Criteria:**

> `npm run lint` (or the new stylelint command) passes with zero hardcoded-value violations in component files.

---

## Task 6: First AI Fix via Annotated Screenshot

**Goal:** Prove the full loop: Penpot design → harness diff → AI fix → verified Storybook render.

**Context:** The harness from Task 1 now provides local screenshot capture, Penpot frame export, and diff generation. This task uses that harness (not Chromatic CI) to identify, annotate, and fix visual mismatches. Chromatic remains the CI gate, but the iteration loop happens locally.

**Steps:**

1. [ ] Identify 3–5 visual mismatches between Penpot frames and current Storybook renders (e.g., wrong padding on `CartRow`, incorrect font-size on `EmptyState`, misaligned `CouponInput`). Use `npm run test:visual` to surface them automatically.
2. [ ] For each mismatch, run the harness:
   - `npm run storybook:screenshot -- --story shared-ui-cartrow--default` → baseline
   - `npx tsx scripts/visual-test/export-penpot-frame.ts --frame CartRow` → reference
   - `npx tsx scripts/visual-test/generate-diff.ts --before baseline.png --after reference.png --out diff.png` → annotated diff
3. [ ] Run the AI agent with the prompt template (see Task 7) for each mismatch. The agent uses:
   - `component-map.json` to find the Penpot frame and component file
   - `src/styles/design-tokens.json` for token values
   - The annotated diff image to understand what to fix
4. [ ] The agent edits the component's Tailwind classes or inline styles.
5. [ ] Re-run `npm run test:visual` to verify the diff is resolved (exit code 0).
6. [ ] Save before/after/diff triplets to `docs/visual-qa-examples/`.
7. [ ] Run the full quality gate: `npm run lint && npm run lint:arch && npm run build && npm run test:storybook`.

**Acceptance Criteria:**

> 3+ visual bugs are fixed by the AI agent in 1–2 iterations each. Each fix is documented with before/after screenshots and a brief explanation of which token was corrected.

**Prompt template for this task (to be refined in Task 7):**

```markdown
Task: fix the visual mismatch in component {COMPONENT_NAME}

Context:

- Current implementation screenshot: `.visual-test/baselines/{STORY_ID}.png`
- Design reference screenshot: `.visual-test/penpot-exports/{PENPOT_FRAME}.png`
- Annotated diff: `.visual-test/diffs/{STORY_ID}-diff.png`
- Project tokens: ./src/styles/design-tokens.json
- Component file: {COMPONENT_FILE_PATH} (from component-map.json)

Mismatches (annotated on the diff image):
{NUMBERED_LIST_OF_DIFFS}

Instructions:

1. Read the Penpot frame {PENPOT_FRAME} via MCP (or run `npx tsx scripts/visual-test/export-penpot-frame.ts --frame {PENPOT_FRAME}` if MCP is unavailable).
2. Read the component's current Storybook story to see existing args/classes.
3. Fix the component using Tailwind utility classes that map to tokens in design-tokens.json.
4. Do NOT use arbitrary values (e.g., `p-[13px]`). Use token-based classes only.
5. Run `npm run test:visual` to verify the diff is resolved (must exit 0).
6. Run the full quality gate: `npm run lint && npm run lint:arch && npm run build && npm run test:storybook`.
```

---

## Task 7: Document the AI Prompt Template

**Goal:** Create a reusable, team-wide prompt template so any engineer or agent can repeat the visual-fix workflow.

**Steps:**

1. [ ] Create `docs/ai-prompt-templates.md`.
2. [ ] Include:
   - Annotated-screenshot prompt (full template from Task 6)
   - Numeric-diff prompt (for Phase 2, when Playwright pixel-diff is ready)
   - Harness quick-reference: `npm run storybook:screenshot`, `npm run test:visual`, `component-map.json` schema
   - A "bad prompt" example and why it fails (e.g., missing token file path, vague descriptions)
3. [ ] Add a troubleshooting section:
   - Penpot MCP returns stale data → use `export-penpot-frame.ts` fallback
   - Chromatic snapshot is flaky → rely on local `test:visual` first
   - Diff threshold too sensitive → adjust in `scripts/visual-test/generate-diff.ts`
4. [ ] (Optional) Run a 15-minute team walkthrough.

**Acceptance Criteria:**

> `docs/ai-prompt-templates.md` is complete, reviewed by 1+ teammate, and linked from the main project README or AGENTS.md.

---

## Risks & Blockers

| Risk                                                                                      | Likelihood | Mitigation                                                                                                                                            |
| ----------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Playwright screenshot capture is flaky** (font loading, animation timing)               | Medium     | Add `waitUntil: 'networkidle'` and `fontsLoaded` check in `capture-story-screenshot.ts`; disable animations in `.storybook/preview.ts` for test mode  |
| **Penpot MCP server requires a running Penpot instance or cloud API token**               | Medium     | The Task 1 harness provides `export-penpot-frame.ts` as a fallback; MCP is preferred but not mandatory for Phase 1                                    |
| **Chromatic MCP package is still in beta and lacks Storybook 10 support**                 | Medium     | Pin to the latest stable version; if incompatible, use the Chromatic REST API (`chromatic.com/api`) as a temporary bridge                             |
| **W3C token export from Penpot loses Tailwind v4 `@theme` syntax details**                | Medium     | The `sync:tokens` script must be bi-directional: JSON → TS/CSS, with a manual review step for `@theme` block ordering                                 |
| **stylelint + Tailwind v4 arbitrary-value detection is noisy**                            | Low        | Whitelist `0`, `1px`, `100%`, and animation keyframes; run the rule only on `src/shared/ui/`, `src/entities/`, and `src/features/`                    |
| **AI agent makes incorrect fixes that look right in Storybook but break in the real app** | Medium     | Always verify fixes against the Vite dev build (`npm run dev`) and run the existing Vitest + Storybook test suites before marking done                |
| **Harness scripts add maintenance burden**                                                | Low        | Keep scripts in `scripts/visual-test/` with their own `README.md`; write them in TypeScript with strict typing; add unit tests for `generate-diff.ts` |

---

## Next Step After Completion

**Phase 2 — Semi-Automated Level (Playwright + Numeric Diff):**

- Replace annotated screenshots with Playwright pixel-diff tests using the existing harness from Task 1
- Compute numeric diffs (padding delta in px, color delta in LAB space) via `generate-diff.ts` enhancements
- AI agent receives structured diff data (JSON) in addition to images
- Integrate `test:visual` into GitHub Actions so CI fails on visual regressions
- Target: agent fixes bugs without human annotation

---

## Links & Resources

- Penpot MCP Server: https://github.com/penpot/penpot-mcp
- Chromatic MCP / AI: https://www.chromatic.com/ai
- W3C Design Tokens Format: https://design-tokens.github.io/community-group/format/
- Storybook Testing: https://storybook.js.org/docs/writing-tests
- Tailwind CSS v4 Theme: https://tailwindcss.com/docs/theme
- Existing project tokens: `src/shared/ui/tokens/README.md`

---

## Notes for the Team

- **All CSS fixes must use tokens** (Tailwind utilities mapping to `design-tokens.json` or CSS custom properties). No arbitrary values.
- **Each Task gets its own branch and PR**, except Task 6 which may span multiple small PRs (one per bug fix).
- **Harness scripts live in `scripts/visual-test/`** and follow the same quality gates as production code: `npm run lint && npm run lint:arch && npm run build`.
- **Before/after/diff screenshots from Task 6** go into `docs/visual-qa-examples/` with naming convention: `{component-name}-{bug-id}-before.png` / `{component-name}-{bug-id}-after.png` / `{component-name}-{bug-id}-diff.png`.
- **FSD compliance:** The `component-map.json` registry references slice public APIs only (e.g., `src/shared/ui/shadcn/button.tsx` via its `index.ts` export). Do not bypass public APIs.
- **spec-kitty workflow:** All harness changes (Task 1) go through a spec-kitty worktree just like any other code change. Do not edit `.storybook/` or `scripts/` directly in the main checkout.
- **Pre-push already includes `build-storybook`** (as of the latest update). The new harness adds `test:visual` on top of that for local visual regression before push.
- If a Task is blocked for > 2 days, escalate to the Phase 2 planning session rather than letting the ticket stall.
