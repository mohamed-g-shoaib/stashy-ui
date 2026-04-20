import {
  Analytics01Icon,
  Home01Icon,
  Invoice03Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons"
import type { NavItem } from "@/components/home/types"
import type { ChartConfig } from "@/components/ui/chart"

export const budgetChartData = [
  { name: "variable", value: 7960, fill: "var(--color-brand)" },
  { name: "fixed", value: 1240, fill: "var(--color-info)" },
  { name: "remaining", value: 800, fill: "var(--color-surface-offset)" },
]

export const budgetChartConfig = {
  variable: {
    label: "Variable",
    color: "var(--color-brand)",
  },
  fixed: {
    label: "Fixed",
    color: "var(--color-info)",
  },
  remaining: {
    label: "Remaining",
    color: "var(--color-surface-offset)",
  },
} satisfies ChartConfig

export const fixedPayments = [
  {
    nameKey: "fixedPayments.rent",
    dueKey: "fixedPayments.oneDay",
    amount: "3000 EGP",
    date: "Mon, 20/Apr",
  },
  {
    nameKey: "fixedPayments.internet",
    dueKey: "fixedPayments.twoDays",
    amount: "260 EGP",
    date: "Tue, 21/Apr",
  },
]

export const transactions = [
  { amount: "-200 EGP", date: "Fri, 17/Apr" },
  { amount: "-800 EGP", date: "Fri, 17/Apr" },
  { amount: "-1200 EGP", date: "Fri, 17/Apr" },
]

export const navItems: NavItem[] = [
  { value: "home", labelKey: "nav.home", icon: Home01Icon },
  { value: "tracker", labelKey: "nav.tracker", icon: Invoice03Icon },
  { value: "analytics", labelKey: "nav.analytics", icon: Analytics01Icon },
  { value: "settings", labelKey: "nav.settings", icon: Settings02Icon },
]
