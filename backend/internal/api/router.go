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

	// Public routes
	handlers.RegisterLogRoutes(r, s)
	handlers.RegisterEventRoutes(r, s)
	handlers.RegisterPageViewRoutes(r, s)
	handlers.RegisterAnalyticsRoutes(r, s)
	handlers.RegisterHealthRoutes(r, s)
	handlers.RegisterPostRoutes(r, s)
	handlers.RegisterUserRoutes(r, s)

	// Auth routes (rate-limited by default middleware)
	handlers.RegisterAuthRoutes(r, s)

	// Public project routes (GET only)
	handlers.RegisterPublicProjectRoutes(r, s)

	// Admin routes - protected by auth middleware
	// These are mounted under /admin prefix
	adminRouter := r.PathPrefix("/admin").Subrouter()
	adminRouter.Use(middleware.RequireAuth(queries))
	handlers.RegisterAdminProjectRoutes(adminRouter, s)

	base := middleware.Chain(r, middleware.Logging, middleware.Recovery, middleware.CORS, middleware.RealIP, middleware.Analytics(queries), middleware.RateLimit)
	return otelhttp.NewHandler(base, "HTTPRouter")
}
