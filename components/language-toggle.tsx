"use client"

import { LanguagesIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { useUiSound } from "@/hooks/use-ui-sound"
import { usePathname, useRouter } from "@/i18n/navigation"
import { type Locale } from "@/i18n/routing"
import { getAlternateLocale } from "@/lib/i18n"

export function LanguageToggle() {
  const t = useTranslations("LanguageToggle")
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const { playSound } = useUiSound()
  const nextLocale = getAlternateLocale(locale)

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={t("label")}
      className="h-9 rounded-full px-3"
      onClick={() => {
        playSound("click-soft")
        React.startTransition(() => {
          router.replace(pathname, { locale: nextLocale })
        })
      }}
    >
      <LanguagesIcon data-icon="inline-start" aria-hidden="true" />
      {t("label")}
    </Button>
  )
}
