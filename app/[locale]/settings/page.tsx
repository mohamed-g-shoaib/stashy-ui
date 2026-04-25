import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import { SettingsScreen } from "@/app/(app)/settings"

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)

  return <SettingsScreen />
}
