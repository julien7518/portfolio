type category =
  "UI/UX" | "SaaS" | "Portfolio" | "Python" | "Swift" | "React" | "AI"

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

export const projects: ProjectType[] = [
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
    name: "Mellow",
    subtitle: "Beautiful, smooth, always-on-top music player for macOS",
    date: "Jul 2026",
    description: "",
    link: "/projects/mellow",
    github: "https://github.com/julien7518/mellow",
    categories: ["UI/UX", "Swift"],
    imageAlt: "Screenshot of the Mellow player in action",
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
    live: "https://paperlm.vercel.app",
    github: "https://github.com/julien7518/paperlm",
    categories: ["AI", "React"],
    imageAlt: "Screenshot of the PaperLM interface",
  },
  {
    name: "MNISTify",
    subtitle: "Real-time handwritten digit recognition, powered by WebGPU",
    date: "Nov 2025",
    description: "",
    link: "/projects/mnistify",
    github: "https://github.com/julien7518/mnistify",
    live: "https://mnistify.vercel.app",
    imageAlt: "Screenshot of a prediction",
    categories: ["React"],
  },
  {
    name: "Arno Cauchois",
    subtitle: "Arno Cauchois' portfolio",
    date: "Mar 2024",
    description: "",
    live: "https://arnocauchois.com",
    categories: ["Portfolio"],
    imageAlt: "Screenshot of the portfolio",
  },
  {
    name: "Elsa Fernandes",
    subtitle: "Elsa Fernandes' portfolio",
    date: "Jun 2026",
    description: "",
    live: "https://elsa-fernandes.vercel.app",
    github: "https://github.com/julien7518/elsa-fernandes",
    categories: ["Portfolio"],
    imageAlt: "Screenshot of the home page",
  },
]
