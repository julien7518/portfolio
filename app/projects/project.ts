type category =
  | "UI/UX"
  | "SaaS"
  | "Python"
  | "Swift"
  | "React"
  | "Next.js"
  | "AI"
  | "3D"
  | "WebGPU"
  | "Hardware"

export interface ProjectType {
  name: string
  subtitle?: string
  description?: string
  date: string
  long_description?: string[]
  role?: string
  stack?: string[]
  outcome?: { value: string; label: string }[]
  link?: string
  live?: string
  github?: string
  categories?: category[]
  imageSrc?: string
  imageAlt?: string
  gallery?: string[]
  galleryAlts?: string[]
}

export const selectedProjects: ProjectType[] = [
  {
    name: "Quinvo",
    subtitle: "Simplified invoicing for French entrepreneurs",
    description:
      "An invoicing web app built around the French legal format, with clients, filtering and PDF export.",
    date: "Feb 2026",
    long_description: [
      "Invoicing tools in France tend to be either enterprise payroll platforms or generic PDF generators that leave the legal formatting to you. Quinvo takes the middle road: a small, fast web app where a freelancer or small studio writes an invoice in the format the administration expects, keeps a list of clients, and exports a clean PDF.",
      "The interface was designed mobile-first, because most invoices get created or corrected from a phone between two meetings. Clients, invoice lines and settings each have their own screen, and the dashboard keeps the filters and the list on a single surface so nothing is hidden behind a navigation step.",
    ],
    link: "/projects/quinvo",
    live: "https://quinvo-app.vercel.app",
    github: "https://github.com/julien7518/quinvo",
    categories: ["SaaS", "UI/UX", "React"],
    imageSrc: "/quinvo/dashboard.png",
    imageAlt: "Quinvo dashboard with the invoice list and filters",
    gallery: [
      "/quinvo/landing.png",
      "/quinvo/dashboard.png",
      "/quinvo/invoiceslist.png",
      "/quinvo/clients.png",
      "/quinvo/clientdetails.png",
      "/quinvo/invoice.png",
      "/quinvo/filter.png",
      "/quinvo/settings.png",
      "/quinvo/darkmode.png",
    ],
    galleryAlts: [
      "Landing page",
      "Dashboard with the invoice list and filters",
      "Invoice list",
      "Clients list",
      "Client details",
      "Invoice editor",
      "Filters",
      "Settings",
      "Dark mode",
    ],
  },
  {
    name: "kaumite",
    subtitle:
      "Generate Git commit messages locally with Apple Foundation Models",
    description:
      "A terminal tool that writes commit messages with an on-device model, so no code leaves the machine.",
    date: "Aug 2026",
    long_description: [
      "Most commit-message helpers send your diff to a third-party API. kaumite keeps the whole loop local: it reads the staged diff and hands it to a model running through the Apple Foundation Models framework, so a diff never leaves the machine.",
      "It is a terminal tool with a single job. Point it at the current repository, review the message it proposes, and amend or keep it. Because the model runs on device, the interesting constraint is latency and context length rather than throughput, which shaped most of the interface decisions.",
    ],
    link: "/projects/kaumite",
    github: "https://github.com/julien7518/kaumite",
    categories: ["Swift"],
    imageAlt: "Terminal interface of kaumite",
  },
  {
    name: "ShaderLab",
    subtitle: "A real-time 3D editor using WebGPU",
    description:
      "A browser-based shader editor that compiles and previews WGSL directly on the GPU.",
    date: "Dec 2025",
    long_description: [
      "ShaderLab is a shader editor that runs entirely in the browser. Fragments and vertex stages written in WGSL are compiled through WebGPU and rendered on a live quad, so the feedback loop is immediate instead of a build-and-deploy cycle.",
      "The editor exists because the tooling around GPU programming is still awkward. Having the compile, the preview and the code side by side makes it practical to iterate on a shader, and it is a good excuse to learn the WebGPU pipeline end to end: buffers, bind groups, render passes and error handling.",
    ],
    link: "/projects/shaderlab",
    github: "https://github.com/julien7518/shaderlab",
    live: "https://webgpu-shaderlab.vercel.app",
    categories: ["3D", "WebGPU"],
    imageSrc: "/shaderlab/shaderlab.png",
    imageAlt: "ShaderLab editor with the live shader preview",
    gallery: ["/shaderlab/shaderlab.png"],
  },
  {
    name: "PaperLM",
    subtitle: "A privacy-first AI research assistant that runs in your browser",
    description:
      "A research assistant that queries and summarises papers client-side, with no server holding your library.",
    date: "Jan 2026",
    long_description: [
      "Reading a stack of papers usually means uploading them somewhere. PaperLM inverts that: the documents, the index and the queries stay in the browser, and the assistant answers from a local corpus rather than a shared one.",
      "The whole pipeline runs client-side, from parsing the PDF to retrieving the relevant passages to generating the summary. That constraint is the point of the project, and it is also what makes the hard parts interesting: keeping the index small enough to stay responsive, and making a retrieval step that is good enough to be worth reading the answer.",
    ],
    link: "/projects/paperlm",
    live: "https://paperlm.vercel.app",
    github: "https://github.com/julien7518/paperlm",
    categories: ["AI", "React"],
    imageSrc: "/paperlm/paperlm.png",
    imageAlt: "PaperLM research assistant interface",
    gallery: ["/paperlm/paperlm.png"],
  },
]

export const portfolioProjects: ProjectType[] = [
  {
    name: "Arno Cauchois",
    subtitle: "Arno Cauchois' portfolio",
    description: "A personal portfolio with a full light and dark theme.",
    date: "Mar 2024",
    live: "https://arnocauchois.com",
    imageSrc: "/arno-cauchois/light.png",
    imageAlt: "Light theme of the Arno Cauchois portfolio",
    gallery: ["/arno-cauchois/light.png", "/arno-cauchois/dark.png"],
    galleryAlts: ["Light theme", "Dark theme"],
  },
  {
    name: "Elsa Fernandes",
    subtitle: "Elsa Fernandes' portfolio",
    description: "A personal portfolio built as a collaboration exercise.",
    date: "Jun 2026",
    live: "https://elsa-fernandes.vercel.app",
    github: "https://github.com/julien7518/elsa-fernandes",
    categories: ["React"],
    imageAlt: "Home page of the Elsa Fernandes portfolio",
  },
]

export const littleProjects: ProjectType[] = [
  {
    name: "MNISTify",
    subtitle: "Real-time handwritten digit recognition, powered by WebGPU",
    description:
      "Draw a digit and see it classified live, with inference running on the GPU.",
    date: "Nov 2025",
    github: "https://github.com/julien7518/mnistify",
    live: "https://mnistify.vercel.app",
    categories: ["React", "WebGPU"],
    imageSrc: "/mnistify/mnistify.png",
    imageAlt: "MNISTify predicting a handwritten digit",
    gallery: ["/mnistify/mnistify.png"],
  },
  {
    name: "CreaTruck",
    subtitle:
      "A remote-controlled car built from the chassis to the electronics",
    description:
      "A complete hardware project: chassis, motor control, radio link and recording.",
    date: "Feb 2026",
    live: "https://hma-creatruck-recorder.notion.site/MDF-CreaTruck-294ba826d55e801e8914ed33b52a0e70",
    categories: ["Hardware"],
    imageAlt: "Photography of the CreaTruck",
  },
  {
    name: "CreaDart",
    subtitle:
      "A straightforward web application coded in a single day to track our class’s dart tournament",
    description:
      "A one-day build to score a class tournament, then kept because it was actually used.",
    date: "Apr 2026",
    github: "https://github.com/julien7518/creadart",
    live: "https://creadart.vercel.app",
    categories: ["React"],
    imageAlt: "Home page of CreaDart",
  },
  {
    name: "Tempestra",
    subtitle: "Easily generate weather forecast PDFs",
    description:
      "Turns a place and a date range into a printable forecast sheet.",
    date: "Dec 2024",
    github: "https://github.com/julien7518/tempestra",
    live: "https://tempestra-pdf.vercel.app",
    categories: ["React"],
    imageAlt: "Screenshot of the Tempestra website",
  },
  {
    name: "BeloteScore",
    subtitle: "Point calculator for french belote card game",
    description:
      "Keeps the running score of a belote game and does the arithmetic.",
    date: "Nov 2024",
    github: "https://github.com/julien7518/belote-score",
    live: "https://belote-score.vercel.app",
    categories: ["React"],
    imageAlt: "Screenshot of the BeloteScore website",
  },
]

export const allProjects: ProjectType[] = [
  ...selectedProjects,
  ...portfolioProjects,
  ...littleProjects,
]
