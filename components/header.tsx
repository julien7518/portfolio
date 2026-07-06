import Link from "next/link"
import { Button } from "./ui/button"

export function Header() {
  return (
    <div className="flex justify-between p-4 md:p-6">
      <div className="space-x-4 md:space-x-6">
        <Link href="/" className="font-heading">
          JF
        </Link>

        <Button asChild variant="link" className="px-0">
          <Link href="/projects">Projects</Link>
        </Button>

        <Button asChild variant="link" className="px-0">
          <Link href="/me">Me</Link>
        </Button>
      </div>
      <div className="space-x-2">
        <Button asChild variant="tertiary" className="px-4">
          <Link href="/resume">CV</Link>
        </Button>
        <Button asChild variant="default">
          <Link href="mailto:julien.f2004@icloud.com">Contact</Link>
        </Button>
      </div>
    </div>
  )
}
