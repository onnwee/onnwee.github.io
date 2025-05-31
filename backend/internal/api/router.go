package api

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/api/handlers"
	"github.com/onnwee/onnwee.github.io/backend/pkg/middleware"

	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"

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
	handlers.RegisterPostRoutes(r, s)
	handlers.RegisterProjectRoutes(r, s)
	handlers.RegisterUserRoutes(r, s)

	base := middleware.Chain(r, middleware.Logging, middleware.Recovery, middleware.CORS, middleware.RealIP, middleware.RateLimit)
	return otelhttp.NewHandler(base, "HTTPRouter")
}
