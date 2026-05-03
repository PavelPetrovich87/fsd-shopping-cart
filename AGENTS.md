# AGENTS.md

Vendor-agnostic instructions for AI coding agents.

## Agent-Specific Configuration

| Agent | Config file |
|-------|-------------|
| Claude Code | `CLAUDE.md` or `CLAUDE-for-fsd-project.md` |
| Kimi (OpenClaw / Kimi Claw) | `KIMI.md` |

Load your agent-specific file AFTER reading this document.

## Stack

React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, ESLint 9 (flat config), Steiger (FSD linter).

## Skill Routing (MANDATORY)

Before editing any file, identify applicable skills by path match and load them via the skill tool.

| Path pattern               | Required skills                                                            |
| -------------------------- | -------------------------------------------------------------------------- |
| `src/**`                   | `fsd-architecture`                                                         |
| `src/shared/ui/**`         | `story-first-ui` + `fsd-ui-styling-constraints` + `tailwind-design-system` |
| `src/entities/**/model/**` | `domain-modeling-plain-objects`                                            |
| `src/features/**/model/**` | `domain-modeling-plain-objects`                                            |
| `src/entities/**/api/**`   | `domain-modeling-plain-objects` (Ports & Adapters ref)                     |

If the directory of the file you are editing contains `README.md` or `DOMAIN.md`,
read it to understand slice-specific business rules.

## Commands

```bash
npm run lint        # ESLint — code quality + React rules
npm run lint:arch   # Steiger — FSD architecture linter
npm run build       # tsc -b + vite build — type-check and bundle
```

All commands must exit with code 0. Warnings are errors.

## Workflow

1. Explore current file structure (ls/glob src/) before writing code
2. Identify applicable skills by path match (see table above)
3. Load applicable skills
4. Write code following skill instructions
5. Run: npm run lint
6. Errors? Read the message → fix → go to 5
7. Run: npm run lint:arch
8. Errors? Fix → go to 5
9. Run: npm run build
10. Errors? Fix → go to 9
11. If you added custom Tailwind classes (e.g., `text-error-600`), verify the CSS rule exists:
    `grep '<class-name>' dist/assets/index-*.css`
12. Done only when ALL commands exit 0

## Spec-Kitty Workflow Notes

- `spec-kitty` is an orchestrator. Its CLI scaffolds files and state; the agent writes the actual spec, plan, tasks, and code.
- **MANDATORY lane-based workflow**: ALL code changes MUST go through worktrees via `spec-kitty agent action implement <WP-ID>` — never edit files directly in the project root or main branch.
- When working on a WP through `spec-kitty implement`, all code edits MUST happen inside the allocated `.worktrees/.../` directory, never in the main checkout.
- Before starting implementation in a new worktree, verify the workspace is runnable. If project commands fail because dependencies are missing, run `npm install` in that worktree first.
- For automation, prefer `spec-kitty next --json`, `spec-kitty agent tasks status --json`, and `spec-kitty agent tasks validate-workflow ... --json` over the dashboard. Treat dashboard output as a convenience view, not the source of truth.
- **WP Lifecycle**: Work packages MUST progress through lanes: `planned` → `doing` → `for_review` → `approved` → `done`. Use `spec-kitty agent tasks move-task <WP-ID> --to <lane>` to transition.
- Before considering a WP ready for review, verify both project quality gates and workflow consistency.
- When adding unit tests, ensure they are executable through the project harness rather than existing only as files.

## Planning Artifacts vs Actual Code

`docs/TICKETS.md`, `kitty-specs/`, and `.kilo/plans/` are planning artifacts.
They may contain file paths, component names, or structural decisions that no longer match the actual codebase.

When implementing any ticket or plan:

1. **Always check the actual file system first** — use `ls`/`glob` to see what exists before creating new files
2. **Follow current project conventions** — if a ticket says `src/shared/ui/button/` but the project already uses `src/shared/ui/shadcn/`, follow the actual structure
3. **Treat ticket file paths as intent, not literal instructions** — implement what the ticket describes using current project patterns

Planning artifacts are templates and intentions. The actual codebase is the source of truth.
