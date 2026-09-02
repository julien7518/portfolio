type category =
  "UI/UX" | "SaaS" | "Python" | "Swift" | "React" | "AI" | "3D" | "Hardware"

export interface ProjectType {
  name: string
  subtitle?: string
  description: string
  date: string
  long_description?: string
  link?: string
  live?: string
  github?: string
  categories?: category[]
  imageSrc?: string
  imageAlt?: string
  gallery?: string[]
  reverse?: boolean
  minHeight?: number
  imageProportion?: "1/2" | "1/3" | "1/4"
}

export const selectedProjects: ProjectType[] = [
  {
    name: "Quinvo",
    subtitle: "Simplified invoicing for French entrepreneurs",
    date: "Feb 2026",
    description: "",
    live: "https://quinvo-app.vercel.app",
    link: "/projects/quinvo",
    github: "https://github.com/julien7518/quinvo",
    categories: ["SaaS", "UI/UX", "React"],
    imageAlt: "Screenshot of the Quinvo user dashboard",
  },
  {
    name: "kaumite",
    subtitle:
      "Generate Git commit messages locally with Apple Foundation Models",
    date: "Aug 2026",
    description: "",
    link: "/projects/kaumite",
    github: "https://github.com/julien7518/kaumite",
    categories: ["Swift"],
    imageAlt: "TUI screenshot",
  },
  {
    name: "ShaderLab",
    subtitle: "A real-time 3D editor using WebGPU",
    date: "Dec 2025",
    description: "",
    link: "/projects/shaderlab",
    github: "https://github.com/julien7518/shaderlab",
    live: "https://webgpu-shaderlab.vercel.app",
    imageAlt: "Screenshot of the project",
  },
  {
    name: "PaperLM",
    subtitle: "A privacy-first AI research assistant that runs in your browser",
    date: "Jan 2026",
    description: "",
    link: "projects/paperlm",
    live: "https://paperlm.vercel.app",
    github: "https://github.com/julien7518/paperlm",
    categories: ["AI", "React"],
    imageAlt: "Screenshot of the PaperLM interface",
  },
]

export const portfolioProjects: ProjectType[] = [
  {
    name: "Arno Cauchois",
    subtitle: "Arno Cauchois' portfolio",
    date: "Mar 2024",
    description: "",
    live: "https://arnocauchois.com",
    imageAlt: "Screenshot of the portfolio",
  },
  {
    name: "Elsa Fernandes",
    subtitle: "Elsa Fernandes' portfolio",
    date: "Jun 2026",
    description: "",
    live: "https://elsa-fernandes.vercel.app",
    github: "https://github.com/julien7518/elsa-fernandes",
    categories: ["React"],
    imageAlt: "Screenshot of the home page",
  },
]

export const littleProjects: ProjectType[] = [
  {
    name: "MNISTify",
    subtitle: "Real-time handwritten digit recognition, powered by WebGPU",
    date: "Nov 2025",
    description: "",
    github: "https://github.com/julien7518/mnistify",
    live: "https://mnistify.vercel.app",
    imageAlt: "Screenshot of a prediction",
    categories: ["React"],
  },
  {
    name: "CreaTruck",
    subtitle:
      "A remote-controlled car built from the chassis to the electronics",
    date: "Feb 2026",
    description: "",
    live: "https://hma-creatruck-recorder.notion.site/MDF-CreaTruck-294ba826d55e801e8914ed33b52a0e70",
    imageAlt: "Photography of the CreaTruck",
    categories: ["Hardware"],
  },
  {
    name: "CreaDart",
    subtitle:
      "A straightforward web application was coded in a single day to track our class’s dart tournament",
    date: "Apr 2026",
    description: "",
    github: "https://github.com/julien7518/creadart",
    live: "https://creadart.vercel.app",
    imageAlt: "Screenshot of the homepage",
    categories: ["React"],
  },
  {
    name: "Tempestra",
    subtitle: "Easily generate weather forecast PDFs",
    date: "Dec 2024",
    description: "",
    github: "https://github.com/julien7518/tempestra",
    live: "https://tempestra-pdf.vercel.app",
    imageAlt: "Screenshot of the website",
    categories: ["React"],
  },
  {
    name: "BeloteScore",
    subtitle: "Point calculator for french belote card game",
    date: "Nov 2024",
    description: "",
    github: "https://github.com/julien7518/belote-score",
    live: "https://belote-score.vercel.app",
    imageAlt: "Screenshot of the website",
    categories: ["React"],
  },
]
