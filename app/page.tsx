import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-around p-6">
      <div>
        <h1 className="mb-10 font-heading text-9xl">Julien Fernandes</h1>
        <div className="flex justify-around">
          <Button>Hello</Button>
        </div>
      </div>
    </div>
  )
}
