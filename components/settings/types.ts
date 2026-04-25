export type ThemeValue = "light" | "dark" | "system"
export type LanguageValue = "English" | "Arabic"

export type PaymentMethod = {
  id: string
  name: string
  icon: "cash" | "card" | "bank"
  isDefault: boolean
}

export type BudgetBoost = {
  id: string
  label: string
  amount: number
  expiresOn: string
}

export type DrawerKind =
  | null
  | "profile"
  | "budget"
  | "boost"
  | "methodAdd"
  | { kind: "methodEdit"; methodId: string }

export type ProfileState = {
  username: string
  status: "Active" | "Inactive"
  email: string
  memberSince: string
}
