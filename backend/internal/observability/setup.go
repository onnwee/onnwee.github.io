package observability

import (
	"context"
	"os"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/prometheus"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
)

var (
	serviceName    = "onnwee-backend"
	serviceVersion = "0.1.0"
)

func InitOpenTelemetry(_ context.Context) (*prometheus.Exporter, error) {
	// Create a Prometheus exporter
	exporter, err := prometheus.New()
	if err != nil {
		return nil, err
	}

	// Set global meter provider
	provider := metric.NewMeterProvider(
		metric.WithReader(exporter),
		metric.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName(serviceName),
			semconv.ServiceVersion(serviceVersion),
			attribute.String("env", os.Getenv("APP_ENV")),
		)),
	)
	otel.SetMeterProvider(provider)

	// Set global tracer provider
	tracerProvider := trace.NewTracerProvider(
		trace.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName(serviceName),
			semconv.ServiceVersion(serviceVersion),
			attribute.String("env", os.Getenv("APP_ENV")),
		)),
	)
	otel.SetTracerProvider(tracerProvider)

	return exporter, nil
}
