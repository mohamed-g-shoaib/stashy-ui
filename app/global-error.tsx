"use client"

import "./globals.css"

import { Geist, Geist_Mono } from "next/font/google"
import * as React from "react"
import { ErrorView } from "@/components/error-view"
import { FallbackActions } from "@/components/fallback-actions"

import { cn } from "@/lib/utils"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [locale, setLocale] = React.useState<"en" | "ar">("en")

  React.useEffect(() => {
    setLocale(document.documentElement.lang === "ar" ? "ar" : "en")
  }, [])

  const copy =
    locale === "ar"
      ? {
          homeLabel: "العودة للرئيسية",
          retryLabel: "أعد المحاولة",
          homeHref: "/ar",
        }
      : {
          homeLabel: "Go home",
          retryLabel: "Try again",
          homeHref: "/",
        }

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={cn("antialiased", "font-sans", geist.variable, fontMono.variable)}
        suppressHydrationWarning
      >
        <ErrorView
          title={locale === "ar" ? "حدث خطأ ما." : "Something went wrong."}
          description={
            locale === "ar"
              ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
              : "An unexpected error occurred. Please try again."
          }
          action={
            <FallbackActions
              homeHref={copy.homeHref}
              homeLabel={copy.homeLabel}
              retryLabel={copy.retryLabel}
              onRetry={reset}
            />
          }
        />
      </body>
    </html>
  )
}
