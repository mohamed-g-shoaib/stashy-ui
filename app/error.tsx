"use client"

import * as React from "react"

import { ErrorView } from "@/components/error-view"
import { Button } from "@/components/ui/button"
import { getDirectionForLocale } from "@/lib/i18n"

export default function RouteErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [locale, setLocale] = React.useState<"en" | "ar">("en")

  React.useEffect(() => {
    setLocale(document.documentElement.lang === "ar" ? "ar" : "en")
  }, [])

  const direction = getDirectionForLocale(locale)

  return (
    <ErrorView
      locale={locale}
      direction={direction}
      title={locale === "ar" ? "حدث خطأ ما." : "Something went wrong."}
      description={
        locale === "ar"
          ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
          : "An unexpected error occurred. Please try again."
      }
      action={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-3"
            onClick={reset}
          >
            {locale === "ar" ? "أعد المحاولة" : "Try again"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-3"
            onClick={() => {
              window.location.assign(`/${locale}`)
            }}
          >
            {locale === "ar" ? "العودة للرئيسية" : "Go home"}
          </Button>
        </>
      }
    />
  )
}
