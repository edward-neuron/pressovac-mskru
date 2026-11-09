- Store SEO slugs live in a fixed table (`src/data/storeSlugs.json`) keyed by product/category id — never regenerate existing slugs, because published URLs must stay stable.

## Каталог товаров PRESSOVAC

- Для задач добавления и изменения товаров сначала применяй `.agents/skills/pressovac-catalog/SKILL.md`.

## Рабочий порядок Lovable -> GitHub -> Dairing

- В настройках Lovable выбрана GitHub-ветка `lovable-work`. Сохранённые изменения Select Element и редактора синхронизируются в эту ветку.
- GitHub Actions workflow `.github/workflows/lovable-auto-pr.yml` запускается на каждый push в `lovable-work`: он создаёт один PR в `main` или повторно использует уже открытый PR. Новые push добавляются в тот же PR. Если разницы с `main` нет, новый PR не создаётся.
- PR может появиться сразу после синхронизации с GitHub, до нажатия Lovable Publish. GitHub не получает отдельного события Publish: Publish обновляет только `*.lovable.app` и не запускает production deploy.
- Однократная настройка GitHub App: открой `https://github.com/settings/apps/new`, зарегистрируй App, отключи webhook и выдай Repository permissions: Contents = Read-only, Pull requests = Read and write. Сохрани App ID, создай private key и установи App только на `edward-neuron/pressovac-mskru`. В настройках репозитория открой Settings -> Secrets and variables -> Actions -> New repository secret и добавь `PRESSOVAC_PR_APP_ID` (значение App ID) и `PRESSOVAC_PR_APP_PRIVATE_KEY` (содержимое скачанного PEM-файла). Закрытый ключ хранится только в GitHub Secrets, не в репозитории, Lovable или переписке. До добавления секретов workflow завершится явной ошибкой и PR не создаст.
- Проверка PR `Build site with production npm path` должна запуститься и пройти. Владелец проверяет изменённые файлы и вручную сливает PR в `main`; workflow не имеет права сливать PR или публиковать сайт.
- После слияния Dairing проверяет `origin/main` каждую минуту и автоматически обновляет боевой сайт. После merge проверяй успешный запуск Dairing и живой сайт. Не запускай ручной релиз VPS и не нажимай Lovable Publish от имени владельца.
