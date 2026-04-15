---
work_package_id: WP03
title: Gallery Page
dependencies:
- WP01
- WP02
requirement_refs:
- FR-001
- FR-003
planning_base_branch: main
merge_target_branch: main
branch_strategy: 'Current branch at workflow start: main. Planning/base branch: main. Completed changes merge into main.'
subtasks:
- T008
- T009
- T010
- T011
- T012
- T013
- T014
- T015
history:
- date: '2026-04-15'
  action: created
authoritative_surface: src/app/ui/VisualHarness/
execution_mode: code_change
owned_files:
- src/app/ui/VisualHarness/VisualHarness.tsx
- src/app/ui/VisualHarness/VisualHarness.stories.tsx
- src/app/ui/VisualHarness/components/ComponentGrid.tsx
- src/app/ui/VisualHarness/components/ComponentCard.tsx
- src/app/ui/VisualHarness/components/FilterBar.tsx
tags: []
---

# WP03: Gallery Page

## Objective

Build the component gallery page (`/harness`) that displays all UI components from Storybook stories in a filterable grid. This is the primary user-facing feature (FR-001, FR-003).

## Context

The gallery page serves as a visual index of all UI components. It uses Playwright to capture screenshots from running Storybook instances and displays them in a responsive grid with filtering. Users (developers, QA, design) can quickly scan all components, filter by FSD layer, and search by name.

**Key Dependencies**:
- `visual-harness-config.ts` — For Storybook URL
- `story-discovery.ts`, `story-metadata.ts` — For component list
- `/harness` route — Mount point (WP01)

**User Stories Served**:
- FR-001.1: Display grid of all registered components
- FR-001.2: Organize by FSD layer
- FR-001.3: Show component metadata
- FR-001.4: Support filtering by layer and search
- FR-001.5: Link to Storybook story
- FR-001.6: Display multiple states
- FR-003.2: Responsive layout
- FR-003.3: Navigation tabs/chips for filtering
- FR-003.4: Search input
- FR-003.5: Click to expand inline preview

## Subtask Details

### T008: Create VisualHarness.tsx main page

**Purpose**: Create the main gallery page component.

**Steps**:
1. Create `src/app/ui/VisualHarness/VisualHarness.tsx`
2. Implement component structure:

```typescript
import { useState, useEffect } from 'react';
import { discoverStories, storiesToComponentCards } from '@/shared/lib/story-discovery';
import { defaultConfig } from '@/shared/lib/visual-harness-config';
import { ComponentGrid } from './components/ComponentGrid';
import { FilterBar } from './components/FilterBar';
import type { StoryMetadata } from '@/shared/lib/story-metadata';

export function VisualHarness() {
  const [components, setComponents] = useState<StoryMetadata[]>([]);
  const [filter, setFilter] = useState<FsdLayer | 'all'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComponents();
  }, []);

  async function loadComponents() {
    try {
      setLoading(true);
      const stories = await discoverStories();
      const cards = storiesToComponentCards(stories);
      setComponents(cards);
      setError(null);
    } catch (err) {
      setError('Failed to load components. Is Storybook running?');
    } finally {
      setLoading(false);
    }
  }

  const filtered = components.filter(card => {
    const matchesLayer = filter === 'all' || card.layer === filter;
    const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
    return matchesLayer && matchesSearch;
  });

  return (
    <div className="visual-harness">
      <header>
        <h1>UI Component Gallery</h1>
        <p>Visual harness for {components.length} components</p>
      </header>
      
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        layers={['all', 'shared', 'entities', 'features', 'widgets']}
      />
      
      {loading && <div className="loading">Loading components...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && <ComponentGrid components={filtered} />}
    </div>
  );
}
```

3. Add CSS modules or inline styles for layout:
   - Responsive grid (CSS Grid)
   - Header section
   - Loading/error states

**Files**: `src/app/ui/VisualHarness/VisualHarness.tsx` (new)

**Validation**:
- [ ] Component renders without errors
- [ ] Loading state displays while fetching
- [ ] Error state displays if Storybook unavailable
- [ ] FSD-compliant (only imports from shared/lib, app/ui)

---

### T009: Create VisualHarness.stories.tsx

**Purpose**: Create Storybook story for the gallery page (story-first convention).

**Steps**:
1. Create `src/app/ui/VisualHarness/VisualHarness.stories.tsx`
2. Include stories for different states:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { VisualHarness } from './VisualHarness';

const meta = {
  title: 'App/VisualHarness',
  component: VisualHarness,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VisualHarness>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // Uses mock data for story
};

export const Empty: Story = {
  args: {
    components: [],
  },
};

export const Filtered: Story = {
  args: {
    filter: 'shared',
    search: 'button',
  },
};

export const StorybookUnavailable: Story = {
  args: {
    error: 'Storybook unavailable. Please ensure Storybook is running on localhost:6006',
  },
};
```

**Files**: `src/app/ui/VisualHarness/VisualHarness.stories.tsx` (new)

**Validation**:
- [ ] Storybook compiles without errors
- [ ] Stories demonstrate all gallery states
- [ ] CSF3 format with `satisfies Meta`

---

### T010: Create ComponentGrid.tsx

**Purpose**: Display components in a responsive grid layout.

**Steps**:
1. Create `src/app/ui/VisualHarness/components/ComponentGrid.tsx`
2. Implement grid layout:

```typescript
import type { StoryMetadata } from '@/shared/lib/story-metadata';
import { ComponentCard } from './ComponentCard';

interface ComponentGridProps {
  components: StoryMetadata[];
}

export function ComponentGrid({ components }: ComponentGridProps) {
  if (components.length === 0) {
    return (
      <div className="empty-state">
        <p>No components found.</p>
        <p>Create Storybook stories to see them here.</p>
      </div>
    );
  }

  return (
    <div className="component-grid">
      {components.map(component => (
        <ComponentCard key={component.id} component={component} />
      ))}
    </div>
  );
}
```

3. Add CSS Grid styles:
   - Desktop: 3-4 columns
   - Tablet: 2 columns
   - Mobile: 1 column
   - Gap between cards

**Files**: `src/app/ui/VisualHarness/components/ComponentGrid.tsx` (new)

**Validation**:
- [ ] Grid displays all components passed as props
- [ ] Responsive breakpoints work correctly
- [ ] Empty state displays when no components

---

### T011: Create ComponentCard.tsx

**Purpose**: Display individual component preview card with metadata.

**Steps**:
1. Create `src/app/ui/VisualHarness/components/ComponentCard.tsx`
2. Implement card component:

```typescript
import { useState } from 'react';
import type { StoryMetadata } from '@/shared/lib/story-metadata';

interface ComponentCardProps {
  component: StoryMetadata;
  onPreview?: (component: StoryMetadata) => void;
}

export function ComponentCard({ component, onPreview }: ComponentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const storybookUrl = `${defaultConfig.storybookUrl}/?path=/story/${component.storyPath}`;

  return (
    <div className="component-card" data-layer={component.layer}>
      <div className="card-header">
        <span className="layer-badge">{component.layer}</span>
        <span className="variant-count">{component.storyCount} variants</span>
      </div>
      
      <div className="card-preview" onClick={() => setExpanded(!expanded)}>
        {/* Screenshot preview image */}
        <img src={component.previewImage} alt={component.name} />
        {expanded && (
          <div className="expanded-preview">
            {/* Larger preview or iframe */}
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <h3>{component.name}</h3>
        <div className="variants">
          {component.variants.slice(0, 3).map(v => (
            <span key={v} className="variant-tag">{v}</span>
          ))}
          {component.variants.length > 3 && (
            <span className="more">+{component.variants.length - 3}</span>
          )}
        </div>
        <a href={storybookUrl} target="_blank" rel="noopener noreferrer">
          Open in Storybook
        </a>
      </div>
    </div>
  );
}
```

3. Include metadata display (FR-001.3):
   - Component name
   - FSD layer badge
   - Story count
   - Variant tags
   - Link to Storybook

**Files**: `src/app/ui/VisualHarness/components/ComponentCard.tsx` (new)

**Validation**:
- [ ] Card displays all component metadata
- [ ] Click expands inline preview (FR-003.5)
- [ ] "Open in Storybook" link works
- [ ] Layer badge shows correct layer

---

### T012: Create FilterBar.tsx

**Purpose**: Create filtering controls (layer tabs + search input).

**Steps**:
1. Create `src/app/ui/VisualHarness/components/FilterBar.tsx`
2. Implement filter bar:

```typescript
type FsdLayer = 'shared' | 'entities' | 'features' | 'widgets';

interface FilterBarProps {
  filter: FsdLayer | 'all';
  onFilterChange: (filter: FsdLayer | 'all') => void;
  search: string;
  onSearchChange: (search: string) => void;
  layers: Array<FsdLayer | 'all'>;
}

export function FilterBar({ filter, onFilterChange, search, onSearchChange, layers }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="layer-tabs">
        {layers.map(layer => (
          <button
            key={layer}
            className={`tab ${filter === layer ? 'active' : ''}`}
            onClick={() => onFilterChange(layer)}
          >
            {layer === 'all' ? 'All' : layer.charAt(0).toUpperCase() + layer.slice(1)}
          </button>
        ))}
      </div>
      
      <input
        type="search"
        placeholder="Search components..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
}
```

3. Style tabs and search input:
   - Active tab highlighted
   - Search input with icon
   - Responsive (stack on mobile)

**Files**: `src/app/ui/VisualHarness/components/FilterBar.tsx` (new)

**Validation**:
- [ ] All layer options render as tabs
- [ ] Active tab is visually distinct
- [ ] Search input filters on change
- [ ] Clicking tab updates filter

---

### T013: Implement filtering logic

**Purpose**: Connect filter bar to component grid (FR-001.4, FR-003.3, FR-003.4).

**Steps**:
1. Implement filtering in VisualHarness.tsx:
   - Layer filter: show only components from selected layer
   - Search filter: case-insensitive substring match on component name
   - Combined: both filters apply simultaneously

2. Filter logic:
```typescript
const filtered = components.filter(card => {
  const matchesLayer = filter === 'all' || card.layer === filter;
  const matchesSearch = search === '' || 
    card.name.toLowerCase().includes(search.toLowerCase());
  return matchesLayer && matchesSearch;
});
```

**Files**: `src/app/ui/VisualHarness/VisualHarness.tsx` (modify T008)

**Validation**:
- [ ] Layer filter works (select "shared" → only shared components)
- [ ] Search filter works (type "button" → only components with "button")
- [ ] Combined filters work (layer: entities, search: "cart")
- [ ] Clearing search shows all filtered layer components

---

### T014: Implement inline preview expansion

**Purpose**: Allow clicking component card to see larger preview (FR-003.5).

**Steps**:
1. Add expanded state to ComponentCard:
   - Default: show thumbnail preview
   - Expanded: show larger preview or iframe with Storybook story

2. Expansion can use:
   - Playwright screenshot as preview image
   - Or iframe embedding Storybook story URL (if Storybook is accessible)

3. Add expansion animation and close mechanism:
   - Click card to expand
   - Click outside or "X" to close
   - ESC key to close

**Files**: `src/app/ui/VisualHarness/components/ComponentCard.tsx` (modify T011)

**Validation**:
- [ ] Click on card expands preview
- [ ] Expanded view shows larger preview
- [ ] Close mechanism works (X button, click outside, ESC)
- [ ] Multiple expanded cards handled correctly

---

### T015: Add responsive layout styling

**Purpose**: Ensure gallery works on desktop, tablet, and mobile (FR-003.2).

**Steps**:
1. ComponentGrid responsive:
   - Desktop (>1024px): 4 columns
   - Tablet (768-1024px): 2 columns
   - Mobile (<768px): 1 column

2. FilterBar responsive:
   - Desktop: tabs inline with search
   - Mobile: tabs stack above search

3. ComponentCard sizing:
   - Aspect ratio maintained
   - Text scales appropriately

4. Add CSS media queries or Tailwind classes

**Files**: CSS files for VisualHarness components

**Validation**:
- [ ] Desktop: 4-column grid, inline filters
- [ ] Tablet: 2-column grid
- [ ] Mobile: 1-column grid, stacked filters
- [ ] No horizontal scroll on any viewport

## Definition of Done

- [ ] Gallery page renders at `/harness`
- [ ] All components display in responsive grid
- [ ] Layer filtering works (FR-001.4, FR-003.3)
- [ ] Search filtering works (FR-001.4, FR-003.4)
- [ ] ComponentCard shows metadata (name, layer, variants) (FR-001.3)
- [ ] Click expands inline preview (FR-003.5)
- [ ] "Open in Storybook" link works (FR-001.5)
- [ ] Responsive layout at all breakpoints (FR-003.2)
- [ ] FSD-compliant (only imports from allowed layers)
- [ ] VisualHarness story passes Storybook compilation

## Risks

1. **Playwright dependency**: Gallery needs Playwright to capture screenshots. If Storybook unavailable, show graceful error.
2. **Screenshot storage**: Pre-captured screenshots stored in baseline directory. Gallery loads these.

## Reviewer Guidance

- Verify FSD compliance: VisualHarness can only import from shared, entities, features, widgets (not pages)
- Verify filtering works with both layer AND search
- Check responsive breakpoints at 768px and 1024px
- Verify Storybook links use correct storyPath format
- Check that empty state message directs developers to create stories
