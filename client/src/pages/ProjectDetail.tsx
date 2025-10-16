import { ErrorBoundary } from '@/components'
import { projects } from '@/data/projects'
import { errorMonitor, renderEmbed } from '@/utils'
import { useMemo, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'

// Type guard to validate project data structure
const isValidProject = (project: any): project is (typeof projects)[0] => {
  return (
    project &&
    typeof project.slug === 'string' &&
    typeof project.title === 'string' &&
    typeof project.summary === 'string' &&
    Array.isArray(project.tags)
  )
}

// Custom hook for safely fetching project data
const useProjectData = (slug: string | undefined) => {
  return useMemo(() => {
    // Handle missing slug parameter
    if (!slug || typeof slug !== 'string') {
      return {
        project: null,
        error: 'No project identifier provided',
        errorType: 'missing-slug' as const,
      }
    }

    // Validate slug format (basic security check)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return {
        project: null,
        error: 'Invalid project identifier format',
        errorType: 'invalid-slug' as const,
      }
    }

    try {
      // Find the project
      const foundProject = projects.find(p => p?.slug === slug)

      if (!foundProject) {
        return {
          project: null,
          error: `Project "${slug}" not found`,
          errorType: 'not-found' as const,
        }
      }

      // Validate project data structure
      if (!isValidProject(foundProject)) {
        console.error('Invalid project data structure:', foundProject)
        return {
          project: null,
          error: 'Project data is corrupted or invalid',
          errorType: 'invalid-data' as const,
        }
      }

      return {
        project: foundProject,
        error: null,
        errorType: null,
      }
    } catch (error) {
      console.error('Error fetching project data:', error)
      return {
        project: null,
        error: 'Failed to load project data',
        errorType: 'fetch-error' as const,
      }
    }
  }, [slug])
}

// Error component that matches your site's aesthetic
const ProjectError = ({
  error,
  errorType,
  slug,
}: {
  error: string
  errorType: string
  slug?: string
}) => {
  const details = (() => {
    switch (errorType) {
      case 'not-found':
        return {
          icon: '🔍',
          title: 'Project not found',
          suggestion: "Double-check the URL or browse the full index—it's probably nearby.",
          suggestSimilar: true,
        }
      case 'invalid-slug':
        return {
          icon: '⚠️',
          title: 'That URL looks off',
          suggestion: 'Project slugs only include lowercase letters, numbers, and dashes.',
          suggestSimilar: false,
        }
      case 'invalid-data':
        return {
          icon: '💥',
          title: 'Data hiccup',
          suggestion:
            'Something in the project entry is misconfigured. Give it another try shortly.',
          suggestSimilar: false,
        }
      default:
        return {
          icon: '❌',
          title: 'Something went sideways',
          suggestion: 'A quick refresh usually fixes it. If not, feel free to reach out.',
          suggestSimilar: true,
        }
    }
  })()

  const similarProjects =
    details.suggestSimilar && slug
      ? projects
          .filter(p => p.slug.includes(slug.toLowerCase()) || slug.toLowerCase().includes(p.slug))
          .slice(0, 3)
      : []

  return (
    <section className="section">
      <div className="surface-card relative overflow-hidden px-10 py-12 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-60 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(var(--color-accent), 0.32), transparent 60%)',
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-5">
          <span className="text-4xl">{details.icon}</span>
          <h1 className="text-3xl font-semibold text-text">{details.title}</h1>
          <p className="text-base text-text-muted/90">{error}</p>
          <p className="text-sm text-text-muted/80">{details.suggestion}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <NavLink
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-surface/70 px-5 py-2 text-sm font-medium text-text transition-colors duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
            >
              Browse projects
            </NavLink>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-5 py-2 text-sm font-semibold text-accent transition-colors duration-300 hover:bg-accent/25"
            >
              Refresh page
            </button>
          </div>

          {similarProjects.length > 0 && (
            <div className="mt-6 w-full rounded-2xl border border-border/30 bg-surface/70 p-5 text-left">
              <p className="text-xs uppercase tracking-[0.32em] text-text-muted">Maybe you meant</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {similarProjects.map(project => (
                  <li key={project.slug}>
                    <NavLink to={`/projects/${project.slug}`} className="chip text-[11px]">
                      {project.emoji} {project.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Safe image component with error handling
const SafeImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (hasError) {
    return (
      <div
        className={`surface-card flex min-h-[260px] items-center justify-center text-center ${className ?? ''}`}
        role="img"
        aria-label="Illustration unavailable"
      >
        <div className="space-y-2">
          <div className="text-2xl">🖼️</div>
          <p className="text-sm text-text-muted">Image could not be loaded</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-border/35 bg-surface/70 shadow-soft ${className ?? ''}`}
    >
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-surface-strong/40 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-text-muted">
            <span className="h-2 w-2 animate-ping rounded-full bg-accent" />
            Loading visual
          </div>
        </div>
      )}

      <img
        src={src}
        alt={alt || 'Project image'}
        className={`h-full w-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
      />
    </div>
  )
}

const ProjectDetail = () => {
  const { slug } = useParams()
  const { project, error, errorType } = useProjectData(slug)

  // Handle error states
  if (error || !project) {
    return (
      <ProjectError
        error={error || 'Unknown error'}
        errorType={errorType || 'unknown'}
        slug={slug}
      />
    )
  }

  // Safe rendering with null checks for optional fields
  return (
    <section className="section space-y-10">
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
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.32em] text-text-muted">
            <span className="inline-flex h-1.5 w-9 rounded-full bg-accent/70" />
            <span>{project.external ? 'Case Study' : 'Workbench'}</span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold text-text">
              {project.emoji && <span className="mr-2 text-3xl align-middle">{project.emoji}</span>}
              {project.title}
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-text-muted/90">
              {project.summary}
            </p>
          </div>

          {project.tags?.length ? (
            <ul className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <li key={tag}>
                  <span className="chip">{tag}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <NavLink
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-surface/70 px-5 py-2 text-sm font-medium text-text transition-colors duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
            >
              ← Back to projects
            </NavLink>

            {project.href && (
              <a
                href={project.href}
                target={project.external ? '_blank' : '_self'}
                rel={project.external ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-5 py-2 text-sm font-semibold text-accent transition-colors duration-300 hover:bg-accent/25"
              >
                {project.external ? 'View repository' : 'Open project'}
              </a>
            )}
          </div>
        </div>
      </article>

      {project.image ? <SafeImage src={project.image} alt={`${project.title} screenshot`} /> : null}

      {project.content ? (
        <article className="surface-card px-8 py-8 text-base leading-relaxed text-text-muted/90">
          {project.content
            .split('\n')
            .map(paragraph => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, index, array) => (
              <p
                key={`${project.slug}-paragraph-${index}`}
                className={index === array.length - 1 ? undefined : 'mb-4'}
              >
                {paragraph}
              </p>
            ))}
        </article>
      ) : null}

      {project.embed ? (
        <ErrorBoundary
          fallback={({ error, reset }) => (
            <div className="surface-card px-6 py-6 text-center text-sm text-text-muted">
              <p className="mb-3 font-medium text-text">We couldn’t load the embedded preview.</p>
              <p className="mb-4 text-xs text-text-muted/80">{error?.message ?? 'Unknown error'}</p>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2 text-xs font-semibold text-accent transition-colors duration-300 hover:bg-accent/25"
              >
                Try again
              </button>
            </div>
          )}
          onError={(error, errorInfo) => {
            errorMonitor.logReactError(error, errorInfo, 'ProjectDetail', 'high')
          }}
        >
          {renderEmbed({ url: project.embed, title: project.title })}
        </ErrorBoundary>
      ) : null}
    </section>
  )
}

export default ProjectDetail
