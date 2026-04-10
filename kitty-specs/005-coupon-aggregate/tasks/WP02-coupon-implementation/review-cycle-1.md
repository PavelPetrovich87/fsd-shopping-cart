**Issue 1 (blocking): Coupon aggregate is not implemented as a class with a private constructor.**
`src/entities/coupon/model/coupon.ts` exports `Coupon` as a factory object plus an interface, but WP02 acceptance criteria explicitly require a `Coupon` class with a private constructor and static factory methods. Please refactor to a class-based aggregate (`class Coupon`) with `private constructor(private readonly props: CouponProps)`, preserving the existing behavior.

**Issue 2 (blocking): Coupon implementation bypasses `Money` encapsulation using unsafe casts.**
`src/entities/coupon/model/coupon.ts` uses `toCents(amount)` with `(amount as unknown as { cents: number }).cents` to read a private field from `Money`. This violates aggregate safety and can break with any internal `Money` change. Replace this with an explicit public API on `Money` (e.g., getter/method) and update coupon logic/tests to use that API without private-field casting.
