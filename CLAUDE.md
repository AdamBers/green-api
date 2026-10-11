# Инструкции Claude

Применяй правила из @AGENTS.md ко всему коду этого проекта.

- HTTP-методы в entities/<domain>/api.ts, прямые query/mutation hooks только в features/<domain>/hooks.
- Сценарные hooks и Zod-схемы — model соответствующей feature; не смешивай их с API-hooks.
- Компоненты Feature/Widget — корневые файлы соответствующих папок, приватные компоненты отдельно.
- SCSS Modules, общие CSS-токены, React Hook Form + Zod, прямые импорты без barrel-файлов.
- normalizeApiError — единственная точка классификации API-ошибок; UI выбирает место показа.
- Credentials сохраняются через Zustand persist в sessionStorage, сообщения — в Query cache.
- Доменные Zustand-сторы размещать в entities/<domain>/store/<domain>Store.ts и импортировать
  напрямую: session/store/sessionStore.ts, chat/store/chatStore.ts. В store только состояние,
  синхронные actions и persist; API-hooks и бизнес-сценарии остаются в features. Не собирать
  доменные сторы в app/store, shared/stores или общий root store; не создавать пустые папки.
- Реальное API по умолчанию выключено. Демо должно явно обозначаться в интерфейсе.
- Не менять youitproject, не staging-ить и не публиковать без отдельной команды пользователя.
- Проверять type-check, lint, test, build. Не заявлять о проверке реального API без инстанса.
