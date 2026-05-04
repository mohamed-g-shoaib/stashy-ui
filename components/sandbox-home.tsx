"use client"

import { Calendar03Icon, Note03Icon, Wallet02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { LanguageToggle } from "@/components/language-toggle"
import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes"
import { semanticSurfaceClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

export function SandboxHome() {
  const t = useTranslations("SandboxHome")

  return (
    <main className="flex min-h-svh flex-col justify-center px-4 py-10">
      <div className={cn("flex flex-col gap-6 p-4", heroSurfaceClass)}>
        <div className="flex flex-col gap-2">
          <p className="inline-flex w-fit items-center rounded-full bg-brand-subtle px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-brand shadow-ring">
            {t("eyebrow")}
          </p>
          <h1 className="text-balance text-2xl font-semibold leading-[1.2] text-foreground">
            {t("heading")}
          </h1>
          <p className="text-pretty text-[1.0625rem] leading-[1.5] text-text-secondary">
            {t("description")}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <PreviewTile icon={Wallet02Icon} tone={semanticSurfaceClass.brand} />
          <PreviewTile icon={Calendar03Icon} tone={semanticSurfaceClass.warning} />
          <PreviewTile icon={Note03Icon} tone={semanticSurfaceClass.injection} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LanguageToggle />
        </div>
      </div>
    </main>
  )
}

function PreviewTile({
  icon,
  tone,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  tone: string
}) {
  return (
    <div className={cn("flex flex-col gap-2", statTileClass)} aria-hidden="true">
      <span className={cn("flex size-9 items-center justify-center rounded-full shadow-ring", tone)}>
        <HugeiconsIcon icon={icon} size={16} />
      </span>
      <div className="h-2 w-10 rounded-full bg-text-tertiary/20" />
      <div className="h-2 w-14 rounded-full bg-text-secondary/25" />
    </div>
  )
}
