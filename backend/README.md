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

4. **Reset the database**

   ```bash
   make reset-db
   ```

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
    "fmt"
    _ "github.com/lib/pq"
    "golang.org/x/crypto/bcrypt"
)

func main() {
    db, _ := sql.Open("postgres", "your-db-url")
    password := "your-password"
    hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    
    db.Exec("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
        "admin", "admin@example.com", string(hash))
}
```

### Session Details

* Sessions are stored in the `sessions` table
* Session cookies are httpOnly with SameSite=Lax
* Default expiration: 24 hours
* Rate limiting applies to login attempts (60 requests/minute)

---

## 📦 Tooling

* **PostgreSQL**
* **sqlc** – For type-safe DB access
* **Gorilla Mux** – For routing
* **gofakeit** – For seeding mock data

---

## 📁 Project Structure

```bash
/cmd
  /server    → main entrypoint for the API server
  /seed      → seed script for the database
/internal
  /api       → HTTP handlers
  /db        → generated SQL + models
  /utils     → helper functions (IP parsing, etc.)
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
