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

func RegisterProjectRoutes(r *mux.Router, s *server.Server) {
	type projectResponse struct {
		ID          int32     `json:"id"`
		Title       string    `json:"title"`
		Slug        string    `json:"slug"`
		Description *string   `json:"description"`
		RepoUrl     *string   `json:"repo_url"`
		LiveUrl     *string   `json:"live_url"`
		Summary     *string   `json:"summary"`
		Tags        []string  `json:"tags"`
		Footer      *string   `json:"footer"`
		Href        *string   `json:"href"`
		External    bool      `json:"external"`
		Color       *string   `json:"color"`
		Emoji       *string   `json:"emoji"`
		Content     *string   `json:"content"`
		Image       *string   `json:"image"`
		Embed       *string   `json:"embed"`
		CreatedAt   string    `json:"created_at"`
		UpdatedAt   string    `json:"updated_at"`
	}

	toPtr := func(ns sql.NullString) *string {
		if ns.Valid {
			v := ns.String
			return &v
		}
		return nil
	}

	toTimeString := func(t sql.NullTime) string {
		if t.Valid {
			return t.Time.Format(time.RFC3339)
		}
		return ""
	}

	toResp := func(p db.Project) projectResponse {
		// Ensure non-nil tags
		tags := p.Tags
		if tags == nil {
			tags = []string{}
		}
		return projectResponse{
			ID:          p.ID,
			Title:       p.Title,
			Slug:        p.Slug,
			Description: toPtr(p.Description),
			RepoUrl:     toPtr(p.RepoUrl),
			LiveUrl:     toPtr(p.LiveUrl),
			Summary:     toPtr(p.Summary),
			Tags:        tags,
			Footer:      toPtr(p.Footer),
			Href:        toPtr(p.Href),
			External:    p.External,
			Color:       toPtr(p.Color),
			Emoji:       toPtr(p.Emoji),
			Content:     toPtr(p.Content),
			Image:       toPtr(p.Image),
			Embed:       toPtr(p.Embed),
			CreatedAt:   toTimeString(p.CreatedAt),
			UpdatedAt:   toTimeString(p.UpdatedAt),
		}
	}

	type projectPayload struct {
		Title       string   `json:"title"`
		Slug        string   `json:"slug"`
		Description *string  `json:"description"`
		RepoUrl     *string  `json:"repo_url"`
		LiveUrl     *string  `json:"live_url"`
		Summary     *string  `json:"summary"`
		Tags        []string `json:"tags"`
		Footer      *string  `json:"footer"`
		Href        *string  `json:"href"`
		External    *bool    `json:"external"`
		Color       *string  `json:"color"`
		Emoji       *string  `json:"emoji"`
		Content     *string  `json:"content"`
		Image       *string  `json:"image"`
		Embed       *string  `json:"embed"`
	}
	// POST /projects - Create a project
	r.HandleFunc("/projects", func(w http.ResponseWriter, r *http.Request) {
		var body projectPayload
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		// default values
		ext := false
		if body.External != nil {
			ext = *body.External
		}
		tags := body.Tags
		if tags == nil {
			tags = []string{}
		}

		params := db.CreateProjectParams{
			Title:       body.Title,
			Slug:        body.Slug,
			Description: utils.ToNullString(body.Description),
			RepoUrl:     utils.ToNullString(body.RepoUrl),
			LiveUrl:     utils.ToNullString(body.LiveUrl),
			Summary:     utils.ToNullString(body.Summary),
			Tags:        tags,
			Footer:      utils.ToNullString(body.Footer),
			Href:        utils.ToNullString(body.Href),
			External:    ext,
			Color:       utils.ToNullString(body.Color),
			Emoji:       utils.ToNullString(body.Emoji),
			Content:     utils.ToNullString(body.Content),
			Image:       utils.ToNullString(body.Image),
			Embed:       utils.ToNullString(body.Embed),
			UserID:      sql.NullInt32{},
		}

		project, err := s.DB.CreateProject(r.Context(), params)
		if err != nil {
			http.Error(w, `{"error":"Failed to create project"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(toResp(project))
	}).Methods("POST")

	// GET /projects - List projects
	r.HandleFunc("/projects", func(w http.ResponseWriter, r *http.Request) {
		projects, err := s.DB.ListProjects(r.Context())
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch projects"}`, http.StatusInternalServerError)
			return
		}

		// Ensure we return an empty array instead of null for zero projects
		if projects == nil {
			projects = []db.Project{}
		}

		// Map to clean JSON
		resp := make([]projectResponse, 0, len(projects))
		for _, p := range projects {
			resp = append(resp, toResp(p))
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
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
		json.NewEncoder(w).Encode(toResp(project))
	}).Methods("GET")

	// PUT /projects/{id} - Update a project
	r.HandleFunc("/projects/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}

		var body projectPayload
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}


		// Defaults
		ext := false
		if body.External != nil {
			ext = *body.External
		}
		tags := body.Tags
		if tags == nil {
			tags = []string{}
		}

		params := db.UpdateProjectParams{
			ID:          int32(id),
			Title:       body.Title,
			Description: utils.ToNullString(body.Description),
			RepoUrl:     utils.ToNullString(body.RepoUrl),
			LiveUrl:     utils.ToNullString(body.LiveUrl),
			Summary:     utils.ToNullString(body.Summary),
			Tags:        tags,
			Footer:      utils.ToNullString(body.Footer),
			Href:        utils.ToNullString(body.Href),
			External:    ext,
			Color:       utils.ToNullString(body.Color),
			Emoji:       utils.ToNullString(body.Emoji),
			Content:     utils.ToNullString(body.Content),
			Image:       utils.ToNullString(body.Image),
			Embed:       utils.ToNullString(body.Embed),
		}

		project, err := s.DB.UpdateProject(r.Context(), params)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Project not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to update project"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(toResp(project))
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
