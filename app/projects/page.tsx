import ProjectCard from "@/components/project-card"
import { littleProjects, portfolioProjects, selectedProjects } from "./project"
import { AnimatedTitle } from "@/components/ui/animated-title"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import SubTitle from "@/components/ui/subtitle"

export default function Projects() {
  return (
    <div className="h-full w-full px-6">
      <AnimatedTitle
        title="Projects"
        subtitle1={`[${selectedProjects.length + littleProjects.length + portfolioProjects.length}]`}
        subtitle2="2024-2026"
        className="sticky top-0 z-10"
      />
      <div className="grid gap-10 px-0.5 md:grid-cols-2">
        {selectedProjects.map((project, index) => (
          <ScrollReveal key={project.name} delay={index * 200}>
            <ProjectCard
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
          </ScrollReveal>
        ))}
        <SubTitle label="Portfolios" number={portfolioProjects.length} />
        {portfolioProjects.map((project, index) => (
          <ScrollReveal key={project.name} delay={index * 200}>
            <ProjectCard
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
          </ScrollReveal>
        ))}
        <SubTitle label="Other little things" number={littleProjects.length} />
        {littleProjects.map((project, index) => (
          <ScrollReveal key={project.name} delay={index * 200}>
            <ProjectCard
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
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
