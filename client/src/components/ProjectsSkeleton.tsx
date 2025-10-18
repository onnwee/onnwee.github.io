import SkeletonCard from './SkeletonCard'

/**
 * ProjectsSkeleton - Loading placeholder for projects list page
 * Matches the Projects page structure with header and grid
 */
const ProjectsSkeleton = () => {
  return (
    <section className="section space-y-12">
      {/* Header skeleton */}
      <div className="glass-panel relative overflow-hidden px-10 py-12">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="h-6 w-20 animate-pulse rounded-full bg-border/40" />
            <div className="h-12 w-80 animate-pulse rounded bg-border/40" />
            <div className="space-y-2">
              <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-border/30" />
              <div className="h-5 w-3/4 max-w-2xl animate-pulse rounded bg-border/30" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-48 animate-pulse rounded bg-border/30" />
            <div className="h-3 w-48 animate-pulse rounded bg-border/30" />
          </div>
        </div>
      </div>

      {/* Filter controls skeleton */}
      <div className="surface-card px-6 py-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="h-11 w-full max-w-sm animate-pulse rounded-full bg-border/30" />
          <div className="h-4 w-24 animate-pulse rounded bg-border/30" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="h-7 w-16 animate-pulse rounded-full bg-border/30" />
          <span className="h-7 w-20 animate-pulse rounded-full bg-border/30" />
          <span className="h-7 w-14 animate-pulse rounded-full bg-border/30" />
          <span className="h-7 w-18 animate-pulse rounded-full bg-border/30" />
          <span className="h-7 w-16 animate-pulse rounded-full bg-border/30" />
        </div>
      </div>

      {/* Project grid skeleton */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  )
}

export default ProjectsSkeleton
