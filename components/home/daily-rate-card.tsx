import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import type { DailyRate, DailyScenario } from "@/components/home/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type DailyRateCardProps = {
  value: DailyScenario
  onValueChange: (value: string) => void
  rate: DailyRate
}

export function DailyRateCard({ value, onValueChange, rate }: DailyRateCardProps) {
  const t = useTranslations("Home")

  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-4 shadow-soft">
      <CardContent className="flex flex-col gap-4 px-4">
        <Tabs value={value} onValueChange={onValueChange} className="gap-3">
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-sm bg-surface-offset p-1">
            <TabsTrigger value="track" className="rounded-xs text-xs">
              {t("daily.trackTab")}
            </TabsTrigger>
            <TabsTrigger value="overspent" className="rounded-xs text-xs">
              {t("daily.overspentTab")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={value} className="flex flex-col gap-4">
            <DailyRateAmounts rate={rate} />
            <DailyAllowanceBar rate={rate} label={t("daily.progressLabel")} />
            <DailyRateStatus rate={rate} />
            <Separator className="bg-border-subtle" />
            <TomorrowRate rate={rate} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function DailyRateAmounts({ rate }: { rate: DailyRate }) {
  const t = useTranslations("Home")

  return (
    <div className="grid grid-cols-2 gap-3">
      <MoneyBlock label={t("daily.remaining")} value={rate.remaining} emphasis />
      <MoneyBlock label={t("daily.allowance")} value={rate.allowance} alignEnd />
    </div>
  )
}

function MoneyBlock({
  label,
  value,
  emphasis,
  alignEnd,
}: {
  label: string
  value: string
  emphasis?: boolean
  alignEnd?: boolean
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1 text-start", alignEnd && "text-end")}>
      <p className="text-xs font-medium text-text-tertiary">{label}</p>
      <p
        className={cn(
          "truncate font-semibold leading-none text-foreground tabular-nums",
          emphasis ? "text-2xl" : "text-xl",
        )}
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
        <span className="font-semibold text-foreground tabular-nums">{rate.spent}</span>
      </p>
      <Badge
        variant={isOnTrack ? "secondary" : "destructive"}
        className={cn(
          "rounded-full",
          isOnTrack &&
            "bg-success-subtle text-success dark:bg-success-subtle-dark dark:text-success-dark",
        )}
      >
        {rate.status}
      </Badge>
    </div>
  )
}

function TomorrowRate({ rate }: { rate: DailyRate }) {
  const t = useTranslations("Home")
  const isOverspent = rate.statusTone === "danger"

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-foreground">
        {t("daily.tomorrow")} <span className="tabular-nums text-brand">{rate.tomorrow}</span>
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
