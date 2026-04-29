---
affected_files: []
cycle_number: 1
mission_slug: 017-cart-control
reproduction_command:
reviewed_at: '2026-04-29T14:47:42Z'
reviewer_agent: unknown
verdict: rejected
wp_id: WP01
---

## Review Feedback — Alternative Approach Required

The previous implementation relied on plain `<button>` elements sized to 20×20 to match the Penpot design. This created maintenance issues:
1. CartControl had to live in `shared/ui/shadcn/` solely to bypass the `className` restriction on custom components
2. No reuse of the existing `shared/ui/shadcn/button` primitive, leading to duplicated hover/focus styles

### Required Changes (Alternative Approach)
- **Extend shadcn Button** with a new `icon-xs` variant (20×20) or use `size="icon-xs"` so CartControl can compose shadcn primitives
- **Move CartControl** to `shared/ui/cart-control/` (standard shared/ui slice) since it will no longer need raw `className` hacks
- **CartControl must remain** a stateless quantity selector: `[−] quantity [+]` per Penpot Option B
- Keep all existing stories and quality gate validations
