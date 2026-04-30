# Segment Naming

Segment folders inside slices must reflect functional purpose. Generic technical names are forbidden.

| Status       | Names                                                   |
| ------------ | ------------------------------------------------------- |
| ❌ Forbidden | `utils/`, `hooks/`, `helpers/`, `components/`, `types/` |
| ✅ Allowed   | `ui/`, `model/`, `api/`, `lib/`, `config/`              |

**Rationale:** Segment names describe _what the code does_ (UI, model, API) rather than _what kind of code it is_ (utils, hooks, components). This keeps the architecture intent-driven and prevents accumulation of unclassified code.
