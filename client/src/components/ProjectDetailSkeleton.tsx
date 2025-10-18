/**
 * ProjectDetailSkeleton - Loading placeholder for project detail page
 * Matches the ProjectDetail structure
 */
const ProjectDetailSkeleton = () => {
  return (
    <section className="section space-y-10">
      {/* Header section skeleton */}
      <article className="surface-card relative overflow-hidden px-8 py-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-50 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 12% 18%, rgba(var(--color-accent), 0.28), transparent 60%), radial-gradient(circle at 82% 6%, rgba(var(--color-highlight), 0.22), transparent 55%)',
          }}
          aria-hidden
        />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Status badge skeleton */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex h-1.5 w-9 animate-pulse rounded-full bg-border/40" />
            <span className="h-2 w-20 animate-pulse rounded bg-border/40" />
          </div>

          {/* Title and summary skeleton */}
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <div className="h-10 w-3/4 animate-pulse rounded bg-border/40" />
              <div className="h-10 w-1/2 animate-pulse rounded bg-border/40" />
            </div>
            <div className="mt-2 space-y-2">
              <div className="h-6 w-full animate-pulse rounded bg-border/30" />
              <div className="h-6 w-5/6 animate-pulse rounded bg-border/30" />
            </div>
          </div>

          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2">
            <span className="h-7 w-16 animate-pulse rounded-full bg-border/30" />
            <span className="h-7 w-20 animate-pulse rounded-full bg-border/30" />
            <span className="h-7 w-14 animate-pulse rounded-full bg-border/30" />
            <span className="h-7 w-18 animate-pulse rounded-full bg-border/30" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex flex-wrap gap-3">
            <span className="h-9 w-36 animate-pulse rounded-full bg-border/30" />
            <span className="h-9 w-32 animate-pulse rounded-full bg-border/30" />
          </div>
        </div>
      </article>

      {/* Image skeleton */}
      <div
        className="relative overflow-hidden rounded-3xl border border-border/35 bg-surface/70 shadow-soft"
        style={{ minHeight: '320px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-surface-strong/40">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-text-muted">
            <span className="h-2 w-2 animate-ping rounded-full bg-accent" />
            Loading preview
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <article className="surface-card px-8 py-8">
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-border/30" />
          <div className="h-4 w-full animate-pulse rounded bg-border/30" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-border/30" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-border/30" />
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-border/30" />
          <div className="h-4 w-full animate-pulse rounded bg-border/30" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-border/30" />
        </div>
      </article>
    </section>
  )
}

export default ProjectDetailSkeleton
