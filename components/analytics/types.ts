export type AnalyticsMonth = {
  id: string
  isoDate: string
  daysTracked: number
  daysRemaining: number
  daysInMonth: number
  status: "closed" | "inProgress"

  // Q1 — Days within rate (dot grid drives from overspentDaysMtd + daysTracked)
  overspentDaysMtd: number

  // Q2 — Rollover cushion (hero)
  rolloverEgp: number

  // Pacing (supports Q2 context)
  pacingDeltaPct: number
  budgetUsedPct: number
  monthProgressPct: number

  // Q3 + Q4 — Budget composition
  budgetComposition: {
    fixedEgp: number
    majorEgp: number
    variableEgp: number
    totalBudget: number
  }

  // Q5 — Spending rhythm
  weeklySpend: number[]
  weeklyBudgetTarget: number

  // Q6 — Payment method breakdown
  paymentMethods: PaymentMethodBreakdown[]

  // Q7 — Projection
  projectionConfidenceDay: number
  avgDailySpend: number
  projectedEndSpend: number
  projectedSavings: number
  projectedSavingsRate: number

  // Internal fields
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

  // Q8 + Q9 — Progress over time
  savingsRate: number
  baseDailyRate: number
  largePurchasesPct: number
  baseRateChangeReason: string
}

export type PaymentMethodBreakdown = {
  id: string
  name: string
  variable: number
  fixed: number
  major: number
  total: number
}

export type ComparisonTone = "positive" | "negative" | "neutral"

export type PaymentMethodFilter = "all" | "variable" | "fixed" | "major"
