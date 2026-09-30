import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Cursor } from "@/components/cursor"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const geist = Geist({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
})

const instrumentSerifHeading = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Julien Fernandes",
    template: "%s | Julien Fernandes",
  },
  description: "Engineering Student based in Paris, France.",
  keywords: [
    "julien",
    "fernandes",
    "developer",
    "engineer",
    "portfolio",
    "paris",
  ],
  authors: [{ name: "Julien Fernandes" }],
  openGraph: {
    title: "Julien Fernandes",
    description: "Engineering Student based in Paris, France.",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geist.variable,
        geistMono.variable,
        instrumentSerifHeading.variable
      )}
    >
      <Analytics />
      <body className="flex min-h-svh flex-col font-sans">
        <ThemeProvider>
          <SmoothScroll />
          <Cursor />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
