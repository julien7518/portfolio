"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import LinkButton from "./ui/link-button"
import { MdLightMode, MdDarkMode } from "react-icons/md"

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()

  const detail = pathname?.match(/^\/projects\/([^/]+)\/?$/)
  const projectsHref = detail
    ? `/projects#project-${detail[1]}`
    : "/projects"

  return (
    <div className="flex justify-between p-4 md:p-6">
      <div className="space-x-4 md:space-x-6">
        <Link href="/" className="font-heading">
          JF
        </Link>

        <LinkButton labelFull="Projects" link={projectsHref} />

        <LinkButton labelFull="Me" link="/me" />
      </div>
      <div className="space-x-2">
        <Button
          variant="ghost"
          className="hidden p-2 md:inline"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          data-cursor-pointer
          asChild
        >
          {resolvedTheme === "dark" ? <MdLightMode /> : <MdDarkMode />}
        </Button>
        <Button asChild variant="secondary" className="px-4">
          <Link href="/resume">CV</Link>
        </Button>
        <Button asChild>
          <Link href="mailto:julien.f2004@icloud.com">Contact</Link>
        </Button>
      </div>
    </div>
  )
}
