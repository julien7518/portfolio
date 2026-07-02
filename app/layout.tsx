import { Instrument_Serif } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { GeistPixelGrid } from "geist/font/pixel"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Cursor } from "@/components/cursor"
import { Footer } from "@/components/footer"

const instrumentSerifHeading = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: {
    default: "Julien Fernandes",
    template: "%s | Julien Fernandes",
  },
  description: "Engineering student, developer and athlete.",
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
        GeistSans.variable,
        GeistMono.variable,
        GeistPixelGrid.className,
        instrumentSerifHeading.variable
      )}
    >
      <Analytics />
      <body>
        <Cursor />
        <ThemeProvider>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
