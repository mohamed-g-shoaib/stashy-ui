"use client"

import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Calendar03Icon,
  CreditCardIcon,
  Invoice03Icon,
  MoneyBag02Icon,
  ShoppingBag02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale, useTranslations } from "next-intl"

import { FILL_WIDTH_CLASS, TICK_POSITION_CLASS } from "@/components/analytics/data"
import {
  formatAnalyticsCurrency,
  formatAnalyticsMonthLabel,
  formatAnalyticsPercent,
  formatAnalyticsSignedPercent,
} from "@/components/analytics/formatters"
import type { AnalyticsMonth, ComparisonTone } from "@/components/analytics/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes"
import { semanticProgressClass, semanticSurfaceClass, semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

export function PacingCard({ month }: { month: AnalyticsMonth }) {
  const t = useTranslations("Analytics")
  const pacingLabel =
    month.pacingDeltaPct < 0
      ? t("pacing.underPace")
      : month.pacingDeltaPct > 0
        ? t("pacing.overPace")
        : t("pacing.onPace")
  const pacingToneClass =
    month.pacingDeltaPct < 0
      ? semanticTextClass.stability
      : month.pacingDeltaPct > 0
        ? semanticTextClass.critical
        : "text-foreground"

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-5 px-4">
        <div className="space-y-3">
          <p className="text-[0.9375rem] font-medium leading-[1.6] text-foreground text-pretty">
            {getPacingNarrative(t, month)}
          </p>
          <div className="flex items-end gap-3">
            <p
              dir="ltr"
              className={cn(
                "text-[2.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums",
                pacingToneClass,
              )}
            >
              {formatAnalyticsSignedPercent(month.pacingDeltaPct)}
            </p>
            <p className="pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary">
              {pacingLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <HeroStat
            label={t("pacing.budgetUsed")}
            value={formatAnalyticsPercent(month.budgetUsedPct)}
          />
          <HeroStat
            label={t("pacing.monthProgress")}
            value={formatAnalyticsPercent(month.monthProgressPct)}
          />
        </div>

        <div className="space-y-3">
          <ProgressTrack
            ariaLabel={t("pacing.barLabel")}
            fillClassName={cn(
              month.pacingDeltaPct < 0
                ? semanticProgressClass.stability
                : month.pacingDeltaPct > 0
                  ? semanticProgressClass.critical
                  : semanticProgressClass.brand,
              FILL_WIDTH_CLASS[month.budgetUsedPct],
            )}
            tickClassName={TICK_POSITION_CLASS[month.monthProgressPct]}
          />

          {month.overspentDaysMtd > 0 ? (
            <MutedPill label={t("pacing.overspentDays", { count: month.overspentDaysMtd })} />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectionCard({ month }: { month: AnalyticsMonth }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")
  const projectedSavingsTone =
    month.projectedSavings > 0
      ? semanticTextClass.stability
      : month.projectedSavings < 0
        ? semanticTextClass.critical
        : "text-foreground"

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <SectionHeader
          icon={Invoice03Icon}
          title={t("projection.title")}
          subtitle={t("projection.subtitle")}
        />

        <div className="grid grid-cols-3 gap-2">
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
            valueClassName={projectedSavingsTone}
          />
        </div>

        <p className="text-[0.9375rem] leading-[1.6] text-text-secondary text-pretty">
          {getProjectionNarrative(t, locale, month)}
        </p>

        <MutedPill label={t("projection.savingsRate", { rate: month.projectedSavingsRate })} />
      </CardContent>
    </Card>
  )
}

export function ShapingCard({ month }: { month: AnalyticsMonth }) {
  const locale = useLocale()
  const t = useTranslations("Analytics")
  const remaining =
    month.effectiveBudget -
    month.totalVariableSpent +
    month.incomeReceived -
    month.fixedOverspend -
    month.majorPurchasesTotal
  const fixedOverspendAmount = month.fixedTotalSpent - month.fixedTotalBudget
  const fixedStatus =
    fixedOverspendAmount > 0
      ? t("shaping.fixedOverBudget", {
          amount: formatAnalyticsCurrency(locale, fixedOverspendAmount),
          manualCount: month.fixedManualOverBudgetCount,
          paidCount: month.fixedAutoPaidCount,
          totalCount: month.fixedAutoTotalCount,
        })
      : t("shaping.fixedWithinBudget", {
          budget: formatAnalyticsCurrency(locale, month.fixedTotalBudget),
          paidCount: month.fixedAutoPaidCount,
          totalCount: month.fixedAutoTotalCount,
        })
  const majorStatus =
    month.majorPurchaseCount > 0
      ? t("shaping.majorDragging", {
          count: month.majorPurchaseCount,
          amount: formatAnalyticsCurrency(locale, month.majorPurchasesTotal),
        })
      : t("shaping.majorNone")
  const grandTotalSpent =
    month.totalVariableSpent + month.fixedTotalSpent + month.majorPurchasesTotal
  const netAfterReceived = grandTotalSpent - month.incomeReceived

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <SectionHeader
          icon={MoneyBag02Icon}
          title={t("shaping.title")}
          subtitle={t("shaping.subtitle")}
        />

        <div className="grid gap-3">
          <InsightRow
            icon={MoneyBag02Icon}
            title={t("shaping.variableBudgetLeft")}
            value={formatAnalyticsCurrency(locale, remaining)}
            tone={remaining >= 0 ? "positive" : "negative"}
            description={
              remaining >= 0
                ? t("shaping.leftToWorkWith", {
                    amount: formatAnalyticsCurrency(locale, Math.abs(remaining)),
                  })
                : t("shaping.missingFromPlan", {
                    amount: formatAnalyticsCurrency(locale, Math.abs(remaining)),
                  })
            }
          />

          <InsightRow
            icon={Calendar03Icon}
            title={t("shaping.fixedPressure")}
            value={
              fixedOverspendAmount > 0
                ? formatAnalyticsCurrency(locale, fixedOverspendAmount)
                : formatAnalyticsCurrency(locale, month.fixedTotalSpent)
            }
            tone={fixedOverspendAmount > 0 ? "negative" : "neutral"}
            description={fixedStatus}
          />

          <InsightRow
            icon={ShoppingBag02Icon}
            title={t("shaping.majorPurchases")}
            value={formatAnalyticsCurrency(locale, month.majorPurchasesTotal)}
            tone={month.majorPurchasesTotal > 0 ? "warning" : "neutral"}
            description={majorStatus}
          />
        </div>

        <Separator className="bg-border-subtle" />

        <div className="grid grid-cols-2 gap-3">
          <SummaryItem
            label={t("shaping.grandTotalSpent")}
            value={formatAnalyticsCurrency(locale, grandTotalSpent)}
          />
          <SummaryItem
            label={t("shaping.netAfterReceived")}
            value={formatAnalyticsCurrency(locale, netAfterReceived)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function MonthComparisonCard({
  currentMonth,
  previousMonth,
}: {
  currentMonth: AnalyticsMonth
  previousMonth: AnalyticsMonth | null
}) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  if (!previousMonth) {
    return (
      <Card size="sm" className="py-4">
        <CardContent className="flex flex-col gap-4 px-4">
          <SectionHeader
            icon={CreditCardIcon}
            title={t("comparison.title")}
            subtitle={t("comparison.emptyDescription", { month: t("month.previousPlaceholder") })}
          />
          <div className="flex flex-col items-center gap-4 pt-2 text-center">
            <Button type="button" size="sm">
              {t("comparison.closeMonth", { month: t("month.previousPlaceholder") })}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const savingsDelta = currentMonth.savingsRate - previousMonth.savingsRate
  const baseDelta = currentMonth.baseDailyRate - previousMonth.baseDailyRate
  const largePurchasesDelta = currentMonth.largePurchasesPct - previousMonth.largePurchasesPct

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <SectionHeader
          icon={CreditCardIcon}
          title={t("comparison.title")}
          subtitle={getComparisonVerdict(t, currentMonth, previousMonth)}
        />

        <div className="flex flex-col gap-4">
          <ComparisonRow
            label={t("comparison.savingsRate")}
            values={`${formatAnalyticsPercent(previousMonth.savingsRate)} → ${formatAnalyticsPercent(currentMonth.savingsRate)}`}
            delta={savingsDelta}
            tone={savingsDelta > 0 ? "positive" : savingsDelta < 0 ? "negative" : "neutral"}
            message={savingsDelta !== 0 ? t("comparison.savingsMore") : undefined}
          />

          <Separator className="bg-border-subtle" />

          <ComparisonRow
            label={t("comparison.baseDailyRate")}
            values={`${formatAnalyticsCurrency(locale, previousMonth.baseDailyRate)} → ${formatAnalyticsCurrency(locale, currentMonth.baseDailyRate)}`}
            delta={baseDelta}
            tone="neutral"
            reason={t("comparison.baseRateReason")}
          />

          <Separator className="bg-border-subtle" />

          <ComparisonRow
            label={t("comparison.largePurchases")}
            values={`${formatAnalyticsPercent(previousMonth.largePurchasesPct)} → ${formatAnalyticsPercent(currentMonth.largePurchasesPct)}`}
            delta={largePurchasesDelta}
            tone={
              largePurchasesDelta < 0
                ? "positive"
                : largePurchasesDelta > 0
                  ? "negative"
                  : "neutral"
            }
            message={largePurchasesDelta !== 0 ? t("comparison.largeLess") : undefined}
          />
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
            <div className="h-2 w-10 rounded-full bg-info/40" />
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

function ComparisonRow({
  label,
  values,
  delta,
  tone,
  message,
  reason,
}: {
  label: string
  values: string
  delta: number
  tone: ComparisonTone
  message?: string
  reason?: string
}) {
  const badgeLabel = delta === 0 ? "—" : formatAnalyticsSignedPercent(delta)
  const icon =
    delta < 0 ? (
      <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden="true" size={12} className="rotate-90" />
    ) : delta > 0 ? (
      <HugeiconsIcon icon={ArrowUpRight01Icon} aria-hidden="true" size={12} />
    ) : null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p dir="ltr" className="mt-1 text-sm text-text-secondary tabular-nums">
            {values}
          </p>
        </div>

        <Badge
          variant={
            tone === "positive" ? "stability" : tone === "negative" ? "critical" : "neutral"
          }
          className="h-auto rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
        >
          {icon}
          <span dir="ltr" className="tabular-nums">
            {badgeLabel}
          </span>
        </Badge>
      </div>

      {message ? (
        <p className="text-sm leading-[1.5] text-text-secondary text-pretty">{message}</p>
      ) : null}
      {reason ? (
        <p className="text-sm leading-[1.5] text-text-tertiary text-pretty">{reason}</p>
      ) : null}
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

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("flex flex-col gap-1", statTileClass)}>
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p
        dir="ltr"
        className="text-[1.25rem] font-semibold leading-[1.1] text-foreground tabular-nums"
      >
        {value}
      </p>
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

function InsightRow({
  icon,
  title,
  value,
  tone,
  description,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  title: string
  value: string
  tone: "positive" | "negative" | "warning" | "neutral"
  description: string
}) {
  return (
    <div className={cn("flex gap-3", statTileClass)}>
      <span
        className={cn(
          "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full shadow-ring",
          tone === "positive" && semanticSurfaceClass.stability,
          tone === "negative" && semanticSurfaceClass.critical,
          tone === "warning" && semanticSurfaceClass.pressure,
          tone === "neutral" && semanticSurfaceClass.muted,
        )}
      >
        <HugeiconsIcon icon={icon} aria-hidden="true" size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p
            dir="ltr"
            className={cn(
              "shrink-0 text-sm font-semibold tabular-nums",
              tone === "positive" && semanticTextClass.stability,
              tone === "negative" && semanticTextClass.critical,
              tone === "warning" && semanticTextClass.pressure,
              tone === "neutral" && "text-foreground",
            )}
          >
            {value}
          </p>
        </div>
        <p className="mt-1 text-sm leading-[1.5] text-text-secondary text-pretty">{description}</p>
      </div>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={statTileClass}>
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p dir="ltr" className="mt-1 text-sm font-semibold text-foreground tabular-nums">
        {value}
      </p>
    </div>
  )
}

function MutedPill({ label }: { label: string }) {
  return (
    <Badge
      variant="neutral"
      className="h-auto w-fit rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
    >
      {label}
    </Badge>
  )
}

function ProgressTrack({
  ariaLabel,
  fillClassName,
  tickClassName,
}: {
  ariaLabel: string
  fillClassName: string
  tickClassName?: string
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="relative h-3 overflow-hidden rounded-full bg-surface-offset shadow-ring"
    >
      <div className={cn("absolute inset-y-0 start-0 rounded-full", fillClassName)} />
      {tickClassName ? (
        <div
          className={cn(
            "absolute inset-y-[-2px] w-0.5 -translate-x-1/2 rounded-full bg-text-tertiary/75",
            tickClassName,
          )}
        />
      ) : null}
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

function getPacingNarrative(
  t: ReturnType<typeof useTranslations<"Analytics">>,
  month: AnalyticsMonth,
) {
  return t("pacing.narrative", {
    budgetUsed: month.budgetUsedPct,
    monthProgress: month.monthProgressPct,
    descriptor:
      month.pacingDeltaPct < 0
        ? t("pacing.underPace")
        : month.pacingDeltaPct > 0
          ? t("pacing.overPace")
          : t("pacing.onPace"),
  })
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

function getComparisonVerdict(
  t: ReturnType<typeof useTranslations<"Analytics">>,
  currentMonth: AnalyticsMonth,
  previousMonth: AnalyticsMonth,
) {
  const savingsImproved = currentMonth.savingsRate > previousMonth.savingsRate
  const baseImproved = currentMonth.baseDailyRate <= previousMonth.baseDailyRate
  const largePurchasesImproved = currentMonth.largePurchasesPct <= previousMonth.largePurchasesPct
  const allImproved = savingsImproved && baseImproved && largePurchasesImproved
  const allWorse =
    currentMonth.savingsRate < previousMonth.savingsRate &&
    currentMonth.baseDailyRate > previousMonth.baseDailyRate &&
    currentMonth.largePurchasesPct > previousMonth.largePurchasesPct

  if (allImproved) {
    return t("comparison.verdictBetter")
  }

  if (allWorse) {
    return t("comparison.verdictWorse")
  }

  return t("comparison.verdictMixed")
}
