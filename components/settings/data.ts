import type { BudgetBoost, PaymentMethod, ThemeValue } from "@/components/settings/types"

export const PROFILE_USERNAME = "Mohamed Gamal"
export const PROFILE_STATUS: "Active" | "Inactive" = "Active"
export const PROFILE_EMAIL = "mohamed.g.shoaib@gmail.com"
export const PROFILE_MEMBER_SINCE = "12/9/2025"
export const MONTHLY_BUDGET = 10000
export const CURRENCY = "EGP"
export const INITIAL_BUDGET_BOOSTS: BudgetBoost[] = []
export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "1", name: "Cash", icon: "cash", isDefault: true },
  { id: "2", name: "Instapay", icon: "card", isDefault: false },
]
export const THEME: ThemeValue = "dark"
export const LANGUAGE: "English" | "Arabic" = "English"
export const PLAN: "free" | "pro" = "pro"
export const APP_NAME = "Stashy"
export const APP_VERSION = "1.1.0"
export const THEME_OPTIONS = ["light", "dark", "system"] as const
