package observability

import (
	"context"
	"os"
	"testing"
)

func TestInitOpenTelemetryWithoutOTLPEndpoint(t *testing.T) {
	// Ensure no OTLP endpoint is set
	os.Unsetenv("OTEL_EXPORTER_OTLP_ENDPOINT")
	os.Setenv("APP_ENV", "test")

	ctx := context.Background()
	exporter, err := InitOpenTelemetry(ctx)
	if err != nil {
		t.Fatalf("InitOpenTelemetry failed: %v", err)
	}
	if exporter == nil {
		t.Fatal("Expected non-nil Prometheus exporter")
	}
}

func TestInitOpenTelemetryWithOTLPEndpoint(t *testing.T) {
	// Set a fake OTLP endpoint (will fail to connect, but that's expected)
	os.Setenv("OTEL_EXPORTER_OTLP_ENDPOINT", "localhost:4318")
	os.Setenv("APP_ENV", "test")
	defer os.Unsetenv("OTEL_EXPORTER_OTLP_ENDPOINT")

	ctx := context.Background()
	exporter, err := InitOpenTelemetry(ctx)
	if err != nil {
		t.Fatalf("InitOpenTelemetry failed: %v", err)
	}
	if exporter == nil {
		t.Fatal("Expected non-nil Prometheus exporter")
	}
}
