import { TerminalCard, LazyGrid, MultiTagFilter, SkeletonCard, ProjectsSkeleton } from '@/components'
import { useResponsiveItemsPerPage, useUrlArrayState, useUrlState, useDebounce } from '@/hooks'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { ProjectsApi, type ApiProject } from '@/utils/api'

const Projects = () => {
  const itemsPerPage = useResponsiveItemsPerPage()

  const [data, setData] = useState<ApiProject[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // URL-synchronized state for filters
  const [selectedTags, setSelectedTags] = useUrlArrayState('tags')
  const [query, setQuery] = useUrlState('query', '')
  
  // Local state for immediate search input feedback (initialized from URL)
  const [searchInput, setSearchInput] = useState(query)
  
  // Debounce the search query for URL updates and filtering
  const debouncedQuery = useDebounce(searchInput, 300)
  
  // Sync debounced query to URL
  useEffect(() => {
    setQuery(debouncedQuery)
  }, [debouncedQuery, setQuery])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ProjectsApi.list()
      .then(res => {
        if (!cancelled) {
          setData(res)
          setError(null)
        }
      })
      .catch(err => {
        if (!cancelled) setError(err?.message || 'Failed to load projects')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const projects = useMemo(() => data ?? [], [data])
  
  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projects.forEach(project => {
      project.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [projects])
  
  // Toggle tag selection
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }, [setSelectedTags])
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedTags([])
    setSearchInput('')
    setQuery('')
  }, [setSelectedTags, setQuery])
  
  // Filter projects based on selected tags (AND logic) and search query
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Tag filtering with AND logic - project must have ALL selected tags
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => project.tags?.includes(tag))
      
      // Text search - matches title OR summary OR any tag OR emoji
      const searchLower = debouncedQuery.toLowerCase()
      const matchesSearch = !debouncedQuery || 
        project.title.toLowerCase().includes(searchLower) ||
        project.summary?.toLowerCase().includes(searchLower) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        project.emoji?.toLowerCase().includes(searchLower)
      
      return matchesTags && matchesSearch
    })
  }, [projects, selectedTags, debouncedQuery])

  // Show skeleton while loading
  if (loading) {
    return <ProjectsSkeleton />
  }

  // Show error state
  if (error && !loading) {
    return (
      <section className="section">
        <div className="surface-card flex flex-col gap-4 rounded-3xl border border-border/35 bg-surface/70 px-6 py-7 text-sm text-text-muted shadow-soft">
          <div className="flex items-center gap-3 text-text">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-text-muted">
                Failed to load projects
              </p>
              <p className="text-base font-medium text-text">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="self-start rounded-full bg-accent/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-accent transition-colors duration-300 hover:bg-accent/25"
          >
            Try again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="section space-y-12">
      <div className="glass-panel relative overflow-hidden px-10 py-12">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <p className="chip is-active w-fit">Work</p>
            <h1 className="headline gradient-text">Selected Projects</h1>
            <p className="max-w-2xl text-base text-text-muted">
              A cross-section of the tools, products, and experiments I've shipped as a full-stack
              engineer—from data-intensive dashboards to creative coding installations. Each piece
              blends maintainable architecture with a polished, memorable interface.
            </p>
          </div>
          <div className="grid gap-2 text-right text-xs uppercase tracking-[0.35em] text-text-muted">
            <span>Frontend • Backend • DevOps</span>
            <span>TypeScript • Go • Cloud Native</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="surface-card px-6 py-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            placeholder="Search by title, tags, summary, or emoji"
            className="w-full rounded-full border border-border/30 bg-surface/70 px-5 py-3 text-sm text-text placeholder:text-text-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30 md:max-w-sm"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            aria-label="Search projects"
          />
          <span className="text-xs uppercase tracking-[0.32em] text-text-muted">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
        {allTags.length > 0 && (
          <div className="mt-6">
            <MultiTagFilter
              tags={allTags}
              selected={selectedTags}
              onToggle={toggleTag}
              onClear={clearFilters}
            />
          </div>
        )}
      </div>

      <LazyGrid
        items={filteredProjects}
        itemsPerPage={itemsPerPage}
        className="gap-8"
        animateIn
        animationDelayStep={120}
        renderSkeleton={() => <SkeletonCard />}
        skeletonCount={6}
        renderItem={project => (
          <TerminalCard
            key={project.slug}
            title={`${project.emoji ?? ''} ${project.title}`}
            summary={project.summary ?? undefined}
            tags={project.tags}
            footer={project.footer ?? undefined}
            href={project.href ?? `/projects/${project.slug}`}
            external={project.external}
            color={
              project.color === 'green' ||
              project.color === 'pink' ||
              project.color === 'cyan' ||
              project.color === 'yellow'
                ? (project.color as 'green' | 'pink' | 'cyan' | 'yellow')
                : undefined
            }
          />
        )}
      />
    </section>
  )
}

export default Projects
