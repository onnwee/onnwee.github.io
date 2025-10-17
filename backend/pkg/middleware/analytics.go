package middleware

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/onnwee/onnwee.github.io/backend/internal/db"
	"github.com/onnwee/onnwee.github.io/backend/internal/metrics"
	"github.com/onnwee/onnwee.github.io/backend/internal/utils"
)

// Analytics middleware captures page views automatically
func Analytics(queries *db.Queries) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Only record GET requests to avoid recording API mutations
			if r.Method == http.MethodGet {
				// Record page view asynchronously to not block the request
				go recordPageView(r, queries)
			}

			// Continue to the next handler
			next.ServeHTTP(w, r)
		})
	}
}

func recordPageView(r *http.Request, queries *db.Queries) {
	// Extract request details
	path := r.URL.Path
	referrer := r.Referer()
	userAgent := r.UserAgent()
	
	// Get real IP from middleware-set header
	ip := r.Header.Get("X-Client-IP")
	if ip == "" {
		ip = utils.GetIP(r)
	}
	
	// Anonymize IP for privacy
	anonymizedIP := utils.AnonymizeIP(ip)

	// Increment Prometheus counter
	metrics.IncrementPageView(path, r.Method)

	// Create page view record
	params := db.CreatePageViewParams{
		Path:      path,
		Referrer:  toNullString(referrer),
		UserAgent: toNullString(userAgent),
		IpAddress: toNullString(anonymizedIP),
		ViewedAt:  time.Now().UTC(),
	}

	// Insert into database (ignore errors to not impact the request)
	_ = queries.CreatePageView(r.Context(), params)
}

// toNullString converts a string to sql.NullString
func toNullString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{Valid: false}
	}
	return sql.NullString{String: s, Valid: true}
}
