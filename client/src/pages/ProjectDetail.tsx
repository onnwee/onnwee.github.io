import { ErrorBoundary, TerminalCard } from '@/components'
import { projects } from '@/data/projects'
import { useTheme } from '@/hooks'
import { renderEmbed, errorMonitor } from '@/utils'
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
  const { glitchMode } = useTheme()

  // Customize error message and suggestions based on error type
  const getErrorDetails = () => {
    switch (errorType) {
      case 'not-found':
        return {
          icon: '🔍',
          suggestion: "Check the URL or browse all projects to find what you're looking for.",
          showSimilar: true,
        }
      case 'invalid-slug':
        return {
          icon: '⚠️',
          suggestion: 'The project URL contains invalid characters.',
          showSimilar: false,
        }
      case 'invalid-data':
        return {
          icon: '💥',
          suggestion: 'The project data appears to be corrupted. Please try refreshing the page.',
          showSimilar: false,
        }
      default:
        return {
          icon: '❌',
          suggestion: 'Please try refreshing the page or contact support if the problem persists.',
          showSimilar: true,
        }
    }
  }

  const { icon, suggestion, showSimilar } = getErrorDetails()

  // Find similar projects if requested (simple fuzzy matching)
  const similarProjects =
    showSimilar && slug
      ? projects
          .filter(p => p.slug.includes(slug.toLowerCase()) || slug.toLowerCase().includes(p.slug))
          .slice(0, 3)
      : []

  return (
    <div className="section">
      <div
        className={`p-6 border rounded font-mono text-center ${
          glitchMode
            ? 'border-glitchRed bg-neutral text-glitchRed animate-glitch'
            : 'border-red-400 bg-neutral text-red-300'
        }`}
        role="alert"
        aria-live="assertive"
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h1 className="text-2xl font-display mb-4">Project Not Found</h1>
        <p className="mb-4 text-base">{error}</p>
        <p className="mb-6 text-sm opacity-80">{suggestion}</p>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center flex-wrap mb-6">
          <NavLink to="/projects" className="btn-primary">
            Browse All Projects
          </NavLink>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary bg-secondary hover:bg-glitchBlue"
          >
            Refresh Page
          </button>
        </div>

        {/* Similar projects suggestions */}
        {similarProjects.length > 0 && (
          <div className="border-t border-current pt-4 mt-4">
            <p className="text-sm mb-3 opacity-80">Similar projects you might be interested in:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {similarProjects.map(project => (
                <NavLink
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  className="text-xs px-3 py-1 border border-current rounded hover:bg-current hover:text-neutral transition-colors"
                >
                  {project.emoji} {project.title}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Safe image component with error handling
const SafeImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  if (imageError) {
    return (
      <div
        className={`bg-neutral border border-neutral-600 flex items-center justify-center text-center p-8 ${className}`}
        role="img"
        aria-label="Image failed to load"
      >
        <div>
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm opacity-60">Image could not be loaded</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div
          className={`absolute inset-0 bg-neutral animate-pulse flex items-center justify-center ${className}`}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="text-xs opacity-60">Loading image...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt || 'Project image'}
        role="img"
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true)
          setImageLoading(false)
        }}
      />
    </div>
  )
}

const ProjectDetail = () => {
  const { slug } = useParams()
  const { project, error, errorType } = useProjectData(slug)
  const { glitchMode } = useTheme()

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
    <div className="section">
      <h1 className="text-4xl font-display mb-4">
        {project.emoji ?? ''} {project.title}
      </h1>

      {/* Tags with safe rendering */}
      {project.tags && project.tags.length > 0 && (
        <div className="mb-6">
          <div className="text-sm flex gap-3 flex-wrap">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-neutral border border-glitchGreen text-glitchGreen rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Safe image rendering */}
      {project.image && (
        <SafeImage
          src={project.image}
          alt={`${project.title} screenshot`}
          className={`mb-6 rounded ${glitchMode ? 'glitch-box' : 'clean-box'}`}
        />
      )}

      {/* Safe embed rendering */}
      {project.embed && (
        <ErrorBoundary
          fallback={({ error, reset }) => (
            <div className="mb-6 p-4 border border-red-400 rounded text-center">
              <div className="text-sm mb-2">Failed to load embed</div>
              <button onClick={reset} className="btn-primary text-xs">
                Retry
              </button>
            </div>
          )}
          onError={(error, errorInfo) => {
            errorMonitor.logReactError(error, errorInfo, 'ProjectDetail', 'high')
          }}
        >
          {renderEmbed({ url: project.embed, title: project.title, glitchMode })}
        </ErrorBoundary>
      )}

      {/* Project Description */}
      <TerminalCard
        title={project.slug}
        summary={project.content || project.summary}
        footer={project.external ? 'External Link' : 'Internal Project'}
        href={project.href}
        external={project.external}
        color={project.color}
      />

      {/* Back Link */}
      <div className="mt-6">
        <NavLink to="/projects" className="link-hover text-glitchBlue text-sm">
          ← Back to Projects
        </NavLink>
      </div>
    </div>
  )
}

export default ProjectDetail
