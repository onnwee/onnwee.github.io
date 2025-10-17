package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestMetrics(t *testing.T) {
	// Create a test handler
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Wrap it with the Metrics middleware
	handler := Metrics(testHandler)

	// Create a test request
	req := httptest.NewRequest("GET", "/test", nil)
	w := httptest.NewRecorder()

	// Execute the handler
	handler.ServeHTTP(w, req)

	// Check the response
	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
	if w.Body.String() != "OK" {
		t.Errorf("Expected body 'OK', got %s", w.Body.String())
	}
}

func TestMetricsWithError(t *testing.T) {
	// Create a test handler that returns an error
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Error"))
	})

	// Wrap it with the Metrics middleware
	handler := Metrics(testHandler)

	// Create a test request
	req := httptest.NewRequest("POST", "/api/test", nil)
	w := httptest.NewRecorder()

	// Execute the handler
	handler.ServeHTTP(w, req)

	// Check the response
	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}
