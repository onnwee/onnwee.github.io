-- name: CreateSession :one
INSERT INTO sessions (user_id, ip_address, user_agent, expires_at)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetSessionByID :one
SELECT * FROM sessions
WHERE id = $1;

-- name: DeleteSession :exec
DELETE FROM sessions
WHERE id = $1;

-- name: ListSessionsByUser :many
SELECT * FROM sessions
WHERE user_id = $1
ORDER BY created_at DESC;

-- name: ExpireSession :exec
UPDATE sessions
SET expires_at = now()
WHERE id = $1;
