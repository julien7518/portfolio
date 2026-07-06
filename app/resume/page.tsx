import { Button } from "@/components/ui/button"

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
