import { TerminalCard } from '@/components'
import { projects } from '@/data/projects'

const Projects = () => {
  return (
    <div className="section">
      <h1 className="text-3xl font-display mb-6">/projects</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {projects.map(project => (
          <TerminalCard
            key={project.slug}
            title={`${project.emoji ?? ''} ${project.title}`}
            summary={project.summary}
            tags={project.tags}
            footer={project.footer}
            href={project.href ?? `/projects/${project.slug}`}
            external={project.external}
            color={project.color}
          />
        ))}
      </div>
    </div>
  )
}

export default Projects
