-- name: GetEventsByName :many
SELECT * FROM events
WHERE event_name = $1
ORDER BY viewed_at DESC
LIMIT $2 OFFSET $3;

-- name: CountEvents :one
SELECT COUNT(*) FROM events;

-- name: CreateEvent :exec
INSERT INTO events (event_name, data, session_id, ip_address, viewed_at)
VALUES ($1, $2, $3, $4, $5);

-- name: ListEvents :many
-- @param event_name:nullable
-- @param session_id:nullable
SELECT * FROM events
WHERE 
  (event_name = $1 OR $1 IS NULL)
  AND (session_id = $2 OR $2 IS NULL)
ORDER BY viewed_at DESC
LIMIT $3 OFFSET $4;