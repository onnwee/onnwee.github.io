import { TerminalCard } from '@/components'
import { projects } from '@/data/projects'
import { useTheme } from '@/hooks'
import { renderEmbed } from '@/utils/renderEmbed'
import { Link, useParams } from 'react-router-dom'

const ProjectDetail = () => {
  const { slug } = useParams()
  const project = projects.find(p => p.slug === slug)
  const { glitchMode } = useTheme()

  if (!project) {
    return (
      <div className="section">
        <h1 className="text-2xl font-display mb-4">404: Project not found</h1>
        <Link to="/projects" className="link-hover text-accent">
          ← Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="section">
      <h1 className="text-4xl font-display mb-4">
        {project.emoji ?? ''} {project.title}
      </h1>

      {/* Tags */}
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

      {/* Optional Image */}
      {project.image && (
        <img
          className={`mb-6 rounded ${glitchMode ? 'glitch-box' : 'clean-box'}`}
          src={project.image}
          alt={`${project.title} screenshot`}
        />
      )}

      {/* Optional Embed */}
      {project.embed && renderEmbed({ url: project.embed, title: project.title, glitchMode })}

      {/* Project Description */}
      <TerminalCard
        title={project.slug}
        summary={project.content}
        footer={project.external ? 'External Link' : 'Internal Project'}
        href={project.href}
        external={project.external}
        color={project.color}
      />

      {/* Back Link */}
      <div className="mt-6">
        <Link to="/projects" className="link-hover text-glitchBlue text-sm">
          ← Back to Projects
        </Link>
      </div>
    </div>
  )
}

export default ProjectDetail
