# Data Model: UI Visual Harness

## Entities

### HarnessConfig

Central configuration for the visual harness.

| Field | Type | Description |
|-------|------|-------------|
| `storiesPattern` | `string` | Glob pattern to discover story files |
| `storybookUrl` | `string` | Base URL where Storybook is running |
| `viewportConfig` | `Viewport[]` | Viewport configurations |
| `baselineDir` | `string` | Directory for baseline screenshots |
| `diffDir` | `string` | Directory for diff images |
| `failOnDiff` | `boolean` | Whether diffs cause test failure |
| `diffThreshold` | `number` | Pixel difference threshold (0.0-1.0) |

### Viewport

Screen size configuration for screenshot capture.

| Field | Type | Description |
|-------|------|-------------|
| `name` | `'desktop' \| 'mobile' \| 'tablet'` | Viewport identifier |
| `width` | `number` | Screen width in pixels |
| `height` | `number` | Screen height in pixels |

### ComponentCard

Represents a UI component in the gallery.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (kebab-case component name) |
| `name` | `string` | Human-readable component name |
| `layer` | `'shared' \| 'entities' \| 'features' \| 'widgets'` | FSD layer |
| `storyCount` | `number` | Number of stories for this component |
| `variants` | `string[]` | List of variant names (e.g., ["Default", "Sizes", "Variants"]) |
| `lastUpdated` | `string` | ISO date of last story update |
| `storyPath` | `string` | Storybook story path (e.g., "UI/Button") |
| `previewImage` | `string` | Path to captured preview screenshot |

### VisualTestResult

Result of a visual regression test run.

| Field | Type | Description |
|-------|------|-------------|
| `component` | `string` | Component name |
| `viewport` | `string` | Viewport name |
| `passed` | `boolean` | Whether test passed |
| `diffRatio` | `number` | Pixel difference ratio (0.0-1.0) |
| `baselinePath` | `string` | Path to baseline image |
| `actualPath` | `string` | Path to actual screenshot |
| `diffPath` | `string` | Path to diff image (if failed) |

## Relationships

```
HarnessConfig
├── storiesPattern → Glob pattern for StoryFileDiscovery
├── storybookUrl → Base URL for Playwright navigation
└── viewportConfig → Viewport[]
    └── Viewport (multiplicity: 3)

ComponentCard
├── storyPath → Points to Storybook story
└── previewImage → Local screenshot file

VisualTestResult
├── baselinePath → visual-baselines/{component}/{viewport}/{date}.png
├── actualPath → Generated during test run
└── diffPath → visual-diffs/{component}/{viewport}/{date}.png
```

## File Storage Structure

```
visual-baselines/
└── {component}/
    └── {viewport}/
        └── {date}.png

visual-diffs/
└── {component}/
    └── {viewport}/
        └── {date}.png
```

## State Transitions

### Visual Test States

```
Idle → Running → Complete
                   ├── Passed (no visual changes)
                   └── Failed (diff > threshold)
                       └── Awaiting baseline update
```
