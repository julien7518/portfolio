import type { Metadata } from "next"

import { AmbientCanvas } from "@/components/ambient-canvas"
import { AnimatedTitle } from "@/components/ui/animated-title"
import {
  ProjectIndex,
  type ProjectGroup,
} from "@/components/projects/project-index"
import { ProjectPreviewProvider } from "@/components/projects/preview"
import {
  littleProjects,
  portfolioProjects,
  selectedProjects,
  type ProjectType,
} from "./project"
import { slugify } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work, client portfolios and side projects — invoicing, WebGPU, on-device AI and hardware.",
}

function toRow(project: ProjectType) {
  return {
    slug: slugify(project.name),
    name: project.name,
    subtitle: project.subtitle,
    date: project.date,
    github: project.github,
    live: project.live,
    imageSrc: project.imageSrc,
    imageAlt: project.imageAlt,
    categories: project.categories,
    href: project.link ?? project.live ?? "#",
    external: !project.link,
  }
}

export default function Projects() {
  const groups: ProjectGroup[] = [
    { label: "Selected work", projects: selectedProjects.map(toRow) },
    { label: "Portfolios", projects: portfolioProjects.map(toRow) },
    { label: "Other little things", projects: littleProjects.map(toRow) },
  ]

  const total = groups.reduce(
    (count, group) => count + group.projects.length,
    0
  )

  return (
    <ProjectPreviewProvider>
      <div className="relative">
        <AmbientCanvas />

        <div className="relative z-10 w-full px-6">
          <AnimatedTitle
            title="Projects"
            subtitle1={`[${total}]`}
            subtitle2="2024 — 2026"
            className="sticky top-0 z-10"
          />

          <p className="mt-4 hidden max-w-prose font-mono text-[0.625rem] leading-relaxed tracking-widest text-muted-foreground uppercase lg:block">
            Hover a row to open the project live in a floating window · use{" "}
            <span className="text-primary">↑ ↓</span> to move between them
          </p>

          <ProjectIndex groups={groups} />
        </div>
      </div>
    </ProjectPreviewProvider>
  )
}
