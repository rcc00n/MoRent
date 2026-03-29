# More Rent — technical architecture

## 1. Stack
- Backend: Django
- API: Django REST Framework
- Frontend: React + Vite
- Database: PostgreSQL
- Reverse proxy: Nginx
- Deploy: Docker Compose
- Static/media: Nginx volumes or S3-compatible storage later

## 2. Architecture style
Нужна clean and scalable architecture без лишней энтерпрайз-сложности.

### Backend zones
- `apps/core` — общие сущности, настройки, utility
- `apps/pages` — контентные страницы
- `apps/cars` — автомобили, характеристики, галереи, тарифы
- `apps/leads` — заявки
- `apps/contacts` — формы обратной связи
- `apps/legal` — юридические страницы
- `apps/reviews` — отзывы
- `apps/seo` — meta, slugs, SEO landing pages
- `apps/integrations` — GreenCRM adapter

### Frontend zones
- `src/app` — router, layout, providers
- `src/pages` — route pages
- `src/widgets` — page sections
- `src/features` — фильтры, формы, заявка
- `src/entities` — car, lead, review, faq
- `src/shared` — ui kit, hooks, utils, motion, api

## 3. Rendering strategy
Оптимальный вариант для SEO и UX:
- React frontend
- желательно SSR/SSG подход для SEO-важных страниц

Но если строго остаемся в связке Django + React + Vite без Next.js, тогда:
- Django отдает API
- React работает как SPA
- SEO усиливается через prerender / server-rendered critical pages / sitemap / meta management

### Практическая рекомендация
Для быстрого старта:
- Django как основной backend и CMS-like источник данных
- React/Vite как frontend app
- для главной, каталога, карточек авто и SEO-страниц предусмотреть prerender strategy

Если агент может быстро собрать SSR-подход — хорошо. Если нет, сначала делаем сильный SPA + prerender + sitemap.

## 4. Data model overview

### Car
- id
- title
- slug
- short_description
- full_description
- status
- is_featured
- price_from
- currency
- transmission
- seats
- fuel_type
- drive_type
- car_class
- region_pickup
- region_return
- priority
- created_at
- updated_at

### CarImage
- id
- car
- image
- alt
- sort_order
- is_cover

### CarFeature
- id
- car
- label
- value
- icon
- sort_order

### Lead
- id
- first_name
- last_name
- phone
- email (optional but recommended)
- car
- pickup_datetime
- return_datetime
- pickup_location
- return_location
- source
- utm_source
- utm_medium
- utm_campaign
- comment
- consent_personal_data
- consent_offer
- status
- crm_external_id
- created_at

### CallbackRequest
- id
- name
- phone
- preferred_contact_method
- comment
- created_at

### FAQItem
- id
- question
- answer
- category
- sort_order
- is_active

### Review
- id
- author_name
- text
- rating
- city
- car_model
- published_at
- is_active

### SeoPage
- id
- slug
- h1
- title
- description
- content_blocks / structured content
- indexable

## 5. Admin area
Хотя бриф про клиентскую часть, для реальной работы нужны удобные Django admin / internal tools:
- управление автомобилями
- загрузка галереи
- управление тарифами
- FAQ
- отзывы
- SEO-поля
- просмотр заявок
- ручной retry CRM-интеграции

## 6. Forms architecture
Формы должны:
- валидироваться и на фронте, и на бэке
- иметь антидубль защиту
- логировать ошибки
- уметь прокидывать UTM
- сохранять заявку до отправки в CRM

## 7. Performance constraints
- hero assets lazy / adaptive
- WebP/AVIF where possible
- videos only if compressed and optional
- 3D only where justified
- code splitting on routes
- image sizes per breakpoint
- defer non-critical motion libraries

## 8. Security baseline
- CSRF where relevant
- rate limiting for forms
- validation and sanitization
- server-side form validation
- secure environment variables
- HTTPS only in production
- no secrets in repo

