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
    <Button asChild variant="link" className="px-0">
      <Link href={link}>
        {label} {Icon ? <Icon /> : null}
      </Link>
    </Button>
  )
}
