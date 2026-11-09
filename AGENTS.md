- Store SEO slugs live in a fixed table (`src/data/storeSlugs.json`) keyed by product/category id — never regenerate existing slugs, because published URLs must stay stable.

## Каталог товаров PRESSOVAC

- Для задач добавления и изменения товаров сначала применяй `.agents/skills/pressovac-catalog/SKILL.md`.

## Рабочий порядок Lovable -> GitHub -> Dairing

- В настройках Lovable выбрана GitHub-ветка `lovable-work`. Сохранённые изменения Select Element и редактора синхронизируются в эту ветку.
- GitHub Actions workflow `.github/workflows/lovable-auto-pr.yml` запускается на каждый push в `lovable-work`: он создаёт один PR в `main` или повторно использует уже открытый PR. Новые push добавляются в тот же PR. Если разницы с `main` нет, новый PR не создаётся.
- PR может появиться сразу после синхронизации с GitHub, до нажатия Lovable Publish. GitHub не получает отдельного события Publish: Publish обновляет только `*.lovable.app` и не запускает production deploy.
- Для автоматического создания PR один раз настрой GitHub App только для репозитория `edward-neuron/pressovac-mskru`: разрешения Repository contents: read и Pull requests: read/write; установи приложение только на этот репозиторий. Добавь в GitHub repository Settings -> Secrets and variables -> Actions секреты `PRESSOVAC_PR_APP_ID` и `PRESSOVAC_PR_APP_PRIVATE_KEY`. Закрытый ключ хранится только в GitHub Secrets и никогда не помещается в репозиторий, Lovable или переписку. До настройки секретов workflow завершится понятной ошибкой и PR не создаст.
- Проверка PR `Build site with production npm path` должна запуститься и пройти. Владелец проверяет изменения и вручную сливает PR в `main`; workflow не имеет права сливать PR или публиковать сайт.
- После слияния Dairing проверяет `origin/main` каждую минуту и автоматически обновляет боевой сайт. После merge проверяй успешный запуск Dairing и живой сайт. Не запускай ручной релиз VPS и не нажимай Lovable Publish от имени владельца.
