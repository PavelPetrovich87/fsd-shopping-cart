---
work_package_id: WP01
title: Money Value Object Implementation
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-001-001-shared-money-value-object
base_commit: df3a52f49f2f94375e8c4f0067204b5ad10dc204
created_at: '2026-04-08T12:44:03.955654+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
- T007
- T008
phase: Phase 1 - Implementation
lane: done
agent: "kilo"
shell_pid: "17427"
history:
- timestamp: '2026-04-08T11:15:00Z'
  lane: planned
  agent: system
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
- timestamp: '2026-04-08T12:52:00Z'
  lane: for_review
  agent: kilo
  shell_pid: ''
  action: Moved to for_review - Money VO implemented, all quality gates pass
- timestamp: '2026-04-08T13:57:00Z'
  lane: approved
  agent: kilo
  shell_pid: ''
  action: Review passed, approved for merge
- timestamp: '2026-04-08T14:10:00Z'
  lane: done
  agent: kilo
  shell_pid: ''
  action: Merged to main manually, workflow state reconciled
authoritative_surface: src/shared/lib
execution_mode: code_change
mission_id: 01KNPJJXYHRFTRHNEYEEBWT0Z1
owned_files:
- kitty-specs/001-001-shared-money-value-object/plan.md
- kitty-specs/001-001-shared-money-value-object/spec.md
- src/shared/lib/index.ts
- src/shared/lib/money.test.ts
- src/shared/lib/money.ts
wp_code: WP01
---

# Work Package Prompt: WP01 – Money Value Object Implementation

## Objectives & Success Criteria

- Implement `Money` class in `src/shared/lib/money.ts` with all required operations
- Create comprehensive unit tests in `src/shared/lib/money.test.ts`
- Update re-export in `src/shared/lib/index.ts`
- All quality gates pass: `npm run lint && npm run lint:arch && npm run build`

## Context & Constraints

- FSD Project: Feature-Sliced Design shopping cart
- Layer: `shared/lib/` (no cross-slice dependencies)
- Named exports only (no export default)
- Immutable Value Object pattern
- Pure TypeScript (no external dependencies)

Reference documents:
- spec.md: `kitty-specs/001-001-shared-money-value-object/spec.md`
- plan.md: `kitty-specs/001-001-shared-money-value-object/plan.md`
- charter: `.kittify/memory/charter.md`

## Subtasks & Detailed Guidance

### Subtask T001 – Create Money class file

**Purpose**: Establish the Money class with private constructor and basic structure.

**Steps**:
1. Create `src/shared/lib/money.ts`
2. Define private `cents` field (number, integer)
3. Define private `currency` field (string, default "USD")
4. Create private constructor
5. Export `Money` class with named export

**Files**: `src/shared/lib/money.ts` (new file)

### Subtask T002 – Implement fromPrice factory method

**Purpose**: Provide convenient factory for creating Money from dollar amounts.

**Steps**:
1. Add static method `Money.fromPrice(dollars: number): Money`
2. Convert dollars to cents: `dollars * 100`
3. Return new Money instance with calculated cents
4. Add TypeScript types: parameter is number, return is Money

**Files**: `src/shared/lib/money.ts`

**Example**: `Money.fromPrice(25)` returns Money with 2500 cents

### Subtask T003 – Implement arithmetic operations

**Purpose**: Enable add, subtract, multiply operations on Money values.

**Steps**:
1. Implement `add(other: Money): Money`
   - Assert same currency
   - Return new Money with `this.cents + other.cents`
2. Implement `subtract(other: Money): Money`
   - Assert same currency
   - Return new Money with `this.cents - other.cents`
3. Implement `multiply(factor: number): Money`
   - Use `Math.round(this.cents * factor)` to avoid floating-point issues
   - Return new Money with calculated cents

**Files**: `src/shared/lib/money.ts`

**Key constraint**: All operations must return NEW Money instances (immutability)

### Subtask T004 – Implement equals method

**Purpose**: Enable value-based equality comparison.

**Steps**:
1. Implement `equals(other: Money): boolean`
2. Compare both `cents` and `currency`
3. Return true if both match

**Files**: `src/shared/lib/money.ts`

**Test cases**:
- $10 equals $10 → true
- $10 equals $20 → false
- $10 USD equals $10 EUR → false

### Subtask T005 – Implement format method

**Purpose**: Provide human-readable currency string output.

**Steps**:
1. Implement `format(): string`
2. Use `Intl.NumberFormat` API
3. Configure: `style: "currency"`, `currency: this.currency`
4. Format: divide cents by 100 for display
5. Return formatted string

**Files**: `src/shared/lib/money.ts`

**Expected output**:
- `Money.fromPrice(25).format()` → "$25.00"
- `Money.fromPrice(100).format()` → "$100.00"
- `new Money(0, "USD").format()` → "$0.00"

### Subtask T006 – Create unit tests

**Purpose**: Verify all Money operations work correctly.

**Files**: `src/shared/lib/money.test.ts` (new file)

**Test structure**:
```typescript
import { describe, it, expect } from "vitest";
import { Money } from "./money";

describe("Money", () => {
  // fromPrice factory tests
  it("fromPrice stores correct cents", () => {
    expect(Money.fromPrice(25).cents).toBe(2500);
  });

  // Arithmetic tests
  it("adds two Money values", () => {
    const result = Money.fromPrice(10).add(Money.fromPrice(5));
    expect(result.cents).toBe(1500);
  });

  it("subtracts two Money values", () => {
    const result = Money.fromPrice(20).add(Money.fromPrice(5));
    expect(result.cents).toBe(1500);
  });

  it("multiplies Money by factor", () => {
    const result = Money.fromPrice(10).multiply(3);
    expect(result.cents).toBe(3000);
  });

  // Equality tests
  it("equals returns true for same value", () => {
    expect(Money.fromPrice(10).equals(Money.fromPrice(10))).toBe(true);
  });

  it("equals returns false for different value", () => {
    expect(Money.fromPrice(10).equals(Money.fromPrice(20))).toBe(false);
  });

  // Format tests
  it("formats $25 correctly", () => {
    expect(Money.fromPrice(25).format()).toBe("$25.00");
  });

  // Immutability tests
  it("original instance unchanged after add", () => {
    const original = Money.fromPrice(100);
    original.add(Money.fromPrice(50));
    expect(original.cents).toBe(10000);
  });
});
```

Run tests: `npx vitest run src/shared/lib/money.test.ts`

### Subtask T007 – Update re-export

**Purpose**: Make Money available via `shared/lib` public API.

**Steps**:
1. Open `src/shared/lib/index.ts`
2. Add export: `export { Money } from "./money";`
3. Ensure file has named exports only

**Files**: `src/shared/lib/index.ts`

### Subtask T008 – Run quality gates

**Purpose**: Verify all checks pass before completion.

**Steps**:
1. Run: `npm run lint`
2. Run: `npm run lint:arch`
3. Run: `npm run build`
4. All must exit with code 0

**Commands**:
```bash
npm run lint && npm run lint:arch && npm run build
```

## Test Strategy

Unit tests are REQUIRED per T-001 acceptance criteria.

- Framework: Vitest (already in devDependencies)
- Test file: `src/shared/lib/money.test.ts`
- Run command: `npx vitest run src/shared/lib/money.test.ts`
- Coverage: Must cover all operations + edge cases

## Risks & Mitigations

1. **Floating-point precision**: ALWAYS use integer cents internally
   - Mitigation: `Math.round()` for multiply, integer arithmetic only

2. **Immutability violations**: Methods modifying internal state
   - Mitigation: All methods return `new Money(...)`, never modify `this`

3. **Currency mismatch**: Operations on different currencies
   - Mitigation: Consider enforcing same-currency checks (optional for v1)

## Review Guidance

Key checkpoints for review:
- [ ] Money class exports named export only
- [ ] All operations return new Money instances
- [ ] fromPrice(25).format() returns "$25.00"
- [ ] Unit tests exist and all pass
- [ ] Re-exported from shared/lib/index.ts
- [ ] All quality gates pass

---

## Activity Log

> **CRITICAL**: Activity log entries MUST be in chronological order (oldest first, newest last).

- 2026-04-08T11:15:00Z – system – lane=planned – Prompt generated via /spec-kitty.tasks
- 2026-04-08T12:52:17Z – unknown – shell_pid=17427 – Money VO implemented, all quality gates pass
- 2026-04-08T13:41:31Z – kilo – shell_pid=17427 – Started review via action command
- 2026-04-08T13:43:28Z – kilo – shell_pid=17427 – Review passed: Money VO (USD/RUB) with 10 unit tests. All quality gates passed (lint, lint:arch, build, test:unit).
- 2026-04-08T14:10:52Z – kilo – shell_pid=17427 – Moved to done
