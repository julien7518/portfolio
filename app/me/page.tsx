import { AnimatedTitle } from "@/components/ui/animated-title"
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
      <div></div>
    </div>
  )
}
