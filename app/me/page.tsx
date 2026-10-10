import { AnimatedTitle } from "@/components/ui/animated-title"
import { PortraitSection } from "@/components/me/portrait-section"
import { IdentityCard } from "@/components/me/identity-card"
import { VersionTimeline } from "@/components/me/version-timeline"
import { Workbench } from "@/components/me/workbench"
import { getAge } from "@/lib/utils"

export default function Me() {
  return (
    <div className="h-full w-full px-6">
      <AnimatedTitle
        title="Who I am"
        subtitle1={`${getAge()}y`}
        subtitle2="Student"
        reverse
      />
      <PortraitSection />
      <IdentityCard />
      <VersionTimeline />
      <Workbench />
    </div>
  )
}
