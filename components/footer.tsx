export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden sm:h-36 md:h-48 lg:h-56">
      <div className="font-geist-pixel-grid">
        &copy; {new Date().getFullYear()} Julien Fernandes
      </div>
      <div className="-mt-6 flex translate-y-1/4 items-center justify-center overflow-hidden bg-linear-to-b from-foreground from-0% to-foreground/0 to-85% bg-clip-text text-center font-heading text-[6rem] leading-none text-transparent select-none sm:block sm:h-36 md:h-48 md:text-[14rem] lg:h-56 lg:text-[20rem]">
        Contact me
      </div>
    </footer>
  )
}
