---
work_package_id: WP02
title: Story Discovery & Metadata
dependencies:
- WP01
requirement_refs:
- FR-001
- FR-002
planning_base_branch: main
merge_target_branch: main
branch_strategy: 'Current branch at workflow start: main. Planning/base branch: main. Completed changes merge into main.'
subtasks:
- T006
- T007
history:
- date: '2026-04-15'
  action: created
authoritative_surface: src/shared/lib/
execution_mode: code_change
owned_files:
- src/shared/lib/story-discovery.ts
- src/shared/lib/story-metadata.ts
tags: []
---

# WP02: Story Discovery & Metadata

## Objective

Create utilities to discover Storybook stories and parse their metadata. These utilities are the foundation for both the gallery page (WP03) and the visual regression tests (WP04) — without story discovery, neither can function.

## Context

The visual harness needs to automatically find all Storybook stories in the codebase. Each story file follows CSF3 format and contains metadata about the component. The discovery utility will scan files matching the glob pattern from `visual-harness-config.ts`, and the metadata parser will extract component information.

**Key Dependencies**:
- `src/shared/lib/visual-harness-config.ts` — Provides `storiesPattern`
- WP02 output is consumed by WP03 (gallery) and WP04 (visual tests)

## Subtask Details

### T006: Create story discovery utility

**Purpose**: Scan the codebase for Storybook story files and return their paths.

**Steps**:
1. Create `src/shared/lib/story-discovery.ts`
2. Implement `discoverStories()` function:

```typescript
import { defaultConfig } from './visual-harness-config';
import fs from 'fs';
import path from 'path';

export interface DiscoveredStory {
  filePath: string;      // Absolute path to story file
  componentName: string; // Derived from filename
  layer: FsdLayer;      // 'shared' | 'entities' | 'features' | 'widgets'
}

type FsdLayer = 'shared' | 'entities' | 'features' | 'widgets';

/**
 * Recursively find all story files matching storiesPattern
 */
export async function discoverStories(): Promise<DiscoveredStory[]> {
  const pattern = defaultConfig.storiesPattern;
  // Use glob or recursive directory scanning
  // Filter to only .stories.tsx files
  // Extract component name from filename (e.g., button.stories.tsx → Button)
  // Determine FSD layer from path (src/shared/ui → shared, src/entities → entities, etc.)
}
```

3. Extract layer from path:
   - `src/shared/` → `shared`
   - `src/entities/` → `entities`
   - `src/features/` → `features`
   - `src/widgets/` → `widgets`
   - `src/pages/` → `pages` (excluded per C-003)

4. Handle edge cases:
   - Story files in nested directories
   - Story files not matching expected patterns
   - Empty directories

**Files**: `src/shared/lib/story-discovery.ts` (new)

**Validation**:
- [ ] Discovers `button.stories.tsx` when pattern is `src/**/*.stories.tsx`
- [ ] Returns correct layer for each story
- [ ] Handles nested paths correctly
- [ ] Excludes non-story files
- [ ] Unit test passes with existing button.stories.tsx

---

### T007: Create story metadata parser

**Purpose**: Parse story files to extract component metadata (variants, story names).

**Steps**:
1. Create `src/shared/lib/story-metadata.ts`
2. Implement `parseStoryMetadata()` function:

```typescript
import { DiscoveredStory, discoverStories } from './story-discovery';

export interface StoryMetadata {
  componentId: string;      // kebab-case component name
  name: string;             // Human-readable name
  layer: FsdLayer;
  storyCount: number;       // Number of stories for this component
  variants: string[];        // Story names (e.g., ["Default", "Variants", "Sizes"])
  lastUpdated: string;       // ISO date from file mtime
  storyPath: string;         // Storybook path (e.g., "UI/Button")
}

/**
 * Parse story file to extract metadata
 */
export function parseStoryMetadata(story: DiscoveredStory): StoryMetadata {
  // Read file content
  // Parse CSF3 format to find:
  // - Component title (from meta.title)
  // - Story exports (Default, Variants, Sizes, etc.)
  // - Component name for ComponentCard
}
```

3. Parse CSF3 metadata:
   - Extract `title` from meta (e.g., `title: 'UI/Button'`)
   - Count story exports (named exports that are Story objects)
   - Extract variant names

4. Map to ComponentCard format:

```typescript
export function storiesToComponentCards(stories: DiscoveredStory[]): StoryMetadata[] {
  // Group stories by component
  // For each component:
  // - id: kebab-case of component name
  // - name: from title
  // - layer: from path
  // - storyCount: number of stories
  // - variants: story names
  // - lastUpdated: file mtime
  // - storyPath: Storybook path (title)
}
```

**Files**: `src/shared/lib/story-metadata.ts` (new)

**Validation**:
- [ ] Correctly parses `button.stories.tsx` metadata
- [ ] Extracts component name "Button" from title "UI/Button"
- [ ] Lists all variants (Default, Variants, Sizes, Disabled)
- [ ] Returns StoryMetadata[] matching spec interface
- [ ] Handles story files with single story
- [ ] Handles story files with multiple stories

## Implementation Sketch

**Order of execution**:
1. T006 (story discovery) — discovers files
2. T007 (metadata parser) — parses discovered files

**Parallel opportunities**: These two tasks are sequential (T007 needs T006's output), but individual functions can be developed with clear interfaces.

**Integration point**: These utilities will be imported by:
- `VisualHarness.tsx` (WP03) — for gallery display
- `visual-regression.spec.ts` (WP04) — for screenshot capture

## Definition of Done

- [ ] `discoverStories()` returns DiscoveredStory[] for existing stories
- [ ] `parseStoryMetadata()` correctly extracts component title
- [ ] `storiesToComponentCards()` returns StoryMetadata[] matching ComponentCard interface
- [ ] Unit tests cover:
  - Single story file parsing
  - Multiple stories in one file
  - Layer detection from path
  - Empty/invalid story file handling
- [ ] Integration with `visual-harness-config.ts` (imports storiesPattern)

## Risks

1. **Story file parsing complexity**: CSF3 files have varying structures. Start with simple parsing (regex for meta.title) and expand.
2. **Performance**: For large codebases, story discovery could be slow. Consider caching.
3. **File system timing**: lastUpdated from mtime may change on git operations

## Reviewer Guidance

- Verify returned StoryMetadata matches ComponentCard interface in spec.md
- Verify layer detection is correct for each FSD layer
- Check that story variants are correctly enumerated
- Ensure no hardcoded values (use config storiesPattern)
- Check that files outside FSD layers (pages) are excluded
