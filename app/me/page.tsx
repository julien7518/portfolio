import type { Metadata } from "next"
import { AnimatedTitle } from "@/components/ui/animated-title"
import { AboutExperience } from "@/components/me/about-experience"
import { PortraitSection } from "@/components/me/portrait-section"
import { BeyondScreen } from "@/components/me/beyond-screen"
import { VersionTimeline } from "@/components/me/version-timeline"
import { CurrentBuild } from "@/components/me/current-build"
import { getAge } from "@/lib/utils"
import styles from "@/components/me/about.module.css"

export const metadata: Metadata = {
  title: "Who I am",
  description:
    "Take apart, understand, rebuild. The experiences shaping Julien Fernandes’ work across software, electronics, AI and design.",
}

export default function Me() {
  return (
    <div className={`h-full w-full px-6 ${styles.page}`}>
      <AnimatedTitle
        title="Who I am"
        subtitle1={`${getAge()}y`}
        subtitle2="Student"
        reverse
        className="motion-reduce:animate-none"
      />
      <AboutExperience>
        <PortraitSection />
        <BeyondScreen />
        <VersionTimeline />
        <CurrentBuild />
      </AboutExperience>
    </div>
  )
}
