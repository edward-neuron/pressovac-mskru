# Memory: features/seo-structured-data-ru
Updated: now

Реализована расширенная SEO-оптимизация с использованием структурированных данных JSON-LD:
- **BreadcrumbList**: Хлебные крошки для всех основных страниц (Каталог, Статьи, О компании, Контакты, Доставка, Обучение)
- **FAQPage**: FAQ-схема для главной страницы и всех ключевых разделов с ответами на популярные вопросы
- **Organization**: Схема организации с контактами и адресом
- **ItemList**: Список услуг/оборудования

SEOHead компонент расширен для поддержки:
- breadcrumbs: автоматическая генерация BreadcrumbList
- faq: автоматическая генерация FAQPage
- article: мета-теги для статей (author, published_time, section)
- Дополнительные мета-теги: robots, googlebot, yandex, geo.region, geo.placename
