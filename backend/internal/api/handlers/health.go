package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
)

func RegisterHealthRoutes(r *mux.Router, _ *server.Server) {
	r.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	}).Methods("GET")
}
