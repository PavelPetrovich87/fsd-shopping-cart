# KIMI.md

## Контекст для Kimi-агентов (OpenClaw / Kimi Claw)

**Проект:** FSD Shopping Cart — учебный проект для Harness Engineering.  
**Стек:** React 19, TypeScript 5.9, Vite 8, Tailwind CSS v4, ESLint 9 (flat config), Steiger (FSD linter).

---

## Как работать с этим репозиторием

### 1. Общие правила (из AGENTS.md)

Всегда начинай с чтения `AGENTS.md` — это корневой роутер для всех агентов. Там описаны:
- Skill routing по путям
- Обязательные команды (`npm run lint`, `npm run lint:arch`, `npm run build`)
- Workflow для работы с кодом
- Spec-kitty lane-based workflow

### 2. Специфика Kimi

**Kimi в этом проекте уже используется** через spec-kitty как `kilo:kimi-k2.6:balanced:implementer`.  
Это значит, что Kimi-агенты участвуют в implement-фазе work packages через spec-kitty orchestrator.

**Ключевые отличия от Claude:**
- Kimi работает через spec-kitty CLI, а не напрямую с файлами
- Все изменения кода идут через worktrees (`.worktrees/`)
- Kimi не должен редактировать файлы в main checkout напрямую

### 3. Команды для старта

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Линтинг и проверки (ОБЯЗАТЕЛЬНЫ перед коммитом)
npm run lint        # ESLint
npm run lint:arch   # Steiger FSD linter
npm run build       # Type-check + build
```

### 4. Архитектура FSD

```
app → pages → widgets → features → entities → shared
```

- Каждый слой импортирует ТОЛЬКО из слоёв ниже
- Никаких cross-slice импортов
- Публичный API слоя — только `index.ts`

### 5. Workflow при работе через spec-kitty

```bash
# 1. Получить следующий шаг
spec-kitty next --json

# 2. Начать работу над WP (создаст worktree автоматически)
spec-kitty agent action implement WP01

# 3. Внутри worktree писать код, коммитить
 cd .worktrees/017-cart-control-lane-a
# ... пишешь код ...
git add src/ tests/
git commit -m "feat(WP01): описание изменений"

# 4. Переместить WP в for_review
spec-kitty agent tasks move-task WP01 --to for_review

# 5. После аппрува — мерж
spec-kitty merge --mission 017-cart-control
```

### 6. Важные ограничения

- **НЕ редактируй файлы в корне проекта** — только в worktree
- **ВСЕГДА запускай** `npm run lint && npm run lint:arch && npm run build` перед коммитом
- **Проверяй фактическую структуру** через `ls`/`glob` — не полагайся на пути из тикетов
- **Читай README.md/DOMAIN.md** в папке слайса перед редактированием

### 7. Особенности Kimi-агентов

- **Язык:** Общение на русском, код на английском
- **Стиль:** Конкретный, без воды. Военные аналогии приветствуются 😄
- **Инициатива:** Сначала сделай, потом кратко упомяни пробелы

---

## Быстрый старт для нового Kimi-агента

1. Прочитай `AGENTS.md` (корневой роутер)
2. Прочитай этот файл (`KIMI.md`) — специфика Kimi
3. Прочитай `README.md` проекта
4. Прочитай `ARCHITECTURE.md` для понимания системы
5. Запусти `npm install && npm run lint && npm run build` — убедись, что проект собирается
6. Только после этого начинай работу с spec-kitty

---

## Связь с другими агентами

| Файл | Для кого |
|------|----------|
| `AGENTS.md` | Все агенты (общий роутер) |
| `CLAUDE.md` | Claude Code |
| `CLAUDE-for-fsd-project.md` | Claude (детальная FSD-специфика) |
| `KIMI.md` | Kimi (этот файл) |
| `CONVENTIONS.md` | Все агенты (машинно-проверяемые правила) |

---

*Создано: 2026-05-04*  
*Агент: OpenClaw для Pavel Petrovich*
