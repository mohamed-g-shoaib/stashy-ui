"use client"

import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { AnalyticsUpgradeGate, ProjectionCard } from "@/components/analytics/analytics-cards"
import { BudgetCompositionCard } from "@/components/analytics/budget-composition-card"
import { ANALYTICS_PLAN, analyticsMonths } from "@/components/analytics/data"
import {
  formatAnalyticsMonthLabel,
  getPreviousAnalyticsMonth,
} from "@/components/analytics/formatters"
import { MonthPickerDrawer } from "@/components/analytics/month-picker-drawer"
import { MonthSummaryCard } from "@/components/analytics/month-summary-card"
import { PaymentMethodCard } from "@/components/analytics/payment-method-card"
import { RolloverCard } from "@/components/analytics/rollover-card"
import { SpendingRhythmCard } from "@/components/analytics/spending-rhythm-card"
import { TrendsCard } from "@/components/analytics/trends-card"
import { AppBottomNavigation } from "@/components/app-bottom-navigation"
import { navItems } from "@/components/home/home-data"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Locale } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"

export function AnalyticsScreen() {
  const locale = useLocale() as Locale
  const t = useTranslations("Analytics")
  const direction = getDirectionForLocale(locale)
  const [selectedMonthId, setSelectedMonthId] = React.useState<string>(
    analyticsMonths[2]?.id ?? "2026-04",
  )
  const [monthPickerOpen, setMonthPickerOpen] = React.useState(false)

  const selectedMonth =
    analyticsMonths.find((month) => month.id === selectedMonthId) ?? analyticsMonths[2]
  const previousMonth = React.useMemo(
    () => getPreviousAnalyticsMonth(analyticsMonths, selectedMonth.id),
    [selectedMonth.id],
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
          <Tabs defaultValue="month">
            <div className="px-screen pt-3">
              <TabsList className="w-full">
                <TabsTrigger value="month">{t("tabs.month")}</TabsTrigger>
                <TabsTrigger value="spending">{t("tabs.spending")}</TabsTrigger>
                <TabsTrigger value="trends">{t("tabs.trends")}</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="month" className="px-screen pt-4">
              <div className="flex flex-col gap-3">
                <RolloverCard month={selectedMonth} />
                <ProjectionCard month={selectedMonth} />
              </div>
            </TabsContent>

            <TabsContent value="spending" className="px-screen pt-4">
              <div className="flex flex-col gap-3">
                <BudgetCompositionCard month={selectedMonth} />
                <PaymentMethodCard month={selectedMonth} />
                <SpendingRhythmCard month={selectedMonth} />
              </div>
            </TabsContent>

            <TabsContent value="trends" className="px-screen pt-4">
              <div className="flex flex-col gap-3">
                <MonthSummaryCard month={selectedMonth} previousMonth={previousMonth} />
                <TrendsCard
                  months={analyticsMonths}
                  selectedMonth={selectedMonth}
                  previousMonth={previousMonth}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      <MonthPickerDrawer
        direction={direction}
        open={monthPickerOpen}
        selectedMonthId={selectedMonth.id}
        onOpenChange={setMonthPickerOpen}
        onSelectMonth={setSelectedMonthId}
      />

      <AppBottomNavigation activeValue="analytics" items={navItems} />
    </div>
  )
}
