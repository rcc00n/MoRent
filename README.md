# MoRent

A React rental catalog backed by a Django content and inquiry API. The repository
shows a public browsing flow connected to staff-managed vehicles, translated page
content and persistent booking/contact requests.

This is a source-level engineering reference. It does not promise an available
hosted demo, claim a relationship to another portfolio case, or establish client
publication rights. Historical delivery briefs are classified in
[the documentation index](docs/README.md).

## What is implemented

- Vehicle catalog/detail data with visibility, featured placement and ordering.
- English/Russian copy and CMS-managed FAQ, legal and contact content.
- Booking and general contact requests stored through Django REST Framework.
- Django admin workflows for catalog/content and inquiry handling.
- Route-specific static metadata generation after the Vite build.

A submitted request is an inquiry, not a confirmed reservation. The source's CRM
status fields do not by themselves prove that an external CRM receives records.

## Reproduce the checks without services

Python 3.12 and Node 22:

```bash
python3.12 -m venv .venv
. .venv/bin/activate
python -m pip install -r backend/requirements.txt
python scripts/test_backend.py
python scripts/test_backend.py makemigrations --check --dry-run
npm ci --prefix frontend
npm run lint --prefix frontend
VITE_SITE_URL=https://example.invalid npm run build --prefix frontend
```

The test runner selects in-memory SQLite, a temporary media directory and blocks
network access. Tests use synthetic records; they neither access a running database
nor submit real inquiries. [CI](.github/workflows/ci.yml) runs these same checks,
without deployment. The frontend build generates local files and does not fetch
production data. There is no standalone frontend unit suite yet.

## Local development

Install the dependencies above. A normal development server uses PostgreSQL;
create a separate local database and export `POSTGRES_DB`, `POSTGRES_USER`,
`POSTGRES_PASSWORD`, `POSTGRES_HOST` and `POSTGRES_PORT`. Set `DJANGO_SECRET_KEY`,
`DJANGO_DEBUG=True`, and `DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost` explicitly. Set
`CORS_ALLOWED_ORIGINS=http://localhost:5173` and
`CSRF_TRUSTED_ORIGINS=http://localhost:5173` for the local frontend origin.

```bash
python backend/manage.py migrate
python backend/manage.py createsuperuser
python backend/manage.py runserver 127.0.0.1:8000
```

In a second terminal:

```bash
VITE_API_URL=http://127.0.0.1:8000/api VITE_SITE_URL=http://localhost:5173 npm run dev --prefix frontend
```

Create your own synthetic content in `/admin/`. Do not import an operational customer
export to demonstrate the repository. The test settings are for checks only and
must not be used to run a public service.

## Reviewer map

| Evidence | Source |
| --- | --- |
| Publication/order/localization contracts | [cars](backend/apps/cars/) and its API tests |
| Durable inquiry validation and admin | [bookings](backend/apps/bookings/) |
| Editable site and legal content | [siteconfig](backend/apps/siteconfig/) |
| Frontend API boundary | [api.js](frontend/src/shared/api.js) |
| SEO artifacts | [generator](frontend/scripts/generate-static-pages.mjs) |
| Reproducible service-free checks | [runner](scripts/test_backend.py) |

## Boundaries

The historical briefs describe planned behavior and deployment assumptions; they
are not a current release checklist. Before public operation, verify production
secrets/hosts, PostgreSQL/media persistence, inquiry abuse controls, legal copy,
image rights and any CRM integration. Local checks do not establish those facts.
No client identity, business metrics, production URL or author-role claim is added
by this review guide. Existing project ownership/licence notices remain unchanged.
