import { useTheme } from '@/hooks'
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
  const { glitchMode } = useTheme()

  return (
    <div
      className={`p-6 border rounded font-mono ${
        glitchMode
          ? 'border-glitchRed bg-neutral text-glitchRed animate-glitch'
          : 'border-red-400 bg-neutral text-red-300'
      }`}
    >
      <div className="mb-4 text-sm text-red-500">[ERROR] Something went wrong</div>

      <div className="mb-4 text-base">{error?.message || 'An unexpected error occurred'}</div>

      {/* Only show technical details in development */}
      {import.meta.env.NODE_ENV === 'development' && error?.stack && (
        <details className="mb-4 text-xs opacity-60">
          <summary className="cursor-pointer hover:opacity-80">
            Technical Details (Development Only)
          </summary>
          <pre className="mt-2 p-2 bg-black rounded text-xs overflow-auto">{error.stack}</pre>
        </details>
      )}

      <button onClick={reset} className="btn-primary text-xs">
        Try Again
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
