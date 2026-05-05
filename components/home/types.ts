import type { IconSvgElement } from "@hugeicons/react";

export type DrawerKind = "add" | "filter" | "help" | "settings" | "fixed" | "history";
export type DailyScenario = "track" | "overspent" | "emergency";
export type AddActionKind = "spend" | "receive" | "injection" | "major";
export type PaymentUrgency = "today" | "tomorrow" | "soon";

export type DailyRate = {
  remaining: string;
  remainingAmount: number;
  allowance: string;
  allowanceAmount: number;
  spent: string;
  spentAmount: number;
  explanation: string;
  tomorrow: string | null;
  tomorrowAmount: number | null;
  status: string;
  statusTone: "fixed" | "expense";
  overByAmount: number | null;
};

export type BudgetStrip = {
  fixedLeft: number;
  variableLeft: number;
  daysRemaining: number;
  fixedTotal: number;
  variableTotal: number;
};

export type MajorExpensesRow = {
  totalAmount: number;
  percentOfVariable: number;
} | null;

export type NavItem = {
  value: string;
  labelKey: string;
  icon: IconSvgElement;
};
