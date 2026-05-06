"use client"

import { Invoice03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale, useTranslations } from "next-intl"

import {
  formatAnalyticsCurrency,
  formatAnalyticsMonthLabel,
} from "@/components/analytics/formatters"
import type { AnalyticsMonth } from "@/components/analytics/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes"
import { semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

export function ProjectionCard({ month }: { month: AnalyticsMonth }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")
  const projectedSavingsTone =
    month.projectedSavings > 0
      ? semanticTextClass.income
      : month.projectedSavings < 0
        ? semanticTextClass.expense
        : "text-foreground"

  const confidence = getProjectionConfidence(month.projectionConfidenceDay)

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <SectionHeader
          icon={Invoice03Icon}
          title={t("projection.title")}
          subtitle={t("projection.subtitle")}
        />

        <div
          className={cn("grid grid-cols-3 gap-2", confidence === "early" && "text-text-tertiary")}
        >
          <CompactStat
            label={t("projection.avgDaily")}
            value={formatAnalyticsCurrency(locale, month.avgDailySpend)}
          />
          <CompactStat
            label={t("projection.projectedSpend")}
            value={formatAnalyticsCurrency(locale, month.projectedEndSpend)}
          />
          <CompactStat
            label={t("projection.projectedSavings")}
            value={formatAnalyticsCurrency(locale, Math.abs(month.projectedSavings))}
            valueClassName={confidence !== "early" ? projectedSavingsTone : undefined}
          />
        </div>

        <p className="text-sm leading-[1.6] text-text-tertiary text-pretty">
          {confidence === "early"
            ? t("projection.confidence.early", { day: month.projectionConfidenceDay })
            : confidence === "late"
              ? t("projection.confidence.late", {
                  day: month.projectionConfidenceDay,
                  total: month.daysInMonth,
                })
              : t("projection.confidence.sweet", { day: month.projectionConfidenceDay })}
        </p>

        <p className="text-[0.9375rem] leading-[1.6] text-text-secondary text-pretty">
          {getProjectionNarrative(t, locale, month)}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <MutedPill label={t("projection.savingsRate", { rate: month.projectedSavingsRate })} />
          {confidence === "early" && (
            <Badge
              variant="warning"
              className="h-auto rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
            >
              {t("projection.lowConfidenceBadge")}
            </Badge>
          )}
          {confidence === "late" && (
            <Badge
              variant="income"
              className="h-auto rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
            >
              {t("projection.highConfidenceBadge")}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

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

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  title: string
  subtitle: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={icon} aria-hidden="true" size={18} className="text-text-secondary" />
        <h2 className="text-[1.0625rem] font-semibold text-foreground">{title}</h2>
      </div>
      <p className="text-sm leading-[1.6] text-text-secondary text-pretty">{subtitle}</p>
    </div>
  )
}

function CompactStat({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", statTileClass)}>
      <p className="text-[0.6875rem] font-medium text-text-secondary">{label}</p>
      <p
        dir="ltr"
        className={cn(
          "text-[0.9375rem] font-semibold leading-[1.2] text-foreground tabular-nums",
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  )
}

function MutedPill({ label }: { label: string }) {
  return (
    <Badge
      variant="quiet"
      className="h-auto w-fit rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
    >
      {label}
    </Badge>
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

function getProjectionConfidence(day: number): "early" | "sweet" | "late" {
  if (day <= 5) return "early"
  if (day >= 25) return "late"
  return "sweet"
}

function getProjectionNarrative(
  t: ReturnType<typeof useTranslations<"Analytics">>,
  locale: string,
  month: AnalyticsMonth,
) {
  if (month.projectedSavings >= 0) {
    return t("projection.positiveNarrative", {
      month: formatAnalyticsMonthLabel(locale, month.isoDate),
      amount: formatAnalyticsCurrency(locale, month.projectedSavings),
    })
  }

  return t("projection.negativeNarrative", {
    amount: formatAnalyticsCurrency(locale, Math.abs(month.projectedSavings)),
  })
}
