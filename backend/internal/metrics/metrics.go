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
