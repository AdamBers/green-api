# Правила проекта Green Chat

## Область и стек

- React, TypeScript (strict), Vite, SCSS Modules. UI без библиотеки компонентов.
- Zustand для клиентского состояния; TanStack Query для серверных данных и сообщений.
- Писать лаконично. Не создавать пустые слои, универсальные фабрики и абстракции без потребителей.
- Изменять только этот проект; youitproject служит ориентиром и не входит в область изменений.

## FSD

- Зависимости направлены вниз: app → pages → widgets → features → entities → shared.
- Между слайсами одного слоя не импортировать реализацию друг друга; композиция на верхнем слое.
- entities/<domain>: доменные модели, константы, api.ts и presentation-only ui.
- Все прямые useQuery/useMutation hooks — features/<domain>/hooks. Сразу деструктурировать результат.
- Feature: features/<domain>/<action>/<Action>Feature.tsx; приватный UI в ui, сценарные hooks и схемы в model.
- Без UI: корневой use<Action>Feature.ts. Не создавать hooks внутри action.
- Widget: widgets/<domain>/<Name>/<Name>Widget.tsx, приватные части рядом.
- Shared UI получает props; не подключает stores, API или бизнес-сценарии.
- Один React-компонент на файл, default export в конце. Barrel index.ts запрещены.

## Формы, стили и состояние

- Формы на React Hook Form + Zod + zodResolver; типы выводить из схем.
- Телефоны проверять libphonenumber-js через shared/lib/phone.ts, не локальными regex.
- Стили рядом с компонентом в .module.scss; цвета через CSS-токены app/styles.
- Layout общий, адаптивность обязательна. Диалоги: focus trap, Escape, возврат фокуса.
- Активный чат и поиск в URL; обновление своих параметров сохраняет остальные.
- Credentials и список чатов: Zustand persist в sessionStorage. Сообщения: только Query cache.
- Доменные Zustand-сторы хранить в entities/<domain>/store/<domain>Store.ts: например,
  entities/session/store/sessionStore.ts и entities/chat/store/chatStore.ts.
- В store размещать состояние домена, его синхронные actions и настройки persist; не добавлять
  API-запросы, формы, навигацию или orchestration сценариев. Такие сценарии остаются в features.
- Не собирать доменные сторы в app/store или shared/stores. Импортировать напрямую из файла стора,
  без barrel-файлов и общего root store. Папку store создавать только при наличии стора.
- Выход отменяет запросы, очищает sessionStorage и query cache. Не сохранять токены в репозитории.

## API и ошибки

- Обычные HTTP-функции — entities/<domain>/api.ts. Клиент и единый normalizeApiError — shared/api.
- GREEN-API error DTO: code/message/status, а не контракт youitproject.
- Отменённый запрос не показывать как ошибку. Не публиковать сырой AxiosError с URL, содержащим токен.
- Не разлогинивать на каждый 403. Ошибки классифицировать, текст локализовать централизованно.
- Long polling последовательный: receive → process → delete → receive, с дедупликацией.
- Отправку автоматически не повторять: при таймауте результат неоднозначен.
- Демо явно отделять от реального API; не выдавать демоответы за настоящие сообщения.

## Git и качество

- Без отдельной команды не выполнять git add/commit/push и не создавать PR.
- Upstream только одноимённый; новую ветку от remote создавать с --no-track.
- До публикации/merge обязательно npm run type-check после последних изменений, код 0.
- Перед передачей результата выполнить type-check, lint, test и build; указать непроверенные интеграции.
