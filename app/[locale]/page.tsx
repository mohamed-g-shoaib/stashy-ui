import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import { HomeScreen } from "@/components/home-screen"

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)

  return <HomeScreen />
}
