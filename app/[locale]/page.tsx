import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import { SandboxHome } from "@/components/sandbox-home"

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)

  return <SandboxHome />
}
