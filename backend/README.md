# 🧠 onnwee Backend API

This is the backend API for the `onnwee` platform. It's written in Go and uses PostgreSQL for data persistence, managed via [`sqlc`](https://github.com/sqlc-dev/sqlc).

## 🔧 Setup

1. **Install dependencies**

   ```bash
   go mod tidy
    ```

2. **Run database container**

   ```bash
   docker-compose up -d db
   ```

3. **Reset the database**

   ```bash
   make reset-db
   ```

4. **Generate Go code from SQL**

   ```bash
   sqlc generate
   ```

5. **Seed the database**

   ```bash
   make seed
   ```

6. **Run the server**

   ```bash
   go run cmd/server/main.go
   ```

---

## 📘 API Endpoints

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

* `GET /projects` — List all projects
* `GET /projects/{slug}` — Get project by slug
* `POST /projects` — Create project
* `PUT /projects/{id}` — Update project
* `DELETE /projects/{id}` — Delete project

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

## ⚠️ Notes

* All timestamps are stored in UTC (`TIMESTAMPTZ`)
* Nullables are handled with `sql.Null*` types in Go
