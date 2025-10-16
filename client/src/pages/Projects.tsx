import { TerminalCard, LazyGrid } from '@/components'
import { useResponsiveItemsPerPage } from '@/hooks'
import { useEffect, useMemo, useState } from 'react'
import { ProjectsApi, type ApiProject } from '@/utils/api'

const Projects = () => {
  const itemsPerPage = useResponsiveItemsPerPage()

  const [data, setData] = useState<ApiProject[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <section className="section space-y-12">
      <div className="glass-panel relative overflow-hidden px-10 py-12">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <p className="chip is-active w-fit">Work</p>
            <h1 className="headline gradient-text">Selected Projects</h1>
            <p className="max-w-2xl text-base text-text-muted">
              A cross-section of the tools, products, and experiments I’ve shipped as a full-stack
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

      {loading && <div className="text-text-muted">Loading projects…</div>}
      {error && !loading && <div className="text-red-400">{error}</div>}
      {!loading && !error && (
        <LazyGrid
          items={projects}
          itemsPerPage={itemsPerPage}
          className="gap-8"
          animateIn
          animationDelayStep={120}
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
      )}
    </section>
  )
}

export default Projects
