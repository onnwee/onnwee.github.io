package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
)

func RegisterHealthRoutes(r *mux.Router, s *server.Server) {
	r.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}).Methods("GET")
}
