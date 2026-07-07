import Link from "next/link"
import { Button } from "./ui/button"
import LinkButton from "./link-button"

export function Header() {
  return (
    <div className="flex justify-between p-4 md:p-6">
      <div className="space-x-4 md:space-x-6">
        <Link href="/" className="font-heading">
          JF
        </Link>

        <LinkButton label="Projects" link="/projects" />

        <LinkButton label="Me" link="/me" />
      </div>
      <div className="space-x-2">
        <Button asChild variant="tertiary" className="px-4">
          <Link href="/resume">CV</Link>
        </Button>
        <Button asChild>
          <Link href="mailto:julien.f2004@icloud.com">Contact</Link>
        </Button>
      </div>
    </div>
  )
}
