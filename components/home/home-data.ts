import {
  Analytics01Icon,
  BankIcon,
  Home01Icon,
  Invoice03Icon,
  MoneyBag02Icon,
  CreditCardIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons"
import type { NavItem, Transaction } from "@/components/home/types"

export const budgetChartData = [
  { name: "variable", value: 7960, fill: "var(--color-brand)" },
  { name: "fixed", value: 1240, fill: "var(--color-info)" },
  { name: "remaining", value: 800, fill: "var(--color-surface-offset)" },
]

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

export const transactions: Transaction[] = [
  {
    titleKey: "historyItems.market",
    typeKey: "historyTypes.variable",
    methodKey: "paymentMethods.cash",
    amount: "-200 EGP",
    date: "Fri, 17/Apr",
    tone: "variable",
    methodIcon: MoneyBag02Icon,
  },
  {
    titleKey: "historyItems.internet",
    typeKey: "historyTypes.fixed",
    methodKey: "paymentMethods.card",
    amount: "-800 EGP",
    date: "Fri, 17/Apr",
    tone: "fixed",
    methodIcon: CreditCardIcon,
  },
  {
    titleKey: "historyItems.transfer",
    typeKey: "historyTypes.received",
    methodKey: "paymentMethods.transfer",
    amount: "+1200 EGP",
    date: "Fri, 17/Apr",
    tone: "received",
    methodIcon: BankIcon,
  },
]

export const navItems: NavItem[] = [
  { value: "home", labelKey: "nav.home", icon: Home01Icon },
  { value: "tracker", labelKey: "nav.tracker", icon: Invoice03Icon },
  { value: "analytics", labelKey: "nav.analytics", icon: Analytics01Icon },
  { value: "settings", labelKey: "nav.settings", icon: Settings02Icon },
]
