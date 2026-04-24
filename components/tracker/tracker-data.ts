import {
  BankIcon,
  CreditCardIcon,
  MoneyBag02Icon,
  ShoppingBag02Icon,
} from "@hugeicons/core-free-icons"

import type {
  BudgetBucket,
  MajorExpense,
  MonthlyPayment,
  TrackerTransaction,
} from "@/components/tracker/types"

export const monthlyPayments: MonthlyPayment[] = [
  { nameKey: "monthly.rent", amount: "3,000 EGP", status: "paid", date: "Apr 1" },
  { nameKey: "monthly.spotify", amount: "100 EGP", status: "paid", date: "Apr 5" },
  { nameKey: "monthly.netflix", amount: "80 EGP", status: "paid", date: "Apr 8" },
  {
    nameKey: "monthly.internet",
    amount: "260 EGP",
    status: "pending",
    date: "Apr 21",
  },
  { nameKey: "monthly.gym", amount: "200 EGP", status: "pending", date: "Apr 24" },
  { nameKey: "monthly.icloud", amount: "15 EGP", status: "pending", date: "Apr 26" },
  {
    nameKey: "monthly.phone",
    amount: "300 EGP",
    status: "overdue",
    date: "Apr 10",
  },
]

export const budgetBuckets: BudgetBucket[] = [
  {
    nameKey: "budgets.coffee",
    spent: "480 EGP",
    budgeted: "500 EGP",
    percent: 96,
    percentClass: "basis-[96%]",
    transactionCount: 4,
  },
  {
    nameKey: "budgets.gas",
    spent: "200 EGP",
    budgeted: "300 EGP",
    percent: 67,
    percentClass: "basis-[67%]",
    transactionCount: 3,
  },
  {
    nameKey: "budgets.groceries",
    spent: "950 EGP",
    budgeted: "1000 EGP",
    percent: 95,
    percentClass: "basis-[95%]",
    transactionCount: 7,
  },
  {
    nameKey: "budgets.eatingOut",
    spent: "350 EGP",
    budgeted: "400 EGP",
    percent: 87,
    percentClass: "basis-[87%]",
    transactionCount: 5,
  },
  {
    nameKey: "budgets.transport",
    spent: "120 EGP",
    budgeted: "200 EGP",
    percent: 60,
    percentClass: "basis-[60%]",
    transactionCount: 3,
  },
]

export const majorExpenses: MajorExpense[] = [
  {
    nameKey: "majorItems.laptop",
    amount: "3,000 EGP",
    date: "Apr 7",
    methodKey: "methods.cash",
    percent: "15%",
    isLarge: true,
  },
  {
    nameKey: "majorItems.dentist",
    amount: "800 EGP",
    date: "Apr 10",
    methodKey: "methods.card",
    percent: "4%",
    isLarge: false,
  },
  {
    nameKey: "majorItems.furniture",
    amount: "2,000 EGP",
    date: "Apr 15",
    methodKey: "methods.card",
    percent: "10%",
    isLarge: true,
  },
]

export const trackerTransactions: TrackerTransaction[] = [
  {
    descriptionKey: "transactions.market",
    typeLabelKey: "transactionTypes.variable",
    amount: "-200 EGP",
    date: "Fri, 17/Apr",
    direction: "expense",
    methodIcon: ShoppingBag02Icon,
    methodTone: "cash",
  },
  {
    descriptionKey: "transactions.internet",
    typeLabelKey: "transactionTypes.monthlyInternet",
    amount: "-800 EGP",
    date: "Fri, 17/Apr",
    direction: "expense",
    methodIcon: CreditCardIcon,
    methodTone: "card",
  },
  {
    descriptionKey: "transactions.transfer",
    typeLabelKey: "transactionTypes.variable",
    amount: "+1200 EGP",
    date: "Fri, 17/Apr",
    direction: "received",
    methodIcon: BankIcon,
    methodTone: "bank",
  },
  {
    descriptionKey: "transactions.coffee",
    typeLabelKey: "transactionTypes.budgetCoffee",
    amount: "-150 EGP",
    date: "Thu, 16/Apr",
    direction: "expense",
    methodIcon: MoneyBag02Icon,
    methodTone: "cash",
  },
  {
    descriptionKey: "transactions.laptop",
    typeLabelKey: "transactionTypes.major",
    amount: "-3,000 EGP",
    date: "Wed, 15/Apr",
    direction: "expense",
    methodIcon: CreditCardIcon,
    methodTone: "card",
  },
  {
    descriptionKey: "transactions.freelance",
    typeLabelKey: "transactionTypes.variable",
    amount: "+500 EGP",
    date: "Tue, 14/Apr",
    direction: "received",
    methodIcon: BankIcon,
    methodTone: "bank",
  },
]
