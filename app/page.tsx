import type { Metadata } from "next"

import { Hero } from "@/components/home/hero"
import { Manifesto } from "@/components/home/manifesto"
import { SelectedWork } from "@/components/home/selected-work"
import { Contact } from "@/components/home/contact"
import { ProjectPreviewProvider } from "@/components/projects/preview"
import { allProjects, selectedProjects, toIndexRow } from "./projects/project"

export const metadata: Metadata = {
  description:
    "Julien Fernandes — creative technologist in Paris, France. Web interfaces, native apps, embedded firmware and trained models.",
}

export default function Page() {
  const featured = selectedProjects
    .filter((project) => project.featured)
    .map(toIndexRow)

  return (
    <ProjectPreviewProvider>
      <Hero />
      <Manifesto />
      <SelectedWork projects={featured} total={allProjects.length} />
      <Contact />
    </ProjectPreviewProvider>
  )
}
