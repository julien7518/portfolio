import ProjectCard from "@/components/project-card"

export default function Projects() {
  return (
    <div className="h-full w-full px-6">
      <div className="mb-4">
        <div className="flex place-items-end justify-end space-x-2 align-bottom md:-mb-3">
          <div className="mb-4.5 hidden font-mono text-xs md:block">
            <p className="text-end">9</p>
            <p className="text-end">software</p>
          </div>
          <h1 className={`text-end font-heading text-5xl md:text-9xl`}>
            Projects
          </h1>
        </div>
        <hr className="bg-muted" />
      </div>
      <div>
        <ProjectCard
          name="My project"
          description="This is the subtitle"
          link="/projects"
          content="Here is the longer description"
          live="/live"
          category={["UI/UX", "SaaS", "Portfolio", "Hardware"]}
          imageAlt="a"
          imageSrc="/favicon.svg"
        />
      </div>
    </div>
  )
}
