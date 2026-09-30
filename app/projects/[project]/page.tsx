import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import LinkButton from "@/components/ui/link-button"
import { Title } from "@/components/ui/title"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { Reveal } from "@/components/ui/reveal"
import { Gallery } from "@/components/projects/gallery"
import { NextProject } from "@/components/projects/next-project"
import {
  ProjectPreviewProvider,
  type PreviewTarget,
} from "@/components/projects/preview"
import { GitHub } from "@/components/logos"
import { selectedProjects, type ProjectType } from "../project"
import { slugify } from "@/lib/utils"

const detailable = selectedProjects.filter((project) => project.link)

function toPreviewTarget(project: ProjectType): PreviewTarget {
  return {
    slug: slugify(project.name),
    name: project.name,
    subtitle: project.subtitle,
    date: project.date,
    live: project.live,
    imageSrc: project.imageSrc,
    imageAlt: project.imageAlt,
    categories: project.categories,
  }
}

export function generateStaticParams() {
  return detailable.map((project) => ({ project: slugify(project.name) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ project: string }>
}): Promise<Metadata> {
  const { project: slug } = await params
  const project = detailable.find((item) => slugify(item.name) === slug)

  if (!project) return {}

  const description =
    project.description ??
    `${project.name} — ${project.subtitle ?? ""}. A project by Julien Fernandes.`

  return {
    title: project.name,
    description,
    openGraph: {
      title: `${project.name} — Julien Fernandes`,
      description,
      type: "article",
      images: project.imageSrc ? [{ url: project.imageSrc }] : undefined,
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project: string }>
}) {
  const { project: slug } = await params
  const index = detailable.findIndex((item) => slugify(item.name) === slug)

  if (index === -1) notFound()

  const project = detailable[index]
  const total = detailable.length
  const position = String(index + 1).padStart(2, "0")

  const nextProject = detailable[(index + 1) % total]
  const previousProject = detailable[(index - 1 + total) % total]

  const paragraphs = project.long_description ?? []
  const gallery =
    project.gallery ?? (project.imageSrc ? [project.imageSrc] : [])
  const alts =
    project.galleryAlts ??
    gallery.map((src) =>
      src === project.imageSrc ? project.imageAlt : undefined
    )

  return (
    <ProjectPreviewProvider>
      <ScrollProgress />

      <div className="w-full px-6">
        <Title
          title={project.name}
          subtitle1={project.date}
          subtitle2={`${position} / ${String(total).padStart(2, "0")}`}
          reverse
        />

        <div className="grid gap-12 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:gap-20">
          <aside className="md:sticky md:top-24 md:self-start">
            <dl className="space-y-6 font-mono text-xs">
              <div>
                <dt className="tracking-widest text-muted-foreground uppercase">
                  Year
                </dt>
                <dd className="mt-1">{project.date}</dd>
              </div>

              {project.role ? (
                <div>
                  <dt className="tracking-widest text-muted-foreground uppercase">
                    Role
                  </dt>
                  <dd className="mt-1">{project.role}</dd>
                </div>
              ) : null}

              {project.stack?.length ? (
                <div>
                  <dt className="tracking-widest text-muted-foreground uppercase">
                    Stack
                  </dt>
                  <dd className="mt-1 space-y-1">
                    {project.stack.map((item) => (
                      <span key={item} className="block">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}

              {project.categories?.length ? (
                <div>
                  <dt className="tracking-widest text-muted-foreground uppercase">
                    Fields
                  </dt>
                  <dd className="mt-1 space-y-1">
                    {project.categories.map((item) => (
                      <span key={item} className="block">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}

              {project.live || project.github ? (
                <div className="space-y-3 border-t border-border pt-6">
                  {project.live ? (
                    <LinkButton
                      labelFull="Visit live"
                      labelShort="Live"
                      link={project.live}
                      target="_blank"
                      icon={ArrowUpRight}
                      iconPosition="start"
                    />
                  ) : null}
                  {project.github ? (
                    <LinkButton
                      labelFull="Source code"
                      labelShort="Source"
                      link={project.github}
                      target="_blank"
                      icon={GitHub}
                      iconPosition="start"
                    />
                  ) : null}
                </div>
              ) : null}
            </dl>
          </aside>

          <article className="min-w-0">
            {project.description ? (
              <Reveal>
                <p className="font-heading text-3xl leading-tight text-balance italic md:text-5xl">
                  {project.description}
                </p>
              </Reveal>
            ) : null}

            {paragraphs.length ? (
              <Reveal className="mt-10">
                <div className="max-w-prose space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            ) : null}

            <Gallery images={gallery} alts={alts} name={project.name} />

            {project.outcome?.length ? (
              <Reveal className="mt-16 border-t border-border pt-8 md:mt-24">
                <div className="grid gap-8 sm:grid-cols-3">
                  {project.outcome.map((item) => (
                    <div key={item.label}>
                      <p className="font-heading text-5xl leading-none md:text-6xl">
                        {item.value}
                      </p>
                      <p className="mt-2 font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </article>
        </div>

        <nav className="mt-16 border-t border-border md:mt-24">
          <NextProject
            project={toPreviewTarget(previousProject)}
            href={`/projects/${slugify(previousProject.name)}`}
            external={false}
            variant="previous"
          />
          <div className="border-t border-border">
            <NextProject
              project={toPreviewTarget(nextProject)}
              href={`/projects/${slugify(nextProject.name)}`}
              external={false}
              variant="next"
            />
          </div>
        </nav>
      </div>
    </ProjectPreviewProvider>
  )
}
