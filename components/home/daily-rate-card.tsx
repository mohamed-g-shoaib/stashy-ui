import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import type { DailyRate } from "@/components/home/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type DailyRateCardProps = {
  rate: DailyRate
}

export function DailyRateCard({ rate }: DailyRateCardProps) {
  const t = useTranslations("Home")
  const showsTomorrow = rate.tomorrow !== null

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <p className="text-sm leading-[1.6] text-text-secondary text-pretty">{rate.explanation}</p>
        <DailyRateAmounts rate={rate} />
        <DailyAllowanceBar rate={rate} label={t("daily.progressLabel")} />
        <DailyRateStatus rate={rate} />
        {showsTomorrow ? (
          <>
            <Separator className="bg-border-subtle" />
            <TomorrowRate rate={rate} />
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function DailyRateAmounts({ rate }: { rate: DailyRate }) {
  const t = useTranslations("Home")

  return (
    <div className="grid grid-cols-2 gap-3">
      <MoneyBlock label={t("daily.remaining")} value={rate.remaining} />
      <MoneyBlock label={t("daily.allowance")} value={rate.allowance} />
    </div>
  )
}

function MoneyBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-[var(--radius-sm)] bg-surface-offset p-3 text-start shadow-ring">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p
        dir="ltr"
        className="truncate text-[1.25rem] font-semibold leading-[1.1] text-foreground tabular-nums"
      >
        {value}
      </p>
    </div>
  )
}

function DailyAllowanceBar({ rate, label }: { rate: DailyRate; label: string }) {
  return (
    <div
      className="flex h-4 overflow-hidden rounded-full bg-surface-offset shadow-ring"
      aria-label={label}
    >
      <div className={cn("bg-brand", rate.fill)} />
      <div
        className={cn(
          "bg-[repeating-linear-gradient(135deg,var(--color-warning-subtle)_0,var(--color-warning-subtle)_4px,var(--color-warning)_4px,var(--color-warning)_6px)]",
          rate.spentFill,
        )}
      />
    </div>
  )
}

function DailyRateStatus({ rate }: { rate: DailyRate }) {
  const t = useTranslations("Home")
  const isOnTrack = rate.statusTone === "success"

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <p className="text-text-secondary">
        {t("daily.spent")}{" "}
        <span dir="ltr" className="font-semibold text-foreground tabular-nums">
          {rate.spent}
        </span>
      </p>
      <Badge
        variant={isOnTrack ? "secondary" : "destructive"}
        className={cn("rounded-full", isOnTrack && "bg-success-subtle text-success")}
      >
        {rate.status}
      </Badge>
    </div>
  )
}

function TomorrowRate({ rate }: { rate: DailyRate }) {
  const t = useTranslations("Home")
  const isOverspent = rate.statusTone === "danger"

  if (!rate.tomorrow) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-foreground">
        {t("daily.tomorrow")}{" "}
        <span
          dir="ltr"
          className={cn("tabular-nums", isOverspent ? "text-danger" : "text-foreground")}
        >
          {rate.tomorrow}
        </span>
      </p>
      <HugeiconsIcon
        icon={ArrowUpRight01Icon}
        size={20}
        className={cn("shrink-0", isOverspent ? "rotate-90 text-danger" : "text-success")}
        aria-hidden="true"
      />
    </div>
  )
}
