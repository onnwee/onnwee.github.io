-- name: ListProjects :many
SELECT * FROM projects
ORDER BY created_at DESC;

-- name: GetProjectBySlug :one
SELECT * FROM projects
WHERE slug = $1;

-- name: CreateProject :one
INSERT INTO projects (title, slug, description, repo_url, live_url, user_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: UpdateProject :one
UPDATE projects
SET title = $2,
    description = $3,
    repo_url = $4,
    live_url = $5,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteProject :exec
DELETE FROM projects
WHERE id = $1;
