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
	"go.opentelemetry.io/otel"
)

func RegisterPostRoutes(r *mux.Router, s *server.Server) {
	// GET /posts - List published posts with pagination
	r.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		tracer := otel.Tracer("posts-handler")
		ctx, span := tracer.Start(r.Context(), "ListPosts")
		defer span.End()

		query := r.URL.Query()
		limit := int32(10) // default
		if limitStr := query.Get("limit"); limitStr != "" {
			if limit64, err := strconv.ParseInt(limitStr, 10, 32); err == nil && limit64 > 0 {
				limit = int32(limit64)
			}
		}

		offset := int32(0) // default
		if offsetStr := query.Get("offset"); offsetStr != "" {
			if offset64, err := strconv.ParseInt(offsetStr, 10, 32); err == nil && offset64 >= 0 {
				offset = int32(offset64)
			}
		}
		params := db.ListPostsParams{Limit: limit, Offset: offset}

		start := time.Now()
		posts, err := s.DB.ListPosts(ctx, params)
		metrics.ObserveDBQueryDuration("list_posts", time.Since(start).Seconds())

		if err != nil {
			http.Error(w, `{"error":"Failed to list posts"}`, http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(posts)
	}).Methods("GET")

	// GET /posts/{slug} - Get post by slug
	r.HandleFunc("/posts/{slug}", func(w http.ResponseWriter, r *http.Request) {
		tracer := otel.Tracer("posts-handler")
		ctx, span := tracer.Start(r.Context(), "GetPostBySlug")
		defer span.End()

		slug := mux.Vars(r)["slug"]

		start := time.Now()
		post, err := s.DB.GetPostBySlug(ctx, slug)
		metrics.ObserveDBQueryDuration("get_post_by_slug", time.Since(start).Seconds())

		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Post not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to get post"}`, http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(post)
	}).Methods("GET")

	// POST /posts - Create a new post
	r.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		tracer := otel.Tracer("posts-handler")
		ctx, span := tracer.Start(r.Context(), "CreatePost")
		defer span.End()

		var input db.CreatePostParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		start := time.Now()
		post, err := s.DB.CreatePost(ctx, input)
		metrics.ObserveDBQueryDuration("create_post", time.Since(start).Seconds())

		if err != nil {
			http.Error(w, `{"error":"Failed to create post"}`, http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(post)
	}).Methods("POST")

	// PUT /posts/{id} - Update an existing post
	r.HandleFunc("/posts/{id}", func(w http.ResponseWriter, r *http.Request) {
		tracer := otel.Tracer("posts-handler")
		ctx, span := tracer.Start(r.Context(), "UpdatePost")
		defer span.End()

		idStr := mux.Vars(r)["id"]
		id64, err := strconv.ParseInt(idStr, 10, 32)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		id := int32(id64)
		var input db.UpdatePostParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}
		input.ID = id

		start := time.Now()
		post, err := s.DB.UpdatePost(ctx, input)
		metrics.ObserveDBQueryDuration("update_post", time.Since(start).Seconds())

		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Post not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to update post"}`, http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(post)
	}).Methods("PUT")

	// DELETE /posts/{id} - Delete a post
	r.HandleFunc("/posts/{id}", func(w http.ResponseWriter, r *http.Request) {
		tracer := otel.Tracer("posts-handler")
		ctx, span := tracer.Start(r.Context(), "DeletePost")
		defer span.End()

		idStr := mux.Vars(r)["id"]
		id64, err := strconv.ParseInt(idStr, 10, 32)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		id := int32(id64)

		start := time.Now()
		err = s.DB.DeletePost(ctx, id)
		metrics.ObserveDBQueryDuration("delete_post", time.Since(start).Seconds())

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
