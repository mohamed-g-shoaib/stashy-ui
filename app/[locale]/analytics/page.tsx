import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import { AnalyticsScreen } from "@/app/(app)/analytics"

export default function AnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)

  return <AnalyticsScreen />
}
