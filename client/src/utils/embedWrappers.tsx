import React, { useState } from 'react'

type EmbedWrapperProps = {
  children: React.ReactElement<React.IframeHTMLAttributes<HTMLIFrameElement>>
  heightClass?: string
}

export const EmbedWrapper = ({ children, heightClass = 'aspect-video' }: EmbedWrapperProps) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden rounded-3xl ${heightClass}`}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-strong/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            Loading embed
          </div>
        </div>
      )}
      <div
        className={`${loaded ? 'opacity-100' : 'pointer-events-none opacity-60 blur-sm transition-opacity duration-500'}`}
      >
        {React.cloneElement(children, {
          onLoad: () => setLoaded(true),
        })}
      </div>
    </div>
  )
}
