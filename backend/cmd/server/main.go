package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus/promhttp"

	"github.com/onnwee/onnwee.github.io/backend/internal/api"
	"github.com/onnwee/onnwee.github.io/backend/internal/server"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Init DB
	queries, err := server.InitDB()
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}

	// Build your application router
	appRouter := api.NewRouter(queries)

	// Create a new ServeMux that includes /metrics and your app's router
	mux := http.NewServeMux()
	mux.Handle("/metrics", promhttp.Handler()) // Expose Prometheus metrics
	mux.Handle("/", appRouter)                 // Your main app routes

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Listening on :%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

