"use client"

import { useLocale, useTranslations } from "next-intl"

import { ErrorView } from "@/components/error-view"
import { FallbackActions } from "@/components/fallback-actions"

export default function LocaleErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useLocale()
  const t = useTranslations("Fallback")

  return (
    <ErrorView
      eyebrow={t("eyebrow")}
      title={t("errorTitle")}
      description={t("errorDescription")}
      action={
        <FallbackActions
          homeHref={`/${locale}`}
          homeLabel={t("homeLabel")}
          retryLabel={t("retryLabel")}
          onRetry={reset}
        />
      }
    />
  )
}
