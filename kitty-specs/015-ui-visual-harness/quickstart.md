# UI Visual Harness - Quickstart

## Prerequisites

- Node.js 18+
- npm 9+
- Storybook running on `localhost:6006`
- Playwright browsers installed (`npx playwright install`)

## Setup

```bash
# Install project dependencies
npm install

# Install Playwright browsers
npx playwright install

# Start Storybook (required for harness)
npm run storybook
```

## Running the Harness Gallery

The harness gallery displays all Storybook stories captured via Playwright:

```bash
# With Storybook running on localhost:6006
# Open http://localhost:5173/harness in your browser
```

## Running Visual Regression Tests

```bash
# Run visual regression tests
npm run test:visual

# Update baselines (first run or after intentional visual changes)
UPDATE_BASELINES=true npm run test:visual
```

## Adding New Components

1. Create Storybook story following CSF3 format (see `src/shared/ui/shadcn/button.stories.tsx`)
2. Stories are auto-discovered via glob pattern `src/**/*.stories.tsx`
3. Gallery will automatically include new component

## Configuration

All configuration is in `src/shared/lib/visual-harness-config.ts`:

```typescript
export const harnessConfig: HarnessConfig = {
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

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Gallery shows "Storybook unavailable" | Ensure Storybook is running on localhost:6006 |
| Tests fail with "baseline not found" | Run with `UPDATE_BASELINES=true` to establish baselines |
| Diff images too noisy | Adjust `diffThreshold` in config (higher = less sensitive) |
