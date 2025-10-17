// src/components/LazyGrid.tsx
import { useOnScreen } from '@/hooks'
import React, { useCallback, useEffect, useState } from 'react'

type LazyGridProps<T> = {
  items: T[]
  // eslint-disable-next-line no-unused-vars
  renderItem: (item: T, index: number) => React.ReactNode
  itemsPerPage?: number
  className?: string
  animateIn?: boolean
  animationDelayStep?: number
  emptyState?: React.ReactNode
  renderSkeleton?: () => React.ReactNode
  skeletonCount?: number
}

export default function LazyGrid<T>({
  items,
  renderItem,
  itemsPerPage = 9,
  className = '',
  animateIn = true,
  animationDelayStep = 100,
  emptyState = <p className="text-sm text-gray-400 mt-4">No results found.</p>,
  renderSkeleton,
  skeletonCount = 6,
}: LazyGridProps<T>) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage)
  const [isLoading, setIsLoading] = useState(false)
  const [lastAnnouncedCount, setLastAnnouncedCount] = useState(0)
  const [loaderRef, isVisible] = useOnScreen<HTMLDivElement>('-20px')

  const loadMore = useCallback(() => {
    if (visibleCount >= items.length) return
    setIsLoading(true)
    // Brief delay to show skeletons during content windowing
    // In production with async data, this would be replaced by actual fetch time
    setTimeout(() => {
      setVisibleCount(prev => {
        const newCount = Math.min(prev + itemsPerPage, items.length)
        setLastAnnouncedCount(newCount)
        return newCount
      })
      setIsLoading(false)
    }, 150)
  }, [items.length, itemsPerPage, visibleCount])

  useEffect(() => {
    if (isVisible && !isLoading) loadMore()
  }, [isVisible, loadMore, isLoading])

  const visibleItems = items.slice(0, visibleCount)

  const hasMore = visibleCount < items.length
  const skeletonsToShow = Math.min(skeletonCount, items.length - visibleCount)
  const shouldAnnounceLoadedCount = 
    !isLoading && 
    lastAnnouncedCount > itemsPerPage && 
    lastAnnouncedCount === visibleCount

  return (
    <>
      {/* ARIA live region for accessibility announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading && 'Loading more items...'}
        {shouldAnnounceLoadedCount && `Loaded ${visibleCount} of ${items.length} items`}
      </div>

      <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ${className}`}>
        {visibleItems.map((item, i) => {
          if (!animateIn) return <div key={i}>{renderItem(item, i)}</div>

          return (
            <div
              key={i}
              className="fade-up-once opacity-0 will-change-transform"
              style={{
                animationDelay: `${i * animationDelayStep}ms`,
                animationFillMode: 'forwards',
              }}
            >
              {renderItem(item, i)}
            </div>
          )
        })}

        {/* Skeleton placeholders while loading */}
        {isLoading && renderSkeleton && (
          <>
            {Array.from({ length: skeletonsToShow }).map((_, i) => (
              <div key={`skeleton-${i}`}>
                {renderSkeleton()}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Intersection observer target */}
      {hasMore && (
        <div ref={loaderRef} className="h-12 center text-sm text-muted mt-4">
          {isLoading ? 'Loading...' : ''}
        </div>
      )}

      {items.length === 0 && emptyState}
    </>
  )
}
