"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes"
import { cn } from "@/lib/utils"

export function AnalyticsUpgradeGate() {
  const t = useTranslations("Analytics")
  return (
    <div className="flex min-h-[calc(100svh-14rem)] flex-col items-center justify-center gap-5 text-center">
      <LockIllustration />
      <div className={cn("w-full max-w-[20rem] p-5", heroSurfaceClass)}>
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-brand-subtle px-3 py-1 shadow-ring">
          <span className="size-2 rounded-full bg-brand" />
          <span className="h-2 w-12 rounded-full bg-brand/40" />
        </div>
        <div className="space-y-2">
          <h2 className="text-[1.375rem] font-semibold leading-[1.2] text-foreground text-balance">
            {t("upgrade.title")}
          </h2>
          <p className="mx-auto max-w-[26ch] text-sm leading-[1.6] text-text-secondary text-pretty">
            {t("upgrade.description")}
          </p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className={cn("flex flex-col gap-2 text-start", statTileClass)} aria-hidden="true">
            <div className="h-2 w-8 rounded-full bg-text-tertiary/20" />
            <div className="h-2 w-12 rounded-full bg-brand/45" />
          </div>
          <div className={cn("flex flex-col gap-2 text-start", statTileClass)} aria-hidden="true">
            <div className="h-2 w-7 rounded-full bg-text-tertiary/20" />
            <div className="h-2 w-10 rounded-full bg-injection/40" />
          </div>
          <div className={cn("flex flex-col gap-2 text-start", statTileClass)} aria-hidden="true">
            <div className="h-2 w-9 rounded-full bg-text-tertiary/20" />
            <div className="h-2 w-11 rounded-full bg-warning/45" />
          </div>
        </div>
        <Button type="button" className="mt-5 min-w-40">
          {t("upgrade.cta")}
        </Button>
      </div>
    </div>
  )
}

function LockIllustration() {
  return (
    <div className="relative flex size-24 items-center justify-center rounded-full bg-brand-subtle shadow-ring">
      <div className="absolute inset-3 rounded-full border border-brand/20" />
      <div className="relative h-12 w-10 rounded-sm border-2 border-brand bg-card shadow-ring">
        <div className="absolute start-1/2 top-[-1.2rem] h-7 w-6 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-brand" />
        <div className="absolute start-1/2 top-[1.05rem] size-2.5 -translate-x-1/2 rounded-full bg-brand" />
        <div className="absolute start-1/2 top-[1.5rem] h-3 w-1 -translate-x-1/2 rounded-full bg-brand" />
      </div>
    </div>
  )
}
