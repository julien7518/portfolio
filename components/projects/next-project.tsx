"use client"

import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import { usePreview, type PreviewTarget } from "./preview"

export function NextProject({
  project,
  href,
  variant,
}: {
  project: PreviewTarget
  href: string
  variant: "next" | "previous"
}) {
  const { show, hide } = usePreview()

  const isNext = variant === "next"
  const Icon = isNext ? ArrowUpRight : ArrowLeft
  const direction = isNext
    ? "group-hover/next:translate-x-3 group-focus-visible/next:translate-x-3"
    : "group-hover/next:-translate-x-3 group-focus-visible/next:-translate-x-3"

  const reveal = isNext
    ? "group-hover/next:translate-x-0 group-hover/next:opacity-100 group-focus-visible/next:opacity-100 md:-translate-x-2"
    : "group-hover/next:translate-x-0 group-hover/next:opacity-100 group-focus-visible/next:opacity-100 md:translate-x-2"

  return (
    <Link
      href={href}
      onMouseEnter={() => show(project)}
      onMouseLeave={hide}
      onFocus={() => show(project)}
      onBlur={hide}
      data-cursor-pointer
      className="group/next relative block py-10 md:py-14"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-primary transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover/next:scale-x-100 group-focus-visible/next:scale-x-100"
      />

      <div className="flex items-baseline justify-between gap-6">
        <span className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
          {isNext ? "Next project" : "Previous project"}
        </span>
        <span className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
          {project.date}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-6">
        <h2
          className={`font-heading text-5xl leading-none transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:text-7xl xl:text-8xl ${direction}`}
        >
          {project.name}
        </h2>

        <Icon
          aria-hidden
          className={`size-8 shrink-0 text-primary opacity-0 transition-all duration-500 md:size-12 ${reveal}`}
        />
      </div>

      {project.subtitle ? (
        <p className="mt-3 max-w-prose text-sm text-muted-foreground md:text-base">
          {project.subtitle}
        </p>
      ) : null}
    </Link>
  )
}
