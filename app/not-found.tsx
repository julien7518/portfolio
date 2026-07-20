import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="flex flex-col items-center p-6">
        <div className="mt-30 w-full">
          <h1 className="font-heading text-8xl md:text-9xl">
            You&apos;re lost ?
          </h1>
        </div>
        <div>
          <Button asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
