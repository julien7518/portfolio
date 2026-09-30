import { cn } from "@/lib/utils"

export default function SubTitle({
  label,
  number,
  className,
}: {
  label: string
  number: number
  className?: string
}) {
  return (
    <div className={cn("md:col-span-2", className)}>
      <div className="flex items-baseline justify-between pt-4">
        <h1 className="font-heading text-5xl italic md:text-8xl">{label}</h1>
        <span className="font-mono text-xs text-muted-foreground">
          [{number}]
        </span>
      </div>
      <hr className="bg-muted" />
    </div>
  )
}
