import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

let registered = false

if (typeof window !== "undefined" && !registered) {
  registered = true
  gsap.registerPlugin(ScrollTrigger)
}

gsap.defaults({ ease: "power3.out", duration: 0.7 })

export { gsap, ScrollTrigger }
