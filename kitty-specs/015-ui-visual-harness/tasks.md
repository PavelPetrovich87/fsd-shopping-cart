# Tasks: UI Visual Harness

**Mission**: 015-ui-visual-harness
**Feature Directory**: `/Users/user/work/fsd-shopping-cart/kitty-specs/015-ui-visual-harness`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Subtask Index

| ID | Description | WP | Parallel |
|----|-------------|-----|----------|
| T001 | Add Playwright as dev dependency | WP01 | |
| T002 | Create visual-harness-config.ts | WP01 | |
| T003 | Create VisualHarness directory structure | WP01 | |
| T004 | Add /harness route to app routing | WP01 | |
| T005 | Set up visual-baselines and visual-diffs directories | WP01 | |
| T006 | Create story discovery utility | WP02 | [P] |
| T007 | Create story metadata parser | WP02 | [P] |
| T008 | Create VisualHarness.tsx main page | WP03 | |
| T009 | Create VisualHarness.stories.tsx | WP03 | |
| T010 | Create ComponentGrid.tsx | WP03 | |
| T011 | Create ComponentCard.tsx | WP03 | |
| T012 | Create FilterBar.tsx | WP03 | |
| T013 | Implement filtering logic | WP03 | |
| T014 | Implement inline preview expansion | WP03 | |
| T015 | Add responsive layout styling | WP03 | |
| T016 | Create playwright.config.ts for visual tests | WP04 | |
| T017 | Create visual-regression.spec.ts | WP04 | |
| T018 | Implement screenshot capture for viewports | WP04 | |
| T019 | Implement baseline storage | WP04 | |
| T020 | Implement diff generation | WP04 | |
| T021 | Implement CI build failure on diff | WP04 | |
| T022 | Generate visual test report | WP04 | |
| T023 | Create npm scripts for harness | WP05 | |
| T024 | Gallery tests (acceptance) | WP05 | |
| T025 | Add Storybook unavailable graceful degradation | WP05 | |
| T026 | Add empty gallery state message | WP05 | |
| T027 | Add component metadata display | WP05 | |
| T028 | Verify FSD compliance | WP05 | |
| T029 | Verify gallery load < 2s performance | WP05 | |
| T030 | Verify visual test suite < 5min for 50 stories | WP05 | |
| T031 | Update gitignore for baseline/diff directories | WP01 | |
| T032 | Finalize baseline storage path structure | WP04 | |
| T033 | Add viewport configuration to config | WP01 | |
| T034 | Add diff threshold configuration | WP01 | |

---

## WP01: Foundation & Config

**Goal**: Set up the infrastructure and configuration for the visual harness.

**Priority**: P0 (foundation - must be first)
**Success Criteria**: Configuration file exists, routes registered, directories created
**Test Criteria**: npm run harness:gallery starts without errors (requires Storybook)

### Subtasks

- [ ] T001 Add Playwright as dev dependency (WP01)
- [ ] T002 Create visual-harness-config.ts with all configuration (C-004) (WP01)
- [ ] T003 Create VisualHarness directory structure (WP01)
- [ ] T004 Add /harness route to app routing (FR-003.1) (WP01)
- [ ] T005 Set up visual-baselines and visual-diffs directories (WP01)
- [ ] T031 Update gitignore for baseline/diff directories (WP01)
- [ ] T033 Add viewport configuration to config (WP01)
- [ ] T034 Add diff threshold configuration (WP01)

**Dependencies**: None
**Parallel Opportunities**: T031-T034 can be done in parallel with T001-T005

---

## WP02: Story Discovery & Metadata

**Goal**: Create utilities to discover Storybook stories and parse metadata.

**Priority**: P0 (foundation - must be before gallery and tests can work)
**Success Criteria**: Story discovery returns component list with metadata
**Test Criteria**: Unit test verifies story discovery with existing button.stories.tsx

### Subtasks

- [ ] T006 Create story discovery utility (WP02)
- [ ] T007 Create story metadata parser (WP02)

**Dependencies**: WP01 (needs config to be set up)
**Parallel Opportunities**: T006 and T007 can be done in parallel

---

## WP03: Gallery Page

**Goal**: Build the component gallery page that displays all UI components.

**Priority**: P0 (user-facing feature)
**Success Criteria**: Gallery page displays component grid with filtering
**Test Criteria**: Storybook story for VisualHarness shows gallery with mock components

### Subtasks

- [ ] T008 Create VisualHarness.tsx main page (WP03)
- [ ] T009 Create VisualHarness.stories.tsx (WP03)
- [ ] T010 Create ComponentGrid.tsx (WP03)
- [ ] T011 Create ComponentCard.tsx (WP03)
- [ ] T012 Create FilterBar.tsx (WP03)
- [ ] T013 Implement filtering logic (FR-001.4, FR-003.3, FR-003.4) (WP03)
- [ ] T014 Implement inline preview expansion (FR-003.5) (WP03)
- [ ] T015 Add responsive layout styling (FR-003.2) (WP03)

**Dependencies**: WP01 (needs config and route), WP02 (needs story discovery)
**Parallel Opportunities**: T010-T012 can be done in parallel, then T013-T015

---

## WP04: Visual Regression Tests

**Goal**: Implement Playwright-based visual regression testing setup.

**Priority**: P1 (secondary but important)
**Success Criteria**: Visual tests run and produce baseline/diff artifacts
**Test Criteria**: Tests pass on first run with baseline creation, fail on intentional visual change

### Subtasks

- [ ] T016 Create playwright.config.ts for visual tests (WP04)
- [ ] T017 Create visual-regression.spec.ts (WP04)
- [ ] T018 Implement screenshot capture for viewports (FR-002.2) (WP04)
- [ ] T019 Implement baseline storage (FR-002.3) (WP04)
- [ ] T020 Implement diff generation (FR-002.5) (WP04)
- [ ] T021 Implement CI build failure on diff (FR-002.7) (WP04)
- [ ] T022 Generate visual test report (FR-002.6) (WP04)
- [ ] T032 Finalize baseline storage path structure (WP04)

**Dependencies**: WP01 (needs config), WP02 (needs story discovery)
**Parallel Opportunities**: T018-T022 can be done in sequence with T016-T017

---

## WP05: Polish & Integration

**Goal**: Final integration, edge cases, and verification.

**Priority**: P2 (polish)
**Success Criteria**: All acceptance criteria met, FSD compliance verified
**Test Criteria**: Full integration tests pass

### Subtasks

- [ ] T023 Create npm scripts for harness (WP05)
- [ ] T024 Gallery tests (acceptance) (WP05)
- [ ] T025 Add Storybook unavailable graceful degradation (WP05)
- [ ] T026 Add empty gallery state message (WP05)
- [ ] T027 Add component metadata display (FR-001.3) (WP05)
- [ ] T028 Verify FSD compliance (harness page only imports shared/entities/features/widgets) (WP05)
- [ ] T029 Verify gallery load < 2s performance (NFR-001) (WP05)
- [ ] T030 Verify visual test suite < 5min for 50 stories (NFR-002) (WP05)

**Dependencies**: WP03 (gallery), WP04 (visual tests)
**Parallel Opportunities**: T024-T027 can be done in parallel

---

## Summary

| WP | Subtasks | Estimated Lines |
|----|----------|-----------------|
| WP01 | 8 | ~350 |
| WP02 | 2 | ~250 |
| WP03 | 8 | ~450 |
| WP04 | 8 | ~500 |
| WP05 | 8 | ~350 |

**Total**: 34 subtasks across 5 work packages
**Size Validation**: ✓ All WPs within ideal range (3-10 subtasks, <700 lines)
**MVP Scope**: WP01 + WP02 + WP03 (foundation + gallery page)

---

## Work Package Prompt Files

| WP | Prompt File |
|----|-------------|
| WP01 | [WP01-foundation-config.md](./tasks/WP01-foundation-config.md) |
| WP02 | [WP02-story-discovery.md](./tasks/WP02-story-discovery.md) |
| WP03 | [WP03-gallery-page.md](./tasks/WP03-gallery-page.md) |
| WP04 | [WP04-visual-regression-tests.md](./tasks/WP04-visual-regression-tests.md) |
| WP05 | [WP05-polish-integration.md](./tasks/WP05-polish-integration.md) |
