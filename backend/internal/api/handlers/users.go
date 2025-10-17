package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/db"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
	"github.com/onnwee/onnwee.github.io/backend/internal/utils"
)

func RegisterUserRoutes(r *mux.Router, s *server.Server) {
	// POST /users - Create a user with uniqueness checks
	r.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		var input db.CreateUserParams
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		// Check for existing email or username
		if _, err := s.DB.GetUserByEmail(r.Context(), input.Email); err == nil {
			http.Error(w, `{"error":"Email already in use"}`, http.StatusConflict)
			return
		}
		if _, err := s.DB.GetUserByUsername(r.Context(), input.Username); err == nil {
			http.Error(w, `{"error":"Username already taken"}`, http.StatusConflict)
			return
		}

		user, err := s.DB.CreateUser(r.Context(), input)
		if err != nil {
			http.Error(w, `{"error":"Failed to create user"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(user)
	}).Methods("POST")

	// GET /users - List users with pagination
	r.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
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

		params := db.ListUsersParams{
			Limit:  limit,
			Offset: offset,
		}

		users, err := s.DB.ListUsers(r.Context(), params)
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch users"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users)
	}).Methods("GET")

	// GET /users/{id} - Get user by ID
	r.HandleFunc("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id64, err := strconv.ParseInt(idStr, 10, 32)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		id := int32(id64)

		user, err := s.DB.GetUserByID(r.Context(), id)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"User not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to fetch user"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
	}).Methods("GET")

	// DELETE /users/{id} - Delete a user
	r.HandleFunc("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id64, err := strconv.ParseInt(idStr, 10, 32)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		id := int32(id64)

		err = s.DB.DeleteUser(r.Context(), id)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"User not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to delete user"}`, http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}).Methods("DELETE")

	// PATCH /users/{id} - Partial update
	r.HandleFunc("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		idStr := mux.Vars(r)["id"]
		id64, err := strconv.ParseInt(idStr, 10, 32)
		if err != nil {
			http.Error(w, `{"error":"Invalid ID"}`, http.StatusBadRequest)
			return
		}
		id := int32(id64)

		var input struct {
			Username *string `json:"username"`
			Email    *string `json:"email"`
		}
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		params := db.PatchUserParams{
			ID:       id,
			Username: utils.ToNullString(input.Username),
			Email:    utils.ToNullString(input.Email),
		}

		user, err := s.DB.PatchUser(r.Context(), params)
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"User not found"}`, http.StatusNotFound)
			return
		} else if err != nil {
			http.Error(w, `{"error":"Failed to update user"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
	}).Methods("PATCH")

	// GET /users/available?username=...
	r.HandleFunc("/users/available", func(w http.ResponseWriter, r *http.Request) {
		username := r.URL.Query().Get("username")
		if username == "" {
			http.Error(w, `{"error":"Missing ?username"}`, http.StatusBadRequest)
			return
		}

		_, err := s.DB.GetUserByUsername(r.Context(), username)
		available := err == sql.ErrNoRows

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]bool{
			"available": available,
		})
	}).Methods("GET")
}
