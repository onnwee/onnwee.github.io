# Use latest Go version from official image
FROM golang:latest

# Enable Go modules
ENV GO111MODULE=on

# Set working directory
WORKDIR /app

# Install dependencies (Git, curl for migrate, postgresql-client)
RUN apt-get update && apt-get install -y git curl postgresql-client

# Install golang-migrate
RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.19.0/migrate.linux-amd64.tar.gz | tar xvz && \
    mv migrate /usr/local/bin/migrate && \
    chmod +x /usr/local/bin/migrate

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
