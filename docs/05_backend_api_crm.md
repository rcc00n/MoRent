# More Rent — backend, API, CRM integration

## 1. Main backend responsibilities
- хранить каталог автомобилей
- отдавать данные фронтенду
- принимать заявки
- валидировать формы
- сохранять заявки в БД
- отправлять заявки в GreenCRM
- логировать результат интеграции

## 2. Suggested API routes

### Public content
- `GET /api/pages/home`
- `GET /api/pages/about`
- `GET /api/pages/pricing`
- `GET /api/pages/contacts`
- `GET /api/pages/faq`

### Cars
- `GET /api/cars`
- `GET /api/cars/{slug}`
- `GET /api/cars/featured`
- `GET /api/cars/filters`

### Leads
- `POST /api/leads`
- `POST /api/callback-requests`

### SEO / utility
- `GET /api/seo/sitemap-data`
- `GET /api/health`

## 3. API response principles
- predictable JSON
- normalized errors
- no leaking server internals
- validation messages readable for frontend

## 4. Lead creation flow
1. Frontend sends form data
2. Backend validates data
3. Backend stores lead in PostgreSQL
4. Backend attempts GreenCRM integration
5. If integration success — save external CRM id
6. If integration fails — keep lead locally and mark for retry
7. Frontend still gets successful submission if local save succeeded, but error is logged internally

## 5. GreenCRM integration
По брифу сайт должен кидать новые заявки в GreenCRM и создавать сделку.

### Нужно реализовать
- adapter service: `GreenCrmService`
- mapping from site lead fields to CRM fields
- safe retry logic
- request/response logging without sensitive leaks
- timeout handling

### Recommended integration structure
- `apps/integrations/greencrm/client.py`
- `apps/integrations/greencrm/service.py`
- `apps/integrations/greencrm/mappers.py`
- `apps/integrations/greencrm/exceptions.py`

### Environment variables
- `GREENCRM_BASE_URL`
- `GREENCRM_API_KEY`
- `GREENCRM_PIPELINE_ID`
- `GREENCRM_MANAGER_ID` if needed

## 6. Validation rules for booking form
Required:
- first_name
- last_name
- car
- pickup_datetime
- return_datetime
- pickup_location
- return_location
- consent_personal_data = true
- consent_offer = true

Checks:
- return date later than pickup date
- selected car exists and active
- strings trimmed
- impossible dates rejected

Recommended:
- phone required
- email optional, but worth adding

## 7. Spam protection
Хотя в брифе стоит «нет», для production все равно лучше сделать минимум:
- honeypot field
- simple rate limit by IP
- submit cooldown
- server-side validation

Без тяжелой капчи на MVP, если нужен чистый UX.

## 8. Logging and observability
Нужно логировать:
- form submissions
- validation errors
- CRM sync success/failure
- health checks
- server errors

## 9. Acceptance criteria for backend
- формы стабильно сохраняются
- CRM получает лиды
- данные не теряются при временном падении CRM
- ошибки не ломают UX пользователя
- каталог и карточки отдаются быстро

