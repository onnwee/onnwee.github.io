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
npm run dev          # start Vite dev server with hot reload
npm run build        # production build (emits to dist/)
npm run preview      # serve built assets locally
npm run deploy       # publish to GitHub Pages
```

- Theme + glitch controls live in `src/context/ThemeContext.tsx`; wrap new UI in `<ThemeProvider>` and use the `useTheme()` hook.
- The blog uses `vite-plugin-mdx` plus a frontmatter transformer (`vite.config.ts`). Every MDX file under `src/blog/` needs at least `title`, `tags`, and optional `summary/date` frontmatter to appear in the index.
- `LazyGrid` + `useResponsiveItemsPerPage` coordinate virtualized grids. Prefer these utilities for paginated/animated lists (projects, blog index, future galleries).
- Embed external media through `renderEmbed` or `SafeEmbedRenderer` so URL validation, sandboxing, loading states, and glitch styling stay consistent.

---

## Backend Workflows

```bash
cd backend
go mod tidy                 # sync go.mod
make up                     # postgres + prometheus + grafana via docker-compose
sqlc generate               # regenerate internal/db after editing SQL
go run cmd/server/main.go   # run API locally (expects DATABASE_URL)
make seed                   # populate fake data via gofakeit (respects SEED_* envs)
make reset-db               # drop/recreate tables using scripts/reset_db.sh
```

- Define schema changes in `internal/schema.sql` and queries in `internal/queries/*.sql`. Regenerate Go code with `sqlc generate`; never hand-edit `internal/db`.
- `cmd/server/main.go` loads `.env` automatically, builds the mux router, and exposes Prometheus metrics alongside the API.
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

## Deployment

- The GitHub Actions workflow (see repository settings) runs `npm run deploy` to push the `client/dist` bundle to `gh-pages`.
- Backend services are currently local-only, but Docker Compose provides a ready stack for future deployment targets.

---

## Contributing / Next Steps

- Expand MDX library components in `client/src/components/mdx/` for richer blog formatting.
- Wire the frontend to the Go API once auth/editor flows are ready.
- Add analytics (Umami) and search (Meilisearch) when infrastructure is in place.
