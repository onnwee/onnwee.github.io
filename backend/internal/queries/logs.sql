-- name: CreateLog :one
INSERT INTO logs (level, message, context, ip_address, created_at)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetLogByID :one
SELECT * FROM logs
WHERE id = $1;

-- name: ListLogs :many
SELECT * FROM logs
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: DeleteLog :exec
DELETE FROM logs
WHERE id = $1;
