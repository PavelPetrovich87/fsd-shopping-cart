# Feature Specification: Shared Money Value Object

**Feature Branch**: `001-001-shared-money-value-object`
**Created**: 2026-04-08
**Status**: Draft
**Source**: docs/TICKETS.md T-001

## User Scenarios & Testing

### User Story 1 - Currency Arithmetic (Priority: P1)

As a developer, I need to perform arithmetic operations on monetary values without floating-point errors, so that financial calculations are always accurate.

**Why this priority**: This is the core use case - all domain entities (Cart, Coupon, etc.) depend on Money for price calculations.

**Independent Test**: Can be fully tested by creating Money instances and asserting arithmetic results.

**Acceptance Scenarios**:

1. **Given** $25.00 stored as cents, **When** adding $10.00, **Then** result is $35.00 (3500 cents)
2. **Given** $100.00 stored as cents, **When** subtracting $30.00, **Then** result is $70.00 (7000 cents)
3. **Given** $5.00 stored as cents, **When** multiplying by 3, **Then** result is $15.00 (1500 cents)
4. **Given** $10.00 and another $10.00, **When** checking equality, **Then** they are equal
5. **Given** $10.00 and $20.00, **When** checking equality, **Then** they are not equal

---

### User Story 2 - Currency Formatting (Priority: P1)

As a developer, I need to format Money values as human-readable currency strings, so that prices display correctly in the UI.

**Why this priority**: All UI components that display prices will use this formatting.

**Independent Test**: Can be fully tested by calling format() on Money instances and asserting the output string.

**Acceptance Scenarios**:

1. **Given** Money.fromPrice(25) (2500 cents), **When** calling format(), **Then** result is "$25.00"
2. **Given** Money.fromPrice(100) (10000 cents), **When** calling format(), **Then** result is "$100.00"
3. **Given** Money(0, "USD"), **When** calling format(), **Then** result is "$0.00"

---

### User Story 3 - Immutable Operations (Priority: P2)

As a developer, I need Money instances to be immutable, so that monetary values cannot be accidentally modified after creation.

**Why this priority**: Immutability prevents bugs where money amounts change unexpectedly.

**Independent Test**: Can be tested by calling operations and asserting the original instance is unchanged.

**Acceptance Scenarios**:

1. **Given** a Money instance with 100 cents, **When** calling add(50), **Then** the original instance still has 100 cents
2. **Given** a Money instance, **When** calling any mutating operation, **Then** a new instance is returned

---

## Requirements

### Functional Requirements

- **FR-001**: All arithmetic operations MUST use integer cents internally (no floating-point)
- **FR-002**: Money.fromPrice(n) MUST store n * 100 cents
- **FR-003**: Money MUST support: add, subtract, multiply, equals
- **FR-004**: Money.format() MUST return locale-aware currency string (default: USD, format: "$25.00")
- **FR-005**: All operations MUST return new Money instances (immutable)

### Key Entities

- **Money**: Value Object representing a monetary amount in cents, with factory method fromPrice()

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of arithmetic tests pass with exact integer results
- **SC-002**: Money.fromPrice(25).format() returns "$25.00"
- **SC-003**: Immutable operations verified by asserting original instance unchanged after each operation
- **SC-004**: Unit tests cover: happy path arithmetic, formatting, edge cases (zero, negative guard)
