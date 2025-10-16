-- name: ListProjects :many
SELECT * FROM projects
ORDER BY created_at DESC;

-- name: GetProjectBySlug :one
SELECT * FROM projects
WHERE slug = $1;

-- name: CreateProject :one
INSERT INTO projects (
    title, slug, description, repo_url, live_url,
    summary, tags, footer, href, external, color, emoji, content, image, embed,
    user_id
)
VALUES (
    $1, $2, $3, $4, $5,
    $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
    $16
)
RETURNING *;

-- name: UpdateProject :one
UPDATE projects
SET title = $2,
    description = $3,
    repo_url = $4,
    live_url = $5,
    summary = $6,
    tags = $7,
    footer = $8,
    href = $9,
    external = $10,
    color = $11,
    emoji = $12,
    content = $13,
    image = $14,
    embed = $15,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteProject :exec
DELETE FROM projects
WHERE id = $1;
