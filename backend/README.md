# 🧠 onnwee Backend API

This is the backend API for the `onnwee` platform. It's written in Go and uses PostgreSQL for data persistence, managed via [`sqlc`](https://github.com/sqlc-dev/sqlc).

## 🔧 Setup

1. **Install dependencies**

   ```bash
   go mod tidy
    ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration
   # At minimum, set DATABASE_URL to your PostgreSQL connection string
   ```

   See `.env.example` for all available configuration options.

3. **Run database container**

   ```bash
   docker-compose up -d db
   ```

4. **Run database migrations**

   ```bash
   make migrate-up
   ```

   This will apply all pending migrations to your database.

5. **Generate Go code from SQL**

   ```bash
   sqlc generate
   ```

6. **Seed the database**

   ```bash
   make seed
   ```

7. **Run the server**

   ```bash
   go run cmd/server/main.go
   ```

---

## 📘 API Endpoints

### Authentication

* `POST /auth/login` — Login with username/email and password
  * Request body: `{"username": "user", "password": "pass"}`
  * Returns: `{"success": true, "user_id": 1, "username": "user"}`
  * Sets httpOnly session cookie (24-hour expiration)
* `POST /auth/logout` — Logout and invalidate session
  * Returns: `{"success": true, "message": "Logged out successfully"}`
  * Clears session cookie

### Users

* `POST /users` — Create a new user
* `GET /users` — List all users
* `GET /users/{id}` — Get user by ID
* `DELETE /users/{id}` — Delete user by ID

### Posts

* `GET /posts` — List published posts (`?limit=&offset=`)
* `GET /posts/{slug}` — Get post by slug
* `POST /posts` — Create post
* `PUT /posts/{id}` — Update post
* `DELETE /posts/{id}` — Delete post

### Projects

**Public routes (no authentication required):**
* `GET /projects` — List all projects
* `GET /projects/{slug}` — Get project by slug

**Admin routes (authentication required):**
* `POST /admin/projects` — Create project
* `PUT /admin/projects/{id}` — Update project
* `DELETE /admin/projects/{id}` — Delete project

### Logs

* `GET /logs` — List logs (`?limit=&offset=`)
* `GET /logs/{id}` — Get log by ID
* `POST /logs` — Create log
* `DELETE /logs/{id}` — Delete log

### Events

* `GET /events` — List events (optional `?event_name=&session_id=&limit=&offset=`)
* `POST /events` — Create event

### Page Views

* `GET /page-views?path=/some/path` — List views for a path
* `POST /page-views` — Log a new page view

### Analytics

* `GET /analytics/stats` — Get aggregate analytics statistics
  * Query params: `days` (default: 7, options: 7, 30)
  * Returns: Total page views, total events, top paths, and top event names for the specified time period
  * Example: `GET /analytics/stats?days=30`
  * Response:
    ```json
    {
      "total_page_views": 1234,
      "total_events": 567,
      "page_views_by_path": [
        {"path": "/projects", "count": 345},
        {"path": "/", "count": 289}
      ],
      "events_by_name": [
        {"event_name": "click", "count": 123},
        {"event_name": "scroll", "count": 89}
      ],
      "period": "30 days"
    }
    ```

### Prometheus Metrics

* `GET /metrics` — Prometheus metrics endpoint
  * Exports `http_page_views_total{path, method}` counter
  * Exports `http_events_total{event_name}` counter
  * Additional standard Go metrics and OpenTelemetry metrics

### Sessions

* `GET /sessions` — List all sessions
* `GET /sessions/user/{user_id}` — Get sessions for user
* `GET /sessions/{id}` — Get session by ID
* `POST /sessions` — Create session
* `DELETE /sessions/{id}` — Delete session
* `PUT /sessions/{id}/expire` — Expire session

---

## 🔐 Authentication

The API uses session-based authentication for admin routes:

1. **Login**: POST credentials to `/auth/login` to receive a session cookie
2. **Admin Access**: Use the session cookie to access `/admin/*` endpoints
3. **Logout**: POST to `/auth/logout` to invalidate the session

### Creating a User with Password

Users need a password hash to login. You can create one using Go:

```go
package main

import (
    "database/sql"
    "log"
    _ "github.com/lib/pq"
    "golang.org/x/crypto/bcrypt"
)

func main() {
    // Simplified example - add proper error handling in production
    db, err := sql.Open("postgres", "your-db-url")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()
    
    password := "your-password"
    hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        log.Fatal(err)
    }
    
    _, err = db.Exec("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
        "admin", "admin@example.com", string(hash))
    if err != nil {
        log.Fatal(err)
    }
    
    log.Println("User created successfully")
}
```

### Session Details

* Sessions are stored in the `sessions` table
* Session cookies are httpOnly with SameSite=Lax
* Default expiration: 24 hours
* Rate limiting applies to login attempts (60 requests/minute)

---

## 📊 Analytics & Privacy

The backend includes lightweight analytics collection for monitoring usage:

### Automatic Page View Tracking

The analytics middleware automatically records page views for all GET requests:
* **Path**: The requested URL path
* **Method**: HTTP method (GET)
* **Referrer**: The referring page (if available)
* **User Agent**: Browser/client user agent string
* **IP Address**: **Anonymized** for privacy (see below)
* **Timestamp**: When the request was made

### IP Anonymization

To protect user privacy, all IP addresses are anonymized before storage:
* **IPv4**: Last octet is masked (e.g., `192.168.1.123` → `192.168.1.0`)
* **IPv6**: Last 80 bits are masked, keeping only the /48 prefix
* **Invalid IPs**: Hashed using SHA256

This ensures compliance with privacy regulations while still allowing basic geographic and network analysis.

### Event Tracking

Events can be manually tracked via the `/events` endpoint. Each event is also counted in Prometheus metrics for real-time monitoring.

### Prometheus Integration

All analytics are exposed as Prometheus metrics at `/metrics`:
* `http_page_views_total{path, method}` - Counter of page views by path and HTTP method
* `http_events_total{event_name}` - Counter of custom events by event name

These metrics can be scraped by Prometheus and visualized in Grafana or similar tools.

---

## 📦 Tooling

* **PostgreSQL**
* **golang-migrate** – For database migrations
* **sqlc** – For type-safe DB access
* **Gorilla Mux** – For routing
* **gofakeit** – For seeding mock data

---

## 🗄️ Database Migrations

This project uses [golang-migrate](https://github.com/golang-migrate/migrate) for versioned database migrations.

### Migration Commands

* **Apply pending migrations:**
  ```bash
  make migrate-up
  ```

* **Rollback last migration:**
  ```bash
  make migrate-down-1
  ```

* **Rollback all migrations (requires confirmation):**
  ```bash
  make migrate-down
  ```

* **Create a new migration:**
  ```bash
  make migrate-create NAME=add_users_table
  ```
  This creates two files in `migrations/`:
  - `NNNNNN_add_users_table.up.sql` - Applied when migrating up
  - `NNNNNN_add_users_table.down.sql` - Applied when rolling back

* **Reset database (rollback all, then apply all):**
  ```bash
  make migrate-reset
  ```
  This is useful for development when you want a clean slate.

* **Force migration version (recovery only):**
  ```bash
  make migrate-force VERSION=1
  ```
  Use this only if migrations are in a broken state.

### Migration Files

Migrations are stored in `backend/migrations/` with sequential naming:
```
000001_initial_schema.up.sql
000001_initial_schema.down.sql
000002_add_feature.up.sql
000002_add_feature.down.sql
```

### Docker Integration

When running the full stack with `docker-compose up`, migrations are automatically applied before the API server starts.

### Important Notes

* Always create both `up` and `down` migrations for reversibility
* Test migrations locally before committing
* Never modify existing migration files after they've been applied to production
* The `sqlc.yaml` now points to the `migrations/` directory instead of `schema.sql`

---

## 📁 Project Structure

```bash
/cmd
  /server      → main entrypoint for the API server
  /seed        → seed script for the database
/internal
  /api         → HTTP handlers
  /db          → generated SQL + models (via sqlc)
  /queries     → SQL query definitions for sqlc
  /utils       → helper functions (IP parsing, etc.)
/migrations    → versioned database migrations
/scripts       → helper scripts (db reset, migrations, etc.)
```

---

## 🔐 Environment Variables

The backend requires certain environment variables to run. Copy `.env.example` to `.env` and configure:

### Required
* `DATABASE_URL` – PostgreSQL connection string (e.g., `postgres://user:pass@localhost:5432/dbname?sslmode=disable`)

### Optional
* `PORT` – Server port (default: `8080`)
* `APP_ENV` – Environment name for telemetry (e.g., `development`, `staging`, `production`)
* `SEED_NUM_USERS` – Number of users to create when seeding (default: `500`)
* `SEED_NUM_POSTS` – Number of posts to create when seeding (default: `500`)
* `SEED_NUM_PROJECTS` – Number of projects to create when seeding (default: `500`)
* `SEED_DELAY` – Delay between seed operations (default: `50ms`)

**⚠️ Security Note:** Never commit your `.env` file to version control. It contains sensitive credentials.

---

## ⚠️ Notes

* All timestamps are stored in UTC (`TIMESTAMPTZ`)
* Nullables are handled with `sql.Null*` types in Go
