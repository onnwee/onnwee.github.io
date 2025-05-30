-- name: GetEventsByName :many
SELECT * FROM events
WHERE event_name = $1
ORDER BY occurred_at DESC
LIMIT $2 OFFSET $3;

-- name: CountEvents :one
SELECT COUNT(*) FROM events;

-- name: CreateEvent :exec
INSERT INTO events (event_name, data, session_id, ip_address, occurred_at)
VALUES ($1, $2, $3, $4, $5);

-- name: ListEvents :many
SELECT * FROM events
WHERE 
  (:event_name::text IS NULL OR event_name = :event_name)
  AND (:session_id::text IS NULL OR session_id = :session_id)
ORDER BY occurred_at DESC
LIMIT :limit OFFSET :offset;