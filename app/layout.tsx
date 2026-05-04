import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import { cn } from "@/lib/utils"

const googleSansFlex = localFont({
  src: "../public/fonts/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf",
  variable: "--font-sans",
  display: "swap",
  weight: "400 700",
})

export const metadata: Metadata = {
  title: "Stashy UI",
  description: "Mobile UI sandbox for designing the Stashy app in code.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Stashy UI",
    description: "Mobile UI sandbox for designing the Stashy app in code.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stashy UI",
    description: "Mobile UI sandbox for designing the Stashy app in code.",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={cn("antialiased", "font-sans", googleSansFlex.variable)}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
