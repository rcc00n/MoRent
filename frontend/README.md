# MoRent frontend

React 19, React Router 7, Vite, i18next and API-backed rental/content views.
The authoritative setup and evidence map is the [root README](../README.md).

```bash
npm ci
VITE_API_URL=http://127.0.0.1:8000/api VITE_SITE_URL=http://localhost:5173 npm run dev
npm run lint
VITE_SITE_URL=https://example.invalid npm run build
```

`VITE_API_URL` selects the Django API base. `VITE_SITE_URL` controls generated
canonical/social URLs and sitemap output. Both are public build-time configuration,
never secrets. The build runs `scripts/generate-static-pages.mjs` after Vite.
It does not connect to production or publish anything. `npm run preview` serves the
built files locally; it does not replace the backend.
