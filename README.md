# ⓪ηηωεε 忧世

> Dev • Twitch lurker • Musician • Marxist

A glitch-forward portfolio and content platform for onnwee. The repo ships a static React site today and a Go API that is ready for future dynamic integrations (analytics, search, CRUD authoring tools).

---

## Stack Overview

- **Frontend:** Vite + React + TypeScript (`client/`)
- **Styling:** Tailwind CSS with custom design tokens (`client/src/index.css`)
- **Content:** MDX blog posts, project metadata in TypeScript
- **Backend:** Go HTTP API with Gorilla Mux, sqlc-generated data layer (`backend/`)
- **Observability:** OpenTelemetry + Prometheus metrics at `/metrics`
- **Deploy:** GitHub Pages via Actions (frontend), Docker Compose for local backend infra

---

## Architecture

- `client/` is a single-page app served from GitHub Pages. Routing (`react-router-dom`) renders sections like `/projects`, `/blog`, and `/projects/:slug`.
- `backend/` contains a Go service exposing REST endpoints for posts, projects, users, logs, events, sessions, and page views. sqlc keeps SQL in `internal/queries/*.sql` and generates strongly typed accessors in `internal/db`.
- Middleware stack (`backend/pkg/middleware`) adds logging, panic recovery, permissive CORS, rate limiting, and real client IP detection. `api.NewRouter` composes everything under OpenTelemetry's `otelhttp` wrapper.
- Prometheus is enabled out of the box: `backend/cmd/server/main.go` mounts `/metrics` and `docker-compose.yml` provisions Prometheus + Grafana dashboards pointed at the Go app.
- Frontend embeds and error handling rely on shared utilities: `renderEmbed`, `SafeEmbedRenderer`, `ErrorBoundary`, and a singleton `errorMonitor` that drives the dev error overlay.

---

## Frontend Workflows

```bash
cd client
npm install          # install dependencies
cp .env.example .env # configure environment variables (optional)
npm run dev          # start Vite dev server with hot reload
npm run build        # production build (emits to dist/)
npm run preview      # serve built assets locally
npm run deploy       # publish to GitHub Pages
```

- **Environment Setup (Optional):** Copy `client/.env.example` to `client/.env` to configure optional environment variables like `VITE_API_BASE_URL`, `VITE_ADMIN_TOKEN`, or feature flags. All Vite environment variables must be prefixed with `VITE_` to be exposed to the browser.
- Theme + glitch controls live in `src/context/ThemeContext.tsx`; wrap new UI in `<ThemeProvider>` and use the `useTheme()` hook.
- The blog uses `vite-plugin-mdx` plus a frontmatter transformer (`vite.config.ts`). Every MDX file under `src/blog/` needs at least `title`, `tags`, and optional `summary/date` frontmatter to appear in the index.
- `LazyGrid` + `useResponsiveItemsPerPage` coordinate virtualized grids. Prefer these utilities for paginated/animated lists (projects, blog index, future galleries).
- Embed external media through `renderEmbed` or `SafeEmbedRenderer` so URL validation, sandboxing, loading states, and glitch styling stay consistent.

---

## Backend Workflows

```bash
cd backend
go mod tidy                 # sync go.mod
cp .env.example .env        # configure environment variables (edit DATABASE_URL)
make up                     # postgres + prometheus + grafana via docker-compose
sqlc generate               # regenerate internal/db after editing SQL
go run cmd/server/main.go   # run API locally (loads .env automatically)
make seed                   # populate fake data via gofakeit (respects SEED_* envs)
make reset-db               # drop/recreate tables using scripts/reset_db.sh
```

- **Environment Setup:** Copy `backend/.env.example` to `backend/.env` and configure your `DATABASE_URL`. See the backend README for all available environment variables.
- Define schema changes in `internal/schema.sql` and queries in `internal/queries/*.sql`. Regenerate Go code with `sqlc generate`; never hand-edit `internal/db`.
- `cmd/server/main.go` loads `.env` automatically via `godotenv`, builds the mux router, and exposes Prometheus metrics alongside the API.
- Middleware instrumentation plus `otelhttp` wrappers ensure request metrics surface in Prometheus/Grafana.
- Seed script (`cmd/seed/seed.go`) respects env overrides: `SEED_NUM_USERS`, `SEED_NUM_POSTS`, `SEED_DELAY`, etc. The Docker compose service seeds large datasets by default—tweak envs to keep local inserts manageable.

---

## Project Structure

```
client/
 src/
  components/        // shared UI (ErrorBoundary, LazyGrid, embeds, nav)
  context/           // ThemeProvider + glitch toggles
  data/              // static project metadata
  hooks/             // responsive + intersection observer helpers
  pages/             // route-level components
  blog/              // MDX posts with frontmatter
backend/
 cmd/server/          // API entrypoint exposing /metrics + mux router
 cmd/seed/            // gofakeit-powered data seeding
 internal/api/        // handler registrations per resource
 internal/db/         // sqlc generated queries/models
 internal/queries/    // SQL source of truth
 pkg/middleware/      // logging, recovery, cors, rate limiting, real IP
 scripts/reset_db.sh  // docker exec helper for wiping local DB
```

---

## Observability

- Launch `make up` to spin up Postgres + Prometheus + Grafana. Grafana listens on `localhost:3000` (`admin`/`admin`).
- API metrics live at `/metrics` and are scraped by Prometheus (`prometheus.yml` targets `go_app:8000`).
- Client-side errors in development surface through `ErrorOverlay` polling the `errorMonitor` queue. Call `errorMonitor.logReactError` inside new `ErrorBoundary` wrappers when adding risky UI.

---

## Security & Secrets Management

### Environment Files
Both `client/` and `backend/` use environment files for configuration:

- **Example files** (`.env.example`) are committed to the repository and contain all available configuration options with safe default values
- **Actual files** (`.env`, `.env.local`, `.env.*`) are ignored by git and should **never** be committed
- Copy the example file and update with your actual credentials: `cp .env.example .env`

### Best Practices
- ✅ **DO** use `.env.example` files to document required configuration
- ✅ **DO** use strong, unique passwords and tokens in production
- ✅ **DO** rotate credentials regularly
- ❌ **DON'T** commit `.env` files or any files containing secrets
- ❌ **DON'T** hardcode credentials in source code
- ❌ **DON'T** share `.env` files via insecure channels (email, chat, etc.)

### Vite Environment Variables
Vite exposes environment variables prefixed with `VITE_` to the client bundle. Be careful not to expose sensitive credentials:
- ✅ `VITE_API_BASE_URL` - safe to expose (public API endpoint)
- ❌ `VITE_ADMIN_SECRET_KEY` - would be exposed in browser, insecure

For admin operations, use backend authentication instead of client-side tokens.

---

## Deployment

- The GitHub Actions workflow (see repository settings) runs `npm run deploy` to push the `client/dist` bundle to `gh-pages`.
- Backend services are currently local-only, but Docker Compose provides a ready stack for future deployment targets.

---

## Contributing / Next Steps

- Expand MDX library components in `client/src/components/mdx/` for richer blog formatting.
- Wire the frontend to the Go API once auth/editor flows are ready.
- Add analytics (Umami) and search (Meilisearch) when infrastructure is in place.
