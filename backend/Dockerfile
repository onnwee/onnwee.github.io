# Use latest Go version from official image
FROM golang:latest

# Enable Go modules
ENV GO111MODULE=on

# Set working directory
WORKDIR /app

# Install any dependencies (e.g., Git for go get)
RUN apt-get update && apt-get install -y git

# Copy go.mod and go.sum first for layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy entire project
COPY . .

# Build your Go application
RUN go build -o main ./cmd/server

# Expose the port your app listens on
EXPOSE 8000

# Run the app
CMD ["./main"]
