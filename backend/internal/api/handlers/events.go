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
	// POST /events - create an event
	r.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		var input db.CreateEventParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		// Validate required fields
		if !input.EventName.Valid || input.EventName.String == "" || !input.SessionID.Valid || input.SessionID.String == "" {
			http.Error(w, `{"error":"Missing required fields: event_name and session_id"}`, http.StatusBadRequest)
			return
		}

		// Extract IP if not provided
		if !input.IpAddress.Valid || input.IpAddress.String == "" {
			ip := utils.GetIP(r)
			input.IpAddress = utils.ToNullString(&ip)
		}

		// Use current time if not provided
		if input.ViewedAt.IsZero() {
			input.ViewedAt = time.Now().UTC()
		}

		// Insert event into DB
		if err := s.DB.CreateEvent(r.Context(), input); err != nil {
			http.Error(w, `{"error":"Failed to create event"}`, http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}).Methods("POST")

	// GET /events - list events with optional filters
	r.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()

		// Pagination defaults
		limit, err := strconv.Atoi(query.Get("limit"))
		if err != nil || limit <= 0 {
			limit = 20
		}
		offset, err := strconv.Atoi(query.Get("offset"))
		if err != nil || offset < 0 {
			offset = 0
		}

		// Optional filters
		eventName := sql.NullString{}
		if v := query.Get("event_name"); v != "" {
			eventName = utils.ToNullString(&v)
		}

		sessionID := sql.NullString{}
		if v := query.Get("session_id"); v != "" {
			sessionID = utils.ToNullString(&v)
		}

		params := db.ListEventsParams{
			EventName: eventName,
			SessionID: sessionID,
			Limit:     int32(limit),
			Offset:    int32(offset),
		}

		events, err := s.DB.ListEvents(r.Context(), params)
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch events"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(events)
	}).Methods("GET")
}
