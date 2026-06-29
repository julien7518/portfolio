import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Cursor } from "@/components/cursor"
import { cn } from "@/lib/utils"
import { Metadata } from "next"

const instrumentSerifHeading = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
})

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
        fontMono.variable,
        "font-sans",
        geist.variable,
        instrumentSerifHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Cursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
