"use client"

import { useEffect, useState } from "react"

export function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isOverClickable, setIsOverClickable] = useState(false)

  useEffect(() => {
    const isClickableElement = (element: Element | null) => {
      if (!element) return false

      return Boolean(
        element.closest(
          "a, button, [role='button'], [data-cursor-pointer], input, textarea, select, label, .cursor-pointer"
        )
      )
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      const element = document.elementFromPoint(e.clientX, e.clientY)
      setIsOverClickable(isClickableElement(element))
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const size = isOverClickable ? "35px" : "20px"

  return (
    <div
      className="pointer-events-none fixed -translate-2/4 bg-background mix-blend-difference transition-[width,height] duration-200 ease-in-out dark:bg-foreground"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: size,
        height: size,
      }}
    />
  )
}
