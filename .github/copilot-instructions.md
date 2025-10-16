# Copilot Instructions for onnwee.github.io

## Architecture
- Monorepo splits React front end in `client/` and Go API in `backend/`; front end is currently static (projects/blog content shipped with the bundle) while the API exposes CRUD endpoints ready for future integration.
- Go server (`backend/cmd/server/main.go`) wraps Gorilla Mux routes with custom middleware and OpenTelemetry instrumentation via `otelhttp`; Prometheus metrics are exposed at `/metrics` and scraped by `backend/prometheus.yml` when `docker-compose` runs.
- Database access flows through sqlc-generated `internal/db/*.go`; SQL lives in `internal/queries/*.sql` and schema changes go in `internal/schema.sql`.

## Frontend Patterns
- Vite + React + TypeScript with the `@` alias (see `client/vite.config.ts` and `client/tsconfig.json`)—import shared pieces from `@/components`, `@/hooks`, `@/utils` instead of relative paths.
- Global theming lives in `client/src/context/ThemeContext.tsx`; wrap new UI under `<ThemeProvider>` and use `useTheme()` for glitch/dark toggles so CSS variables defined in `client/src/index.css` stay in sync.
- Error handling relies on `ErrorBoundary` and the singleton `errorMonitor` (`client/src/utils/errorMonitor.ts`); when adding risky components or async flows, either wrap them in an `ErrorBoundary` or call `errorMonitor.logReactError` so the dev overlay surfaces issues.
- Blog posts load through dynamic MDX imports (`BlogPost.tsx`, `BlogIndex.tsx`) and a custom frontmatter plugin; every new file in `client/src/blog/` needs `title`, `tags`, and optional `summary`/`date` frontmatter to participate in search/filtering.
- Portfolio content uses Tailwind plus utility classes defined in `client/src/index.css` (`section`, `terminal-box`, `glitch-box`, etc.); prefer reusing these tokens for consistent styling.
- Embeds and rich media should go through `renderEmbed`/`SafeEmbedRenderer` (`client/src/utils`) plus `SafeEmbedWrapper` to enforce URL validation, sandboxing, and loading states.

## Backend Patterns
- Routes are registered per resource in `backend/internal/api/handlers/*`; handlers expect a `*server.Server` that exposes `DB *db.Queries` and respond with JSON via stdlib encoders—follow this pattern for new endpoints.
- Middleware chain (`backend/pkg/middleware`) adds logging, panic recovery, permissive CORS, real IP detection, and an in-memory rate limiter; include new middleware by updating `api.NewRouter`.
- Database mutations should be authored in SQL files under `internal/queries/` and regenerated with `sqlc generate`; never hand-edit the generated files in `internal/db/`.
- Seeding uses `cmd/seed/seed.go` with `gofakeit`; tweak volume via `SEED_*` env vars. `scripts/reset_db.sh` assumes the compose service is `backend-db-1`.

## Workflows
- Frontend: `cd client && npm install`, then `npm run dev` for local dev, `npm run build` + `npm run preview` to validate production output, `npm run deploy` pushes to GitHub Pages.
- Backend: `cd backend && go mod tidy`, `make up` (Postgres + Prometheus + Grafana), `sqlc generate` after SQL edits, `go run cmd/server/main.go` for local runs, `make seed` to populate data.
- Environment: backend expects `DATABASE_URL` (loaded via `godotenv`), optional `PORT`, and telemetry variables (`APP_ENV`) if you enable `InitOpenTelemetry`.

## Conventions & Gotchas
- Use `useResponsiveItemsPerPage` and `LazyGrid` for paginated grids; the hook returns item counts keyed to breakpoints, and `FadeInWhenVisible` handles intersection observers.
- Project detail pages (`pages/ProjectDetail.tsx`) illustrate defensive data guards, embed rendering, and fallback UX—mirror this approach when adding detail views.
- Keep generated metrics endpoints and middleware instrumentation intact when extending the API so `/metrics` remains scrapeable.
- When contributing analytics or logging, prefer feeding `errorMonitor` on the client and structured JSON responses on the server (see error strings in handlers) for consistency.
