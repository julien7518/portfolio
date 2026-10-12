import { notFound } from "next/navigation"
import { allProjects } from "../project"
import { slugify } from "@/lib/utils"
import { renderOgImage } from "@/lib/og-image"

export const alt = "Project by Julien Fernandes"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ project: string }>
}) {
  const { project: slug } = await params
  const project = allProjects.find((item) => slugify(item.name) === slug)
  if (!project) notFound()
  return renderOgImage(project)
}
