import { notFound } from "next/navigation"

import { AppProviders } from "@/components/app-providers"
import { type Locale, isLocale, locales } from "@/lib/i18n"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return <AppProviders locale={locale as Locale}>{children}</AppProviders>
}
