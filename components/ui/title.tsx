import { cn } from "@/lib/utils"

interface TitleProps {
  title: string
  subtitle1: string
  subtitle2: string
  reverse?: boolean
}

export function Title({
  title,
  subtitle1,
  subtitle2,
  reverse = false,
}: TitleProps) {
  return (
    <div className="mb-4">
      <div
        className={cn(
          "flex place-items-end justify-end space-x-2 align-bottom md:-mb-3",
          reverse ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div className="mx-2.5 mb-4.5 hidden font-mono text-xs md:block">
          <p className={reverse ? "text-start" : "text-end"}>{subtitle1}</p>
          <p className={reverse ? "text-start" : "text-end"}>{subtitle2}</p>
        </div>
        <h1 className="text-end font-heading text-5xl md:text-9xl">{title}</h1>
      </div>
      <hr className="bg-muted" />
    </div>
  )
}
