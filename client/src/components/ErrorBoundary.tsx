import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// Default fallback component that matches your site's aesthetic
const DefaultErrorFallback: React.FC<{ error?: Error; reset: () => void }> = ({ error, reset }) => {
  return (
    <div className="surface-card flex flex-col gap-4 rounded-3xl border border-border/35 bg-surface/70 px-6 py-7 text-sm text-text-muted shadow-soft">
      <div className="flex items-center gap-3 text-text">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-text-muted">
            Runtime hiccup
          </p>
          <p className="text-base font-medium text-text">
            {error?.message || 'An unexpected error occurred'}
          </p>
        </div>
      </div>

      {import.meta.env.NODE_ENV === 'development' && error?.stack ? (
        <details className="rounded-2xl border border-border/25 bg-surface/70 px-4 py-3 text-xs text-text-muted/80">
          <summary className="cursor-pointer text-text transition-colors duration-300 hover:text-accent">
            Technical details (dev only)
          </summary>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed">
            {error.stack}
          </pre>
        </details>
      ) : null}

      <button
        type="button"
        onClick={reset}
        className="self-start rounded-full bg-accent/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-accent transition-colors duration-300 hover:bg-accent/25"
      >
        Try again
      </button>
    </div>
  )
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  // This lifecycle method catches errors during rendering
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  // This lifecycle method is called when an error is caught
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Store error info in state for the fallback component
    this.setState({ error, errorInfo })

    // Call the optional error handler prop
    this.props.onError?.(error, errorInfo)
  }

  // Method to reset the error state (for retry functionality)
  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
