export type AnalyticsMonth = {
  id: string
  isoDate: string
  daysTracked: number
  daysRemaining: number
  status: "closed" | "inProgress"
  pacingDeltaPct: number
  budgetUsedPct: 36 | 94 | 100
  monthProgressPct: 81 | 100
  overspentDaysMtd: number
  avgDailySpend: number
  projectedEndSpend: number
  projectedSavings: number
  projectedSavingsRate: number
  effectiveBudget: number
  totalVariableSpent: number
  incomeReceived: number
  fixedOverspend: number
  majorPurchasesTotal: number
  fixedTotalBudget: number
  fixedTotalSpent: number
  fixedManualOverBudgetCount: number
  fixedAutoPaidCount: number
  fixedAutoTotalCount: number
  majorPurchaseCount: number
  savingsRate: number
  baseDailyRate: number
  largePurchasesPct: number
}

export type ComparisonTone = "positive" | "negative" | "neutral"
