"use client"

import { useMemo, useRef } from "react"

import SubTitle from "@/components/ui/subtitle"
import { Reveal } from "@/components/ui/reveal"
import { IndexRow, type IndexRowProject } from "./index-row"

export type ProjectGroup = {
  label: string
  projects: IndexRowProject[]
}

export function ProjectIndex({ groups }: { groups: ProjectGroup[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const flat = useMemo(
    () => groups.flatMap((group) => group.projects),
    [groups]
  )

  const sections = useMemo(
    () =>
      groups.map((group) => ({
        label: group.label,
        rows: group.projects.map((project) => ({
          project,
          position: flat.indexOf(project) + 1,
        })),
      })),
    [groups, flat]
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return

    const links = Array.from(
      containerRef.current?.querySelectorAll<HTMLAnchorElement>("h3 a") ?? []
    )
    if (!links.length) return

    const current = links.indexOf(document.activeElement as HTMLAnchorElement)
    if (current === -1) return

    event.preventDefault()

    const next =
      event.key === "ArrowDown"
        ? Math.min(current + 1, links.length - 1)
        : Math.max(current - 1, 0)

    links[next]?.focus()
  }

  return (
    <div ref={containerRef} onKeyDown={onKeyDown} className="w-full pb-24">
      {sections.map((section, index) => (
        <section key={section.label} className="mt-16 first:mt-6">
          <SubTitle label={section.label} number={section.rows.length} />

          <Reveal stagger={0.07} y={22} duration={0.8} className="mt-2">
            {section.rows.map(({ project, position }) => (
              <IndexRow
                key={project.slug}
                project={project}
                position={position}
              />
            ))}
          </Reveal>

          {index === sections.length - 1 ? null : (
            <div className="h-16 md:h-24" aria-hidden />
          )}
        </section>
      ))}
    </div>
  )
}
