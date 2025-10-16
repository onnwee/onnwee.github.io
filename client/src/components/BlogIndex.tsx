import { LazyGrid, TagFilter } from '@/components'
import { useResponsiveItemsPerPage } from '@/hooks'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const postModules = import.meta.glob('../blog/*.mdx', { eager: true }) as Record<
  string,
  { frontmatter: { title: string; tags: string[]; summary?: string; date?: string } }
>

type PostMeta = {
  slug: string
  title: string
  summary?: string
  date?: string
  tags: string[]
}

const BlogIndex = () => {
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const itemsPerPage = useResponsiveItemsPerPage()

  const posts: PostMeta[] = useMemo(() => {
    return Object.entries(postModules).map(([path, mod]) => {
      const slug = path.split('/').pop()?.replace('.mdx', '') || 'untitled'
      const { title, tags = [], summary, date } = mod.frontmatter || {}
      return { slug, title, tags, summary, date }
    })
  }, [])

  const allTags = useMemo(() => [...new Set(posts.flatMap(p => p.tags))].sort(), [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true
      const matchesQuery =
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.summary?.toLowerCase().includes(query.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      return matchesTag && matchesQuery
    })
  }, [selectedTag, query, posts])

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="surface-card px-6 py-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            placeholder="Search by title, tags, or summary"
            className="w-full rounded-full border border-border/30 bg-surface/70 px-5 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30 md:max-w-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search blog posts"
          />
          <span className="text-xs uppercase tracking-[0.32em] text-text-muted">
            {filteredPosts.length} posts
          </span>
        </div>
        <div className="mt-6">
          <TagFilter tags={allTags} selected={selectedTag} onSelect={setSelectedTag} />
        </div>
      </div>

      <LazyGrid
        items={filteredPosts}
        itemsPerPage={itemsPerPage}
        className="gap-8"
        animateIn
        animationDelayStep={120}
        renderItem={post => (
          <li
            key={post.slug}
            className="surface-card list-none overflow-hidden px-7 py-8 transition duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-pop"
          >
            <Link to={`/blog/${post.slug}`} className="group flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-text-muted">
                <span>{post.date ?? 'Coming soon'}</span>
                <span className="flex gap-2">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="chip text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-text transition-colors duration-300 group-hover:text-accent">
                {post.title}
              </h2>
              {post.summary && <p className="text-base text-text-muted/90">{post.summary}</p>}
            </Link>
          </li>
        )}
      />
    </div>
  )
}

export default BlogIndex
