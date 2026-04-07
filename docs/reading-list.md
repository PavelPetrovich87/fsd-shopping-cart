# Reading List: Weeks 2–4

Resources from the 7-week Harness Engineering learning plan that correspond to the scaffolding, context engineering, and runtime harness phases — the areas this project covers.

---

## Week 2: Scaffolding

| Format  | Resource                                                                 | Author / Source          | Why It Matters                                                                                                                                            |
| ------- | ------------------------------------------------------------------------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Article | "Same Lint, Same Result: A Stylelint Toolchain for Humans and AI Agents" | Zetsubo (Dev.to)         | Shows how to build a single validation ruleset with self-contained fix guides that work equally well for human engineers and AI agents.                   |
| Article | "AI-First UIs: Why shadcn/ui's Model is Leading the Pack"                | Refine.dev               | Technical breakdown of why copying component source into the repo (lowering abstraction) gives agents structural understanding and consistency.           |
| Video   | "Why AI is Quietly Killing Tailwind CSS"                                 | Huxn WebDev / The Neuron | Economic and architectural analysis of how AI tools generate utility CSS without needing documentation, and what that means for the ecosystem.            |
| Video   | "Tailwind CSS v4 Full Course"                                            | JS Mastery (YouTube)     | Comprehensive guide to Tailwind fundamentals (JIT compiler, class system) — you need to understand the primitives the agent will operate with.            |
| Article | "Architectural Constraints for AI Agents"                                | Bitloops / H. Villalobos | Explains why AI generators optimize for immediate task completion at the expense of long-term architectural coherence, and how strict rules prevent this. |

---

## Week 3: Context Engineering

| Format  | Resource                                                             | Author / Source            | Why It Matters                                                                                                                                                         |
| ------- | -------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Article | "The Complete Guide to AI Agent Memory Files (CLAUDE.md, AGENTS.md)" | HackerNoon / Medium        | Covers the memory file ecosystem, structure (project context, code style, exact commands, architecture), and recursive imports to avoid the single-giant-file problem. |
| Article | "Effective Context Engineering for AI Agents"                        | Anthropic Engineering      | Guide to finding the Goldilocks zone in system prompts, using XML tags for structure, and compaction strategies for long sessions.                                     |
| Article | "The Complete Guide to Figma's MCP Integration: From Design to Code" | Garima Dua (Medium)        | Explains how MCP acts as a universal translator turning visual frames into structured JSON that LLMs use for code generation without manual layer inspection.          |
| Video   | "Claude Code Best Practices"                                         | Code w/ Claude (Anthropic) | Masterclass from Claude Code's creators demonstrating how to "pump" knowledge from LLMs into CLAUDE.md and organize sub-agent work with context preservation.          |
| Video   | "Figma MCP Server for Developers Guide"                              | Ansh Mehra (YouTube)       | Hands-on walkthrough connecting Figma MCP to VS Code: select a component in Figma, immediately generate clean frontend code using tokens and Auto Layout.              |

---

## Week 4: Runtime Harness — Tool Orchestration & Feedback Loops

| Format  | Resource                                                                                                 | Author / Source            | Why It Matters                                                                                                                                                                 |
| ------- | -------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Course  | "Introduction to Model Context Protocol" (anthropic.skilljar.com/introduction-to-model-context-protocol) | Anthropic (official, free) | Builds MCP servers and clients in Python from scratch. Covers the three primitives (Tools, Resources, Prompts), transport layer, and testing with MCP Server Inspector.        |
| Article | "Visual Regression Testing: A Practical Guide (Playwright & Percy)"                                      | Nawaz Dhandala (OneUptime) | Setup guide for snapshot workflows, baseline comparison, and CI integration. Explains masking dynamic content to eliminate test flakiness.                                     |
| Video   | "Playwright AI Agents: Planner, Generator, Healer in Action"                                             | Software Testing Trends    | Demonstrates the new Playwright agents: shows Healer analyzing error reports and autonomously fixing broken locators.                                                          |
| Article | "Supercharge your design system with LLMs and Storybook MCP"                                             | Codrops                    | Technical description of how the Storybook MCP component manifest reduces token cost from 100K+ to minimal, giving agents precise component APIs instead of full source scans. |
| Video   | "Building an Agent Harness from Scratch"                                                                 | AI Captains / Scott Graham | Practical masterclass on defense-in-depth architecture, implementing hooks, and solving AI amnesia through state persistence.                                                  |
| Video   | "Stop getting broken components from your AI agent (Shadcn UI MCP)"                                      | Eric Tech (YouTube)        | Walkthrough of programming a Cursor agent to autonomously assemble UI using the Shadcn MCP server and TDD.                                                                     |
