import { getLocale, getTranslations } from "next-intl/server"

import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations("Fallback")

  return (
    <FallbackScreen
      eyebrow={t("eyebrow")}
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      action={<FallbackActions homeHref={`/${locale}`} homeLabel={t("homeLabel")} />}
    />
  )
}
