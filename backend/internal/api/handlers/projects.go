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
	"go.opentelemetry.io/otel"
)

// RegisterPublicProjectRoutes registers read-only project routes
func RegisterPublicProjectRoutes(r *mux.Router, s *server.Server) {
	type projectResponse struct {
		ID          int32    `json:"id"`
		Title       string   `json:"title"`
		Slug        string   `json:"slug"`
		Description *string  `json:"description"`
		RepoURL     *string  `json:"repo_url"`
		LiveURL     *string  `json:"live_url"`
		Summary     *string  `json:"summary"`
		Tags        []string `json:"tags"`
		Footer      *string  `json:"footer"`
		Href        *string  `json:"href"`
		External    bool     `json:"external"`
		Color       *string  `json:"color"`
		Emoji       *string  `json:"emoji"`
		Content     *string  `json:"content"`
		Image       *string  `json:"image"`
		Embed       *string  `json:"embed"`
		CreatedAt   string   `json:"created_at"`
		UpdatedAt   string   `json:"updated_at"`
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
			RepoURL:     toPtr(p.RepoUrl),
			LiveURL:     toPtr(p.LiveUrl),
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

	// GET /projects - List projects
	r.HandleFunc("/projects", func(w http.ResponseWriter, r *http.Request) {
		tracer := otel.Tracer("projects-handler")
		ctx, span := tracer.Start(r.Context(), "ListProjects")
		defer span.End()

		start := time.Now()
		projects, err := s.DB.ListProjects(ctx)
		metrics.ObserveDBQueryDuration("list_projects", time.Since(start).Seconds())

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
		_ = json.NewEncoder(w).Encode(resp)
	}).Methods("GET")

	// GET /projects/{slug} - Get project by slug
	r.HandleFunc("/projects/{slug}", func(w http.ResponseWriter, r *http.Request) {
		tracer := otel.Tracer("projects-handler")
		ctx, span := tracer.Start(r.Context(), "GetProjectBySlug")
		defer span.End()

		slug := mux.Vars(r)["slug"]

		start := time.Now()
		project, err := s.DB.GetProjectBySlug(ctx, slug)
		metrics.ObserveDBQueryDuration("get_project_by_slug", time.Since(start).Seconds())

		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Project not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to fetch project"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(toResp(project))
	}).Methods("GET")
}

// RegisterAdminProjectRoutes registers admin-only (CRUD) project routes
func RegisterAdminProjectRoutes(r *mux.Router, s *server.Server) {
	type projectResponse struct {
		ID          int32    `json:"id"`
		Title       string   `json:"title"`
		Slug        string   `json:"slug"`
		Description *string  `json:"description"`
		RepoURL     *string  `json:"repo_url"`
		LiveURL     *string  `json:"live_url"`
		Summary     *string  `json:"summary"`
		Tags        []string `json:"tags"`
		Footer      *string  `json:"footer"`
		Href        *string  `json:"href"`
		External    bool     `json:"external"`
		Color       *string  `json:"color"`
		Emoji       *string  `json:"emoji"`
		Content     *string  `json:"content"`
		Image       *string  `json:"image"`
		Embed       *string  `json:"embed"`
		CreatedAt   string   `json:"created_at"`
		UpdatedAt   string   `json:"updated_at"`
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
			RepoURL:     toPtr(p.RepoUrl),
			LiveURL:     toPtr(p.LiveUrl),
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
		RepoURL     *string  `json:"repo_url"`
		LiveURL     *string  `json:"live_url"`
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
	// POST /admin/projects - Create a project
	r.HandleFunc("/projects", func(w http.ResponseWriter, r *http.Request) {
		tracer := otel.Tracer("projects-handler")
		ctx, span := tracer.Start(r.Context(), "CreateProject")
		defer span.End()

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
			RepoUrl:     utils.ToNullString(body.RepoURL),
			LiveUrl:     utils.ToNullString(body.LiveURL),
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

		start := time.Now()
		project, err := s.DB.CreateProject(ctx, params)
		metrics.ObserveDBQueryDuration("create_project", time.Since(start).Seconds())

		if err != nil {
			http.Error(w, `{"error":"Failed to create project"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(toResp(project))
	}).Methods("POST")

	// PUT /admin/projects/{id} - Update a project
	r.HandleFunc("/projects/{id}", func(w http.ResponseWriter, r *http.Request) {
		tracer := otel.Tracer("projects-handler")
		ctx, span := tracer.Start(r.Context(), "UpdateProject")
		defer span.End()

		idStr := mux.Vars(r)["id"]
		id64, err := strconv.ParseInt(idStr, 10, 32)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		id := int32(id64)

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
			ID:          id,
			Title:       body.Title,
			Description: utils.ToNullString(body.Description),
			RepoUrl:     utils.ToNullString(body.RepoURL),
			LiveUrl:     utils.ToNullString(body.LiveURL),
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

		start := time.Now()
		project, err := s.DB.UpdateProject(ctx, params)
		metrics.ObserveDBQueryDuration("update_project", time.Since(start).Seconds())

		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Project not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to update project"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(toResp(project))
	}).Methods("PUT")

	// DELETE /admin/projects/{id} - Delete a project
	r.HandleFunc("/projects/{id}", func(w http.ResponseWriter, r *http.Request) {
		tracer := otel.Tracer("projects-handler")
		ctx, span := tracer.Start(r.Context(), "DeleteProject")
		defer span.End()

		idStr := mux.Vars(r)["id"]
		id64, err := strconv.ParseInt(idStr, 10, 32)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		id := int32(id64)

		start := time.Now()
		err = s.DB.DeleteProject(ctx, id)
		metrics.ObserveDBQueryDuration("delete_project", time.Since(start).Seconds())

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
