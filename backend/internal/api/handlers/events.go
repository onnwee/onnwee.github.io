package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
	"github.com/onnwee/onnwee.github.io/backend/internal/utils"
)

func RegisterEventRoutes(r *mux.Router, s *server.Server) {
	r.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		var input db.CreateEventParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		input.IpAddress = sql.NullString{String: utils.GetIP(r), Valid: true}
		input.OccurredAt = time.Now()

		if err := s.DB.CreateEvent(r.Context(), input); err != nil {
			http.Error(w, "Failed to create event", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}).Methods("POST")

	r.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		limit, err := strconv.Atoi(query.Get("limit"))
		if err != nil || limit <= 0 {
			limit = 20
		}
		offset, err := strconv.Atoi(query.Get("offset"))
		if err != nil || offset < 0 {
			offset = 0
		}

		params := db.ListEventsParams{
			Limit:  int32(limit),
			Offset: int32(offset),
		}

		events, err := s.DB.ListEvents(r.Context(), params)
		if err != nil {
			http.Error(w, "Failed to fetch events", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(events)
	}).Methods("GET")

	r.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		limit, err := strconv.Atoi(query.Get("limit"))
		if err != nil || limit <= 0 {
			limit = 20
		}
		offset, err := strconv.Atoi(query.Get("offset"))
		if err != nil || offset < 0 {
			offset = 0
		}
	
		eventName := query.Get("event_name")
		sessionID := query.Get("session_id")
	
		params := db.ListEventsParams{
			EventName: sql.NullString{String: eventName, Valid: eventName != ""},
			SessionID: sql.NullString{String: sessionID, Valid: sessionID != ""},
			Limit:     int32(limit),
			Offset:    int32(offset),
		}
	
		events, err := s.DB.ListEvents(r.Context(), params)
		if err != nil {
			http.Error(w, "Failed to fetch events", http.StatusInternalServerError)
			return
		}
	
		json.NewEncoder(w).Encode(events)
	}).Methods("GET")
}
