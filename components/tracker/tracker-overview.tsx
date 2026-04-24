import { useTranslations } from "next-intl"

import { TrackerProgress } from "@/components/tracker/tracker-progress"
import { Card, CardContent } from "@/components/ui/card"

export function TrackerOverview() {
  const t = useTranslations("Tracker")

  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-4 shadow-soft">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("overview.title")}</h2>
          <span className="text-xs font-medium text-text-secondary tabular-nums">66%</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <OverviewStat label={t("overview.budgeted")} value="6,200 EGP" />
          <OverviewStat label={t("overview.paid")} value="4,100 EGP" />
          <OverviewStat label={t("overview.remaining")} value="2,100 EGP" />
        </div>
        <TrackerProgress valueClass="basis-[66%]" />
      </CardContent>
    </Card>
  )
}

function OverviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="truncate text-[0.6875rem] font-medium text-text-tertiary">{label}</span>
      <span
        dir="ltr"
        className="truncate text-[0.9375rem] font-semibold text-foreground tabular-nums"
      >
        {value}
      </span>
    </div>
  )
}
