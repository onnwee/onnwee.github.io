import { LazyGrid } from '@/components'
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
    <div className="max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Search posts..."
        className="w-full mb-6 p-2 rounded border border-neutral bg-black text-white"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTag(null)}
          className={`tag ${!selectedTag ? 'bg-accent text-black' : 'bg-neutral'}`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`tag ${selectedTag === tag ? 'bg-accent text-black' : 'bg-neutral'}`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <LazyGrid
        items={filteredPosts}
        itemsPerPage={itemsPerPage}
        className="space-y-4"
        animateIn
        animationDelayStep={100}
        renderItem={(post, index) => (
          <li key={post.slug + index} className="rounded-glow p-4 list-none">
            <Link to={`/blog/${post.slug}`} className="text-xl font-bold link-hover block">
              {post.title}
            </Link>
            <p className="text-sm opacity-70 mb-1">{post.date}</p>
            {post.summary && <p className="text-base">{post.summary}</p>}
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {post.tags.map(tag => (
                <span key={tag} className="tag glitch-tag">
                  {tag}
                </span>
              ))}
            </div>
          </li>
        )}
      />
    </div>
  )
}

export default BlogIndex
