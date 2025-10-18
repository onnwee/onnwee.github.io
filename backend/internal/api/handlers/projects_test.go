package handlers

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
)

// mockProjectQuerier embeds baseMockQuerier and overrides project-specific methods
type mockProjectQuerier struct {
	baseMockQuerier
	listProjects      func(ctx context.Context) ([]db.Project, error)
	getProjectBySlug  func(ctx context.Context, slug string) (db.Project, error)
	createProject     func(ctx context.Context, arg db.CreateProjectParams) (db.Project, error)
	updateProject     func(ctx context.Context, arg db.UpdateProjectParams) (db.Project, error)
	deleteProject     func(ctx context.Context, id int32) error
}

// Override only the methods we need for projects handlers
func (m *mockProjectQuerier) ListProjects(ctx context.Context) ([]db.Project, error) {
	if m.listProjects != nil {
		return m.listProjects(ctx)
	}
	return nil, errors.New("not implemented")
}

func (m *mockProjectQuerier) GetProjectBySlug(ctx context.Context, slug string) (db.Project, error) {
	if m.getProjectBySlug != nil {
		return m.getProjectBySlug(ctx, slug)
	}
	return db.Project{}, errors.New("not implemented")
}

func (m *mockProjectQuerier) CreateProject(ctx context.Context, arg db.CreateProjectParams) (db.Project, error) {
	if m.createProject != nil {
		return m.createProject(ctx, arg)
	}
	return db.Project{}, errors.New("not implemented")
}

func (m *mockProjectQuerier) UpdateProject(ctx context.Context, arg db.UpdateProjectParams) (db.Project, error) {
	if m.updateProject != nil {
		return m.updateProject(ctx, arg)
	}
	return db.Project{}, errors.New("not implemented")
}

func (m *mockProjectQuerier) DeleteProject(ctx context.Context, id int32) error {
	if m.deleteProject != nil {
		return m.deleteProject(ctx, id)
	}
	return errors.New("not implemented")
}

// Stub implementations for posts methods (needed for full interface)
func (m *mockProjectQuerier) ListPosts(ctx context.Context, arg db.ListPostsParams) ([]db.Post, error) { return nil, nil }
func (m *mockProjectQuerier) GetPostBySlug(ctx context.Context, slug string) (db.Post, error) { return db.Post{}, nil }
func (m *mockProjectQuerier) CreatePost(ctx context.Context, arg db.CreatePostParams) (db.Post, error) { return db.Post{}, nil }
func (m *mockProjectQuerier) UpdatePost(ctx context.Context, arg db.UpdatePostParams) (db.Post, error) { return db.Post{}, nil }
func (m *mockProjectQuerier) DeletePost(ctx context.Context, id int32) error { return nil }

// Tests for public project routes

func TestListProjects_Success(t *testing.T) {
	mockDB := &mockProjectQuerier{
		listProjects: func(ctx context.Context) ([]db.Project, error) {
			return []db.Project{
				{
					ID:    1,
					Title: "Project 1",
					Slug:  "project-1",
					Tags:  []string{"tag1", "tag2"},
					CreatedAt: sql.NullTime{Time: time.Now(), Valid: true},
					UpdatedAt: sql.NullTime{Time: time.Now(), Valid: true},
				},
				{
					ID:    2,
					Title: "Project 2",
					Slug:  "project-2",
					Tags:  []string{},
					CreatedAt: sql.NullTime{Time: time.Now(), Valid: true},
					UpdatedAt: sql.NullTime{Time: time.Now(), Valid: true},
				},
			}, nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPublicProjectRoutes(router, s)

	req := httptest.NewRequest("GET", "/projects", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var projects []map[string]interface{}
	if err := json.NewDecoder(w.Body).Decode(&projects); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if len(projects) != 2 {
		t.Errorf("Expected 2 projects, got %d", len(projects))
	}
}

func TestListProjects_EmptyList(t *testing.T) {
	mockDB := &mockProjectQuerier{
		listProjects: func(ctx context.Context) ([]db.Project, error) {
			return []db.Project{}, nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPublicProjectRoutes(router, s)

	req := httptest.NewRequest("GET", "/projects", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var projects []map[string]interface{}
	if err := json.NewDecoder(w.Body).Decode(&projects); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if len(projects) != 0 {
		t.Errorf("Expected 0 projects, got %d", len(projects))
	}
}

func TestListProjects_DBError(t *testing.T) {
	mockDB := &mockProjectQuerier{
		listProjects: func(ctx context.Context) ([]db.Project, error) {
			return nil, errors.New("database error")
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPublicProjectRoutes(router, s)

	req := httptest.NewRequest("GET", "/projects", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}

func TestGetProjectBySlug_Success(t *testing.T) {
	expectedSlug := "my-project"
	mockDB := &mockProjectQuerier{
		getProjectBySlug: func(ctx context.Context, slug string) (db.Project, error) {
			if slug == expectedSlug {
				return db.Project{
					ID:    1,
					Title: "My Project",
					Slug:  expectedSlug,
					Tags:  []string{"go", "web"},
					CreatedAt: sql.NullTime{Time: time.Now(), Valid: true},
					UpdatedAt: sql.NullTime{Time: time.Now(), Valid: true},
				}, nil
			}
			return db.Project{}, sql.ErrNoRows
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPublicProjectRoutes(router, s)

	req := httptest.NewRequest("GET", "/projects/"+expectedSlug, nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var project map[string]interface{}
	if err := json.NewDecoder(w.Body).Decode(&project); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if project["slug"] != expectedSlug {
		t.Errorf("Expected slug %s, got %v", expectedSlug, project["slug"])
	}
}

func TestGetProjectBySlug_NotFound(t *testing.T) {
	mockDB := &mockProjectQuerier{
		getProjectBySlug: func(ctx context.Context, slug string) (db.Project, error) {
			return db.Project{}, sql.ErrNoRows
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPublicProjectRoutes(router, s)

	req := httptest.NewRequest("GET", "/projects/nonexistent", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", w.Code)
	}
}

func TestGetProjectBySlug_DBError(t *testing.T) {
	mockDB := &mockProjectQuerier{
		getProjectBySlug: func(ctx context.Context, slug string) (db.Project, error) {
			return db.Project{}, errors.New("database error")
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPublicProjectRoutes(router, s)

	req := httptest.NewRequest("GET", "/projects/some-slug", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}

// Tests for admin project routes

func TestCreateProject_Success(t *testing.T) {
	mockDB := &mockProjectQuerier{
		createProject: func(ctx context.Context, arg db.CreateProjectParams) (db.Project, error) {
			return db.Project{
				ID:    1,
				Title: arg.Title,
				Slug:  arg.Slug,
				Tags:  arg.Tags,
				CreatedAt: sql.NullTime{Time: time.Now(), Valid: true},
				UpdatedAt: sql.NullTime{Time: time.Now(), Valid: true},
			}, nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	payload := map[string]interface{}{
		"title": "New Project",
		"slug":  "new-project",
		"tags":  []string{"test"},
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("POST", "/projects", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", w.Code)
	}

	var project map[string]interface{}
	if err := json.NewDecoder(w.Body).Decode(&project); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if project["title"] != "New Project" {
		t.Errorf("Expected title 'New Project', got %v", project["title"])
	}
}

func TestCreateProject_InvalidJSON(t *testing.T) {
	mockDB := &mockProjectQuerier{}
	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	req := httptest.NewRequest("POST", "/projects", bytes.NewReader([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestCreateProject_DBError(t *testing.T) {
	mockDB := &mockProjectQuerier{
		createProject: func(ctx context.Context, arg db.CreateProjectParams) (db.Project, error) {
			return db.Project{}, errors.New("database error")
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	payload := map[string]interface{}{
		"title": "New Project",
		"slug":  "new-project",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("POST", "/projects", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}

func TestUpdateProject_Success(t *testing.T) {
	mockDB := &mockProjectQuerier{
		updateProject: func(ctx context.Context, arg db.UpdateProjectParams) (db.Project, error) {
			return db.Project{
				ID:    arg.ID,
				Title: arg.Title,
				Slug:  "updated-project",
				Tags:  arg.Tags,
				CreatedAt: sql.NullTime{Time: time.Now(), Valid: true},
				UpdatedAt: sql.NullTime{Time: time.Now(), Valid: true},
			}, nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	payload := map[string]interface{}{
		"title": "Updated Project",
		"slug":  "updated-project",
		"tags":  []string{"test"},
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("PUT", "/projects/1", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestUpdateProject_InvalidID(t *testing.T) {
	mockDB := &mockProjectQuerier{}
	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	payload := map[string]interface{}{
		"title": "Updated Project",
		"slug":  "updated-project",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("PUT", "/projects/invalid", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestUpdateProject_NotFound(t *testing.T) {
	mockDB := &mockProjectQuerier{
		updateProject: func(ctx context.Context, arg db.UpdateProjectParams) (db.Project, error) {
			return db.Project{}, sql.ErrNoRows
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	payload := map[string]interface{}{
		"title": "Updated Project",
		"slug":  "updated-project",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("PUT", "/projects/999", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", w.Code)
	}
}

func TestUpdateProject_DBError(t *testing.T) {
	mockDB := &mockProjectQuerier{
		updateProject: func(ctx context.Context, arg db.UpdateProjectParams) (db.Project, error) {
			return db.Project{}, errors.New("database error")
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	payload := map[string]interface{}{
		"title": "Updated Project",
		"slug":  "updated-project",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("PUT", "/projects/1", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}

func TestDeleteProject_Success(t *testing.T) {
	mockDB := &mockProjectQuerier{
		deleteProject: func(ctx context.Context, id int32) error {
			return nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	req := httptest.NewRequest("DELETE", "/projects/1", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Errorf("Expected status 204, got %d", w.Code)
	}
}

func TestDeleteProject_InvalidID(t *testing.T) {
	mockDB := &mockProjectQuerier{}
	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	req := httptest.NewRequest("DELETE", "/projects/invalid", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestDeleteProject_NotFound(t *testing.T) {
	mockDB := &mockProjectQuerier{
		deleteProject: func(ctx context.Context, id int32) error {
			return sql.ErrNoRows
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	req := httptest.NewRequest("DELETE", "/projects/999", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", w.Code)
	}
}

func TestDeleteProject_DBError(t *testing.T) {
	mockDB := &mockProjectQuerier{
		deleteProject: func(ctx context.Context, id int32) error {
			return errors.New("database error")
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterAdminProjectRoutes(router, s)

	req := httptest.NewRequest("DELETE", "/projects/1", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}
