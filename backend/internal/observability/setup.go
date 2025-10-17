package observability

import (
	"context"
	"log"
	"os"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
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

func InitOpenTelemetry(ctx context.Context) (*prometheus.Exporter, error) {
	// Create a Prometheus exporter for metrics
	promExporter, err := prometheus.New()
	if err != nil {
		return nil, err
	}

	// Create resource with service information
	res := resource.NewWithAttributes(
		semconv.SchemaURL,
		semconv.ServiceName(serviceName),
		semconv.ServiceVersion(serviceVersion),
		attribute.String("env", os.Getenv("APP_ENV")),
	)

	// Set global meter provider with Prometheus exporter
	provider := metric.NewMeterProvider(
		metric.WithReader(promExporter),
		metric.WithResource(res),
	)
	otel.SetMeterProvider(provider)

	// Configure tracer provider with OTLP exporter if endpoint is set
	var tracerProvider *trace.TracerProvider
	otlpEndpoint := os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
	
	if otlpEndpoint != "" {
		// Create OTLP HTTP trace exporter
		traceExporter, err := otlptracehttp.New(ctx,
			otlptracehttp.WithEndpoint(otlpEndpoint),
			otlptracehttp.WithInsecure(), // Use HTTP instead of HTTPS for local development
		)
		if err != nil {
			log.Printf("Failed to create OTLP trace exporter: %v", err)
			// Fall back to noop
			tracerProvider = trace.NewTracerProvider(
				trace.WithResource(res),
			)
		} else {
			log.Printf("OTLP trace exporter configured with endpoint: %s", otlpEndpoint)
			tracerProvider = trace.NewTracerProvider(
				trace.WithBatcher(traceExporter),
				trace.WithResource(res),
			)
		}
	} else {
		// No OTLP endpoint configured, use noop (no-op spans but still in-memory)
		log.Println("No OTEL_EXPORTER_OTLP_ENDPOINT set, traces will not be exported")
		tracerProvider = trace.NewTracerProvider(
			trace.WithResource(res),
		)
	}
	
	otel.SetTracerProvider(tracerProvider)

	return promExporter, nil
}
