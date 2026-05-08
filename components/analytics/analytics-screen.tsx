"use client"

import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { AnalyticsUpgradeGate, ProjectionCard } from "@/components/analytics/analytics-cards"
import { BudgetCompositionCard } from "@/components/analytics/budget-composition-card"
import { ANALYTICS_PLAN, analyticsData, getMonthView } from "@/components/analytics/data"
import { FixedAnalysisCard } from "@/components/analytics/fixed-analysis-card"
import { formatAnalyticsMonthLabel } from "@/components/analytics/formatters"
import { MajorBehaviourCard } from "@/components/analytics/major-behaviour-card"
import { MonthPickerDrawer } from "@/components/analytics/month-picker-drawer"
import { PacingCard } from "@/components/analytics/pacing-card"
import { PaymentMethodCard } from "@/components/analytics/payment-method-card"
import { SectionHeader } from "@/components/analytics/section-header"
import { TrendsCard } from "@/components/analytics/trends-card"
import { VariableAnalysisCard } from "@/components/analytics/variable-analysis-card"
import { AppBottomNavigation } from "@/components/app-bottom-navigation"
import { navItems } from "@/components/home/home-data"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { type Locale } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"

export function AnalyticsScreen() {
  const locale = useLocale() as Locale
  const t = useTranslations("Analytics")
  const direction = getDirectionForLocale(locale)
  const [selectedMonthId, setSelectedMonthId] = React.useState<string>(analyticsData.current.month)
  const [monthPickerOpen, setMonthPickerOpen] = React.useState(false)

  const selectedMonth = React.useMemo(
    () => getMonthView(analyticsData, selectedMonthId),
    [selectedMonthId],
  )

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="bg-background px-screen pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[1.5rem] font-semibold leading-[1.2] text-foreground">
              {t("title")}
            </h1>
            <p className="mt-2 max-w-[26ch] text-sm leading-[1.5] text-text-tertiary">
              {t("meta.line", {
                tracked: selectedMonth.daysTracked,
                remaining: selectedMonth.daysRemaining,
                status:
                  selectedMonth.status === "inProgress" ? t("month.inProgress") : t("month.closed"),
              })}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 rounded-full bg-card"
            onClick={() => setMonthPickerOpen(true)}
          >
            <HugeiconsIcon icon={Calendar03Icon} data-icon="inline-start" aria-hidden="true" />
            {formatAnalyticsMonthLabel(locale, selectedMonth.isoDate)}
          </Button>
        </div>
        <Separator className="mt-4 bg-border-subtle" />
      </header>

      <main className="flex-1 pb-32">
        {ANALYTICS_PLAN === "free" ? (
          <div className="px-screen pt-4">
            <AnalyticsUpgradeGate />
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-screen pt-2">
            <SectionHeader
              index={1}
              eyebrow={t("section.eyebrow")}
              title={t("section.onPace.title")}
              subtitle={t("section.onPace.subtitle")}
            />
            <PacingCard month={selectedMonth} />
            <ProjectionCard month={selectedMonth} />

            <SectionHeader
              index={2}
              eyebrow={t("section.eyebrow")}
              title={t("section.where.title")}
              subtitle={t("section.where.subtitle")}
            />
            <BudgetCompositionCard month={selectedMonth} />
            <FixedAnalysisCard month={selectedMonth} data={analyticsData} />
            <VariableAnalysisCard month={selectedMonth} />
            <MajorBehaviourCard month={selectedMonth} data={analyticsData} />
            <PaymentMethodCard month={selectedMonth} />

            <SectionHeader
              index={3}
              eyebrow={t("section.eyebrow")}
              title={t("section.improving.title")}
              subtitle={t("section.improving.subtitle")}
            />
            <TrendsCard data={analyticsData} selectedMonth={selectedMonth} />
          </div>
        )}
      </main>

      <MonthPickerDrawer
        direction={direction}
        open={monthPickerOpen}
        selectedMonthId={selectedMonth.month}
        onOpenChange={setMonthPickerOpen}
        onSelectMonth={setSelectedMonthId}
      />

      <AppBottomNavigation activeValue="analytics" items={navItems} />
    </div>
  )
}
