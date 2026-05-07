"use client"

import { useTranslations } from "next-intl"

import type { AnalyticsMonth } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { semanticTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

type SavingsTone = "up" | "down" | "same" | "first"
type DayTone = "clean" | "mostlyClean" | "rough"
type RhythmTone = "consistent" | "volatile"
type VerdictKey = "strong" | "solid" | "mixed" | "challenging"

function getSavingsTone(month: AnalyticsMonth, previous: AnalyticsMonth | null): SavingsTone {
  if (!previous) return "first"
  if (month.savingsRate > previous.savingsRate) return "up"
  if (month.savingsRate < previous.savingsRate) return "down"
  return "same"
}

function getDayTone(month: AnalyticsMonth): DayTone {
  if (month.overspentDaysMtd === 0) return "clean"
  if (month.overspentDaysMtd / Math.max(1, month.daysTracked) < 0.2) return "mostlyClean"
  return "rough"
}

function getRhythmTone(weeklySpend: number[], target: number): RhythmTone {
  const allWithin20 = weeklySpend.every((w) => Math.abs(w - target) / target <= 0.2)
  return allWithin20 ? "consistent" : "volatile"
}

function getVerdict(
  savingsTone: SavingsTone,
  dayTone: DayTone,
  rhythmTone: RhythmTone,
): VerdictKey {
  let score = 0
  if (savingsTone === "up" || savingsTone === "first" || savingsTone === "same") score += 1
  if (dayTone === "clean" || dayTone === "mostlyClean") score += 1
  if (rhythmTone === "consistent") score += 1
  if (score === 3) return "strong"
  if (score === 2) return "solid"
  if (score === 1) return "mixed"
  return "challenging"
}

interface MonthSummaryCardProps {
  month: AnalyticsMonth
  previousMonth: AnalyticsMonth | null
}

export function MonthSummaryCard({ month, previousMonth }: MonthSummaryCardProps) {
  const t = useTranslations("Analytics")

  const savingsTone = getSavingsTone(month, previousMonth)
  const dayTone = getDayTone(month)
  const rhythmTone = getRhythmTone(month.weeklySpend, month.weeklyBudgetTarget)
  const verdict = getVerdict(savingsTone, dayTone, rhythmTone)

  const verdictColorClass =
    verdict === "strong" || verdict === "solid"
      ? semanticTextClass.income
      : verdict === "mixed"
        ? semanticTextClass.warning
        : semanticTextClass.expense

  const savingsText =
    savingsTone === "up"
      ? t("summary.savings.up")
      : savingsTone === "down"
        ? t("summary.savings.down")
        : savingsTone === "same"
          ? t("summary.savings.same")
          : t("summary.savings.first")

  const daysText =
    dayTone === "clean"
      ? t("summary.days.clean")
      : dayTone === "mostlyClean"
        ? t("summary.days.mostlyClean", { overspent: month.overspentDaysMtd })
        : t("summary.days.rough", {
            overspent: month.overspentDaysMtd,
            tracked: month.daysTracked,
          })

  const rhythmText =
    rhythmTone === "consistent" ? t("summary.rhythm.consistent") : t("summary.rhythm.volatile")

  const rows: { text: string; dot: string }[] = [
    {
      text: savingsText,
      dot:
        savingsTone === "up"
          ? "bg-income"
          : savingsTone === "down"
            ? "bg-expense"
            : "bg-text-tertiary",
    },
    {
      text: daysText,
      dot: dayTone === "clean" ? "bg-income" : dayTone === "mostlyClean" ? "bg-warning" : "bg-expense",
    },
    {
      text: rhythmText,
      dot: rhythmTone === "consistent" ? "bg-income" : "bg-warning",
    },
  ]

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-baseline gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-tertiary">
            {t("summary.title")}
          </p>
        </div>

        <p className={cn("text-[1.5rem] font-semibold leading-[1.2]", verdictColorClass)}>
          {t(`summary.verdict.${verdict}`)}
        </p>

        <div className="flex flex-col gap-3">
          {rows.map(({ text, dot }, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className={cn("mt-[0.35rem] size-2 shrink-0 rounded-full", dot)} />
              <p className="text-sm leading-[1.5] text-text-secondary text-pretty">{text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
