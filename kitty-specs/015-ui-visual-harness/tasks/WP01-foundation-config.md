---
work_package_id: WP01
title: Foundation & Config
dependencies: []
requirement_refs:
- FR-003
planning_base_branch: main
merge_target_branch: main
branch_strategy: 'Current branch at workflow start: main. Planning/base branch: main. Completed changes merge into main.'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T031
- T033
- T034
history:
- date: '2026-04-15'
  action: created
authoritative_surface: src/shared/lib/
execution_mode: code_change
owned_files:
- src/shared/lib/visual-harness-config.ts
- src/app/routing/**
- visual-baselines/**
- visual-diffs/**
- .gitignore
tags: []
---

# WP01: Foundation & Config

## Objective

Set up the infrastructure and configuration for the UI visual harness. This WP creates the configuration file that all other harness components depend on (C-004: no hardcoding), establishes the directory structure, and registers the `/harness` route.

## Context

The visual harness needs a centralized configuration to avoid hardcoded values. The configuration file will be imported by the gallery page, the visual regression tests, and the npm scripts. This ensures consistency across all harness components.

**Key Dependencies Created:**
- `visual-harness-config.ts` — Used by WP02, WP03, WP04, WP05
- `/harness` route — Mount point for gallery page (WP03)
- Directory structure — Storage for baselines and diffs (WP04)

## Subtask Details

### T001: Add Playwright as dev dependency

**Purpose**: Install Playwright with screenshot testing capabilities.

**Steps**:
1. Add Playwright to package.json devDependencies:
   ```bash
   npm install -D @playwright/test
   npx playwright install chromium
   ```
2. Verify installation by checking `node_modules/@playwright/test`

**Files**: `package.json` (modify)

**Validation**:
- [ ] `@playwright/test` appears in devDependencies
- [ ] `npx playwright test` runs without errors

---

### T002: Create visual-harness-config.ts

**Purpose**: Centralize all harness configuration in one file per C-004.

**Steps**:
1. Create `src/shared/lib/visual-harness-config.ts`
2. Export the HarnessConfig interface and default config:

```typescript
export interface Viewport {
  name: 'desktop' | 'mobile' | 'tablet';
  width: number;
  height: number;
}

export interface HarnessConfig {
  storiesPattern: string;      // Glob pattern: "src/**/*.stories.tsx"
  storybookUrl: string;        // Base URL: "http://localhost:6006"
  viewportConfig: Viewport[];  // Screen sizes
  baselineDir: string;         // "visual-baselines"
  diffDir: string;             // "visual-diffs"
  failOnDiff: boolean;        // Whether pixel diffs fail the build
  diffThreshold: number;       // 0.0-1.0 threshold (0.001 = 0.1%)
}

export const defaultConfig: HarnessConfig = {
  storiesPattern: 'src/**/*.stories.tsx',
  storybookUrl: 'http://localhost:6006',
  viewportConfig: [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 768, height: 1024 },
  ],
  baselineDir: 'visual-baselines',
  diffDir: 'visual-diffs',
  failOnDiff: true,
  diffThreshold: 0.001, // 0.1%
};
```

3. Create `src/shared/lib/index.ts` export if it doesn't exist

**Files**: `src/shared/lib/visual-harness-config.ts` (new)

**Validation**:
- [ ] File exists at correct path
- [ ] TypeScript compiles without errors
- [ ] Interface matches spec.md data model
- [ ] Viewport dimensions match NFR-003 (1280×720, 390×844, 768×1024)
- [ ] diffThreshold is 0.001 (0.1% per NFR-004)

---

### T003: Create VisualHarness directory structure

**Purpose**: Establish the file organization for the harness gallery.

**Steps**:
1. Create directory structure:
   ```
   src/app/ui/VisualHarness/
   ├── VisualHarness.tsx
   ├── VisualHarness.stories.tsx
   └── components/
       ├── ComponentGrid.tsx
       ├── ComponentCard.tsx
       └── FilterBar.tsx
   ```

**Files**: Directory structure (no content yet)

**Validation**:
- [ ] Directory created at correct path
- [ ] Files will be created in subsequent WPs

---

### T004: Add /harness route to app routing

**Purpose**: Register the harness page route (FR-003.1).

**Steps**:
1. Examine existing routing setup in `src/app/routing/`
2. Add `/harness` route pointing to `VisualHarness` component
3. Ensure route is protected/available in development only (optional gate)

**Files**: `src/app/routing/**` (modify existing)

**Validation**:
- [ ] Route `/harness` accessible when app is running
- [ ] Route does not conflict with existing routes

---

### T005: Set up visual-baselines and visual-diffs directories

**Purpose**: Create directories for screenshot storage (FR-002.3, FR-002.5).

**Steps**:
1. Create directories:
   ```bash
   mkdir -p visual-baselines
   mkdir -p visual-diffs
   ```
2. Add placeholder `.gitkeep` files to preserve directory structure

**Files**: `visual-baselines/`, `visual-diffs/` (directories)

**Validation**:
- [ ] Directories exist at project root
- [ ] Directories are gitignored (T031)

---

### T031: Update gitignore for baseline/diff directories

**Purpose**: Prevent large binary files from entering version control.

**Steps**:
1. Add to `.gitignore`:
   ```
   visual-baselines/
   visual-diffs/
   ```

**Files**: `.gitignore` (modify)

**Validation**:
- [ ] `.gitignore` contains both entries
- [ ] Running `git status` in visual-baselines shows no files

---

### T033: Add viewport configuration to config

**Purpose**: Ensure viewport configuration is complete and documented.

**Steps**:
1. Already done in T002 (config file). Verify:
   - Desktop: 1280×720 ✓
   - Mobile: 390×844 ✓
   - Tablet: 768×1024 ✓

**Validation**: Part of T002 validation

---

### T034: Add diff threshold configuration

**Purpose**: Ensure diff threshold is configurable (NFR-004).

**Steps**:
1. Already done in T002 (config file). Verify diffThreshold is 0.001 (0.1%)

**Validation**: Part of T002 validation

---

## Implementation Sketch

**Order of execution**:
1. T001 (install Playwright) — enables verification of other tasks
2. T002 (config file) — creates the central config other tasks depend on
3. T003 (directory structure) — creates empty directories
4. T004 (routing) — adds the route
5. T005 (storage dirs) — creates storage directories
6. T031 (gitignore) — prevents accidentally committing binaries
7. T033, T034 — part of config validation

**Parallel opportunities**:
- T003, T005 can be done in parallel with T001, T002
- T031 can be done independently

## Definition of Done

- [ ] Playwright installed and verified
- [ ] `visual-harness-config.ts` created with correct interface
- [ ] HarnessConfig matches spec.md data model exactly
- [ ] Viewport dimensions correct (NFR-003)
- [ ] diffThreshold is 0.001 (NFR-004)
- [ ] Directory structure created
- [ ] `/harness` route registered
- [ ] `visual-baselines/` and `visual-diffs/` directories exist
- [ ] `.gitignore` updated
- [ ] All TypeScript compiles without errors

## Risks

1. **Storybook URL hardcoded**: Ensure `storybookUrl` can be overridden via environment variable for CI
2. **Path resolution**: Use absolute paths from project root, not relative

## Reviewer Guidance

- Verify HarnessConfig interface matches spec.md exactly
- Verify viewport dimensions are correct per NFR-003
- Verify diffThreshold is 0.001 per NFR-004
- Ensure no hardcoded values in config file
- Check that owned_files globs are accurate
