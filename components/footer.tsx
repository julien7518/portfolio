import { GitHub, Instagram, LinkedIn, SocialButton, X_Twitter } from "./logos"

export function Footer() {
  return (
    <footer className="flex w-full flex-col-reverse items-center justify-between p-6 md:flex-row">
      <div className="font-mono text-xs">
        Julien Fernandes &copy; {new Date().getFullYear()}
      </div>
      <div className="mb-4 space-x-2 md:mb-0">
        <SocialButton
          name="GitHub"
          logo={GitHub()}
          link="https://github.com/julien7518"
        />
        <SocialButton
          name="LinkedIn"
          logo={LinkedIn()}
          link="https://www.linkedin.com/in/julien-fernandes-61a957370/"
        />
        <SocialButton
          name="Instagram"
          logo={Instagram()}
          link="https://www.instagram.com/julien_75018/"
        />
        <SocialButton
          name="X"
          logo={X_Twitter()}
          link="https://x.com/julien_7518"
        />
      </div>
      {/*<div className="-mt-6 flex translate-y-1/4 items-center justify-center overflow-hidden bg-linear-to-b from-foreground from-0% to-foreground/0 to-85% bg-clip-text text-center font-heading text-[6rem] leading-none text-transparent select-none sm:block sm:h-36 md:h-48 md:text-[14rem] lg:h-56 lg:text-[20rem]">
        Contact me
      </div>*/}
    </footer>
  )
}
