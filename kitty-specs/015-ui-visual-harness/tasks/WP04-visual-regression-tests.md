---
work_package_id: WP04
title: Visual Regression Tests
dependencies:
- WP01
- WP02
requirement_refs:
- FR-002
planning_base_branch: main
merge_target_branch: main
branch_strategy: 'Current branch at workflow start: main. Planning/base branch: main. Completed changes merge into main.'
subtasks:
- T016
- T017
- T018
- T019
- T020
- T021
- T022
- T032
history:
- date: '2026-04-15'
  action: created
authoritative_surface: tests/visual/
execution_mode: code_change
owned_files:
- tests/visual/playwright.config.ts
- tests/visual/harness-gallery.spec.ts
- tests/visual/visual-regression.spec.ts
tags: []
---

# WP04: Visual Regression Tests

## Objective

Implement Playwright-based visual regression testing setup that captures screenshots of Storybook stories across multiple viewports, compares them against baselines, and generates reports. This is the foundation for CI-integrated visual testing.

## Context

Visual regression tests run in CI to catch unintended visual changes. They navigate to each Storybook story, capture screenshots at configured viewports, compare against baselines, and fail if differences exceed threshold.

**Key Dependencies**:
- `visual-harness-config.ts` — Viewports, thresholds, storage paths
- `story-discovery.ts` — Story list to iterate

**FR Coverage**: FR-002.1, FR-002.2, FR-002.3, FR-002.4, FR-002.5, FR-002.6, FR-002.7

## Subtask Details

### T016: Create playwright.config.ts for visual tests

**Purpose**: Configure Playwright for visual regression testing.

**Steps**:
1. Create `tests/visual/playwright.config.ts`
2. Configure for screenshot testing:

```typescript
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:6006', // Storybook URL
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  webServer: {
    command: 'npm run storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

3. Key settings:
   - `testDir`: Location of visual tests
   - `baseURL`: Storybook running URL
   - `screenshot`: only-on-failure (we handle captures explicitly)
   - `webServer`: Auto-start Storybook for tests

**Files**: `tests/visual/playwright.config.ts` (new)

**Validation**:
- [ ] Config file syntax valid
- [ ] Playwright recognizes test directory
- [ ] CI-appropriate settings (retries, parallelism)

---

### T017: Create visual-regression.spec.ts

**Purpose**: Create the main visual regression test suite.

**Steps**:
1. Create `tests/visual/visual-regression.spec.ts`
2. Implement test structure:

```typescript
import { test, expect } from '@playwright/test';
import { defaultConfig } from '../../../src/shared/lib/visual-harness-config';
import { discoverStories, storiesToComponentCards } from '../../../src/shared/lib/story-discovery';

test.describe('Visual Regression', () => {
  let componentCards: StoryMetadata[];

  test.beforeAll(async () => {
    const stories = await discoverStories();
    componentCards = storiesToComponentCards(stories);
  });

  test('captures baseline screenshots', async ({ page }) => {
    // This runs when UPDATE_BASELINES=true
  });

  test('compares against baseline', async ({ page }) => {
    // This runs normally and compares
  });
});
```

3. Implement full test suite with:
   - Loop through all story components
   - Loop through all viewports
   - Navigate to each Storybook story
   - Capture screenshot
   - Compare against baseline
   - Generate diff on failure

**Files**: `tests/visual/visual-regression.spec.ts` (new)

**Validation**:
- [ ] Tests discover all story files
- [ ] Tests iterate through all viewports
- [ ] Screenshot comparisons work

---

### T018: Implement screenshot capture for viewports

**Purpose**: Capture screenshots at configured viewports (FR-002.2).

**Steps**:
1. Add screenshot capture logic:

```typescript
async function captureStoryScreenshot(
  page: Page,
  storyPath: string,
  viewport: Viewport
): Promise<Buffer> {
  // Set viewport size
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  
  // Navigate to Storybook story
  const storyUrl = `${defaultConfig.storybookUrl}/?path=/story/${storyPath}`;
  await page.goto(storyUrl);
  
  // Wait for story to load (canvas is present)
  await page.waitForSelector('#storybook-root', { timeout: 10000 });
  
  // Give time for any animations/transitions
  await page.waitForTimeout(500);
  
  // Capture screenshot
  return await page.screenshot({
    type: 'png',
    fullPage: false,
  });
}
```

2. Viewport handling:
   - Desktop: 1280×720
   - Mobile: 390×844
   - Tablet: 768×1024

3. Story loading:
   - Wait for `#storybook-root` or `.sb-show-main` to be present
   - Timeout after 10 seconds
   - Handle Storybook not running error

**Files**: `tests/visual/visual-regression.spec.ts` (modify T017)

**Validation**:
- [ ] Screenshot captured at each viewport size
- [ ] Viewport dimensions match config (NFR-003)
- [ ] Story loading timeout works
- [ ] Error handling for Storybook unavailable

---

### T019: Implement baseline storage

**Purpose**: Store baseline screenshots organized by component, viewport, date (FR-002.3).

**Steps**:
1. Implement baseline storage path logic:

```typescript
function getBaselinePath(componentId: string, viewport: Viewport, date: string): string {
  return path.join(
    defaultConfig.baselineDir,
    componentId,
    viewport.name,
    `${date}.png`
  );
}

async function saveBaseline(
  componentId: string,
  viewport: Viewport,
  screenshot: Buffer
): Promise<void> {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const baselinePath = getBaselinePath(componentId, viewport, date);
  
  // Create directory if not exists
  await fs.mkdir(path.dirname(baselinePath), { recursive: true });
  
  // Write file
  await fs.writeFile(baselinePath, screenshot);
}
```

2. Storage structure:
   ```
   visual-baselines/
   ├── button/
   │   ├── desktop/
   │   │   └── 2026-04-15.png
   │   ├── mobile/
   │   │   └── 2026-04-15.png
   │   └── tablet/
   │       └── 2026-04-15.png
   └── product-card/
       └── ...
   ```

3. First run behavior (FR-002.3 edge case):
   - If baseline doesn't exist, save as new baseline without comparison
   - Set `isFirstRun = true`

**Files**: `tests/visual/visual-regression.spec.ts` (modify T017)

**Validation**:
- [ ] Baseline saved in correct path structure
- [ ] Directory created automatically
- [ ] First run creates baseline without failure
- [ ] Date-based naming for version history

---

### T020: Implement diff generation

**Purpose**: Generate diff images when screenshots differ (FR-002.5).

**Steps**:
1. Implement comparison logic:

```typescript
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch'; // or similar

interface ComparisonResult {
  passed: boolean;
  diffRatio: number;        // 0.0 - 1.0
  diffBuffer?: Buffer;       // Diff image if failed
}

async function compareScreenshots(
  baseline: Buffer,
  actual: Buffer,
  width: number,
  height: number
): Promise<ComparisonResult> {
  const baselineImg = PNG.sync.read(baseline);
  const actualImg = PNG.sync.read(actual);
  
  const diff = new PNG(width, height);
  const diffPixelCount = pixelmatch(
    baselineImg.data,
    actualImg.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );
  
  const diffRatio = diffPixelCount / (width * height);
  const passed = diffRatio <= defaultConfig.diffThreshold;
  
  return {
    passed,
    diffRatio,
    diffBuffer: passed ? undefined : PNG.sync.write(diff),
  };
}
```

2. Diff storage:

```typescript
function getDiffPath(componentId: string, viewport: Viewport, date: string): string {
  return path.join(
    defaultConfig.diffDir,
    componentId,
    viewport.name,
    `${date}.png`
  );
}
```

3. Diff threshold per NFR-004: 0.1% = 0.001

**Files**: `tests/visual/visual-regression.spec.ts` (modify T017)

**Validation**:
- [ ] Identical screenshots pass (diffRatio = 0)
- [ ] Visual changes produce diff image
- [ ] Threshold correctly applied (0.001 = 0.1%)
- [ ] Diff image stored in correct path

---

### T021: Implement CI build failure on diff

**Purpose**: Fail CI build when regressions are detected (FR-002.7).

**Steps**:
1. After comparison, decide pass/fail:

```typescript
if (!result.passed) {
  // Save diff image
  await saveDiffImage(componentId, viewport, result.diffBuffer);
  
  // Fail the test if failOnDiff is true and not in update mode
  if (defaultConfig.failOnDiff && !process.env.UPDATE_BASELINES) {
    throw new Error(
      `Visual regression detected for ${componentId}@${viewport.name}. ` +
      `Diff ratio: ${(result.diffRatio * 100).toFixed(2)}%`
    );
  }
}
```

2. Environment variables:
   - `UPDATE_BASELINES=true` — Save new baselines, don't fail
   - `CI=true` — Enable stricter settings (more retries)

3. Test behavior:
   - Normal CI run: fail on any diff > threshold
   - Baseline update run: save new baselines, don't fail

**Files**: `tests/visual/visual-regression.spec.ts` (modify T017)

**Validation**:
- [ ] Test fails when diff exceeds threshold
- [ ] Test passes when UPDATE_BASELINES=true
- [ ] Error message includes component and diff ratio
- [ ] Diff image saved for debugging

---

### T022: Generate visual test report

**Purpose**: Generate test report with summary (FR-002.6).

**Steps**:
1. Implement report generation:

```typescript
interface TestResult {
  componentId: string;
  viewport: string;
  passed: boolean;
  diffRatio: number;
  baselinePath: string;
  diffPath?: string;
}

function generateReport(results: TestResult[]): string {
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const newBaselines = results.filter(r => r.diffRatio === 0 && !r.baselineExists).length;
  
  return `
# Visual Regression Report
Generated: ${new Date().toISOString()}

## Summary
- Total: ${results.length}
- Passed: ${passed}
- Failed: ${failed}
- New Baselines: ${newBaselines}

## Failures
${results.filter(r => !r.passed).map(r => `
- ${r.componentId} @ ${r.viewport}: ${(r.diffRatio * 100).toFixed(2)}% diff
  Baseline: ${r.baselinePath}
  Diff: ${r.diffPath}
`).join('\n')}

## New Baselines Needed
${results.filter(r => r.newBaseline).map(r => `
- ${r.componentId} @ ${r.viewport}
`).join('\n')}
`;
}
```

2. Save report:
   - Write to `visual-diffs/report.md`
   - Also output to CI console

3. Attach to test results:
   - Playwright HTML reporter
   - Custom JSON summary for CI parsing

**Files**: `tests/visual/visual-regression.spec.ts` (modify T017)

**Validation**:
- [ ] Report generated with correct statistics
- [ ] Failed components listed with diff ratios
- [ ] New baselines identified
- [ ] Report saved to file

---

### T032: Finalize baseline storage path structure

**Purpose**: Ensure consistent path structure (FR-002.3, NFR-005).

**Steps**:
1. Finalize path structure from spec:
   - `visual-baselines/{component}/{viewport}/{date}.png`
   - `visual-diffs/{component}/{viewport}/{date}.png`

2. Review and ensure all file operations use same path logic:
   - Screenshot capture → save to baseline path
   - Comparison → read from baseline path
   - Diff generation → save to diff path

3. Validate path format:
   - Component ID: kebab-case, derived from Storybook title
   - Viewport: 'desktop', 'mobile', 'tablet'
   - Date: ISO date string (YYYY-MM-DD)

**Files**: Path utilities used across T018-T022

**Validation**:
- [ ] All paths follow consistent format
- [ ] Paths are platform-independent (use path.join)
- [ ] NFR-005 satisfied (organized by component + viewport + date)

## Definition of Done

- [ ] Playwright config created and valid
- [ ] Visual tests discover all Storybook stories
- [ ] Screenshots captured at all 3 viewports
- [ ] Baseline storage follows path structure
- [ ] Diff generation produces diff images
- [ ] CI build fails on visual regression (unless UPDATE_BASELINES=true)
- [ ] Report generated with pass/fail summary
- [ ] All paths use config values (no hardcoding)

## Risks

1. **Pixel noise**: Small pixel differences (anti-aliasing) may cause flaky tests. Use threshold carefully.
2. **Storybook performance**: Screenshot capture may timeout on slow Storybook. Increase timeout if needed.
3. **Screenshot timing**: Animations/transitions may cause inconsistent screenshots. Add wait times.

## Reviewer Guidance

- Verify threshold is 0.001 (0.1%) per NFR-004
- Check that UPDATE_BASELINES mode doesn't fail tests
- Verify report includes all required statistics
- Check that diff images are generated only on failure
- Verify screenshot resolution matches viewport config (NFR-003)
