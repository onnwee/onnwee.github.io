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

func RegisterLogRoutes(r *mux.Router, s *server.Server) {
	// POST /logs - Create a log
	r.HandleFunc("/logs", func(w http.ResponseWriter, r *http.Request) {
		var input db.CreateLogParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		// Validate required fields
		if input.Level == "" || input.Message == "" {
			http.Error(w, `{"error":"Missing required fields: level and message"}`, http.StatusBadRequest)
			return
		}

		// Extract IP if not provided
		if !input.IpAddress.Valid || input.IpAddress.String == "" {
			ip := utils.GetIP(r)
			input.IpAddress = utils.ToNullString(&ip)
		}

		// Use current time if not provided
		if input.CreatedAt.IsZero() {
			input.CreatedAt = time.Now().UTC()
		}

		log, err := s.DB.CreateLog(r.Context(), input)
		if err != nil {
			http.Error(w, `{"error":"Failed to create log"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(log)
	}).Methods("POST")

	// GET /logs - List logs with pagination
	r.HandleFunc("/logs", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		limit := int32(10) // default
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

		params := db.ListLogsParams{
			Limit:  limit,
			Offset: offset,
		}

		logs, err := s.DB.ListLogs(r.Context(), params)
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch logs"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(logs)
	}).Methods("GET")

	// GET /logs/{id} - Get log by ID
	r.HandleFunc("/logs/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id64, err := strconv.ParseInt(idStr, 10, 32)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		id := int32(id64)

		log, err := s.DB.GetLogByID(r.Context(), id)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Log not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to fetch log"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(log)
	}).Methods("GET")

	// DELETE /logs/{id} - Delete a log
	r.HandleFunc("/logs/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id64, err := strconv.ParseInt(idStr, 10, 32)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		id := int32(id64)

		err = s.DB.DeleteLog(r.Context(), id)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Log not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to delete log"}`, http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}).Methods("DELETE")
}
