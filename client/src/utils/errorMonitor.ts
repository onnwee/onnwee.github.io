// utils/ErrorMonitor.ts
import React from 'react'

interface ErrorContext {
  component?: string
  user_agent?: string
  url?: string
  timestamp: string
  environment: string
  userId?: string
}

interface ErrorLog {
  message: string
  stack?: string
  context: ErrorContext
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class ErrorMonitor {
  private static instance: ErrorMonitor
  private errorQueue: ErrorLog[] = []
  private maxQueueSize = 50

  private constructor() {
    this.setupGlobalErrorHandlers()
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  private setupGlobalErrorHandlers() {
    window.addEventListener('error', event => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        context: this.buildContext('Global Error Handler'),
        severity: 'high',
      })
    })

    window.addEventListener('unhandledrejection', event => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        context: this.buildContext('Promise Rejection Handler'),
        severity: 'high',
      })
    })
  }

  private buildContext(component = 'Unknown'): ErrorContext {
    return {
      component,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      environment: import.meta.env.NODE_ENV || 'development',
      user_agent: navigator.userAgent,
    }
  }

  logError(errorLog: ErrorLog) {
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.errorQueue.shift()
    }
    this.errorQueue.push(errorLog)

    if (import.meta.env.NODE_ENV === 'development') {
      const style = this.getConsoleStyle(errorLog.severity)
      console.group(`🚨 ${errorLog.severity.toUpperCase()} Error`)
      console.log(`%c${errorLog.message}`, style)
      if (errorLog.stack) console.log('Stack trace:', errorLog.stack)
      console.log('Context:', errorLog.context)
      console.groupEnd()
    }

    if (import.meta.env.NODE_ENV === 'production' && errorLog.severity === 'critical') {
      this.sendToErrorService(errorLog)
    }
  }

  private getConsoleStyle(severity: string): string {
    const styles = {
      low: 'color: #fbbf24; background: #451a03; padding: 2px 6px; border-radius: 3px;',
      medium: 'color: #fb923c; background: #431407; padding: 2px 6px; border-radius: 3px;',
      high: 'color: #f87171; background: #450a0a; padding: 2px 6px; border-radius: 3px;',
      critical: 'color: #fca5a5; background: #7f1d1d; padding: 2px 6px; border-radius: 3px;',
    }
    return styles[severity as keyof typeof styles] || styles.medium
  }

  private async sendToErrorService(errorLog: ErrorLog) {
    try {
      // Replace with actual integration
      console.log('Would send to error service:', errorLog)
    } catch (error) {
      console.error('Failed to send error to monitoring service:', error)
    }
  }

  getRecentErrors(limit = 10): ErrorLog[] {
    return this.errorQueue.slice(-limit)
  }

  clearErrors() {
    this.errorQueue = []
  }

  logReactError(
    error: Error,
    errorInfo: React.ErrorInfo,
    component = 'React Component',
    severity: ErrorLog['severity'] = 'medium',
  ) {
    this.logError({
      message: error.message,
      stack: error.stack,
      context: {
        ...this.buildContext(component),
        // Could optionally include errorInfo.componentStack in a separate field if useful
      },
      severity,
    })
  }
}

// Export singleton instance
export const errorMonitor = ErrorMonitor.getInstance()

