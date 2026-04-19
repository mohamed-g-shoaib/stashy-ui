"use client"

import { useTranslations } from "next-intl"

import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"

export function SandboxHome() {
  const t = useTranslations("SandboxHome")

  return (
    <main className="flex min-h-svh flex-col justify-center px-4 py-10">
      <div className="flex flex-col gap-6 rounded-md border border-border-subtle bg-card p-4 shadow-soft">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
            {t("eyebrow")}
          </p>
          <h1 className="text-balance text-2xl font-semibold leading-[1.2] text-foreground">
            {t("heading")}
          </h1>
          <p className="text-pretty text-[1.0625rem] leading-[1.5] text-text-secondary">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </main>
  )
}
