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
}

export default function LazyGrid<T>({
  items,
  renderItem,
  itemsPerPage = 9,
  className = '',
  animateIn = true,
  animationDelayStep = 100,
  emptyState = <p className="text-sm text-gray-400 mt-4">No results found.</p>,
}: LazyGridProps<T>) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage)
  const [loaderRef, isVisible] = useOnScreen<HTMLDivElement>('-20px')

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + itemsPerPage, items.length))
  }, [items.length, itemsPerPage])

  useEffect(() => {
    if (isVisible) loadMore()
  }, [isVisible, loadMore])

  const visibleItems = items.slice(0, visibleCount)

  return (
    <>
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
      </div>

      {visibleCount < items.length && (
        <div ref={loaderRef} className="h-12 center text-sm text-muted mt-4">
          Loading more...
        </div>
      )}

      {items.length === 0 && emptyState}
    </>
  )
}
