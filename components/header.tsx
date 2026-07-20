"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import LinkButton from "./ui/link-button"

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="flex justify-between p-4 md:p-6">
      <div className="space-x-4 md:space-x-6">
        <Link href="/" className="font-heading">
          JF
        </Link>

        <LinkButton labelFull="Projects" link="/projects" />

        <LinkButton labelFull="Me" link="/me" />
      </div>
      <div className="space-x-2">
        <Button
          variant="ghost"
          className="hidden px-2 md:inline"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? "light" : "dark"}
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
