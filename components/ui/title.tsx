import { cn } from "@/lib/utils"

interface TitleProps {
  title: string
  subtitle1: string
  subtitle2: string
  reverse?: boolean
  className?: string
}

export function Title({
  title,
  subtitle1,
  subtitle2,
  reverse = false,
  className,
}: TitleProps) {
  return (
    <div className={cn("mb-6 bg-background pt-3", className)}>
      <div
        className={cn(
          "flex place-items-end justify-end space-x-2 align-bottom",
          reverse ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div className="mx-2.5 mb-4.5 hidden font-mono text-xs md:block">
          <p className={reverse ? "text-start" : "text-end"}>{subtitle1}</p>
          <p className={reverse ? "text-start" : "text-end"}>{subtitle2}</p>
        </div>
        <h1 className="text-end font-heading text-6xl md:text-9xl">{title}</h1>
      </div>
      <hr className="bg-muted md:-mt-3" />
    </div>
  )
}
