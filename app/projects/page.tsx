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
  const slug = slugify(project.name)

  return {
    slug,
    name: project.name,
    subtitle: project.subtitle,
    date: project.date,
    github: project.github,
    live: project.live,
    imageAlt: project.imageAlt,
    categories: project.categories,
    frames: project.gallery ?? (project.imageSrc ? [project.imageSrc] : []),
    href: `/projects/${slug}`,
  }
}

export default function Projects() {
  const groups: ProjectGroup[] = [
    { label: "Selected work", projects: selectedProjects.map(toRow) },
    { label: "Portfolios", projects: portfolioProjects.map(toRow) },
    { label: "Other little things", projects: littleProjects.map(toRow) },
  ]

  const count = groups.reduce(
    (total, group) => total + group.projects.length,
    0
  )

  return (
    <ProjectPreviewProvider>
      <div className="relative">
        <AmbientCanvas />

        <div className="relative z-10 w-full px-6">
          <AnimatedTitle
            title="Projects"
            subtitle1={`[${count}]`}
            subtitle2="2024 — 2026"
            className="sticky top-0 z-10"
          />

          <ProjectIndex groups={groups} />
        </div>
      </div>
    </ProjectPreviewProvider>
  )
}
