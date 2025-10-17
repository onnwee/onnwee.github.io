package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
	"github.com/onnwee/onnwee.github.io/backend/internal/metrics"
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

		// Increment Prometheus counter for events
		if input.EventName.Valid {
			metrics.IncrementEvent(input.EventName.String)
		}

		w.WriteHeader(http.StatusCreated)
	}).Methods("POST")

	// GET /events - list events with optional filters
	r.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()

		// Pagination defaults
		limit := int32(20) // default
		if limitStr := query.Get("limit"); limitStr != "" {
			if limit64, err := strconv.ParseInt(limitStr, 10, 32); err == nil && limit64 > 0 {
				limit = int32(limit64)
			}
		}

		offset := int32(0) // default
		if offsetStr := query.Get("offset"); offsetStr != "" {
			if offset64, err := strconv.ParseInt(offsetStr, 10, 32); err == nil && offset64 >= 0 {
				offset = int32(offset64)
			}
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
			Limit:     limit,
			Offset:    offset,
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
