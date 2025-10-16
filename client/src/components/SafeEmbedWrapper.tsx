import React, { useCallback, useEffect, useState } from 'react'

type EmbedWrapperProps = {
  children: React.ReactNode
  heightClass?: string
  url?: string
  title?: string
}

type LoadState = 'loading' | 'loaded' | 'error'

export default function SafeEmbedWrapper({
  children,
  heightClass = 'aspect-video',
  url,
  title,
}: EmbedWrapperProps) {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    setLoadState('loading')
    setError(null)
    setRetryKey(current => current + 1)
  }, [])

  const handleLoad = useCallback(() => {
    setLoadState('loaded')
    setError(null)
  }, [])

  const handleError = useCallback(
    (errorMessage?: string) => {
      setLoadState('error')
      setError(errorMessage || 'Failed to load embed')
      console.error('Embed loading error:', { url, title, error: errorMessage })
    },
    [url, title],
  )

  useEffect(() => {
    setLoadState('loading')
    setError(null)
  }, [children, url, retryKey])

  if (loadState === 'error') {
    return (
      <div
        className={`relative overflow-hidden rounded-3xl ${heightClass}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-border/40 bg-surface/70 p-6 text-center text-sm text-text-muted shadow-soft">
          <span className="text-2xl">🚫</span>
          <p className="font-medium text-text">Failed to load embed</p>
          <p className="text-xs text-text-muted/80">{error}</p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2 text-xs font-semibold text-accent transition-colors duration-300 hover:bg-accent/25"
            >
              Open direct link ↗
            </a>
          )}
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-full border border-border/35 bg-surface/70 px-4 py-2 text-xs font-medium text-text transition-colors duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl ${heightClass}`}>
      {loadState === 'loading' && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-surface-strong/40 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            Loading embed
          </div>
        </div>
      )}

      <div
        className={`${loadState === 'loaded' ? 'opacity-100' : 'pointer-events-none opacity-60 blur-sm transition-opacity duration-500'}`}
      >
        {React.isValidElement(children) &&
        typeof children.type === 'string' &&
        children.type.toLowerCase() === 'iframe' ? (
          React.cloneElement(children, {
            key: retryKey,
            onLoad: handleLoad,
            onError: () => handleError('Content failed to load'),
          } as React.IframeHTMLAttributes<HTMLIFrameElement>)
        ) : (
          <div className="rounded-3xl border border-border/35 bg-surface/70 p-5 text-center text-xs text-text-muted shadow-soft">
            ⚠️ Unsupported embed content
          </div>
        )}
      </div>
    </div>
  )
}
