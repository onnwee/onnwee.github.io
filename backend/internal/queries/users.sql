-- name: CreateUser :one
INSERT INTO users (username, email, updated_at)
VALUES ($1, $2, now())
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;

-- name: GetUserByUsername :one
SELECT * FROM users
WHERE username = $1;

-- name: ListUsers :many
SELECT * FROM users
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;

-- name: PatchUser :one
UPDATE users
SET
  username = COALESCE(sqlc.narg('username'), username),
  email = COALESCE(sqlc.narg('email'), email),
  updated_at = now()
WHERE id = sqlc.arg('id')
RETURNING *;