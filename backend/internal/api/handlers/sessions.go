package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
	"github.com/onnwee/onnwee.github.io/backend/internal/utils"
)

func RegisterSessionRoutes(r *mux.Router, s *server.Server) {
	// POST /sessions - create a session
	r.HandleFunc("/sessions", func(w http.ResponseWriter, r *http.Request) {
		var input db.CreateSessionParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		if !input.UserID.Valid {
			http.Error(w, `{"error":"Missing required field: user_id"}`, http.StatusBadRequest)
			return
		}

		if !input.IpAddress.Valid {
			input.IpAddress = sql.NullString{String: utils.GetIP(r), Valid: true}
		}
		if !input.UserAgent.Valid {
			input.UserAgent = sql.NullString{String: r.UserAgent(), Valid: true}
		}
		if !input.ExpiresAt.Valid {
			input.ExpiresAt = sql.NullTime{Time: time.Now().Add(30 * 24 * time.Hour), Valid: true}
		}

		session, err := s.DB.CreateSession(r.Context(), input)
		if err != nil {
			http.Error(w, `{"error":"Failed to create session"}`, http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(session)
	}).Methods("POST")

	// GET /sessions/{id} - get session by ID
	r.HandleFunc("/sessions/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id, err := uuid.Parse(idStr)
		if err != nil {
			http.Error(w, `{"error":"Invalid session ID"}`, http.StatusBadRequest)
			return
		}

		session, err := s.DB.GetSessionByID(r.Context(), id)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Session not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to fetch session"}`, http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(session)
	}).Methods("GET")

	// DELETE /sessions/{id} - delete session by ID
	r.HandleFunc("/sessions/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id, err := uuid.Parse(idStr)
		if err != nil {
			http.Error(w, `{"error":"Invalid session ID"}`, http.StatusBadRequest)
			return
		}

		err = s.DB.DeleteSession(r.Context(), id)
		if err != nil {
			http.Error(w, `{"error":"Failed to delete session"}`, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}).Methods("DELETE")

	// GET /sessions/user/{user_id} - list sessions by user ID
	r.HandleFunc("/sessions/user/{user_id}", func(w http.ResponseWriter, r *http.Request) {
		userID, err := strconv.Atoi(mux.Vars(r)["user_id"])
		if err != nil {
			http.Error(w, `{"error":"Invalid user ID"}`, http.StatusBadRequest)
			return
		}
		sessions, err := s.DB.ListSessionsByUser(r.Context(), sql.NullInt32{Int32: int32(userID), Valid: true})
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch sessions"}`, http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(sessions)
	}).Methods("GET")

	// PATCH /sessions/{id}/expire - expire session by ID
	r.HandleFunc("/sessions/{id}/expire", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id, err := uuid.Parse(idStr)
		if err != nil {
			http.Error(w, `{"error":"Invalid session ID"}`, http.StatusBadRequest)
			return
		}

		err = s.DB.ExpireSession(r.Context(), id)
		if err != nil {
			http.Error(w, `{"error":"Failed to expire session"}`, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}).Methods("PATCH")
}
