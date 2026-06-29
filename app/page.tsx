import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6 md:items-center md:justify-around">
      <div>
        <h1 className="mb-10 font-heading text-8xl md:text-9xl">
          Julien <br /> Fernandes
        </h1>
        <div className="flex justify-around">
          <Button>Hello</Button>
        </div>
      </div>
    </div>
  )
}
