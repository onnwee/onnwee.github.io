// import { MdxComponents } from '@/components'
import { BlogPostSkeleton } from '@/components'
import { lazy, Suspense, useMemo } from 'react'
import { NavLink, useParams } from 'react-router-dom'

const BlogPost = () => {
  const { slug } = useParams()

  const PostWrapper = useMemo(() => {
    return lazy(async () => {
      if (!slug) {
        return {
          default: () => (
            <section className="section">
              <div className="surface-card flex flex-col gap-4 rounded-3xl border border-border/35 bg-surface/70 px-6 py-7 text-sm text-text-muted shadow-soft">
                <div className="flex items-center gap-3 text-text">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.32em] text-text-muted">
                      Missing blog identifier
                    </p>
                    <p className="text-base font-medium text-text">
                      No blog post slug was provided in the URL
                    </p>
                  </div>
                </div>
                <NavLink
                  to="/"
                  className="self-start rounded-full bg-accent/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-accent transition-colors duration-300 hover:bg-accent/25"
                >
                  Go home
                </NavLink>
              </div>
            </section>
          ),
        }
      }

      try {
        const mod = await import(`../blog/${slug}.mdx`)
        return {
          default: () => (
            <article className="prose prose-invert max-w-3xl mx-auto">
              <h1 className="mb-2">{mod.frontmatter?.title}</h1>
              {mod.frontmatter?.date && (
                <p className="text-sm opacity-60 mb-6">{mod.frontmatter.date}</p>
              )}
              <mod.default components={{}} />
            </article>
          ),
        }
      } catch (e) {
        console.error('Error loading blog post:', e)
        return {
          default: () => (
            <section className="section">
              <div className="surface-card flex flex-col gap-4 rounded-3xl border border-border/35 bg-surface/70 px-6 py-7 text-sm text-text-muted shadow-soft">
                <div className="flex items-center gap-3 text-text">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.32em] text-text-muted">
                      Post not found
                    </p>
                    <p className="text-base font-medium text-text">
                      The blog post "{slug}" could not be loaded
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-full bg-accent/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-accent transition-colors duration-300 hover:bg-accent/25"
                  >
                    Try again
                  </button>
                  <NavLink
                    to="/"
                    className="rounded-full border border-border/40 bg-surface/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-text transition-colors duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                  >
                    Go home
                  </NavLink>
                </div>
              </div>
            </section>
          ),
        }
      }
    })
  }, [slug])

  return (
    <main id="main" className="section space-y-8">
      <Suspense fallback={<BlogPostSkeleton />}>
        <PostWrapper />
      </Suspense>
    </main>
  )
}

export default BlogPost
