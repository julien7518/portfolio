"use client"

import { useEffect, useState } from "react"

function getParisTime() {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date())
}

export function ParisClock() {
  const [time, setTime] = useState(getParisTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getParisTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <div>{time}</div>
}
