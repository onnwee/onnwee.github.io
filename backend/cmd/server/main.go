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

	// Build router from api package
	router := api.NewRouter(queries)

	// Register /metrics for Prometheus
	http.Handle("/metrics", promhttp.Handler())

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Listening on :%s", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
