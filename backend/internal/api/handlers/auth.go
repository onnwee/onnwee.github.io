package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
	"github.com/onnwee/onnwee.github.io/backend/internal/utils"
	"golang.org/x/crypto/bcrypt"
)

const (
	sessionCookieName = "session_id"
	sessionDuration   = 24 * time.Hour // 24 hours
)

func RegisterAuthRoutes(r *mux.Router, s *server.Server) {
	// POST /auth/login - Login with username/email + password
	r.HandleFunc("/auth/login", func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		if input.Username == "" || input.Password == "" {
			http.Error(w, `{"error":"Username and password are required"}`, http.StatusBadRequest)
			return
		}

		// Get user by username or email
		user, err := s.DB.GetUserForAuth(r.Context(), input.Username)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Invalid credentials"}`, http.StatusUnauthorized)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
			return
		}

		// Check if user has a password hash
		if !user.PasswordHash.Valid || user.PasswordHash.String == "" {
			http.Error(w, `{"error":"Invalid credentials"}`, http.StatusUnauthorized)
			return
		}

		// Verify password
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash.String), []byte(input.Password)); err != nil {
			http.Error(w, `{"error":"Invalid credentials"}`, http.StatusUnauthorized)
			return
		}

		// Create session
		expiresAt := time.Now().Add(sessionDuration)
		session, err := s.DB.CreateSession(r.Context(), db.CreateSessionParams{
			UserID: sql.NullInt32{
				Int32: user.ID,
				Valid: true,
			},
			IpAddress: sql.NullString{
				String: utils.GetIP(r),
				Valid:  true,
			},
			UserAgent: sql.NullString{
				String: r.UserAgent(),
				Valid:  true,
			},
			ExpiresAt: sql.NullTime{
				Time:  expiresAt,
				Valid: true,
			},
		})
		if err != nil {
			http.Error(w, `{"error":"Failed to create session"}`, http.StatusInternalServerError)
			return
		}

		// Set httpOnly cookie
		http.SetCookie(w, &http.Cookie{
			Name:     sessionCookieName,
			Value:    session.ID.String(),
			Path:     "/",
			Expires:  expiresAt,
			MaxAge:   int(sessionDuration.Seconds()),
			HttpOnly: true,
			Secure:   false, // Set to true in production with HTTPS
			SameSite: http.SameSiteLaxMode,
		})

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":  true,
			"user_id":  user.ID,
			"username": user.Username,
		})
	}).Methods("POST")

	// POST /auth/logout - Logout and invalidate session
	r.HandleFunc("/auth/logout", func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(sessionCookieName)
		if err != nil {
			http.Error(w, `{"error":"No active session"}`, http.StatusUnauthorized)
			return
		}

		sessionID, err := uuid.Parse(cookie.Value)
		if err != nil {
			http.Error(w, `{"error":"Invalid session"}`, http.StatusBadRequest)
			return
		}

		// Expire the session in the database
		if err := s.DB.ExpireSession(r.Context(), sessionID); err != nil {
			// Even if DB update fails, we'll clear the cookie
			// Log error but continue
		}

		// Clear the cookie
		http.SetCookie(w, &http.Cookie{
			Name:     sessionCookieName,
			Value:    "",
			Path:     "/",
			Expires:  time.Unix(0, 0),
			MaxAge:   -1,
			HttpOnly: true,
			Secure:   false,
			SameSite: http.SameSiteLaxMode,
		})

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"message": "Logged out successfully",
		})
	}).Methods("POST")
}
