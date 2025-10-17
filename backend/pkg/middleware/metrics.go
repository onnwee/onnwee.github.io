package middleware

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/metrics"
)

// responseWriter wraps http.ResponseWriter to capture status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// Metrics is middleware that captures HTTP request metrics
func Metrics(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Wrap response writer to capture status code
		wrapped := &responseWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK, // default status
		}

		// Serve the request
		next.ServeHTTP(wrapped, r)

		// Calculate duration
		duration := time.Since(start).Seconds()

		// Get route pattern from mux
		route := r.URL.Path
		if routeMatch := mux.CurrentRoute(r); routeMatch != nil {
			if pathTemplate, err := routeMatch.GetPathTemplate(); err == nil {
				route = pathTemplate
			}
		}

		statusCode := strconv.Itoa(wrapped.statusCode)

		// Record metrics
		metrics.ObserveHTTPRequestDuration(route, r.Method, statusCode, duration)
		metrics.IncrementHTTPRequests(route, r.Method, statusCode)
	})
}
