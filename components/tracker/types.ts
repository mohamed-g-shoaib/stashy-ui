import type { IconSvgElement } from "@hugeicons/react"

export type TrackerTab = "fixed" | "major" | "history"
export type PaymentStatus = "paid" | "pending" | "overdue"
export type WarningTone = "neutral" | "warning" | "danger"
export type FilterKind = "type" | "direction" | "method"

export type MonthlyPayment = {
  nameKey?: string
  nameLabel?: string
  amount: string
  date: string
  status: PaymentStatus
}

export type BudgetBucket = {
  nameKey?: string
  nameLabel?: string
  spent: string
  budgeted: string
  percent: number
  percentClass: string
  transactionCount: number
}

export type MajorExpense = {
  nameKey?: string
  nameLabel?: string
  amount: string
  date: string
  methodKey?: string
  methodLabel?: string
  percent: string
  isLarge: boolean
}

export type TrackerTransaction = {
  descriptionKey?: string
  descriptionLabel?: string
  typeLabelKey?: string
  typeLabel?: string
  typeCategory: "variable" | "monthly" | "budget" | "major"
  amount: string
  date: string
  dateISO: string
  direction: "expense" | "received"
  methodIcon: IconSvgElement
  methodTone: "cash" | "card" | "bank"
}
