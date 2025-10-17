-- name: GetViewsByPath :many
SELECT * FROM page_views
WHERE path = $1
ORDER BY viewed_at DESC
LIMIT $2 OFFSET $3;

-- name: CountViewsByPath :one
SELECT COUNT(*) FROM page_views
WHERE path = $1;

-- name: CreatePageView :exec
INSERT INTO page_views (path, referrer, user_agent, session_id, ip_address, viewed_at, user_id)
VALUES ($1, $2, $3, $4, $5, $6, $7);

-- name: GetViewsCountByPathLastNDays :many
SELECT 
  path,
  COUNT(*) as view_count
FROM page_views
WHERE viewed_at >= NOW() - ($1 || ' days')::INTERVAL
GROUP BY path
ORDER BY view_count DESC;

-- name: GetTotalViewsLastNDays :one
SELECT COUNT(*) 
FROM page_views
WHERE viewed_at >= NOW() - ($1 || ' days')::INTERVAL;