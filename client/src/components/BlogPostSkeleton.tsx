/**
 * BlogPostSkeleton - Loading placeholder for blog post page
 * Matches the blog post structure with title, date, and content
 */
const BlogPostSkeleton = () => {
  return (
    <main id="main" className="section space-y-8">
      <article className="prose prose-invert max-w-3xl mx-auto">
        {/* Title skeleton */}
        <div className="space-y-3 mb-6">
          <div className="h-10 w-3/4 animate-pulse rounded bg-border/40" />
          <div className="h-10 w-1/2 animate-pulse rounded bg-border/40" />
        </div>

        {/* Date skeleton */}
        <div className="h-4 w-32 animate-pulse rounded bg-border/30 mb-6" />

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-border/30" />
            <div className="h-4 w-full animate-pulse rounded bg-border/30" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-border/30" />
          </div>
          
          <div className="space-y-2 mt-6">
            <div className="h-4 w-full animate-pulse rounded bg-border/30" />
            <div className="h-4 w-full animate-pulse rounded bg-border/30" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-border/30" />
          </div>

          <div className="h-48 animate-pulse rounded-lg bg-border/30 my-6" />

          <div className="space-y-2 mt-6">
            <div className="h-4 w-full animate-pulse rounded bg-border/30" />
            <div className="h-4 w-full animate-pulse rounded bg-border/30" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-border/30" />
          </div>
        </div>
      </article>
    </main>
  )
}

export default BlogPostSkeleton
