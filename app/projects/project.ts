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
      "An invoicing dashboard for freelancers: clients, invoice statuses, and the revenue you still have to declare.",
    date: "Feb 2026",
    role: "Solo build — product design & fullstack",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Supabase",
    ],
    long_description: [
      "Quinvo is an invoicing web app for freelancers and small studios, built to give a quick read on where money stands without opening an accounting tool. Invoices are created in a standard format, carry a status (paid, pending, overdue), and calculate their own totals and taxes. Clients live in their own table, so recurring work is a matter of picking a name rather than retyping an address on every invoice.",
      "The dashboard is the part I care most about: pending invoices, revenue generated and revenue still to declare, with monthly and quarterly charts underneath. Revenue to declare in particular is a distinctly French administrative concern, and it is the number a freelancer opens the app to check. The stack is Next.js, React and TypeScript with Tailwind and shadcn/ui on the front, Supabase for both the database and email-based authentication, deployed on Vercel.",
    ],
    link: "/projects/quinvo",
    live: "https://quinvo-app.vercel.app",
    github: "https://github.com/julien7518/quinvo",
    categories: ["SaaS", "UI/UX", "React", "Next.js"],
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
    role: "Solo build — Swift CLI",
    stack: ["Swift", "Apple Foundation Models", "Git"],
    long_description: [
      "Most commit-message helpers send your diff to somebody's API. kaumite keeps the whole loop local: it reads the staged or unstaged changes and hands them to a model running through Apple's Foundation Models framework, so a diff never leaves the machine and nothing is downloaded first. It requires macOS 26 or later, Xcode 16 and Swift 6.4.",
      "The interface is a terminal tool with one job. Two commands, all and staged, cover the two cases. The output follows the Conventional Commits specification, can be written in English, French or German, and a dry-run mode prints the message without committing so you can read it first. There is a no-color flag for CI environments, and the whole thing ships as a Swift package you build with SPM and drop in your PATH.",
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
      "A browser scene editor where ray-marched primitives are added, selected, moved and coloured live.",
    date: "Dec 2025",
    role: "Solo build — graphics & interface",
    stack: ["WebGPU", "WGSL", "JavaScript", "Tailwind CSS"],
    long_description: [
      "ShaderLab is an interactive 3D scene editor that runs in the browser, rendered with WebGPU and WGSL ray marching. You build a scene out of primitives — spheres, boxes and the rest — then select them, move them with a three-axis translation gizmo and change their colour from a side panel. The viewport updates immediately: nothing is recompiled and nothing reloads between two edits.",
      "Selection is the part worth explaining. On a ray-marched image there is no mesh to ray cast against, so objects are picked with an ID-based render pass that writes a unique identifier per object and reads the pixel back under the cursor. The project is also my way of learning the WebGPU pipeline properly rather than through a wrapper: buffers, bind groups, render passes, multi-pass rendering and error handling all appear here because the editor needs them. The honest gaps are listed in the repository — the picking pass still flickers, auto-rotate jitters slightly, and CSG needs redoing.",
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
      "A research assistant that indexes your PDFs and answers with citations, without uploading anything.",
    date: "Jan 2026",
    role: "Solo build — fullstack",
    stack: [
      "Next.js",
      "React",
      "MLC WebLLM",
      "Transformers.js",
      "PDF.js",
      "Tailwind CSS",
    ],
    long_description: [
      "PaperLM turns a pile of papers into a literature review without uploading a single page. Drop PDFs into the sidebar and the pipeline runs client-side: PDF.js extracts the text, it is chunked and each chunk is embedded with all-MiniLM-L6-v2 through Transformers.js, then the passages relevant to your question are retrieved and handed to Llama 3.2 1B running locally through MLC WebLLM. Answers stream back grounded in those passages and cite the documents they came from, and a single button produces a longer structured review instead of a chat reply.",
      "The constraint is the interesting part. Because inference runs on the consumer GPU through WebGPU, the real limits are model size, context length and how fast the browser streams tokens — not server throughput. Choosing a 1B model, chunking aggressively enough to keep retrieval relevant, and accepting a first-token delay were the three decisions that shaped the rest.",
    ],
    link: "/projects/paperlm",
    live: "https://paperlm.vercel.app",
    github: "https://github.com/julien7518/paperlm",
    categories: ["AI", "React", "Next.js"],
    imageSrc: "/paperlm/paperlm.png",
    imageAlt: "PaperLM research assistant interface",
    gallery: ["/paperlm/paperlm.png"],
  },
]

export const portfolioProjects: ProjectType[] = [
  {
    name: "Arno Cauchois",
    subtitle: "Arno Cauchois' portfolio",
    description:
      "A photographer's portfolio built around a full-bleed gallery, with a light and a dark theme.",
    date: "Mar 2024",
    role: "Built for a photographer friend",
    long_description: [
      "A portfolio for Arno Cauchois, a photographer, whose work needed a site that got out of the way of the images. The gallery is the page: a full-bleed grid you scroll, with no chrome competing for attention, and a name, a role and a single contact route laid over it.",
      "The part I spent time on was the theme. Dark and light are both first-class rather than one being an inverted afterthought, which for a photographer means the images stay consistent instead of shifting contrast when someone switches their system theme. Built in 2024 and still running.",
    ],
    live: "https://arnocauchois.com",
    categories: ["UI/UX"],
    imageSrc: "/arno-cauchois/light.png",
    imageAlt: "Light theme of the Arno Cauchois portfolio",
    gallery: ["/arno-cauchois/light.png", "/arno-cauchois/dark.png"],
    galleryAlts: ["Light theme", "Dark theme"],
  },
  {
    name: "Elsa Fernandes",
    subtitle: "Elsa Fernandes' portfolio",
    description:
      "A wedding photographer's portfolio, built as a collaboration.",
    date: "Jun 2026",
    role: "Built for my cousin",
    stack: ["Next.js", "TypeScript", "React"],
    long_description: [
      "Clic Émotion is the portfolio of Elsa Fernandes, a wedding photographer, and it was a collaboration rather than a personal exercise: she brought the work and the structure, I built it with her. A Next.js app in TypeScript and React, opening on the gallery and running through an about page, packages and a contact form.",
      "The constraint was her medium. Wedding work is shot on film, much of it on Kodak Portra 400, so the images arrive already graded and the site has to stay out of their way — no heavy filters, no aggressive crops, and a colour treatment that does not fight the photography. Her own words on the front page, construire ensemble et donner forme à vos envies, set the tone the whole build follows.",
    ],
    live: "https://elsa-fernandes.vercel.app",
    github: "https://github.com/julien7518/elsa-fernandes",
    categories: ["React", "Next.js", "UI/UX"],
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
    role: "Solo build — machine learning & WebGPU",
    stack: ["Next.js", "TinyGrad", "WebGPU"],
    long_description: [
      "MNISTify makes digit recognition something you can play with instead of read about. You draw a number on a canvas and the prediction updates as you draw, with a live chart of what the network is actually outputting so you can watch the confidence move rather than just read a label.",
      "Two architectures are available and can be compared side by side: a multilayer perceptron, which is fast and light, and a convolutional network, which is more accurate. You can inspect the model's input and compare inference time between them. Training runs on the MNIST dataset through TinyGrad; inference then runs in the browser on WebGPU, so the whole thing costs nothing to host and stays responsive while you draw.",
    ],
    github: "https://github.com/julien7518/mnistify",
    live: "https://mnistify.vercel.app",
    categories: ["AI", "React", "Next.js", "WebGPU"],
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
    role: "Solo build — hardware",
    categories: ["Hardware"],
    long_description: [
      "CreaTruck is a remote-controlled car built end to end rather than assembled from a kit: the chassis, the motor control, the radio link between the handset and the board, and the onboard recording of every run.",
      "It came out of wanting to follow the truck while it drives instead of chasing it with the controller. The documentation of the build lives in a public Notion page, and it is the project where the constraints are physical — soldering, interference, and a battery that has to last the length of a track.",
    ],
    live: "https://hma-creatruck-recorder.notion.site/MDF-CreaTruck-294ba826d55e801e8914ed33b52a0e70",
    imageAlt: "Photography of the CreaTruck",
  },
  {
    name: "CreaDart",
    subtitle:
      "A straightforward web application coded in a single day to track our class’s dart tournament",
    description:
      "A one-morning build to score a class tournament, kept because it was actually used.",
    date: "Apr 2026",
    role: "Solo build — one-day side project",
    stack: ["Next.js", "TypeScript", "Neon"],
    long_description: [
      "CreaDart was built in a morning to solve one very small problem: our class wanted to keep score of a darts tournament without arguing about it. Players are added, matches are created between them, results go in, and a leaderboard and a stats page do the arithmetic.",
      "It is deliberately minimal — Next.js with TypeScript and a Neon Postgres database is the whole stack. The repository is explicit that this is not a production-ready application and never had ambitions to be; it is a fun side project that worked on the first try and is still the one we use on tournament nights.",
    ],
    github: "https://github.com/julien7518/creadart",
    live: "https://creadart.vercel.app",
    categories: ["React", "Next.js"],
    imageAlt: "Home page of CreaDart",
  },
  {
    name: "Tempestra",
    subtitle: "Easily generate weather forecast PDFs",
    description:
      "Generates a printable weather forecast as a PDF, with the right icon for each day.",
    date: "Dec 2024",
    role: "Solo build — fullstack",
    stack: ["Next.js", "jsPDF", "Météo Concept API"],
    long_description: [
      "Tempestra turns a weather forecast into a document you can keep. A Next.js server route fetches a daily forecast from the Météo Concept API and assembles a PDF with jsPDF, embedding the right weather icon for each day, and the page previews the result inline or hands it over as a download.",
      "Right now the location is pinned to Paris by its INSEE code, which is a deliberate consequence of the free API tier being limited to fifty calls a day. Choosing an arbitrary city is on the roadmap alongside landscape orientation, a °C/°F switch and saved preferences. The icons are drawn as PNGs rather than pulled from an icon font, so they print consistently instead of arriving as glyphs.",
    ],
    github: "https://github.com/julien7518/tempestra",
    live: "https://tempestra-pdf.vercel.app",
    categories: ["React", "Next.js"],
    imageAlt: "Screenshot of the Tempestra website",
  },
  {
    name: "BeloteScore",
    subtitle: "Point calculator for french belote card game",
    description:
      "A score calculator for belote: pick the contract, declare the result, get the points.",
    date: "Nov 2024",
    role: "Solo build — side project",
    stack: ["Next.js", "TypeScript"],
    long_description: [
      "Belote has a scoring table complicated enough to be worth automating. You pick the suit and the figure of the contract — atout, tout atout, contré or surcontré — say whether the belotes went in, and whether the defending team scored a capot or a dedans, and the calculator returns the points for both sides.",
      "It is a small tool that solves one annoyance: doing that arithmetic by hand at the end of a game, when the result matters and nobody wants to be the one who got it wrong.",
    ],
    github: "https://github.com/julien7518/belote-score",
    live: "https://belote-score.vercel.app",
    categories: ["React", "Next.js"],
    imageAlt: "Screenshot of the BeloteScore website",
  },
]

export const allProjects: ProjectType[] = [
  ...selectedProjects,
  ...portfolioProjects,
  ...littleProjects,
]
