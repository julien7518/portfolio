import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/ui/reveal"
import { contact, location } from "@/resources"

export function Contact() {
  return (
    <section className="px-6 pb-24 md:pb-32">
      <Reveal y={26}>
        <div className="border-t border-border pt-8 md:pt-12">
          <p className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
            {contact.availability}
          </p>

          <h2 className="mt-6 font-heading text-[19vw] leading-[0.82] tracking-[-0.03em] md:text-[15vw] lg:text-[12vw]">
            Let’s work
            <br />
            together
            <span className="text-primary">.</span>
          </h2>

          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-baseline md:justify-between">
            <a
              href={contact.mailto()}
              data-cursor-pointer
              className="group inline-flex items-baseline gap-3 self-start text-lg tracking-tight transition-colors duration-300 hover:text-muted-foreground md:text-2xl"
            >
              {contact.email}
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 self-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <p className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
              {location.note}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
