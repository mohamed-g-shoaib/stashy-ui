import type { IconSvgElement } from "@hugeicons/react"

export type TrackerTab = "fixed" | "major" | "history"
export type PaymentStatus = "paid" | "pending" | "overdue"
export type WarningTone = "neutral" | "warning" | "danger"
export type FilterKind = "type" | "direction" | "method"

export type MonthlyPayment = {
  nameKey: string
  amount: string
  date: string
  status: PaymentStatus
}

export type BudgetBucket = {
  nameKey: string
  spent: string
  budgeted: string
  percent: number
  percentClass: string
  transactionCount: number
}

export type MajorExpense = {
  nameKey: string
  amount: string
  date: string
  methodKey: string
  percent: string
  isLarge: boolean
}

export type TrackerTransaction = {
  descriptionKey: string
  typeLabelKey: string
  amount: string
  date: string
  direction: "expense" | "received"
  methodIcon: IconSvgElement
  methodTone: "cash" | "card" | "bank"
}
