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
  categories?: string[]
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
  const hasFrames = project.frames.length > 0

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

    router.push(project.href)
  }

  return (
    <div
      ref={rowRef}
      id={`project-${project.slug}`}
      data-reveal-item
      data-cursor-pointer
      onMouseEnter={() => {
        if (hasFrames) show(project)
      }}
      onMouseLeave={hide}
      onClick={navigate}
      className="group/row relative border-b border-border focus-within:outline-none"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-foreground transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-focus-within/row:scale-x-100 group-hover/row:scale-x-100"
      />

      <span
        aria-hidden
        className="absolute inset-y-0 left-0 z-20 w-0.75 origin-center scale-y-0 bg-primary transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-focus-within/row:scale-y-100 group-hover/row:scale-y-100"
      />

      <div className="relative z-10 flex flex-col gap-3 py-6 pr-2 pl-4 transition-colors duration-200 group-focus-within/row:text-background group-hover/row:text-background md:flex-row md:items-baseline md:gap-8 md:py-9 md:pl-6">
        <span className="pointer-events-none w-8 shrink-0 font-mono text-xs tabular-nums">
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-4xl leading-none tracking-tight transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-focus-within/row:translate-x-2 group-hover/row:translate-x-2 md:text-6xl xl:text-7xl">
            <Link
              href={project.href}
              onFocus={() => {
                if (!hasFrames) return

                show(project)
                rowRef.current?.scrollIntoView({
                  block: "nearest",
                  behavior: "smooth",
                })
              }}
              onBlur={hide}
              className="rounded-none focus-visible:outline-none"
            >
              {project.name}
            </Link>
          </h3>

          {project.subtitle ? (
            <p className="mt-2 max-w-prose text-sm text-muted-foreground transition-colors duration-200 group-focus-within/row:text-background/70 group-hover/row:text-background/70 md:text-base">
              {project.subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex items-baseline justify-between gap-6 transition-colors delay-[340ms] duration-200 group-focus-within/row:text-background group-hover/row:text-background md:shrink-0 md:flex-col md:items-end md:gap-1.5 md:text-right">
          {project.categories?.length ? (
            <span className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase transition-colors duration-200 group-focus-within/row:text-background/60 group-hover/row:text-background/60">
              {project.categories.join(" · ")}
            </span>
          ) : null}
          <span className="font-mono text-xs tabular-nums md:text-[0.625rem]">
            {project.date}
          </span>
          <span className="pointer-events-none flex size-6 shrink-0 items-center justify-center self-end bg-primary text-primary-foreground transition-all duration-500 group-focus-within/row:scale-100 group-hover/row:translate-x-0 group-hover/row:scale-100 md:size-7 md:-translate-x-2 md:scale-75">
            <ArrowUpRight aria-hidden className="size-4 md:size-5" />
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-end gap-4 pb-5 pl-4 md:hidden">
        {project.frames[0] ? (
          <div className="pointer-events-none relative aspect-5/3 w-36 overflow-hidden bg-muted">
            <Image
              src={project.frames[0]}
              alt={project.imageAlt ?? ""}
              fill
              sizes="144px"
              className="scale-[1.08] object-cover"
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
            className="pointer-events-auto ml-auto inline-flex items-center gap-2 font-mono text-[0.625rem] tracking-widest uppercase"
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
