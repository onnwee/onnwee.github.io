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

// mockPostQuerier embeds baseMockQuerier and overrides post-specific methods
type mockPostQuerier struct {
	baseMockQuerier
	listPosts     func(ctx context.Context, arg db.ListPostsParams) ([]db.Post, error)
	getPostBySlug func(ctx context.Context, slug string) (db.Post, error)
	createPost    func(ctx context.Context, arg db.CreatePostParams) (db.Post, error)
	updatePost    func(ctx context.Context, arg db.UpdatePostParams) (db.Post, error)
	deletePost    func(ctx context.Context, id int32) error
}

// Override only the methods we need for posts handlers
func (m *mockPostQuerier) ListPosts(ctx context.Context, arg db.ListPostsParams) ([]db.Post, error) {
	if m.listPosts != nil {
		return m.listPosts(ctx, arg)
	}
	return nil, errors.New("not implemented")
}

func (m *mockPostQuerier) GetPostBySlug(ctx context.Context, slug string) (db.Post, error) {
	if m.getPostBySlug != nil {
		return m.getPostBySlug(ctx, slug)
	}
	return db.Post{}, errors.New("not implemented")
}

func (m *mockPostQuerier) CreatePost(ctx context.Context, arg db.CreatePostParams) (db.Post, error) {
	if m.createPost != nil {
		return m.createPost(ctx, arg)
	}
	return db.Post{}, errors.New("not implemented")
}

func (m *mockPostQuerier) UpdatePost(ctx context.Context, arg db.UpdatePostParams) (db.Post, error) {
	if m.updatePost != nil {
		return m.updatePost(ctx, arg)
	}
	return db.Post{}, errors.New("not implemented")
}

func (m *mockPostQuerier) DeletePost(ctx context.Context, id int32) error {
	if m.deletePost != nil {
		return m.deletePost(ctx, id)
	}
	return errors.New("not implemented")
}

// Tests for posts routes

func TestListPosts_Success(t *testing.T) {
	mockDB := &mockPostQuerier{
		listPosts: func(ctx context.Context, arg db.ListPostsParams) ([]db.Post, error) {
			return []db.Post{
				{
					ID:      1,
					Title:   "Post 1",
					Slug:    "post-1",
					Content: "Content 1",
					Tags:    []string{"tag1"},
					CreatedAt: sql.NullTime{Time: time.Now(), Valid: true},
					UpdatedAt: sql.NullTime{Time: time.Now(), Valid: true},
				},
				{
					ID:      2,
					Title:   "Post 2",
					Slug:    "post-2",
					Content: "Content 2",
					Tags:    []string{"tag2"},
					CreatedAt: sql.NullTime{Time: time.Now(), Valid: true},
					UpdatedAt: sql.NullTime{Time: time.Now(), Valid: true},
				},
			}, nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("GET", "/posts", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var posts []db.Post
	if err := json.NewDecoder(w.Body).Decode(&posts); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if len(posts) != 2 {
		t.Errorf("Expected 2 posts, got %d", len(posts))
	}
}

func TestListPosts_WithPagination(t *testing.T) {
	mockDB := &mockPostQuerier{
		listPosts: func(ctx context.Context, arg db.ListPostsParams) ([]db.Post, error) {
			// Verify pagination parameters
			if arg.Limit != 5 || arg.Offset != 10 {
				t.Errorf("Expected limit=5, offset=10, got limit=%d, offset=%d", arg.Limit, arg.Offset)
			}
			return []db.Post{}, nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("GET", "/posts?limit=5&offset=10", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestListPosts_DefaultPagination(t *testing.T) {
	mockDB := &mockPostQuerier{
		listPosts: func(ctx context.Context, arg db.ListPostsParams) ([]db.Post, error) {
			// Verify default pagination parameters
			if arg.Limit != 10 || arg.Offset != 0 {
				t.Errorf("Expected default limit=10, offset=0, got limit=%d, offset=%d", arg.Limit, arg.Offset)
			}
			return []db.Post{}, nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("GET", "/posts", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestListPosts_DBError(t *testing.T) {
	mockDB := &mockPostQuerier{
		listPosts: func(ctx context.Context, arg db.ListPostsParams) ([]db.Post, error) {
			return nil, errors.New("database error")
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("GET", "/posts", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}

func TestGetPostBySlug_Success(t *testing.T) {
	expectedSlug := "my-post"
	mockDB := &mockPostQuerier{
		getPostBySlug: func(ctx context.Context, slug string) (db.Post, error) {
			if slug == expectedSlug {
				return db.Post{
					ID:      1,
					Title:   "My Post",
					Slug:    expectedSlug,
					Content: "Post content",
					Tags:    []string{"test"},
					CreatedAt: sql.NullTime{Time: time.Now(), Valid: true},
					UpdatedAt: sql.NullTime{Time: time.Now(), Valid: true},
				}, nil
			}
			return db.Post{}, sql.ErrNoRows
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("GET", "/posts/"+expectedSlug, nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var post db.Post
	if err := json.NewDecoder(w.Body).Decode(&post); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if post.Slug != expectedSlug {
		t.Errorf("Expected slug %s, got %s", expectedSlug, post.Slug)
	}
}

func TestGetPostBySlug_NotFound(t *testing.T) {
	mockDB := &mockPostQuerier{
		getPostBySlug: func(ctx context.Context, slug string) (db.Post, error) {
			return db.Post{}, sql.ErrNoRows
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("GET", "/posts/nonexistent", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", w.Code)
	}
}

func TestGetPostBySlug_DBError(t *testing.T) {
	mockDB := &mockPostQuerier{
		getPostBySlug: func(ctx context.Context, slug string) (db.Post, error) {
			return db.Post{}, errors.New("database error")
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("GET", "/posts/some-slug", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}

func TestCreatePost_Success(t *testing.T) {
	mockDB := &mockPostQuerier{
		createPost: func(ctx context.Context, arg db.CreatePostParams) (db.Post, error) {
			return db.Post{
				ID:      1,
				Title:   arg.Title,
				Slug:    arg.Slug,
				Content: arg.Content,
				Tags:    arg.Tags,
				CreatedAt: sql.NullTime{Time: time.Now(), Valid: true},
				UpdatedAt: sql.NullTime{Time: time.Now(), Valid: true},
			}, nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	payload := db.CreatePostParams{
		Title:   "New Post",
		Slug:    "new-post",
		Content: "New content",
		Tags:    []string{"test"},
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("POST", "/posts", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("Expected status 201, got %d", w.Code)
	}

	var post db.Post
	if err := json.NewDecoder(w.Body).Decode(&post); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if post.Title != "New Post" {
		t.Errorf("Expected title 'New Post', got %s", post.Title)
	}
}

func TestCreatePost_InvalidJSON(t *testing.T) {
	mockDB := &mockPostQuerier{}
	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("POST", "/posts", bytes.NewReader([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestCreatePost_DBError(t *testing.T) {
	mockDB := &mockPostQuerier{
		createPost: func(ctx context.Context, arg db.CreatePostParams) (db.Post, error) {
			return db.Post{}, errors.New("database error")
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	payload := db.CreatePostParams{
		Title:   "New Post",
		Slug:    "new-post",
		Content: "New content",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("POST", "/posts", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}

func TestUpdatePost_Success(t *testing.T) {
	mockDB := &mockPostQuerier{
		updatePost: func(ctx context.Context, arg db.UpdatePostParams) (db.Post, error) {
			return db.Post{
				ID:      arg.ID,
				Title:   arg.Title,
				Slug:    "updated-post",
				Content: arg.Content,
				Tags:    arg.Tags,
				CreatedAt: sql.NullTime{Time: time.Now(), Valid: true},
				UpdatedAt: sql.NullTime{Time: time.Now(), Valid: true},
			}, nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	payload := db.UpdatePostParams{
		Title:   "Updated Post",
		Content: "Updated content",
		Tags:    []string{"test"},
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("PUT", "/posts/1", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestUpdatePost_InvalidID(t *testing.T) {
	mockDB := &mockPostQuerier{}
	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	payload := db.UpdatePostParams{
		Title:   "Updated Post",
		Content: "Updated content",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("PUT", "/posts/invalid", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestUpdatePost_InvalidJSON(t *testing.T) {
	mockDB := &mockPostQuerier{}
	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("PUT", "/posts/1", bytes.NewReader([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestUpdatePost_NotFound(t *testing.T) {
	mockDB := &mockPostQuerier{
		updatePost: func(ctx context.Context, arg db.UpdatePostParams) (db.Post, error) {
			return db.Post{}, sql.ErrNoRows
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	payload := db.UpdatePostParams{
		Title:   "Updated Post",
		Content: "Updated content",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("PUT", "/posts/999", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", w.Code)
	}
}

func TestUpdatePost_DBError(t *testing.T) {
	mockDB := &mockPostQuerier{
		updatePost: func(ctx context.Context, arg db.UpdatePostParams) (db.Post, error) {
			return db.Post{}, errors.New("database error")
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	payload := db.UpdatePostParams{
		Title:   "Updated Post",
		Content: "Updated content",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("PUT", "/posts/1", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}

func TestDeletePost_Success(t *testing.T) {
	mockDB := &mockPostQuerier{
		deletePost: func(ctx context.Context, id int32) error {
			return nil
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("DELETE", "/posts/1", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Errorf("Expected status 204, got %d", w.Code)
	}
}

func TestDeletePost_InvalidID(t *testing.T) {
	mockDB := &mockPostQuerier{}
	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("DELETE", "/posts/invalid", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestDeletePost_NotFound(t *testing.T) {
	mockDB := &mockPostQuerier{
		deletePost: func(ctx context.Context, id int32) error {
			return sql.ErrNoRows
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("DELETE", "/posts/999", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", w.Code)
	}
}

func TestDeletePost_DBError(t *testing.T) {
	mockDB := &mockPostQuerier{
		deletePost: func(ctx context.Context, id int32) error {
			return errors.New("database error")
		},
	}

	s := &server.Server{DB: mockDB}
	router := mux.NewRouter()
	RegisterPostRoutes(router, s)

	req := httptest.NewRequest("DELETE", "/posts/1", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}
