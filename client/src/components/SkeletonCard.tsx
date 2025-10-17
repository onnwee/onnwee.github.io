/**
 * SkeletonCard - Loading placeholder matching TerminalCard structure
 * Respects prefers-reduced-motion via CSS
 */
const SkeletonCard = () => {
  return (
    <article
      className="relative overflow-hidden rounded-3xl border border-border/40 bg-surface/80 px-8 py-7 shadow-soft"
      style={{ backdropFilter: 'blur(22px)' }}
      aria-hidden="true"
    >
      {/* Featured badge skeleton */}
      <div className="flex items-center gap-3">
        <span className="inline-flex h-1.5 w-8 animate-pulse rounded-full bg-border/40" />
        <span className="h-2 w-16 animate-pulse rounded bg-border/40" />
      </div>

      {/* Title skeleton */}
      <div className="mt-5 space-y-2">
        <div className="h-7 w-3/4 animate-pulse rounded bg-border/40" />
        <div className="h-7 w-1/2 animate-pulse rounded bg-border/40" />
      </div>

      {/* Summary skeleton */}
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-border/30" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-border/30" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-border/30" />
      </div>

      {/* Tags skeleton */}
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="h-6 w-16 animate-pulse rounded-full bg-border/30" />
        <span className="h-6 w-20 animate-pulse rounded-full bg-border/30" />
        <span className="h-6 w-14 animate-pulse rounded-full bg-border/30" />
      </div>

      {/* Footer skeleton */}
      <div className="mt-6 flex items-center gap-2">
        <span className="inline-flex h-1 w-5 animate-pulse rounded-full bg-border/30" />
        <span className="h-2 w-20 animate-pulse rounded bg-border/30" />
      </div>
    </article>
  )
}

export default SkeletonCard
