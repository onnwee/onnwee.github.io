package server

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq" // postgres driver for database/sql
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
)

type Server struct {
	DB db.Querier
}

func InitDB() (*db.Queries, error) {
	conn, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		return nil, err
	}
	return db.New(conn), nil
}

// NewServer preserves backward compatibility for consumers using *db.Queries.
func NewServer(queries *db.Queries) *Server {
	return NewServerWithQuerier(queries)
}

// NewServerWithQuerier is the new constructor accepting any db.Querier.
func NewServerWithQuerier(q db.Querier) *Server {
	return &Server{DB: q}
}
