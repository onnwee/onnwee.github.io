import { useTheme } from '@/hooks'
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
  heightClass = 'aspect-video mb-6',
  url,
  title,
}: EmbedWrapperProps) {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)
  const { glitchMode } = useTheme()

  const handleRetry = useCallback(() => {
    setLoadState('loading')
    setError(null)
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
  }, [children, url])

  if (loadState === 'error') {
    return (
      <div
        className={`relative overflow-hidden rounded ${heightClass}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="h-full flex flex-col items-center justify-center p-4 text-center border">
          <p className="text-red-500 text-sm mb-2">🚫 Failed to load embed.</p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs bg-secondary hover:bg-glitchBlue"
            >
              Open Direct Link
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded ${heightClass}`}>
      {loadState === 'loading' && (
        <div
          className="absolute inset-0 bg-neutral animate-pulse flex items-center justify-center z-10"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2">Loading embed...</div>
            <div className="flex gap-1 justify-center">
              <div
                className="w-2 h-2 bg-accent rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="w-2 h-2 bg-accent rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <div
                className="w-2 h-2 bg-accent rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}

      <div className={`${loadState === 'loaded' ? '' : 'blur-sm grayscale pointer-events-none'}`}>
        {React.isValidElement(children) &&
        typeof children.type === 'string' &&
        children.type.toLowerCase() === 'iframe' ? (
          React.cloneElement(children, {
            onLoad: handleLoad,
            onError: () => handleError('Content failed to load'),
            onLoadStart: () => setLoadState('loading'),
          } as React.IframeHTMLAttributes<HTMLIFrameElement>)
        ) : (
          <div className="p-4 text-xs font-mono text-center text-yellow-400 bg-neutral border border-yellow-600 rounded">
            ⚠️ Unsupported embed content
          </div>
        )}
      </div>
    </div>
  )
}
