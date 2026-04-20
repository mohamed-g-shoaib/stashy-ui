import type { IconSvgElement } from "@hugeicons/react"

export type DrawerKind = "add" | "filter" | "help" | "settings" | "fixed" | "history"
export type DailyScenario = "track" | "overspent"

export type DailyRate = {
  remaining: string
  allowance: string
  spent: string
  tomorrow: string
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
