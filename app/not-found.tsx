import { headers } from "next/headers"

import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"
import { defaultLocale, isLocale } from "@/lib/i18n"

const MESSAGES = {
  en: {
    title: "Page not found.",
    description: "This route does not exist yet.",
    homeLabel: "Go home",
  },
  ar: {
    title: "الصفحة غير موجودة.",
    description: "هذا المسار غير موجود بعد.",
    homeLabel: "العودة للرئيسية",
  },
} as const

export default async function NotFound() {
  const requestHeaders = await headers()
  const headerLocale = requestHeaders.get("x-forge-locale") ?? undefined
  const locale = isLocale(headerLocale) ? headerLocale : defaultLocale
  const copy = MESSAGES[locale]

  return (
    <FallbackScreen
      title={copy.title}
      description={copy.description}
      action={<FallbackActions homeHref={`/${locale}`} homeLabel={copy.homeLabel} />}
    />
  )
}
