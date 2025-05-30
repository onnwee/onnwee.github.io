-- name: ListPosts :many
SELECT * FROM posts
WHERE is_draft = FALSE
ORDER BY published_at DESC
LIMIT $1 OFFSET $2;

-- name: GetPostBySlug :one
SELECT * FROM posts WHERE slug = $1;

-- name: CreatePost :one
INSERT INTO posts (title, slug, summary, content, tags, is_draft)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: UpdatePost :one
UPDATE posts
SET title = $2, summary = $3, content = $4, tags = $5, is_draft = $6, updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeletePost :exec
DELETE FROM posts WHERE id = $1;
