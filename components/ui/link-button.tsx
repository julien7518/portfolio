import { Button } from "./button"
import Link from "next/link"
import type { ComponentType, SVGProps } from "react"
import { HTMLAttributeAnchorTarget } from "react"
import { cn } from "@/lib/utils"

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

interface LinkButtonProps {
  className?: string
  labelFull: string
  labelShort?: string
  link: string
  target?: HTMLAttributeAnchorTarget
  icon?: IconComponent
  iconPosition?: "start" | "end"
}

export default function LinkButton({
  labelFull,
  labelShort,
  link,
  icon: Icon,
  target,
  iconPosition = "end",
  className,
}: LinkButtonProps) {
  const labelContent = (
    <>
      <span className="hidden md:flex">{labelFull}</span>
      <span className="flex md:hidden">{labelShort ?? labelFull}</span>
    </>
  )

  return (
    <Button asChild variant="link" className={cn("group px-0", className)}>
      <Link
        href={link}
        target={target}
        className="inline-flex items-center gap-2 no-underline! hover:no-underline!"
      >
        {Icon && iconPosition == "start" ? <Icon className="size-4" /> : null}

        <span className="relative inline-block">
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-current" />
          <span className="relative block overflow-hidden">
            <span className="block transition-transform duration-300 group-hover:-translate-y-full">
              {labelContent}
            </span>
            <span className="absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full">
              {labelContent}
            </span>
          </span>
        </span>

        {Icon && iconPosition == "end" ? <Icon className="size-4" /> : null}
      </Link>
    </Button>
  )
}
