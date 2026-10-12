import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/metadata"
import { identity } from "@/resources"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description: `${identity.name}’ resume — engineering student and creative technologist based in Paris, working across web, native apps, embedded systems and AI.`,
  path: "/resume",
})

export default function Resume() {
  return (
    <div className="flex h-screen w-full flex-col items-center">
      <embed
        src="/julien-fernandes-resume.pdf"
        type="application/pdf"
        className="h-full w-full"
      />
      <div className="m-6">
        <Button asChild>
          <a
            href="/julien-fernandes-resume.pdf"
            download="julien-fernandes-resume.pdf"
          >
            Download
          </a>
        </Button>
      </div>
    </div>
  )
}
