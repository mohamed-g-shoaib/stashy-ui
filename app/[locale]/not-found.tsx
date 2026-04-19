import { getLocale, getTranslations } from "next-intl/server"

import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"
import { type Locale } from "@/i18n/routing"
import { getDirectionForLocale, isLocale } from "@/lib/i18n"

export default async function LocaleNotFound() {
  const requestedLocale = await getLocale()
  const locale: Locale = isLocale(requestedLocale) ? requestedLocale : "en"
  const direction = getDirectionForLocale(locale)
  const t = await getTranslations("Fallback")

  return (
    <FallbackScreen
      eyebrow={t("eyebrow")}
      locale={locale}
      direction={direction}
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      action={<FallbackActions homeHref={`/${locale}`} homeLabel={t("homeLabel")} />}
    />
  )
}
