"use client"

import { ParisClock } from "@/components/paris-clock"

export default function Page() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="flex flex-col items-center p-6">
        <div className="mt-30 w-full">
          <div className="flex w-full justify-between font-mono text-sm">
            <div>Paris, France</div>
            <ParisClock />
          </div>
          <h1 className="font-heading text-8xl md:text-9xl">
            Julien Fernandes
          </h1>
        </div>
      </div>
    </div>
  )
}
