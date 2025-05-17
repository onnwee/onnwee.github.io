import React, { useState } from 'react'

type EmbedWrapperProps = {
  children: React.ReactNode
  heightClass?: string
}

export const EmbedWrapper = ({
  children,
  heightClass = 'aspect-video mb-6',
}: EmbedWrapperProps) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden rounded ${heightClass}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-neutral animate-pulse flex items-center justify-center z-10">
          <div className="text-xs text-gray-400">Loading embed...</div>
        </div>
      )}
      <div className={`${loaded ? '' : 'blur-sm grayscale pointer-events-none'}`}>
        {React.cloneElement(children as React.ReactElement, {
          onLoad: () => setLoaded(true),
        })}
      </div>
    </div>
  )
}
