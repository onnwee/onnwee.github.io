package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
	"github.com/onnwee/onnwee.github.io/backend/internal/utils"
)

func RegisterPageViewRoutes(r *mux.Router, s *server.Server) {
	r.HandleFunc("/pageviews", func(w http.ResponseWriter, r *http.Request) {
		var input db.CreatePageViewParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		ip := utils.GetIP(r)
		input.IpAddress = utils.ToNullString(&ip)
		input.ViewedAt = time.Now()

		if err := s.DB.CreatePageView(r.Context(), input); err != nil {
			http.Error(w, "Failed to record page view", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}).Methods("POST")
}
