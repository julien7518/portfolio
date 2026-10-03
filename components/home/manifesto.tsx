import { Reveal } from "@/components/ui/reveal"

export function Manifesto() {
  return (
    <section className="px-6 py-28 md:py-40">
      <div className="grid gap-10 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:gap-20">
        <p className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
          Approach
        </p>

        <Reveal y={32}>
          <p className="max-w-4xl font-heading text-4xl leading-[1.08] text-balance italic md:text-6xl lg:text-7xl">
            I build where disciplines overlap —{" "}
            <span className="text-primary not-italic">
              interfaces, code, hardware and intelligence.
            </span>{" "}
            The best technology does not ask to be understood. It simply feels
            right.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
