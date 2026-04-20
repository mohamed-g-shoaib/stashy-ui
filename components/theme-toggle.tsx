"use client"

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import * as React from "react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useUiSound } from "@/hooks/use-ui-sound"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const t = useTranslations("ThemeToggle")
  const { playSound } = useUiSound()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"
  const nextThemeLabel = !mounted
    ? t("fallbackLabel")
    : isDark
      ? t("toLightLabel")
      : t("toDarkLabel")

  function handleToggle() {
    if (!mounted) {
      return
    }

    const nextTheme = isDark ? "light" : "dark"

    setTheme(nextTheme)
    playSound(nextTheme === "dark" ? "switch-off" : "switch-on")
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={nextThemeLabel}
      className="h-11 min-h-11 rounded-full px-3"
      onClick={handleToggle}
    >
      <span className="relative me-1.5 size-4">
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            !mounted || !isDark
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]",
          ].join(" ")}
        >
          <HugeiconsIcon icon={Sun03Icon} aria-hidden="true" />
        </span>
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            mounted && isDark
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]",
          ].join(" ")}
        >
          <HugeiconsIcon icon={Moon02Icon} aria-hidden="true" />
        </span>
      </span>
      {nextThemeLabel}
    </Button>
  )
}
