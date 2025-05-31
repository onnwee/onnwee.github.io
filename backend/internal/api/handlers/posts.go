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

func RegisterPostRoutes(r *mux.Router, s *server.Server) {
	// GET /posts - List published posts with pagination
	r.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		limit, err := strconv.Atoi(query.Get("limit"))
		if err != nil || limit <= 0 {
			limit = 10
		}
		offset, err := strconv.Atoi(query.Get("offset"))
		if err != nil || offset < 0 {
			offset = 0
		}
		params := db.ListPostsParams{Limit: int32(limit), Offset: int32(offset)}
		posts, err := s.DB.ListPosts(r.Context(), params)
		if err != nil {
			http.Error(w, `{"error":"Failed to list posts"}`, http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(posts)
	}).Methods("GET")

	// GET /posts/{slug} - Get post by slug
	r.HandleFunc("/posts/{slug}", func(w http.ResponseWriter, r *http.Request) {
		slug := mux.Vars(r)["slug"]
		post, err := s.DB.GetPostBySlug(r.Context(), slug)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Post not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to get post"}`, http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(post)
	}).Methods("GET")

	// POST /posts - Create a new post
	r.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		var input db.CreatePostParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}
		post, err := s.DB.CreatePost(r.Context(), input)
		if err != nil {
			http.Error(w, `{"error":"Failed to create post"}`, http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(post)
	}).Methods("POST")

	// PUT /posts/{id} - Update an existing post
	r.HandleFunc("/posts/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		var input db.UpdatePostParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}
		input.ID = int32(id)
		post, err := s.DB.UpdatePost(r.Context(), input)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Post not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to update post"}`, http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(post)
	}).Methods("PUT")

	// DELETE /posts/{id} - Delete a post
	r.HandleFunc("/posts/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		err = s.DB.DeletePost(r.Context(), int32(id))
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Post not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to delete post"}`, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}).Methods("DELETE")
}