import type { IconSvgElement } from "@hugeicons/react"

export type DrawerKind = "add" | "filter" | "help" | "settings" | "fixed" | "history"
export type DailyScenario = "track" | "overspent"
export type AddActionKind = "spend" | "receive" | "injection" | "major"

export type DailyRate = {
  remaining: string
  allowance: string
  spent: string
  explanation: string
  tomorrow: string | null
  status: string
  statusTone: "success" | "danger"
  fill: string
  spentFill: string
}

export type NavItem = {
  value: string
  labelKey: string
  icon: IconSvgElement
}

export type TransactionTone = "variable" | "fixed" | "received"

export type Transaction = {
  titleKey: string
  typeKey: string
  methodKey: string
  amount: string
  date: string
  tone: TransactionTone
  methodIcon: IconSvgElement
}
