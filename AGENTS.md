# AGENTS.md

Vendor-agnostic instructions for AI coding agents. For deep architectural context, see [ARCHITECTURE.md](./ARCHITECTURE.md). For enforceable rules, see [CONVENTIONS.md](./CONVENTIONS.md).

## Stack

React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, ESLint 9 (flat config), Steiger (FSD linter).

## Architecture: Feature-Sliced Design

```
app → pages → widgets → features → entities → shared
```

**One rule to remember:** dependencies flow DOWN only. Never import from a layer above. Never import across slices on the same layer.

Every slice exposes a single `index.ts` as its public API. Direct imports into internal folders (`ui/`, `model/`, `api/`) from outside the slice are forbidden.

## Commands

```bash
npm run lint        # ESLint — code quality + React rules
npm run lint:arch   # Steiger — FSD architecture linter
npm run build       # tsc -b + vite build — type-check and bundle
```

All commands must exit with code 0. Warnings are errors.

## Workflow

```
1. Explore current file structure (ls/glob src/) before writing code
2. For shared/ui components: write story first, then component (see Story-First Convention below)
3. Write code
4. Run: npm run lint
5. Errors? Read the message → fix → go to 4
6. Run: npm run lint:arch
7. Errors? Fix → go to 4
8. Run: npm run build
9. Errors? Fix → go to 8
10. Done only when ALL commands exit 0
```

Do not skip steps. Do not suppress warnings. The linter is your guide.

## Spec-Kitty Workflow Notes

- `spec-kitty` is an orchestrator. Its CLI scaffolds files and state; the agent writes the actual spec, plan, tasks, and code.
- **MANDATORY lane-based workflow**: ALL code changes MUST go through worktrees via `spec-kitty agent action implement <WP-ID>` — never edit files directly in the project root or main branch.
- When working on a WP through `spec-kitty implement`, all code edits MUST happen inside the allocated `.worktrees/.../` directory, never in the main checkout.
- Before starting implementation in a new worktree, verify the workspace is runnable. If project commands fail because dependencies are missing, run `npm install` in that worktree first.
- For automation, prefer `spec-kitty next --json`, `spec-kitty agent tasks status --json`, and `spec-kitty agent tasks validate-workflow ... --json` over the dashboard. Treat dashboard output as a convenience view, not the source of truth.
- **WP Lifecycle**: Work packages MUST progress through lanes: `planned` → `doing` → `for_review` → `approved` → `done`. Use `spec-kitty agent tasks move-task <WP-ID> --to <lane>` to transition.
- Before considering a WP ready for review, verify both project quality gates and workflow consistency.
- When adding unit tests, ensure they are executable through the project harness rather than existing only as files.

## Story-First Convention

When creating a UI component in `shared/ui/`:

1. Create `ComponentName.stories.tsx` FIRST — define all variants, sizes, and states as Storybook stories
2. Write the component implementation to satisfy the stories
3. Stories are executable specifications: Storybook compilation catches type/prop mismatches

Story format: Use CSF3 with `satisfies Meta<typeof Component>` for type safety.

## Bug Fix Workflow

When fixing a bug in `shared/ui/`:

1. Reproduce the bug as a story (e.g., `ButtonOverflow.stories.tsx`)
2. Verify the story shows the bug
3. Fix the component
4. The reproduction story stays as a regression guard — never delete it

## File Structure

```
src/
├── app/                → Providers, routing, global styles
├── pages/              → Route-level composition
├── widgets/            → Self-contained composite UI blocks
├── features/           → User interactions + business logic
│   └── <slice>/
├── entities/           → Business objects + data shapes
│   └── <slice>/
└── shared/             → Reusable, business-agnostic infrastructure
    ├── ui/
    ├── lib/
    ├── api/
    └── config/
```

Slices are added as the project grows. Always check the actual file system for current state — this diagram is a template, not a snapshot.

## Import Rules (Quick Reference)

| Rule                    | Example of violation                                          |
| ----------------------- | ------------------------------------------------------------- |
| No higher-level imports | `entities/` importing from `features/`                        |
| No cross-slice imports  | `features/cart` importing from `features/wishlist`            |
| Public API only         | `import { X } from '@/features/cart/ui/Button'`               |
| Relative inside slice   | `import { X } from '@/features/cart/model/store'` inside cart |
| Absolute between slices | `import { X } from '../../entities/product'`                  |
