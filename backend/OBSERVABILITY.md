# Observability & OpenTelemetry Configuration

This document describes the observability features implemented in the backend, including metrics, tracing, and OpenTelemetry configuration.

## Overview

The backend implements comprehensive observability using:
- **Prometheus metrics** for monitoring request rates, durations, and database query performance
- **OpenTelemetry traces** for distributed tracing (configurable via environment variables)
- **Custom spans** around database operations for granular performance tracking

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string

### Optional Observability Configuration
- `APP_ENV`: Application environment (e.g., `development`, `staging`, `production`)
- `OTEL_EXPORTER_OTLP_ENDPOINT`: OpenTelemetry collector endpoint for trace export
  - Example: `localhost:4318` (HTTP) or `localhost:4317` (gRPC)
  - If not set, traces will not be exported (noop mode)
  - Useful for local development with tools like Jaeger or Tempo

## Metrics

### Exposed Metrics

The backend exposes Prometheus metrics at `/metrics`:

#### HTTP Request Metrics
- `http_request_duration_seconds` (histogram)
  - Duration of HTTP requests by route, method, and status code
  - Buckets: 0.005s, 0.01s, 0.025s, 0.05s, 0.1s, 0.25s, 0.5s, 1s, 2.5s, 5s, 10s
  
- `http_requests_total` (counter)
  - Total number of HTTP requests by route, method, and status code

#### Database Query Metrics
- `db_query_duration_seconds` (histogram)
  - Duration of database queries by operation name
  - Operations: `list_projects`, `get_project_by_slug`, `create_project`, `update_project`, `delete_project`, `list_posts`, `get_post_by_slug`, `create_post`, `update_post`, `delete_post`
  - Buckets: 0.001s, 0.005s, 0.01s, 0.025s, 0.05s, 0.1s, 0.25s, 0.5s, 1s

#### Legacy Metrics
- `http_page_views_total` (counter)
- `http_events_total` (counter)

### Example Metrics Query

```bash
# Get all HTTP request durations
curl http://localhost:8080/metrics | grep http_request_duration_seconds

# Get database query durations
curl http://localhost:8080/metrics | grep db_query_duration_seconds

# Get request counts by status code
curl http://localhost:8080/metrics | grep http_requests_total
```

## Tracing

### OpenTelemetry Spans

The backend creates spans for:
- **HTTP requests** (via `otelhttp` middleware)
- **Database operations** in projects and posts handlers
  - `ListProjects`
  - `GetProjectBySlug`
  - `CreateProject`
  - `UpdateProject`
  - `DeleteProject`
  - `ListPosts`
  - `GetPostBySlug`
  - `CreatePost`
  - `UpdatePost`
  - `DeletePost`

### Trace Export Configuration

#### No Export (Default)
```bash
# Traces are created but not exported
./server
```

#### Export to OTLP Collector
```bash
# Export to local Jaeger (HTTP endpoint)
OTEL_EXPORTER_OTLP_ENDPOINT=localhost:4318 ./server

# Export to local Jaeger (gRPC endpoint)
OTEL_EXPORTER_OTLP_ENDPOINT=localhost:4317 ./server

# Export to production collector
OTEL_EXPORTER_OTLP_ENDPOINT=collector.example.com:4318 APP_ENV=production ./server
```

### Local Development with Jaeger

To visualize traces locally, run Jaeger with Docker:

```bash
docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 16686:16686 \
  jaegertracing/all-in-one:latest
```

Then start the backend with:
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=localhost:4318 ./server
```

View traces at: http://localhost:16686

## Architecture

### Metrics Flow
```
HTTP Request → Metrics Middleware → Handler → DB Query
                   ↓                              ↓
            Record duration           Record query duration
                   ↓                              ↓
            Prometheus metrics ← /metrics endpoint
```

### Tracing Flow
```
HTTP Request → OTel HTTP Handler → Handler with Span → DB Query
                      ↓                    ↓
                Create span        Create child span
                      ↓                    ↓
                Export to OTLP collector (if configured)
```

## Middleware Stack

The middleware chain in `router.go`:
1. `Logging` - Request logging
2. `Recovery` - Panic recovery
3. `CORS` - CORS headers
4. `RealIP` - Real IP detection
5. `Analytics` - Analytics tracking
6. `RateLimit` - Rate limiting
7. `Metrics` - Prometheus metrics collection
8. `otelhttp.NewHandler` - OpenTelemetry HTTP instrumentation

## Implementation Details

### Files Modified
- `cmd/server/main.go` - Initialize OpenTelemetry
- `internal/observability/setup.go` - Configure OTLP exporter
- `internal/metrics/metrics.go` - Add histogram and counter metrics
- `pkg/middleware/metrics.go` - HTTP metrics middleware
- `internal/api/router.go` - Add metrics middleware
- `internal/api/handlers/projects.go` - Add spans and DB metrics
- `internal/api/handlers/posts.go` - Add spans and DB metrics

### Dependencies Added
- `go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp` - OTLP HTTP exporter
- `go.opentelemetry.io/otel/exporters/otlp/otlptrace` - OTLP trace exporter

## Testing

Run tests with:
```bash
cd backend
go test ./...
```

Tests cover:
- Metrics functions
- Observability initialization (with and without OTLP endpoint)
- Metrics middleware functionality
