"use client"

import { usePathname } from "next/navigation"
import { Title } from "./title"
import { cn } from "@/lib/utils"

interface AnimatedTitleProps {
  title: string
  subtitle1: string
  subtitle2: string
  reverse?: boolean
  className?: string
}

export function AnimatedTitle({
  title,
  subtitle1,
  subtitle2,
  reverse = false,
  className,
}: AnimatedTitleProps) {
  const pathname = usePathname()

  return (
    <div
      key={pathname}
      className={cn(
        "animate-title-slide",
        reverse && "animate-title-slide-right",
        className
      )}
    >
      <Title
        title={title}
        subtitle1={subtitle1}
        subtitle2={subtitle2}
        reverse={reverse}
      />
    </div>
  )
}
