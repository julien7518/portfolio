"use client"

import { useRef, type MouseEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowUpRight, MoveRight } from "lucide-react"

import { GitHub } from "@/components/logos"
import { usePreview, type PreviewTarget } from "./preview"

export type IndexRowProject = PreviewTarget & {
  date?: string
  github?: string
  href: string
  external: boolean
}

export function IndexRow({
  project,
  position,
}: {
  project: IndexRowProject
  position: number
}) {
  const router = useRouter()
  const { show, hide } = usePreview()
  const rowRef = useRef<HTMLDivElement>(null)

  const number = String(position).padStart(2, "0")

  const externalProps = project.external
    ? { target: "_blank" as const, rel: "noreferrer noopener" }
    : {}

  const navigate = (event: MouseEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    if (event.defaultPrevented || event.button !== 0) return
    if ((event.target as HTMLElement).closest("a")) return

    const selection = window.getSelection()
    const hasSelection =
      selection?.type === "Range" &&
      selection.anchorNode !== null &&
      rowRef.current?.contains(selection.anchorNode)

    if (hasSelection) return

    if (project.external) {
      window.open(project.href, "_blank", "noopener,noreferrer")
    } else {
      router.push(project.href)
    }
  }

  return (
    <div
      ref={rowRef}
      data-reveal-item
      data-cursor-pointer
      onMouseEnter={() => show(project)}
      onMouseLeave={hide}
      onClick={navigate}
      className="group/row relative border-b border-border transition-colors duration-500 focus-within:bg-primary/[0.035] hover:bg-primary/[0.035]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px origin-left scale-x-0 bg-primary transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-focus-within/row:scale-x-100 group-hover/row:scale-x-100"
      />

      <div className="relative z-30 flex flex-col gap-3 px-0.5 py-6 md:flex-row md:items-baseline md:gap-8 md:px-2 md:py-9">
        <span className="pointer-events-none w-8 shrink-0 font-mono text-xs text-muted-foreground tabular-nums transition-colors duration-500 group-hover/row:text-primary">
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-4xl leading-none tracking-tight transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-focus-within/row:translate-x-2 group-hover/row:translate-x-2 md:text-6xl xl:text-7xl">
            <Link
              href={project.href}
              {...externalProps}
              onFocus={() => {
                show(project)
                rowRef.current?.scrollIntoView({
                  block: "nearest",
                  behavior: "smooth",
                })
              }}
              onBlur={hide}
              className="rounded-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
            >
              {project.name}
            </Link>
          </h3>

          {project.subtitle ? (
            <p className="mt-2 max-w-prose text-sm text-muted-foreground md:text-base">
              {project.subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex items-baseline justify-between gap-6 md:shrink-0 md:flex-col md:items-end md:gap-1.5 md:text-right">
          {project.categories?.length ? (
            <span className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
              {project.categories.join(" · ")}
            </span>
          ) : null}
          <span className="font-mono text-xs text-muted-foreground md:text-[0.625rem]">
            {project.date}
          </span>
          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 self-end text-primary opacity-0 transition-all duration-500 group-focus-within/row:opacity-100 group-hover/row:translate-x-0 group-hover/row:opacity-100 md:size-5 md:-translate-x-1"
          />
        </div>
      </div>

      <div className="relative z-40 flex items-center justify-end gap-4 px-0.5 pb-5 md:hidden">
        {project.imageSrc ? (
          <div className="pointer-events-none relative aspect-[5/3] w-40 overflow-hidden bg-muted">
            <Image
              src={project.imageSrc}
              alt={project.imageAlt ?? ""}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        ) : null}
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor-pointer
            aria-label={`${project.name} GitHub repository`}
            className="pointer-events-auto ml-auto inline-flex items-center gap-2 font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase"
          >
            <span className="size-3.5 [&>svg]:size-3.5">{GitHub()}</span>
            Source
            <MoveRight aria-hidden className="size-3" />
          </a>
        ) : null}
      </div>
    </div>
  )
}
