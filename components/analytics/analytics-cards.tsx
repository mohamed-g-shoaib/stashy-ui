"use client"

import { useLocale, useTranslations } from "next-intl"

import { formatAnalyticsCurrency } from "@/components/analytics/formatters"
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

  const confidence = getProjectionConfidence(month.projectionConfidenceDay)
  const isOverBudget = month.projectedEndSpend > month.effectiveBudget

  const actualSpent = month.totalVariableSpent + month.fixedTotalSpent + month.majorPurchasesTotal
  const projectedAdditional = Math.max(0, month.projectedEndSpend - actualSpent)

  const spentPct = Math.min(100, Math.round((actualSpent / month.effectiveBudget) * 100))
  const additionalPct = Math.min(
    100 - spentPct,
    Math.round((projectedAdditional / month.effectiveBudget) * 100),
  )
  const bufferPct = Math.max(0, 100 - spentPct - additionalPct)

  const isEarly = confidence === "early"

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("projection.title")}</h2>

        {/* Layer 1 — Hero: the answer */}
        <div
          className={cn(
            "rounded-xl p-4",
            isEarly ? "bg-surface-offset" : isOverBudget ? "bg-expense-subtle" : "bg-income-subtle",
          )}
        >
          <p className="mb-1 text-xs text-text-tertiary">
            {isEarly
              ? t("projection.heroEarly", { day: month.projectionConfidenceDay })
              : isOverBudget
                ? t("projection.heroOverspend")
                : t("projection.heroSaving")}
          </p>
          <p
            dir="ltr"
            className={cn(
              "text-[2rem] font-bold leading-none tabular-nums",
              isEarly
                ? "text-text-tertiary"
                : isOverBudget
                  ? semanticTextClass.expense
                  : semanticTextClass.income,
            )}
          >
            {formatAnalyticsCurrency(locale, Math.abs(month.projectedSavings))}
          </p>
          <p className="mt-2 text-sm leading-[1.5] text-text-secondary">
            {isEarly
              ? t("projection.heroEarlyCaption")
              : isOverBudget
                ? t("projection.heroOverspendCaption")
                : t("projection.heroSavingCaption", { rate: month.projectedSavingsRate })}
          </p>
        </div>

        {/* Layer 2 — Bar: the evidence */}
        <div className="space-y-2">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-offset shadow-ring">
            <div className="h-full bg-expense-subtle" style={{ width: `${spentPct}%` }} />
            <div
              className={cn("h-full", isOverBudget ? "bg-warning-subtle" : "bg-border")}
              style={{ width: `${additionalPct}%` }}
            />
            {bufferPct > 0 && (
              <div className="h-full bg-income-subtle" style={{ width: `${bufferPct}%` }} />
            )}
          </div>

          <div className="flex gap-3 text-[0.6875rem] text-text-tertiary">
            <span className="flex items-center gap-1">
              <span className="size-2 shrink-0 rounded-full bg-expense-subtle" />
              {t("projection.forecastSpent")}
            </span>
            <span className="flex items-center gap-1">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  isOverBudget ? "bg-warning-subtle" : "bg-border",
                )}
              />
              {t("projection.forecastProjected")}
            </span>
            <span className="flex items-center gap-1">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  isOverBudget ? "bg-warning-subtle/50" : "bg-income-subtle",
                )}
              />
              {isOverBudget ? t("projection.forecastOverrun") : t("projection.forecastBuffer")}
            </span>
          </div>
        </div>

        {/* Layer 3 — Pace: the context */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-text-secondary">
            <span dir="ltr" className="font-semibold text-foreground tabular-nums">
              {formatAnalyticsCurrency(locale, month.avgDailySpend)}
            </span>{" "}
            {t("projection.paceCaption", { days: month.daysRemaining })}
          </p>
          {isEarly && (
            <Badge
              variant="warning"
              className="h-auto shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
            >
              {t("projection.lowConfidenceBadge")}
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
