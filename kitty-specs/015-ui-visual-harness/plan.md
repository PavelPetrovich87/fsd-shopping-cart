# Implementation Plan: UI Visual Harness
*Path: [templates/plan-template.md](templates/plan-template.md)*

**Branch**: `015-ui-visual-harness` | **Date**: 2026-04-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/kitty-specs/015-ui-visual-harness/spec.md`

## Summary

Create a UI visual harness consisting of two parts: (1) a centralized component gallery using Playwright to capture Storybook story screenshots for visual review, and (2) a Playwright-based visual regression testing setup that captures and compares UI screenshots across viewports. Approach A (Playwright-powered) was selected for the gallery.

## Technical Context

**Language/Version**: TypeScript 5.9
**Primary Dependencies**: Playwright, Storybook (CSF3 stories), React Router
**Storage**: File-based (baseline screenshots in `visual-baselines/`, diffs in `visual-diffs/`)
**Testing**: Playwright visual regression tests
**Target Platform**: Web (desktop, mobile, tablet viewports)
**Project Type**: Single web application (React + Vite)
**Performance Goals**: Gallery load < 2s, visual test suite < 5min for 50 stories
**Constraints**: FSD-compliant (harness page cannot import from pages layer), no hardcoded config
**Scale/Scope**: ~10-20 components initially, extensible structure

## Engineering Alignment

- Playwright will be used both for gallery screenshot capture (visiting Storybook URLs) and for visual regression testing
- Storybook must be running during gallery view and visual tests
- All config in `src/shared/lib/visual-harness-config.ts` (no hardcoding)
- Gallery page at `/harness` route (app layer routing)
- Baseline storage: `visual-baselines/{component}/{viewport}/{date}.png`
- Diff storage: `visual-diffs/{component}/{viewport}/{date}.png`

## Charter Check

*Note: Charter governance has unresolved template_set issue. Proceeding with project-level decisions.*

**Charter Compliance**: No conflicts detected with charter requirements.

## Project Structure

### Documentation (this feature)

```
kitty-specs/015-ui-visual-harness/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (not needed - all clarifications resolved)
├── data-model.md        # Phase 1 output (entities defined in spec)
├── quickstart.md        # Phase 1 output (developer setup guide)
├── contracts/           # Phase 1 output (not applicable - no external APIs)
└── tasks.md             # Phase 2 output (/spec-kitty.tasks - NOT created by /spec-kitty.plan)
```

### Source Code (repository root)

```
src/
├── shared/lib/
│   └── visual-harness-config.ts    # All harness configuration (C-004)
├── app/
│   ├── routing/                     # Add /harness route (FR-003.1)
│   └── ui/
│       └── VisualHarness/           # Gallery page (FR-001, FR-003)
│           ├── VisualHarness.tsx
│           ├── VisualHarness.stories.tsx
│           └── components/
│               ├── ComponentGrid.tsx
│               ├── ComponentCard.tsx
│               └── FilterBar.tsx
├── shared/ui/shadcn/                # Existing shared components
├── entities/                        # Entity UI components
├── features/                        # Feature UI components
├── widgets/                         # Widget components
visual-baselines/                    # Baseline screenshots (gitignored)
visual-diffs/                        # Diff images (gitignored)
tests/
└── visual/
    ├── playwright.config.ts
    ├── harness-gallery.spec.ts      # Gallery page tests
    └── visual-regression.spec.ts   # Screenshot comparison tests
```

**Structure Decision**: Using Playwright-powered approach (A) — gallery page uses Playwright to visit Storybook story URLs and capture screenshots. Harness page renders captured screenshots in a grid with filtering.

## Phase 0: Research (Not Required)

All technical decisions resolved during planning interrogation:
- Approach A selected (Playwright-powered gallery)
- Tech stack confirmed: TypeScript, Playwright, React Router
- No external API integrations requiring research
- No [NEEDS CLARIFICATION] markers remain

## Phase 1: Design & Contracts

### Data Model (from spec entities)

**HarnessConfig**
```typescript
interface HarnessConfig {
  storiesPattern: string;      // Glob pattern for story files: "src/**/*.stories.tsx"
  storybookUrl: string;        // Base Storybook URL: "http://localhost:6006"
  viewportConfig: Viewport[];  // Screen sizes to test
  baselineDir: string;         // "visual-baselines"
  diffDir: string;             // "visual-diffs"
  failOnDiff: boolean;        // Whether pixel diffs fail the build
  diffThreshold: number;       // 0.0 - 1.0 threshold for failure (0.001 = 0.1%)
}
```

**Viewport**
```typescript
interface Viewport {
  name: 'desktop' | 'mobile' | 'tablet';
  width: number;
  height: number;
}
```

**ComponentCard (Gallery)**
```typescript
interface ComponentCard {
  id: string;
  name: string;
  layer: 'shared' | 'entities' | 'features' | 'widgets';
  storyCount: number;
  variants: string[];
  lastUpdated: string;
  storyPath: string;   // Path to Storybook story: "UI/Button"
  previewImage: string; // Path to captured preview
}
```

### Contracts (Not Applicable)

This feature has no external API contracts. All interactions are:
- Direct React component rendering (gallery page)
- Playwright browser automation (screenshot capture)
- File system storage (baseline/diff images)

### Quickstart

```bash
# Development setup
npm install

# Run Storybook (required for harness gallery)
npm run storybook

# In another terminal, run harness gallery
# (requires Storybook running on localhost:6006)
npm run harness:gallery

# Run visual regression tests
npm run test:visual

# Update baselines
UPDATE_BASELINES=true npm run test:visual

# Open harness page
open http://localhost:5173/harness
```

## Complexity Tracking

*No charter violations requiring justification.*

## Gates

- [x] Branch contract confirmed (main → main)
- [x] Planning question answered (Approach A selected)
- [x] Spec quality checklist passed
- [x] No unresolved [NEEDS CLARIFICATION] markers
