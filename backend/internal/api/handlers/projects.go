package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
)

func RegisterProjectRoutes(r *mux.Router, s *server.Server) {
	// POST /projects - Create a project
	r.HandleFunc("/projects", func(w http.ResponseWriter, r *http.Request) {
		var input db.CreateProjectParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		project, err := s.DB.CreateProject(r.Context(), input)
		if err != nil {
			http.Error(w, `{"error":"Failed to create project"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(project)
	}).Methods("POST")

	// GET /projects - List projects
	r.HandleFunc("/projects", func(w http.ResponseWriter, r *http.Request) {
		projects, err := s.DB.ListProjects(r.Context())
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch projects"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(projects)
	}).Methods("GET")

	// GET /projects/{slug} - Get project by slug
	r.HandleFunc("/projects/{slug}", func(w http.ResponseWriter, r *http.Request) {
		slug := mux.Vars(r)["slug"]
		project, err := s.DB.GetProjectBySlug(r.Context(), slug)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Project not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to fetch project"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(project)
	}).Methods("GET")

	// PUT /projects/{id} - Update a project
	r.HandleFunc("/projects/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}

		var input db.UpdateProjectParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		input.ID = int32(id)
		project, err := s.DB.UpdateProject(r.Context(), input)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Project not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to update project"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(project)
	}).Methods("PUT")

	// DELETE /projects/{id} - Delete a project
	r.HandleFunc("/projects/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}

		err = s.DB.DeleteProject(r.Context(), int32(id))
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Project not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to delete project"}`, http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}).Methods("DELETE")
}
