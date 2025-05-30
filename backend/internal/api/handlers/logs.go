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
	r.HandleFunc("/log", func(w http.ResponseWriter, r *http.Request) {
		var input db.CreateLogParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
		input.CreatedAt = time.Now()
		ip := utils.GetIP(r)
		input.IpAddress = sql.NullString{String: ip, Valid: ip != ""}

		if _, err := s.DB.CreateLog(r.Context(), input); err != nil {
			http.Error(w, "Failed to insert log", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
	}).Methods("POST")

	r.HandleFunc("/log/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		log, err := s.DB.GetLogByID(r.Context(), int32(id))
		if err == sql.ErrNoRows {
			http.Error(w, "Log not found", http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, "Failed to fetch log", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(log)
	}).Methods("GET")

	r.HandleFunc("/logs", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		limitStr := query.Get("limit")
		offsetStr := query.Get("offset")

		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit <= 0 {
			limit = 10
		}
		offset, err := strconv.Atoi(offsetStr)
		if err != nil || offset < 0 {
			offset = 0
		}

		params := db.ListLogsParams{
			Limit:  int32(limit),
			Offset: int32(offset),
		}

		logs, err := s.DB.ListLogs(r.Context(), params)
		if err != nil {
			http.Error(w, "Failed to fetch logs", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(logs)
	}).Methods("GET")

	r.HandleFunc("/log/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		err = s.DB.DeleteLog(r.Context(), int32(id))
		if err == sql.ErrNoRows {
			http.Error(w, "Log not found", http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, "Failed to delete log", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}).Methods("DELETE")
}
