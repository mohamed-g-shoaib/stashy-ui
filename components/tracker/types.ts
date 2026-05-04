export type TrackerTab = "fixed" | "major";
export type PaymentStatus = "paid" | "pending" | "overdue";
export type WarningTone = "quiet" | "warning" | "fixed";

export type MonthlyPayment = {
  nameKey?: string;
  nameLabel?: string;
  amount: string;
  date: string;
  status: PaymentStatus;
};

export type BudgetBucket = {
  nameKey?: string;
  nameLabel?: string;
  spent: string;
  budgeted: string;
  percent: number;
  percentClass: string;
  transactionCount: number;
};

export type MajorExpense = {
  nameKey?: string;
  nameLabel?: string;
  amount: string;
  date: string;
  methodKey?: string;
  methodLabel?: string;
  percent: string;
  isLarge: boolean;
};
