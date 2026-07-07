import { Button } from "./ui/button"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface LinkButtonProps {
  label: string
  link: string
  icon?: LucideIcon
}

export default function LinkButton({
  label,
  link,
  icon: Icon,
}: LinkButtonProps) {
  return (
    <Button asChild variant="link" className="group px-0">
      <Link
        href={link}
        className="inline-flex items-center gap-2 no-underline! hover:no-underline!"
      >
        <span className="relative inline-block">
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-current" />
          <span className="relative block overflow-hidden">
            <span className="block transition-transform duration-300 group-hover:-translate-y-full">
              {label}
            </span>
            <span className="absolute top-full left-0 block transition-transform duration-300 group-hover:-translate-y-full">
              {label}
            </span>
          </span>
        </span>

        {Icon ? <Icon className="size-4" /> : null}
      </Link>
    </Button>
  )
}
