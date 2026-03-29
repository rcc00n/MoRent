# More Rent — devops and deployment

## 1. Infrastructure input
- Domain: `morent82.duckdns.org`
- Server IP: `89.111.171.91`
- Agent has SSH key to the server

## 2. Target deployment scheme
- Nginx
- Django app container
- React frontend container or static build served by Nginx
- PostgreSQL container
- optional: Redis later
- Docker Compose as orchestrator

## 3. Recommended repo structure
- `/backend`
- `/frontend`
- `/infra`
- `/docker-compose.yml`
- `/.env.example`

## 4. Production services
- `nginx`
- `backend`
- `frontend` or `frontend-build`
- `postgres`

## 5. Nginx responsibilities
- serve frontend
- proxy `/api/` to Django
- gzip/brotli where available
- cache static assets
- SSL termination
- redirect HTTP → HTTPS

## 6. Backend deployment notes
- use Gunicorn
- Django in production settings
- environment-based config
- collectstatic on deploy
- allowed hosts include domain and IP if needed

## 7. Database
- PostgreSQL with persistent volume
- backup strategy mandatory
- never expose database publicly

## 8. SSL
Нужно настроить HTTPS. Для домена на DuckDNS обычно используют Let's Encrypt после корректной привязки домена к IP и открытых 80/443.

## 9. Environment variables
### Backend
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS`
- `DATABASE_URL` or separate PG vars
- `CSRF_TRUSTED_ORIGINS`
- `GREENCRM_BASE_URL`
- `GREENCRM_API_KEY`

### Frontend
- `VITE_API_URL`
- `VITE_SITE_URL`

## 10. CI/CD minimum
Даже без сложного пайплайна должны быть:
- branch strategy
- production env file
- deploy script
- rollback path

## 11. Basic deploy sequence
1. Подключиться по SSH
2. Установить Docker и Docker Compose если нет
3. Подготовить директорию проекта
4. Настроить `.env`
5. Поднять PostgreSQL
6. Поднять backend
7. Собрать frontend
8. Настроить Nginx
9. Выпустить SSL
10. Прогнать smoke test

## 12. Smoke test after deploy
- homepage opens
- catalog loads
- car page opens
- booking form submits
- lead saved in DB
- lead sent to GreenCRM
- HTTPS works
- mobile layout not broken

