import Link from "next/link"
import { Button } from "./ui/button"

export function Header() {
  return (
    <div className="flex justify-between p-6">
      <div className="space-x-6">
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
      <div>
        <Button asChild variant="secondary">
          <Link href="mailto:julien.f2004@icloud.com">Contact</Link>
        </Button>
      </div>
    </div>
  )
}
