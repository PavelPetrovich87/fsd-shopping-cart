---
work_package_id: WP05
title: Polish & Integration
dependencies:
- WP03
- WP04
requirement_refs: []
planning_base_branch: main
merge_target_branch: main
branch_strategy: 'Current branch at workflow start: main. Planning/base branch: main. Completed changes merge into main.'
subtasks:
- T023
- T024
- T025
- T026
- T027
- T028
- T029
- T030
history:
- date: '2026-04-15'
  action: created
authoritative_surface: src/app/ui/VisualHarness/
execution_mode: code_change
owned_files:
- package.json
- src/app/ui/VisualHarness/**
- tests/visual/**
tags: []
---

# WP05: Polish & Integration

## Objective

Final integration, edge cases handling, npm scripts setup, and verification that all acceptance criteria are met. This WP ensures the harness is production-ready and all NFRs are satisfied.

## Context

By this point, the gallery page (WP03) and visual tests (WP04) are implemented. This WP adds the finishing touches: npm scripts for easy execution, graceful degradation for edge cases, and verification of all acceptance criteria.

**Key Dependencies**:
- WP03: Gallery page implementation
- WP04: Visual regression tests

**Acceptance Criteria Coverage**:
- NFR-001: Gallery load < 2 seconds
- NFR-002: Visual test suite < 5 minutes for 50 stories
- Edge cases: Storybook unavailable, empty gallery

## Subtask Details

### T023: Create npm scripts for harness

**Purpose**: Add convenient npm scripts for running harness and tests.

**Steps**:
1. Add to `package.json`:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "harness:gallery": "vite --open /harness",
    "test:visual": "playwright test",
    "test:visual:update": "UPDATE_BASELINES=true playwright test",
    "test:visual:report": "playwright show-report"
  }
}
```

2. Consider adding:
   - `harness:open` — Opens gallery page in browser
   - `test:visual:debug` — Debug mode with headed browser

3. Document scripts in quickstart.md

**Files**: `package.json` (modify)

**Validation**:
- [ ] `npm run storybook` starts Storybook on port 6006
- [ ] `npm run harness:gallery` opens gallery page
- [ ] `npm run test:visual` runs visual regression tests
- [ ] `UPDATE_BASELINES=true npm run test:visual` updates baselines

---

### T024: Gallery tests (acceptance)

**Purpose**: Write acceptance tests for the gallery page.

**Steps**:
1. Create `tests/visual/harness-gallery.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Harness Gallery', () => {
  test('loads the harness page', async ({ page }) => {
    await page.goto('http://localhost:5173/harness');
    
    // Page loads
    await expect(page.locator('h1')).toContainText('UI Component Gallery');
  });

  test('displays components in grid', async ({ page }) => {
    await page.goto('http://localhost:5173/harness');
    
    // Wait for components to load
    await page.waitForSelector('.component-grid');
    
    // Verify grid has cards
    const cards = page.locator('.component-card');
    await expect(await cards.count()).toBeGreaterThan(0);
  });

  test('filters by layer', async ({ page }) => {
    await page.goto('http://localhost:5173/harness');
    
    // Click "shared" tab
    await page.click('button:has-text("shared")');
    
    // Verify only shared components shown
    const cards = page.locator('.component-card[data-layer="shared"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify no other layers
    const otherCards = page.locator('.component-card:not([data-layer="shared"])');
    expect(await otherCards.count()).toBe(0);
  });

  test('searches by component name', async ({ page }) => {
    await page.goto('http://localhost:5173/harness');
    
    // Type in search
    await page.fill('input[type="search"]', 'button');
    
    // Verify filtered results
    const cards = page.locator('.component-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
```

2. Run against running app and Storybook

**Files**: `tests/visual/harness-gallery.spec.ts` (new)

**Validation**:
- [ ] Gallery page loads at /harness
- [ ] Components display in grid
- [ ] Layer filtering works
- [ ] Search filtering works
- [ ] Empty search shows all filtered layer components

---

### T025: Add Storybook unavailable graceful degradation

**Purpose**: Handle case when Storybook is not running (FR-002 edge case).

**Steps**:
1. Modify VisualHarness.tsx error handling:

```typescript
async function loadComponents() {
  try {
    setLoading(true);
    const stories = await discoverStories();
    
    // Verify Storybook is accessible
    const response = await fetch(`${defaultConfig.storybookUrl}/`);
    if (!response.ok) {
      throw new Error('StorybookUnreachable');
    }
    
    const cards = storiesToComponentCards(stories);
    setComponents(cards);
    setError(null);
  } catch (err) {
    if (err.message === 'StorybookUnreachable') {
      setError(
        'Storybook is not running. Please start Storybook with `npm run storybook` ' +
        'and ensure it is accessible at ' + defaultConfig.storybookUrl
      );
    } else {
      setError('Failed to load components. Please try again.');
    }
  } finally {
    setLoading(false);
  }
}
```

2. Visual feedback:
   - Show warning icon
   - Provide clear instructions
   - Link to Storybook URL

**Files**: `src/app/ui/VisualHarness/VisualHarness.tsx` (modify)

**Validation**:
- [ ] Error message shown when Storybook unreachable
- [ ] Error includes actionable instructions
- [ ] Retry mechanism available

---

### T026: Add empty gallery state message

**Purpose**: Show helpful message when no stories are discovered (FR-001 edge case).

**Steps**:
1. Modify ComponentGrid empty state:

```typescript
export function ComponentGrid({ components }: ComponentGridProps) {
  if (components.length === 0) {
    return (
      <div className="empty-gallery">
        <div className="empty-icon">📦</div>
        <h2>No Components Found</h2>
        <p>
          This gallery displays Storybook stories from the <code>src/</code> directory.
        </p>
        <p>
          To add components:
        </p>
        <ol>
          <li>Create a Storybook story file (e.g., <code>src/shared/ui/Button.stories.tsx</code>)</li>
          <li>Follow the CSF3 format with a <code>meta</code> export</li>
          <li>Add a <code>title</code> property to define the component name</li>
        </ol>
        <p>
          See <code>src/shared/ui/shadcn/button.stories.tsx</code> for an example.
        </p>
      </div>
    );
  }
  // ... rest of grid
}
```

2. Style the empty state:
   - Centered content
   - Clear instructions
   - Link to existing example

**Files**: `src/app/ui/VisualHarness/components/ComponentGrid.tsx` (modify)

**Validation**:
- [ ] Empty state displays when no components found
- [ ] Instructions are actionable
- [ ] Example reference provided
- [ ] FSD-compliant (no business logic)

---

### T027: Add component metadata display

**Purpose**: Ensure all component metadata is displayed on cards (FR-001.3).

**Steps**:
1. Verify ComponentCard displays all metadata:

```typescript
// Required fields from ComponentCard interface:
// - id: string
// - name: string
// - layer: 'shared' | 'entities' | 'features' | 'widgets'
// - storyCount: number
// - variants: string[]
// - lastUpdated: string
// - storyPath: string
// - previewImage: string
```

2. Display on card:
   - **Name**: Card title
   - **Layer**: Badge with layer name
   - **Story count**: "X variants"
   - **Variants**: First 3 variant tags + "+N more" if >3
   - **Last updated**: Tooltip or secondary text
   - **Storybook link**: "Open in Storybook" link

**Files**: `src/app/ui/VisualHarness/components/ComponentCard.tsx` (modify)

**Validation**:
- [ ] All metadata fields displayed
- [ ] Variant count accurate
- [ ] Layer badge shows correct layer
- [ ] "Open in Storybook" link correct

---

### T028: Verify FSD compliance

**Purpose**: Ensure harness page follows FSD import rules.

**Steps**:
1. Check imports in all VisualHarness files:

```typescript
// ✓ ALLOWED imports for src/app/ui/VisualHarness/
import from '@/shared/lib/...'          // shared/lib is OK
import from '@/shared/ui/...'          // shared/ui is OK
import from '@/entities/...'           // entities is OK
import from '@/features/...'           // features is OK
import from '@/widgets/...'            // widgets is OK

// ✗ FORBIDDEN imports
import from '@/pages/...'             // pages layer is NOT allowed
import from '@/app/...' (other files) // other app files not allowed
```

2. Run architecture lint:
   ```bash
   npm run lint:arch
   ```

3. Verify no import violations

**Files**: All files in `src/app/ui/VisualHarness/`

**Validation**:
- [ ] No imports from `pages/` layer
- [ ] No circular dependencies
- [ ] `lint:arch` passes

---

### T029: Verify gallery load < 2s performance

**Purpose**: Ensure gallery meets NFR-001.

**Steps**:
1. Performance measurement:

```typescript
// Add to VisualHarness
const loadStart = performance.now();
const stories = await discoverStories();
const loadTime = performance.now() - loadStart;

if (loadTime > 2000) {
  console.warn(`Gallery load took ${loadTime}ms, exceeding 2s threshold`);
}
```

2. Optimizations if needed:
   - Cache story discovery results
   - Lazy load component screenshots
   - Preload visible images only

3. Manual verification:
   - Open browser DevTools
   - Navigate to /harness
   - Check Network tab for load time

**Files**: `src/app/ui/VisualHarness/VisualHarness.tsx`

**Validation**:
- [ ] Gallery page load time < 2 seconds
- [ ] Performance measured and logged if exceeded

---

### T030: Verify visual test suite < 5min for 50 stories

**Purpose**: Ensure visual tests meet NFR-002.

**Steps**:
1. Performance measurement in tests:

```typescript
test('visual regression performance', async () => {
  const start = performance.now();
  
  // Run visual tests
  const results = await runVisualTests();
  
  const duration = performance.now() - start;
  const storiesPerMinute = results.total / (duration / 60000);
  
  console.log(`Visual test suite: ${(duration/60000).toFixed(1)} minutes for ${results.total} stories`);
  
  // NFR-002: < 5 minutes for 50 stories = 10 stories/minute minimum
  expect(storiesPerMinute).toBeGreaterThan(10);
});
```

2. Optimizations if needed:
   - Parallel test execution (Playwright workers)
   - Screenshot compression
   - Reduce wait times for fast Storybook

3. Manual verification:
   - Run full test suite
   - Measure total time

**Files**: `tests/visual/visual-regression.spec.ts`

**Validation**:
- [ ] 50 stories complete in < 5 minutes
- [ ] Performance logged
- [ ] Optimization applied if needed

## Definition of Done

- [ ] npm scripts work correctly
- [ ] Acceptance tests pass
- [ ] Storybook unavailable shows graceful error
- [ ] Empty gallery shows actionable message
- [ ] Component metadata fully displayed
- [ ] FSD compliance verified
- [ ] Gallery load < 2s verified
- [ ] Visual test suite < 5min for 50 stories verified
- [ ] All lint and build checks pass

## Risks

1. **Performance variance**: CI machines may be slower than development machines. Allow margin in NFR measurements.

## Reviewer Guidance

- Verify all npm scripts are documented
- Verify acceptance tests cover primary flows
- Check error messages are user-friendly
- Verify FSD compliance (no pages imports)
- Confirm performance measurements taken
- Check lint and build pass
