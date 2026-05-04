# KIMI.md

## Kimi Agent Context (OpenClaw / Kimi Claw)

**Project:** FSD Shopping Cart — learning project for Harness Engineering.  
**Stack:** React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, ESLint 9 (flat config), Steiger (FSD linter).

---

## Language Policy

- **Communication with user:** Russian
- **All documentation, code comments, and code:** English

---

## Working with This Repository

### 1. General Rules (from AGENTS.md)

Always start by reading `AGENTS.md` — the root router for all agents. It contains:
- Skill routing by path
- Mandatory commands (`npm run lint`, `npm run lint:arch`, `npm run build`)
- Workflow for code changes
- Spec-kitty lane-based workflow

### 2. Kimi-Specific Details

**Kimi is already used in this project** via spec-kitty as `kilo:kimi-k2.6:balanced:implementer`.  
This means Kimi agents participate in the implement phase of work packages through the spec-kitty orchestrator.

**Key differences from Claude:**
- Kimi works through spec-kitty CLI, not directly with files
- All code changes go through worktrees (`.worktrees/`)
- Kimi must not edit files in the main checkout directly

### 3. Startup Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Linting and checks (MANDATORY before commit)
npm run lint        # ESLint
npm run lint:arch   # Steiger FSD linter
npm run build       # Type-check + build
```

### 4. FSD Architecture

```
app → pages → widgets → features → entities → shared
```

- Each layer imports ONLY from layers below
- No cross-slice imports
- Public API of a slice is only `index.ts`

### 5. Workflow via spec-kitty

```bash
# 1. Get next step
spec-kitty next --json

# 2. Start work on a WP (creates worktree automatically)
spec-kitty agent action implement WP01

# 3. Inside worktree: write code, commit
 cd .worktrees/017-cart-control-lane-a
# ... write code ...
git add src/ tests/
git commit -m "feat(WP01): description of changes"

# 4. Move WP to for_review
spec-kitty agent tasks move-task WP01 --to for_review

# 5. After approval — merge
spec-kitty merge --mission 017-cart-control
```

### 6. Important Constraints

- **DO NOT edit files in the project root** — only in worktree
- **ALWAYS run** `npm run lint && npm run lint:arch && npm run build` before commit
- **Check actual structure** via `ls`/`glob` — don't rely on ticket paths
- **Read README.md/DOMAIN.md** in the slice folder before editing

### 7. Kimi Agent Traits

- **Language:** English for everything except user communication
- **Style:** Concise, no fluff. Military analogies welcome 😄
- **Proactivity:** Do the task first, mention gaps briefly after

---

## Quick Start for New Kimi Agents

1. Read `AGENTS.md` (root router)
2. Read this file (`KIMI.md`) — Kimi specifics
3. Read `README.md` of the project
4. Read `ARCHITECTURE.md` for system understanding
5. Run `npm install && npm run lint && npm run build` — verify the project builds
6. Only then start working with spec-kitty

---

## Agent Configuration Files

| File | For |
|------|-----|
| `AGENTS.md` | All agents (shared router) |
| `CLAUDE.md` | Claude Code |
| `CLAUDE-for-fsd-project.md` | Claude (detailed FSD spec) |
| `KIMI.md` | Kimi (this file) |
| `CONVENTIONS.md` | All agents (machine-enforceable rules) |

---

*Created: 2026-05-04*  
*Agent: OpenClaw for Pavel Petrovich*
