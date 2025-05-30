import { TerminalCard, LazyGrid } from '@/components'
import { projects } from '@/data/projects'
import { useResponsiveItemsPerPage } from '@/hooks'

const Projects = () => {
  const itemsPerPage = useResponsiveItemsPerPage()

  return (
    <div className="section">
      <h1 className="text-3xl font-display mb-6">/projects</h1>
      <LazyGrid
        items={projects}
        itemsPerPage={itemsPerPage}
        className="space-y-4"
        animateIn
        animationDelayStep={100}
        renderItem={project => (
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
        )}
      />
    </div>
  )
}

export default Projects
