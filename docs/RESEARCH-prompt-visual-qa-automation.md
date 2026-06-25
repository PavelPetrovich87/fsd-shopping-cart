# Исследование: Подходы к автоматизированному тестированию вёрстки в React-проектах с Storybook

## Контекст проекта (не предписание — фон для понимания ограничений)

Проект: учебный e-commerce (корзина товаров), frontend-only.

**Стек:**

- React 19 + TypeScript 5.9 + Vite 8
- Tailwind CSS v4 (система токенов в CSS `@theme` + TS-модули)
- Storybook 10.3.6 (React+Vite, addon-vitest, addon-a11y, addon-docs)
- Vitest Browser Mode + Playwright 1.59 (headless Chromium)
- Chromatic 16.9.1 (визуальный регресс в CI, soft mode — не блокирует PR)
- Penpot — дизайн-файл `.penpot` лежит локально
- **Penpot MCP Server — работает локально**, агент имеет read-доступ к фреймам (padding, colors, typography)
- FSD (Feature-Sliced Design) — строгая архитектура со слоями `app → pages → widgets → features → entities → shared`
- spec-kitty — оркестратор, весь код идёт через worktrees (`/.worktrees/`)

**Что УЖЕ есть:**

- 14+ stories для компонентов (Button, InputField, Modal, Tag, Tooltip, CartRow, EmptyState, CheckoutButton и др.)
- CI: lint + lint:arch + build + build-storybook на каждый PR
- Pre-push: lint + lint:arch + validate:arch + build + build-storybook
- `test:storybook` (Vitest Browser Mode) настроен, но не запускается в CI
- `test:unit` (Vitest node mode) есть, но не запускалась в CI до недавнего времени
- Husky + lint-staged на pre-commit

**Что НЕТ (и это нормально — мы исследуем, как лучше до этого прийти):**

- Нет локального скриншот-тестирования
- Нет систематического сравнения реализации с дизайном (Penpot MCP есть, но нет workflow)
- Нет интеграции AI-агента в цикл проверки вёрстки
- Нет W3C JSON токенов (только TS + CSS)
- Нет stylelint / правил на хардкод

---

## Задача исследования

Провести обзор подходов к **автоматизированному тестированию вёрстки** (visual regression, layout testing, design-to-code verification) в React-экосистеме 2024–2026 годов. Результат должен помочь команде принять обоснованное решение о том, какую архитектуру и набор инструментов внедрять.

**Важно:** Не зацикливайся на наших текущих гипотезах (MCP-серверы, W3C JSON, `scripts/visual-test/`). Если существует принципиально другой подход — опиши его. Мы ищем ландшафт решений, не валидацию нашего плана.

---

## Области исследования

### 1. Локальный визуальный регресс без облачных сервисов

- Какие инструменты позволяют делать скриншот-тестирование Storybook-компонентов локально, без Chromatic/Percy/Applitools?
- Как Playwright + Storybook могут работать вместе для скриншотов? Не только `@vitest/browser-playwright` для unit-тестов, а именно screenshot comparison.
- Что даёт `@storybook/test-runner` (Playwright-based) vs `@storybook/addon-vitest`? Когда что использовать?
- Существуют ли lightweight решения типа Lost Pixel, Loki, BackstopJS, и насколько они живы в 2025–2026?
- Как организовать baseline / diff / update workflow локально (git-lfs, local folder, docker)?

### 2. Сравнение реализации с дизайн-файлом (design-to-code verification)

**Контекст:** Penpot MCP Server уже работает локально. Агент может читать фреймы (padding, font-size, colors). Вопрос не в "можно ли", а в "как организовать workflow".

- Какие архитектуры сравнения "Storybook vs Дизайн" существуют? Скриншотное, структурное (computed styles vs токены), гибридное?
- Какие метрики из Penpot имеет смысл сравнивать с кодом? Все (padding, margin, font, colors, radius, shadows) или только критичные?
- Как организовать **pipeline**: `MCP читает Penpot → получает ожидаемые значения → сравнивает с computed styles из Playwright/Storybook → генерирует отчёт`?
- Нужен ли промежуточный слой (W3C JSON токены) или MCP может напрямую сравнивать Penpot-значения с `getComputedStyle`?
- Инструменты типа `storybook-addon-designs`, `@storybook/addon-designs` — имеют ли они программный API для автоматического сравнения, или это только ручная сверка для разработчиков?
- Есть ли примеры реальных проектов, где design-to-code verification работает без скриншотов — чисто через сравнение стилей?

### 3. Проверка токенов и запрета хардкода

- Какие инструменты проверяют, что в коде не используются raw values вместо design tokens?
- stylelint + Tailwind CSS v4 — реально ли? Какие плагины существуют?
- Можно ли через PostCSS/Tailwind AST находить arbitrary values (`p-[13px]`) и флагать их?
- Есть ли подходы "token linting", которые сравнивают CSS custom properties с W3C JSON токенами?

### 4. Интеграция AI-агента в visual QA workflow

**Контекст:** Penpot MCP уже подключён и работает. Агент может читать дизайн. Вопрос — как организовать замкнутый цикл.

- Какие команды используют AI-агентов для визуального QA? Не маркетинговые слайды, а реальные workflow и ограничения.
- Какие ещё MCP-серверы существуют для дизайна/вёрстки кроме `penpot-mcp`? (Chromatic MCP, Figma MCP и др.) Как они работают в связке?
- Какие архитектуры AI-loop существуют?
  - **Loop A:** MCP читает дизайн → агент генерирует CSS-фикс → `test:visual` верифицирует → повторить при неудаче
  - **Loop B:** Playwright делает скриншот → агент анализирует diff как картинку → генерирует фикс
  - **Loop C:** Structured diff (JSON с расхождениями) → агент получает данные, не картинки → фикс
  - **Loop D:** Human annotates diff → агент получает annotated screenshot → фикс
- Какой loop наиболее надёжен, быстр и детерминирован? Какой — хрупкий и требует ручного вмешательства?
- Как агент верифицирует свой фикс? Через повторный `test:visual`, через `npm run lint`, или через CI-чек?
- Какие guardrails нужны, чтобы агент не превратил дизайн-систему в хаос? (token enforcement, lint gates, human approval на critical components)
- Сколько итераций обычно требуется агенту для фикса простого visual bug (padding, color)? Данные из реальных проектов.

### 5. Storybook Testing Harness — глубокий разбор

- `@storybook/addon-vitest` (Vitest Browser Mode) — что он реально умеет? Может ли делать визуальные assert'ы (pixel-perfect, layout) или только functional/accessibility?
- `@storybook/test-runner` (Playwright) — может ли делать скриншоты и сравнивать? Как он работает со stories в headless режиме?
- Chromatic — что происходит под капотом? Можно ли часть его функциональности воспроизвести локально?
- Как организовать viewport testing (mobile/tablet/desktop) для Storybook stories? Параметры, decorators, или отдельные stories?

### 6. Архитектура в контексте FSD

- Как тестирование вёрстки организовано в проектах с FSD? Где живут тесты: рядом с компонентом (`ui/`), в отдельном слое `tests/`, или на уровне виджетов?
- Как избежать дублирования visual tests между `shared/ui/button` и `features/checkout/ui/checkout-button`, который его использует?
- Тестируют ли visual regression на уровне страниц/виджетов, или только на уровне изолированных компонентов?

### 7. Подходы к "annotated diff" и human-in-the-loop

- Как инструменты визуализируют различия между скриншотами? (highlight diff, side-by-side, overlay, heatmap)
- Какие форматы отчётов используются для передачи AI-агенту или человеку? (JSON с координатами diff-зон, annotated PNG, HTML-отчёт)
- Есть ли стандартизированные форматы для "visual bug reports"?

---

## Формат результата

### 1. Сравнительная таблица инструментов

| Инструмент | Тип | Локальный/Облачный | Интеграция со Storybook | Интеграция с Penpot/Figma | Скорость | Надёжность | Подходит для нашего стека? | Сложность внедрения |
| ---------- | --- | ------------------ | ----------------------- | ------------------------- | -------- | ---------- | -------------------------- | ------------------- |
| ...        | ... | ...                | ...                     | ...                       | ...      | ...        | ...                        | ...                 |

Критерии оценки для нашего стека:

- Работает ли с React 19 + Vite 8?
- Совместим ли с Tailwind CSS v4?
- Работает ли в headless/CI (Ubuntu runner)?
- Требует ли облачного токена/подписки?
- Интегрируется ли с Penpot MCP (read-доступ к фреймам уже есть)?

### 2. Архитектурные паттерны

Опиши 2–4 принципиально разных архитектурных подхода к visual QA automation. Для каждого:

- **Название паттерна**
- **Суть** (2–3 предложения)
- **Стек инструментов**
- **Плюсы**
- **Минусы**
- **Когда выбирать**
- **Эскиз workflow** (plain text или ASCII diagram)

Примеры паттернов для исследования (не ограничивайся ими):

- "Chromatic-style облачный snapshot comparison"
- "Playwright-only локальный screenshot regression"
- "Design-token driven structural verification (MCP читает Penpot → сравнивает с computed styles)"
- "AI agent loop: MCP читает дизайн → агент фиксит → test:visual верифицирует"
- "Hybrid: structural lint (MCP + computed styles) + скриншоты только для critical components"
- "Human-in-the-loop: MCP генерирует diff-отчёт → человек апрувит → агент применяет фикс"

### 3. Deep dive: 2 наиболее подходящих подхода

Выбери 2 подхода, которые лучше всего подходят под наш стек (React 19, Storybook 10, Tailwind v4, Playwright, FSD, spec-kitty worktrees). Для каждого:

- **Пошаговый план внедрения** (конкретные команды, npm-пакеты, файлы конфигурации)
- **Оценка времени** (в часах/днях для 1 разработчика)
- **Риски и ограничения**
- **Как это вписывается в FSD + spec-kitty workflow**
- **Конкретный пример**: как будет выглядеть тест для компонента `shared/ui/button` или `entities/cart/ui/cart-row`

### 4. Anti-patterns и ловушки

- Что часто ломается при внедрении visual regression?
- Какие подходы не работают с Tailwind CSS v4?
- Какие инструменты мертвы/заброшены (не тратьте время)?
- Что точно НЕ стоит делать в контексте FSD?

### 5. Рекомендации по приоритизации

Если команда хочет получить результат за 1–2 недели силами 1 frontend-разработчика, что внедрять в каком порядке? Какие quick wins, а что — долгосрочная инфраструктура?

---

## Ограничения и контекстные нюансы (важно учитывать)

1. **Tailwind CSS v4** — это не классический Tailwind с `tailwind.config.js`. Токены определены через `@theme` blocks в CSS. Это ломает многие инструменты, заточенные под v3.
2. **Storybook 10** — относительно новый мажор. Некоторые аддоны ещё не обновлены.
3. **Vitest Browser Mode** — уже настроен, но используется только для functional tests. Можно ли расширить его для скриншотов?
4. **spec-kitty worktrees** — любое изменение конфигурации проекта (`.storybook/`, `vite.config.ts`, `package.json`) должно проходить через worktree и be lintable/buildable.
5. **Penpot MCP доступен локально** — агент читает фреймы напрямую через MCP. Не нужно исследовать "как подключить", нужно исследовать "как эффективно использовать".
6. **CI runner: ubuntu-latest** — нет GPU, headless Chromium only.

---

## Что НЕ нужно исследовать

- Не нужен обзор инструментов для e2e тестирования целых страниц (Cypress, Selenium). Фокус — изолированные компоненты в Storybook.
- Не нужен обзор дизайн-систем в целом. Только тестирование вёрстки.
- Не нужно валидировать наш текущий план (тикет Phase 1). Если наш план — тупик, скажи об этом прямо.
- Не нужны маркетинговые описания. Нужна техническая глубина: API, конфиги, trade-offs.

---

## Дополнительные вопросы для размышления

- Можно ли использовать `vite preview` статического Storybook + Playwright для скриншотов вместо отдельных инструментов типа Loki?
- Достаточно ли `@storybook/addon-a11y` с `test: 'error'` как замена части visual checks? (accessibility-ошибки часто коррелируют с layout-ошибками)
- **Structural regression через MCP:** если агент читает Penpot-фрейм и знает ожидаемые значения, может ли он через Playwright сделать `expect(getComputedStyle(button).padding).toBe('12px')` без скриншотов? Это быстрее и детерминированнее pixel-diff?
- Как организовать **token reconciliation**: Penpot-MCP возвращает значения в одних единицах (px, hex), а Tailwind использует rem + hsl. Нужен ли адаптер/конвертер между ними?
- Как работает `storybook-addon-pseudo-states` и нужен ли он для тестирования hover/focus/disabled состояний?
- Может ли MCP читать **токены напрямую из Penpot** (color styles, typography styles) или только конкретные значения инстансов? Если только инстансы — как извлекать "токен как источник правды"?

---

**Финальный результат:** Markdown-документ, который команда может обсудить на тех-дизайн-сессии и принять решение о roadmap. Не шаблон для копипасты, а аналитический обзор с выводами.
