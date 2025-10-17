package middleware

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/google/uuid"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
)

type ctxKey string

const (
	sessionCookieName        = "session_id"
	userIDContextKey  ctxKey = "user_id"
)

// RequireAuth middleware checks for a valid session cookie
// and verifies it against the database
func RequireAuth(queries *db.Queries) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get session cookie
			cookie, err := r.Cookie(sessionCookieName)
			if err != nil {
				http.Error(w, `{"error":"Authentication required"}`, http.StatusUnauthorized)
				return
			}

			// Parse session ID
			sessionID, err := uuid.Parse(cookie.Value)
			if err != nil {
				http.Error(w, `{"error":"Invalid session"}`, http.StatusUnauthorized)
				return
			}

			// Validate session in database
			session, err := queries.GetValidSession(r.Context(), sessionID)
			if err == sql.ErrNoRows {
				http.Error(w, `{"error":"Session expired or invalid"}`, http.StatusUnauthorized)
				return
			} else if err != nil {
				http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
				return
			}

			// Session is valid, add user ID to context
			if session.UserID.Valid {
				ctx := context.WithValue(r.Context(), userIDContextKey, session.UserID.Int32)
				r = r.WithContext(ctx)
			}

			next.ServeHTTP(w, r)
		})
	}
}

// GetUserIDFromContext retrieves the user ID from the request context
func GetUserIDFromContext(ctx context.Context) (int32, bool) {
	userID, ok := ctx.Value(userIDContextKey).(int32)
	return userID, ok
}
