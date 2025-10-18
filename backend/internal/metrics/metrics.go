package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	// PageViewCounter tracks page views by path and method
	PageViewCounter = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_page_views_total",
			Help: "Total number of page views by path and method",
		},
		[]string{"path", "method"},
	)

	// EventCounter tracks events by event name
	EventCounter = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_events_total",
			Help: "Total number of events by event name",
		},
		[]string{"event_name"},
	)

	// HTTPRequestDuration tracks request duration by route and method
	HTTPRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP request duration in seconds by route and method",
			Buckets: prometheus.DefBuckets, // Default buckets: 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10
		},
		[]string{"route", "method", "status_code"},
	)

	// HTTPRequestsTotal tracks total HTTP requests by route and method
	HTTPRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests by route, method, and status code",
		},
		[]string{"route", "method", "status_code"},
	)

	// DBQueryDuration tracks database query duration by operation
	DBQueryDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "db_query_duration_seconds",
			Help:    "Database query duration in seconds by operation",
			Buckets: []float64{0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0},
		},
		[]string{"operation"},
	)
)

// IncrementPageView increments the page view counter
func IncrementPageView(path, method string) {
	PageViewCounter.WithLabelValues(path, method).Inc()
}

// IncrementEvent increments the event counter
func IncrementEvent(eventName string) {
	if eventName != "" {
		EventCounter.WithLabelValues(eventName).Inc()
	}
}

// ObserveHTTPRequestDuration records HTTP request duration
func ObserveHTTPRequestDuration(route, method, statusCode string, durationSeconds float64) {
	HTTPRequestDuration.WithLabelValues(route, method, statusCode).Observe(durationSeconds)
}

// IncrementHTTPRequests increments the HTTP request counter
func IncrementHTTPRequests(route, method, statusCode string) {
	HTTPRequestsTotal.WithLabelValues(route, method, statusCode).Inc()
}

// ObserveDBQueryDuration records database query duration
func ObserveDBQueryDuration(operation string, durationSeconds float64) {
	DBQueryDuration.WithLabelValues(operation).Observe(durationSeconds)
}
