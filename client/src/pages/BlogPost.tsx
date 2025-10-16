// import { MdxComponents } from '@/components'
import { lazy, Suspense, useMemo } from 'react'
import { useParams } from 'react-router-dom'

const BlogPost = () => {
  const { slug } = useParams()

  const PostWrapper = useMemo(() => {
    return lazy(async () => {
      if (!slug) {
        return {
          default: () => <div className="section">Missing blog slug.</div>,
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
          default: () => <div className="section">Post not found.</div>,
        }
      }
    })
  }, [slug])

  return (
    <main id="main" className="section space-y-8">
      <Suspense
        fallback={
          <div className="surface-card px-6 py-8 text-sm text-text-muted">Loading post...</div>
        }
      >
        <PostWrapper />
      </Suspense>
    </main>
  )
}

export default BlogPost
