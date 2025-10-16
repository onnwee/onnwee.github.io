# ⓪ηηωεε 忧世

> Dev • Twitch lurker • Musician • Marxist

A glitch-forward portfolio and content platform for onnwee. The repo ships a static React site today and a Go API that is ready for future dynamic integrations (analytics, search, CRUD authoring tools).

**🚀 New here?** Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for a complete guide to setting up your local environment in under 15 minutes.

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

## Quick Start

### Prerequisites

- **Node.js** 20+ and **npm** 10+
- **Go** 1.24+
- **Docker** and **Docker Compose**
- **sqlc**: `go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest`

### Frontend Setup

```bash
cd client
npm install          # install dependencies
npm run dev          # start Vite dev server with hot reload
```

Visit `http://localhost:5173` to see the frontend.

### Backend Setup

```bash
cd backend

# Start infrastructure (PostgreSQL, Prometheus, Grafana)
make up

# Wait for PostgreSQL to be ready (~10 seconds)
sleep 10

# Initialize database schema
make reset-db

# Generate Go code from SQL
sqlc generate

# Seed with sample data
make seed

# Run API server
go run cmd/server/main.go
```

Visit `http://localhost:8000/users` to verify the API is running.

**For detailed setup instructions, troubleshooting, and contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).**

---

## Frontend Workflows

```bash
cd client
npm install          # install dependencies
npm run dev          # start Vite dev server with hot reload
npm run build        # production build (emits to dist/)
npm run preview      # serve built assets locally
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
make logs                   # tail Docker service logs
make down                   # stop Docker services
```

### Working with the Database

**Schema Changes:**
1. Edit `internal/schema.sql`
2. Run `make reset-db` to apply changes
3. Run `sqlc generate` to regenerate Go code
4. Run `make seed` to populate with fresh data

**Adding Queries:**
1. Write SQL in `internal/queries/*.sql` (e.g., `users.sql`)
2. Use sqlc annotations: `-- name: GetUserByID :one`
3. Run `sqlc generate` to create Go methods
4. Never manually edit files in `internal/db/`

**Database Configuration:**
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

### Frontend (GitHub Pages)

The frontend is deployed to GitHub Pages automatically. To deploy manually:

```bash
cd client

# Build production bundle
npm run build

# Deploy to GitHub Pages (requires gh-pages package)
npm install -D gh-pages
npx gh-pages -d dist
```

**Automated Deployment:**
- GitHub Actions can be configured to deploy on push to `main`
- The workflow should run `npm run build` in the `client/` directory
- Deploy the `client/dist/` directory to the `gh-pages` branch

**Custom Domain:**
- Add a `CNAME` file to `client/public/` with your domain
- Configure DNS to point to GitHub Pages

### Backend (Local/Docker)

Backend services are currently local-only, but Docker Compose provides a ready stack for future deployment targets:

- **Development**: Use `make up` to run locally
- **Production**: Deploy Docker containers to a cloud provider (AWS, GCP, DigitalOcean)
- **Environment Variables**: Set `DATABASE_URL`, `PORT`, and telemetry variables in production
- **Metrics**: Prometheus metrics are exposed at `/metrics` for monitoring

For production deployment, consider:
- Using managed PostgreSQL (AWS RDS, DigitalOcean Databases)
- Setting up proper secrets management
- Configuring CORS for your frontend domain
- Enabling rate limiting and authentication middleware

---

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Development setup and workflows
- Branching strategy and commit conventions
- Pull request process
- Code style guidelines
- Testing requirements

**Quick Links:**
- [Report a Bug](https://github.com/onnwee/onnwee.github.io/issues/new?labels=bug)
- [Request a Feature](https://github.com/onnwee/onnwee.github.io/issues/new?labels=enhancement)
- [Ask a Question](https://github.com/onnwee/onnwee.github.io/issues/new?labels=question)

## Next Steps / Roadmap

- Expand MDX library components in `client/src/components/mdx/` for richer blog formatting.
- Wire the frontend to the Go API once auth/editor flows are ready.
- Add analytics (Umami) and search (Meilisearch) when infrastructure is in place.
- Add automated testing (Vitest for frontend, Go tests for backend)
- Implement CI/CD pipelines for automated deployment

---

## Troubleshooting

### Frontend Issues

**Port 5173 already in use:**
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9
# Or specify a different port
npm run dev -- --port 3000
```

**Build errors after updating dependencies:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Hot reload not working:**
- Clear browser cache
- Restart Vite dev server
- Check for syntax errors in browser console

### Backend Issues

**Database connection refused:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
cd backend
make down
make up
sleep 10
make reset-db
```

**Port 8000 already in use:**
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9
# Or set a different port in .env
echo "PORT=8080" >> backend/.env
```

**sqlc generate fails:**
```bash
# Reinstall sqlc
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest

# Verify sqlc.yaml configuration
cat backend/sqlc.yaml

# Check SQL syntax in queries/
```

**Docker container name conflicts:**
```bash
# Remove old containers
docker rm -f backend-db-1 prometheus grafana

# Restart services
cd backend
make up
```

### Common Issues

**Permission denied errors:**
```bash
# Make scripts executable
chmod +x backend/scripts/*.sh

# Fix Docker socket permissions (Linux)
sudo usermod -aG docker $USER
# Log out and back in
```

**Out of disk space:**
```bash
# Clean Docker volumes
docker system prune -a --volumes

# Clean npm cache
npm cache clean --force
```

**Need help?** Open an issue on GitHub or check [CONTRIBUTING.md](./CONTRIBUTING.md) for more troubleshooting tips.
