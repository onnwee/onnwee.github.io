// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: events.sql

package db

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"
)

const countEvents = `-- name: CountEvents :one
SELECT COUNT(*) FROM events
`

func (q *Queries) CountEvents(ctx context.Context) (int64, error) {
	row := q.db.QueryRowContext(ctx, countEvents)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const createEvent = `-- name: CreateEvent :exec
INSERT INTO events (event_name, data, session_id, ip_address, viewed_at)
VALUES ($1, $2, $3, $4, $5)
`

type CreateEventParams struct {
	EventName sql.NullString  `json:"event_name"`
	Data      json.RawMessage `json:"data"`
	SessionID sql.NullString  `json:"session_id"`
	IpAddress sql.NullString  `json:"ip_address"`
	ViewedAt  time.Time       `json:"viewed_at"`
}

func (q *Queries) CreateEvent(ctx context.Context, arg CreateEventParams) error {
	_, err := q.db.ExecContext(ctx, createEvent,
		arg.EventName,
		arg.Data,
		arg.SessionID,
		arg.IpAddress,
		arg.ViewedAt,
	)
	return err
}

const getEventsByName = `-- name: GetEventsByName :many
SELECT id, event_name, data, referrer, user_agent, session_id, ip_address, viewed_at, user_id FROM events
WHERE event_name = $1
ORDER BY viewed_at DESC
LIMIT $2 OFFSET $3
`

type GetEventsByNameParams struct {
	EventName sql.NullString `json:"event_name"`
	Limit     int32          `json:"limit"`
	Offset    int32          `json:"offset"`
}

func (q *Queries) GetEventsByName(ctx context.Context, arg GetEventsByNameParams) ([]Event, error) {
	rows, err := q.db.QueryContext(ctx, getEventsByName, arg.EventName, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Event
	for rows.Next() {
		var i Event
		if err := rows.Scan(
			&i.ID,
			&i.EventName,
			&i.Data,
			&i.Referrer,
			&i.UserAgent,
			&i.SessionID,
			&i.IpAddress,
			&i.ViewedAt,
			&i.UserID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listEvents = `-- name: ListEvents :many
SELECT id, event_name, data, referrer, user_agent, session_id, ip_address, viewed_at, user_id FROM events
WHERE 
  (event_name = $1 OR $1 IS NULL)
  AND (session_id = $2 OR $2 IS NULL)
ORDER BY viewed_at DESC
LIMIT $3 OFFSET $4
`

type ListEventsParams struct {
	EventName sql.NullString `json:"event_name"`
	SessionID sql.NullString `json:"session_id"`
	Limit     int32          `json:"limit"`
	Offset    int32          `json:"offset"`
}

// @param event_name:nullable
// @param session_id:nullable
func (q *Queries) ListEvents(ctx context.Context, arg ListEventsParams) ([]Event, error) {
	rows, err := q.db.QueryContext(ctx, listEvents,
		arg.EventName,
		arg.SessionID,
		arg.Limit,
		arg.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Event
	for rows.Next() {
		var i Event
		if err := rows.Scan(
			&i.ID,
			&i.EventName,
			&i.Data,
			&i.Referrer,
			&i.UserAgent,
			&i.SessionID,
			&i.IpAddress,
			&i.ViewedAt,
			&i.UserID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
