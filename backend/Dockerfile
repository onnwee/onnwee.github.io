# Multi-stage build: Get migrate from official image
FROM migrate/migrate:v4.19.0 AS migrate

# Use latest Go version from official image
FROM golang:latest

# Enable Go modules
ENV GO111MODULE=on

# Set working directory
WORKDIR /app

# Install dependencies (Git, postgresql-client)
RUN apt-get update && apt-get install -y git postgresql-client && rm -rf /var/lib/apt/lists/*

# Copy migrate binary from official image
COPY --from=migrate /usr/local/bin/migrate /usr/local/bin/migrate

# Copy go.mod and go.sum first for layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy entire project
COPY . .

# Build your Go application
RUN go build -o main ./cmd/server

# Expose the port your app listens on
EXPOSE 8000

# Copy and set up migration script
COPY scripts/run_migrations.sh /app/run_migrations.sh
RUN chmod +x /app/run_migrations.sh

# Run migrations then start the app
CMD ["/bin/bash", "-c", "/app/run_migrations.sh && ./main"]
