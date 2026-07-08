import ProjectCard from "@/components/project-card"
import { projects } from "./project"
import { Title } from "@/components/ui/title"

export default function Projects() {
  return (
    <div className="h-full w-full px-6">
      <Title
        title="Projects"
        subtitle1={`[${projects.length}]`}
        subtitle2="2024-2026"
        className="sticky top-0 z-10"
      />
      <div className="space-y-10 px-0.5">
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            name={project.name}
            subtitle={project.subtitle}
            description={project.description}
            link={project.link}
            live={project.live}
            github={project.github}
            categories={project.categories}
            imageSrc={project.imageSrc}
            imageAlt={project.imageAlt}
            reverse={project.reverse}
            minHeight={project.minHeight}
            imageProportion={project.imageProportion}
          />
        ))}
      </div>
    </div>
  )
}
