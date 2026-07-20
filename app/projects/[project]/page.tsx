import { notFound } from "next/navigation"
import ProjectCard from "@/components/project-card"
import { projects } from "../project"

function slugify(name: string) {
  return name.toLowerCase()
}

export function generateStaticParams() {
  return projects
    .filter((project) => project.link)
    .map((project) => ({ project: slugify(project.name) }))
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project: string }>
}) {
  const { project: slug } = await params
  const project = projects.find((p) => slugify(p.name) === slug)

  if (!project) notFound()

  return <ProjectCard {...project} />
}
