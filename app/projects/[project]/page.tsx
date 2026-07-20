import { notFound } from "next/navigation"
import { projects } from "../project"
import { Title } from "@/components/ui/title"
import { slugify } from "@/lib/utils"

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

  return (
    <div className="h-full w-full px-6">
      <Title
        title={project.name}
        subtitle1={project.date ?? ""}
        subtitle2={`[${project.categories?.join(", ")}]`}
        reverse
      />
    </div>
  )
}
