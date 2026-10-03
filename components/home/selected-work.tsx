import Link from "next/link"
import { MoveRight } from "lucide-react"

import { IndexRow, type IndexRowProject } from "@/components/projects/index-row"
import { Reveal } from "@/components/ui/reveal"

export function SelectedWork({
  projects,
}: {
  projects: IndexRowProject[]
  total: number
}) {
  return (
    <section className="px-6 pb-28 md:pb-40">
      <div className="flex items-baseline justify-between gap-6 border-b border-border pb-4">
        <h2 className="font-heading text-5xl italic md:text-8xl">
          Selected work
        </h2>

        <Link
          href="/projects"
          data-cursor-pointer
          className="group inline-flex shrink-0 items-center gap-2 font-mono text-[0.625rem] tracking-widest uppercase transition-colors duration-300 hover:text-muted-foreground"
        >
          See all projects
          <MoveRight
            aria-hidden
            className="size-3 transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <Reveal stagger={0.08} y={22} duration={0.8} className="mt-2">
        {projects.map((project, index) => (
          <IndexRow key={project.slug} project={project} position={index + 1} />
        ))}
      </Reveal>
    </section>
  )
}
