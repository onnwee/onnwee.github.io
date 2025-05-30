package api

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/api/handlers"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
)

func NewRouter(queries *db.Queries) http.Handler {
	s := server.NewServer(queries)

	r := mux.NewRouter()
	handlers.RegisterLogRoutes(r, s)
	handlers.RegisterEventRoutes(r, s)
	handlers.RegisterPageViewRoutes(r, s)
	handlers.RegisterHealthRoutes(r, s)

	return r
}
