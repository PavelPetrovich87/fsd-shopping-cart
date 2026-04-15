# UI Visual Harness

## 1. Overview

**Project:** Shopping Cart Application (FSD Architecture)
**Feature:** UI Visual Harness
**Type:** software-dev
**Mission:** 015-ui-visual-harness

### Summary

Create a comprehensive UI visual harness consisting of two parts: (1) a centralized component gallery that displays all Storybook stories in a single view for visual review, and (2) a Playwright-based visual regression testing setup that captures and compares UI screenshots across the application.

### Scope

This harness serves as the visual documentation and regression testing layer for all UI components in the shopping cart application. It does not implement business logic—only visual validation infrastructure.

---

## 2. User Scenarios & Testing

### Primary Users

1. **Frontend Developers** — Verify UI components render correctly across states and variants
2. **QA Engineers** — Run visual regression tests to catch unintended changes
3. **Design/Product** — Review visual consistency across the application

### User Flows

#### Flow 1: Component Gallery Review
1. Developer opens the harness page
2. Gallery displays all components organized by FSD layer (shared → entities → features → widgets)
3. Each component shows all its variants (size, state, theme)
4. Developer can filter by layer, component type, or search by name

#### Flow 2: Visual Regression Testing
1. CI pipeline triggers Playwright visual tests
2. Screenshots captured for all registered component stories
3. Screenshots compared against baseline images
4. Diff images generated for any visual changes
5. Report generated with pass/fail status

### Edge Cases

- **Empty gallery** — If no stories are registered, display a helpful message directing developers to create stories
- **Missing baseline** — On first run, establish baseline without failing tests
- **Storybook unavailable** — Harness should degrade gracefully if Storybook is not running

---

## 3. Functional Requirements

### FR-001: Component Gallery

| ID | Requirement | Status |
|----|-------------|--------|
| FR-001.1 | Display a grid of all registered UI components | pending |
| FR-001.2 | Organize components by FSD layer (shared, entities, features, widgets) | pending |
| FR-001.3 | Show component metadata: name, variant count, last updated | pending |
| FR-001.4 | Support filtering by layer and search by component name | pending |
| FR-001.5 | Link each component to its Storybook story for full interaction | pending |
| FR-001.6 | Display component in multiple states: default, hover, active, disabled | pending |

### FR-002: Visual Regression Testing Setup

| ID | Requirement | Status |
|----|-------------|--------|
| FR-002.1 | Playwright test suite that navigates to all Storybook stories | pending |
| FR-002.2 | Capture screenshot for each story viewport (desktop, mobile, tablet) | pending |
| FR-002.3 | Store baseline screenshots in versioned directory | pending |
| FR-002.4 | Compare new screenshots against baseline on each run | pending |
| FR-002.5 | Generate diff images when visual changes are detected | pending |
| FR-002.6 | Report generation with summary: passed, failed, new baselines needed | pending |
| FR-002.7 | Fail CI build when regressions are detected (unless baseline update flag set) | pending |

### FR-003: Harness Page

| ID | Requirement | Status |
|----|-------------|--------|
| FR-003.1 | Single-page application route (`/harness`) | pending |
| FR-003.2 | Responsive layout: grid adapts to screen size | pending |
| FR-003.3 | Navigation tabs/chips for filtering by FSD layer | pending |
| FR-003.4 | Search input for filtering by component name | pending |
| FR-003.5 | Click component card to expand inline preview | pending |

---

## 4. Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|----|-------------|-----------|--------|
| NFR-001 | Gallery page load time | < 2 seconds | pending |
| NFR-002 | Visual test suite execution time | < 5 minutes for 50 stories | pending |
| NFR-003 | Screenshot resolution | 1280×720 (desktop), 390×844 (mobile), 768×1024 (tablet) | pending |
| NFR-004 | Diff detection threshold | 0.1% pixel difference triggers failure | pending |
| NFR-005 | Baseline storage | Organized by component name + viewport + date | pending |

---

## 5. Constraints

| ID | Constraint | Status |
|----|------------|--------|
| C-001 | Must use existing Storybook stories as source of truth | pending |
| C-002 | Visual tests must run in CI without manual intervention | pending |
| C-003 | Harness page must not import from pages layer (FSD compliance) | pending |
| C-004 | All configuration must be in harness config file (no hardcoding) | pending |
| C-005 | Playwright config must be compatible with existing project setup | pending |

---

## 6. Key Entities

### HarnessConfig
```typescript
{
  storiesPattern: string;      // Glob pattern for story files
  viewportConfig: Viewport[];   // Screen sizes to test
  baselineDir: string;         // Where to store baseline images
  diffDir: string;            // Where to store diff images
  failOnDiff: boolean;        // Whether pixel diffs fail the build
  diffThreshold: number;      // 0.0 - 1.0 threshold for failure
}
```

### Viewport
```typescript
{
  name: 'desktop' | 'mobile' | 'tablet';
  width: number;
  height: number;
}
```

### ComponentCard (Gallery)
```typescript
{
  id: string;
  name: string;
  layer: 'shared' | 'entities' | 'features' | 'widgets';
  storyCount: number;
  variants: string[];
  lastUpdated: string;
  storyPath: string;  // Path to Storybook story
  previewImage: string;
}
```

---

## 7. Success Criteria

1. **Gallery loads and displays** all registered UI components within 2 seconds
2. **Filtering works correctly** — by layer (shared/entities/features/widgets) and by search term
3. **Visual regression tests run** in CI pipeline and produce baseline/screenshot/diff artifacts
4. **CI build fails** when visual regressions are detected (unless baseline update mode enabled)
5. **Diff threshold calibration** — 0.1% pixel difference reliably catches visual bugs without false positives
6. **Harness page is accessible** at `/harness` route without affecting production routes

---

## 8. Assumptions

1. Storybook is already configured in the project and stories follow CSF3 format
2. Playwright is available as dev dependency or will be added
3. The harness page will be added to existing routing (likely in app layer)
4. Baseline screenshots will be stored in `visual-baselines/` directory
5. GitHub Actions or similar CI is available for running visual tests

---

## 9. Dependencies

- **Storybook** — Source of truth for component stories
- **Playwright** — Screenshot capture and comparison
- **React Router** — For harness route (or existing routing solution)
- **Existing stories** — Button story identified as reference

---

## 10. Out of Scope

- Implementing actual UI components (those are in their respective tickets)
- Business logic or feature use cases
- Backend/API integration
- Performance testing beyond visual validation
