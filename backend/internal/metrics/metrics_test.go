package metrics

import (
	"testing"
)

func TestIncrementPageView(t *testing.T) {
	// Test that the function doesn't panic
	IncrementPageView("/test", "GET")
	IncrementPageView("/test", "POST")
}

func TestIncrementEvent(t *testing.T) {
	// Test that the function doesn't panic
	IncrementEvent("test_event")
	IncrementEvent("")
}

func TestObserveHTTPRequestDuration(t *testing.T) {
	// Test that the function doesn't panic with various inputs
	ObserveHTTPRequestDuration("/api/test", "GET", "200", 0.123)
	ObserveHTTPRequestDuration("/api/test", "POST", "201", 0.456)
	ObserveHTTPRequestDuration("/api/test", "GET", "500", 0.789)
}

func TestIncrementHTTPRequests(t *testing.T) {
	// Test that the function doesn't panic with various inputs
	IncrementHTTPRequests("/api/test", "GET", "200")
	IncrementHTTPRequests("/api/test", "POST", "201")
	IncrementHTTPRequests("/api/test", "GET", "500")
}

func TestObserveDBQueryDuration(t *testing.T) {
	// Test that the function doesn't panic with various inputs
	ObserveDBQueryDuration("list_projects", 0.001)
	ObserveDBQueryDuration("get_project_by_slug", 0.005)
	ObserveDBQueryDuration("create_project", 0.010)
}
