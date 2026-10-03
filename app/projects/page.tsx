import type { Metadata } from "next"

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
  toIndexRow,
} from "./project"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work, client portfolios and side projects — invoicing, WebGPU, on-device AI and hardware.",
}

export default function Projects() {
  const groups: ProjectGroup[] = [
    { label: "Selected work", projects: selectedProjects.map(toIndexRow) },
    { label: "Portfolios", projects: portfolioProjects.map(toIndexRow) },
    { label: "Other little things", projects: littleProjects.map(toIndexRow) },
  ]

  const count = groups.reduce(
    (total, group) => total + group.projects.length,
    0
  )

  return (
    <ProjectPreviewProvider>
      <div className="relative">
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
