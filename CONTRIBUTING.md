# Contributing to onnwee.github.io

Thank you for your interest in contributing! This guide will help you get started with development, testing, and submitting changes to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branching Strategy](#branching-strategy)
- [Commit Message Conventions](#commit-message-conventions)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Project Structure](#project-structure)
- [Getting Help](#getting-help)

---

## Code of Conduct

Be respectful, inclusive, and constructive. We're here to learn and build together.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20+) and **npm** (v10+)
- **Go** (v1.24+)
- **Docker** and **Docker Compose**
- **Git**
- **sqlc** (for database code generation): `go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest`

### Quick Setup (< 15 minutes)

1. **Clone the repository**
   ```bash
   git clone https://github.com/onnwee/onnwee.github.io.git
   cd onnwee.github.io
   ```

2. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

3. **Backend Setup** (in a new terminal)
   ```bash
   cd backend
   
   # Copy environment template
   cp .env.example .env
   
   # Start Docker services (PostgreSQL, Prometheus, Grafana)
   make up
   
   # Wait ~10 seconds for PostgreSQL to be ready
   sleep 10
   
   # Reset database schema
   make reset-db
   
   # Generate Go code from SQL
   sqlc generate
   
   # Seed database with sample data
   make seed
   
   # Run the API server
   go run cmd/server/main.go
   ```
   The API will be available at `http://localhost:8000`

4. **Verify Setup**
   - Frontend: Visit `http://localhost:5173`
   - Backend API: Visit `http://localhost:8000/users`
   - Prometheus: Visit `http://localhost:9090`
   - Grafana: Visit `http://localhost:3000` (admin/admin)

---

## Development Workflow

### Frontend Development

```bash
cd client

# Start development server with hot reload
npm run dev

# Lint your code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

**Adding Blog Posts:**
- Create a new `.mdx` file in `client/src/blog/`
- Include required frontmatter: `title`, `tags`, and optional `summary`, `date`
- The post will automatically appear in the blog index

**Styling:**
- Use Tailwind CSS utilities defined in `client/src/index.css`
- Maintain glitch/terminal aesthetic with existing utility classes
- Wrap new UI in `<ThemeProvider>` for theme support

### Backend Development

```bash
cd backend

# Start Docker services
make up

# Run API server (with hot reload if nodemon is installed)
make run
# OR without hot reload:
go run cmd/server/main.go

# After modifying SQL files in internal/queries/*.sql
sqlc generate

# After changing schema in internal/schema.sql
make reset-db
sqlc generate
make seed

# Seed database with fresh data
make seed

# View Docker logs
make logs

# Stop Docker services
make down
```

**Adding Database Queries:**
1. Write SQL in `backend/internal/queries/*.sql`
2. Run `sqlc generate` to create Go code
3. Never manually edit files in `backend/internal/db/` (they're auto-generated)

**Schema Changes:**
1. Update `backend/internal/schema.sql`
2. Run `make reset-db` to apply changes
3. Run `sqlc generate` to regenerate Go code
4. Run `make seed` to populate with fresh data

---

## Branching Strategy

We use a feature branch workflow:

- **`main`** - Production-ready code. All changes come via PRs.
- **`feature/*`** - New features (`feature/add-search`, `feature/analytics`)
- **`fix/*`** - Bug fixes (`fix/navigation-bug`, `fix/api-timeout`)
- **`docs/*`** - Documentation updates (`docs/contributing-guide`)
- **`chore/*`** - Maintenance tasks (`chore/update-deps`, `chore/refactor-middleware`)

### Creating a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/your-feature-name
```

---

## Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no feature change)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (deps, build config)
- **ci**: CI/CD configuration changes

### Examples

```bash
# Simple feature
git commit -m "feat: add dark mode toggle to navigation"

# Bug fix with scope
git commit -m "fix(api): resolve null pointer in user handler"

# Documentation
git commit -m "docs: update README with Docker setup instructions"

# Breaking change
git commit -m "feat!: migrate to React 19

BREAKING CHANGE: Requires Node.js 20+ for new JSX transform"
```

### Best Practices

- **Keep commits atomic**: One logical change per commit
- **Write clear subjects**: Use imperative mood ("add" not "added" or "adds")
- **Keep subject under 72 characters**
- **Explain the "why" in the body**, not just the "what"
- **Reference issues**: Include `Closes #123` or `Fixes #456` in footer

---

## Pull Request Process

### Before Opening a PR

1. **Sync with main**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git merge main
   ```

2. **Test your changes**
   - Frontend: Run `npm run build` and `npm run preview`
   - Backend: Run `go test ./...` (if tests exist)
   - Verify linting: `npm run lint` (frontend)

3. **Review your changes**
   ```bash
   git diff main...your-branch
   ```

### Opening a PR

1. Push your branch to GitHub
2. Open a PR from your branch to `main`
3. Fill out the PR template:
   - **Title**: Use conventional commit format
   - **Description**: Explain what and why
   - **Screenshots**: Include for UI changes
   - **Testing**: Describe how to verify changes
   - **Related Issues**: Link with `Closes #123`

### PR Checklist

- [ ] Code follows style guidelines (ESLint, Prettier, gofmt)
- [ ] Commits follow conventional commit format
- [ ] Documentation updated (if applicable)
- [ ] No merge conflicts with `main`
- [ ] Self-reviewed the code changes
- [ ] Changes tested locally
- [ ] PR description is clear and complete

### Review Process

- Reviewers will provide feedback via comments
- Address feedback by pushing new commits to your branch
- Request re-review when ready
- Maintainer will merge when approved

### After Merge

- Delete your feature branch (locally and remotely)
  ```bash
  git checkout main
  git pull origin main
  git branch -d feature/your-feature
  git push origin --delete feature/your-feature
  ```

---

## Code Style Guidelines

### Frontend (TypeScript/React)

**Linting & Formatting:**
- Run `npm run lint` before committing
- Use Prettier for formatting (configured in `.prettierrc`)
- ESLint rules are defined in `eslint.config.js`

**Conventions:**
- Use functional components with hooks
- Import paths: Use `@/` alias for absolute imports (`@/components`, `@/hooks`, etc.)
- CSS: Prefer Tailwind utilities over custom CSS
- Components: One component per file, named exports
- TypeScript: Enable strict mode, avoid `any` types

**Example:**
```tsx
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import '@/styles/component.css'

export function MyComponent({ title }: { title: string }) {
  const [count, setCount] = useState(0)
  const { theme } = useTheme()
  
  return (
    <div className="terminal-box">
      <h2>{title}</h2>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}
```

### Backend (Go)

**Formatting:**
- Run `gofmt -w .` or `go fmt ./...` before committing
- Use `goimports` for import organization

**Conventions:**
- Follow [Effective Go](https://go.dev/doc/effective_go)
- Package names: lowercase, single word
- Error handling: Always check errors, return early
- Database access: Use sqlc-generated code only
- Handlers: Accept `*server.Server`, return JSON via stdlib
- Middleware: Register in `api.NewRouter` chain

**Example:**
```go
func HandleGetUser(s *server.Server) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        id, err := strconv.Atoi(mux.Vars(r)["id"])
        if err != nil {
            http.Error(w, "Invalid ID", http.StatusBadRequest)
            return
        }
        
        user, err := s.DB.GetUser(r.Context(), int32(id))
        if err != nil {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }
        
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(user)
    }
}
```

### SQL (sqlc)

- Write queries in `backend/internal/queries/*.sql`
- Use descriptive query names (e.g., `-- name: GetUserByID :one`)
- Keep schema in `backend/internal/schema.sql`
- Use `TIMESTAMPTZ` for all timestamps
- Add indexes for frequently queried columns

---

## Testing Requirements

### Frontend Testing

Currently, the frontend does not have a formal test suite. When contributing:

- **Manual testing is required**: Test your changes in the browser
- **Multiple browsers**: Test in Chrome/Firefox/Safari if possible
- **Responsive design**: Test on mobile and desktop viewports
- **Error boundaries**: Wrap risky components in `<ErrorBoundary>`

**Future**: We plan to add Vitest for unit tests and Playwright for E2E tests.

### Backend Testing

Currently, the backend does not have a formal test suite. When contributing:

- **Manual API testing**: Use curl, Postman, or HTTPie to test endpoints
- **Database verification**: Check PostgreSQL tables after mutations
- **Error cases**: Test invalid inputs and edge cases

**Testing Endpoints:**
```bash
# Create a user
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com"}'

# List users
curl http://localhost:8000/users

# Get user by ID
curl http://localhost:8000/users/1
```

**Future**: We plan to add Go unit tests and integration tests.

---

## Project Structure

```
onnwee.github.io/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React context providers
│   │   ├── data/               # Static project metadata
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Route-level components
│   │   ├── blog/               # MDX blog posts
│   │   ├── utils/              # Helper functions
│   │   └── index.css           # Global styles + Tailwind
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── eslint.config.js
│
├── backend/                     # Go API
│   ├── cmd/
│   │   ├── server/             # API entrypoint
│   │   └── seed/               # Database seeding
│   ├── internal/
│   │   ├── api/                # HTTP handlers
│   │   ├── db/                 # sqlc-generated code (do not edit)
│   │   ├── queries/            # SQL queries (source of truth)
│   │   └── schema.sql          # Database schema
│   ├── pkg/
│   │   └── middleware/         # HTTP middleware
│   ├── scripts/
│   │   └── reset_db.sh         # Database reset script
│   ├── go.mod
│   ├── Makefile
│   ├── sqlc.yaml               # sqlc configuration
│   └── docker-compose.yml      # Local infrastructure
│
├── README.md                    # Project overview
├── CONTRIBUTING.md             # This file
└── LICENSE
```

---

## Getting Help

### Resources

- **README.md**: High-level architecture and workflows
- **Copilot Instructions**: `.github/copilot-instructions.md` (patterns & conventions)
- **sqlc Documentation**: [sqlc.dev](https://sqlc.dev/)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev/)
- **Go Documentation**: [go.dev](https://go.dev/)

### Questions & Issues

- **Bug Reports**: Open an issue with the `bug` label
- **Feature Requests**: Open an issue with the `enhancement` label
- **Questions**: Open a discussion or issue with the `question` label
- **Security Issues**: Email the maintainer directly (see profile)

### Development Tips

**Frontend Hot Reload Not Working?**
- Restart the Vite dev server
- Clear browser cache
- Check for syntax errors in the console

**Backend Database Connection Errors?**
- Ensure Docker services are running: `docker ps`
- Check `.env` for correct `DATABASE_URL`
- Reset database: `make reset-db`

**sqlc Generation Errors?**
- Verify `sqlc.yaml` configuration
- Ensure PostgreSQL syntax is correct
- Check for missing `-- name:` comments in queries

**Docker Port Conflicts?**
- Stop conflicting services on ports 5432, 8000, 9090, 3000
- Or modify ports in `docker-compose.yml`

---

## Thank You!

Your contributions make this project better. We appreciate your time and effort! 🚀
