package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
	"github.com/onnwee/onnwee.github.io/backend/internal/utils"
)

// AnalyticsStats represents aggregate analytics data
type AnalyticsStats struct {
	TotalPageViews int64                 `json:"total_page_views"`
	TotalEvents    int64                 `json:"total_events"`
	PageViewsByPath []PathViewCount      `json:"page_views_by_path"`
	EventsByName    []EventNameCount     `json:"events_by_name"`
	Period          string               `json:"period"`
}

type PathViewCount struct {
	Path  string `json:"path"`
	Count int64  `json:"count"`
}

type EventNameCount struct {
	EventName string `json:"event_name"`
	Count     int64  `json:"count"`
}

func RegisterAnalyticsRoutes(r *mux.Router, s *server.Server) {
	// GET /analytics/stats - get aggregate statistics
	// Query params: days (default: 7, options: 7, 30)
	r.HandleFunc("/analytics/stats", func(w http.ResponseWriter, r *http.Request) {
		// Parse days parameter
		daysStr := r.URL.Query().Get("days")
		days := 7 // default
		if daysStr != "" {
			parsedDays, err := strconv.Atoi(daysStr)
			if err == nil && (parsedDays == 7 || parsedDays == 30) {
				days = parsedDays
			}
		}

		// Convert days to string for SQL query
		daysParam := utils.ToNullString(&[]string{strconv.Itoa(days)}[0])

		// Get total page views
		totalViews, err := s.DB.GetTotalViewsLastNDays(r.Context(), daysParam)
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch total page views"}`, http.StatusInternalServerError)
			return
		}

		// Get page views by path
		viewsByPath, err := s.DB.GetViewsCountByPathLastNDays(r.Context(), daysParam)
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch page views by path"}`, http.StatusInternalServerError)
			return
		}

		// Get total events
		totalEvents, err := s.DB.GetTotalEventsLastNDays(r.Context(), daysParam)
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch total events"}`, http.StatusInternalServerError)
			return
		}

		// Get events by name
		eventsByName, err := s.DB.GetEventsCountByNameLastNDays(r.Context(), daysParam)
		if err != nil {
			http.Error(w, `{"error":"Failed to fetch events by name"}`, http.StatusInternalServerError)
			return
		}

		// Build response
		pathViews := make([]PathViewCount, len(viewsByPath))
		for i, v := range viewsByPath {
			pathViews[i] = PathViewCount{
				Path:  v.Path,
				Count: v.ViewCount,
			}
		}

		eventCounts := make([]EventNameCount, len(eventsByName))
		for i, e := range eventsByName {
			eventCounts[i] = EventNameCount{
				EventName: e.EventName.String,
				Count:     e.EventCount,
			}
		}

		stats := AnalyticsStats{
			TotalPageViews:  totalViews,
			TotalEvents:     totalEvents,
			PageViewsByPath: pathViews,
			EventsByName:    eventCounts,
			Period:          strconv.Itoa(days) + " days",
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(stats)
	}).Methods("GET")
}
