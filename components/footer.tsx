import { GitHub, Instagram, LinkedIn, SocialButton, X_Twitter } from "./logos"
import { identity, social, type SocialId } from "@/resources"

const logos: Record<SocialId, () => React.JSX.Element> = {
  github: GitHub,
  linkedin: LinkedIn,
  instagram: Instagram,
  x: X_Twitter,
}

export function Footer() {
  return (
    <footer className="flex w-full flex-col-reverse items-center justify-between p-6 md:flex-row">
      <div className="font-mono text-xs">
        {identity.name} &copy; {new Date().getFullYear()}
      </div>
      <div className="mb-4 space-x-2 md:mb-0">
        {social.map((link) => {
          const Logo = logos[link.id]

          return (
            <SocialButton
              key={link.id}
              name={link.name}
              logo={<Logo />}
              link={link.href}
            />
          )
        })}
      </div>
    </footer>
  )
}
