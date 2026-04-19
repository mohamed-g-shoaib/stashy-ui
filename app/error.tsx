"use client"

import { useParams } from "next/navigation"

import { ErrorView } from "@/components/error-view"
import { FallbackActions } from "@/components/fallback-actions"

const MESSAGES = {
  en: {
    homeLabel: "Go home",
    retryLabel: "Try again",
  },
  ar: {
    homeLabel: "العودة للرئيسية",
    retryLabel: "أعد المحاولة",
  },
} as const

export default function RouteErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams<{ locale?: string }>()
  const locale = params.locale === "ar" ? "ar" : "en"
  const copy = MESSAGES[locale]

  return (
    <ErrorView
      title={locale === "ar" ? "حدث خطأ ما." : "Something went wrong."}
      description={
        locale === "ar"
          ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
          : "An unexpected error occurred. Please try again."
      }
      action={
        <FallbackActions
          homeHref={`/${locale}`}
          homeLabel={copy.homeLabel}
          retryLabel={copy.retryLabel}
          onRetry={reset}
        />
      }
    />
  )
}
