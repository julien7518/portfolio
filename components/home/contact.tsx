import { ArrowUpRight, MapPin, Phone } from "lucide-react"

import { Reveal } from "@/components/ui/reveal"
import { contact, location } from "@/resources"

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-6 px-6 pb-18 md:pb-26">
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

          <div className="mt-10 flex flex-col gap-6 border-t border-border pt-6 md:flex-row md:items-end md:justify-between">
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

            <div className="flex flex-col gap-3 font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase md:items-end">
              <a
                href={contact.phoneHref}
                data-cursor-pointer
                className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-muted-foreground"
              >
                <Phone aria-hidden className="size-3" />
                {contact.phone}
              </a>
              <p className="inline-flex items-center gap-2">
                <MapPin aria-hidden className="size-3" />
                {location.note}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
