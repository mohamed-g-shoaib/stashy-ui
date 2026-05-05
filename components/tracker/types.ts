// ─── Fixed expense types matching the API model ───────────────────────────────

export type FixedExpenseType = "manual" | "recurring" | "installment";
export type FixedExpenseStatus = "on_track" | "warning" | "over_budget";
export type PaymentStatus = "paid" | "unpaid";

export type FixedTransaction = {
  id: string;
  amount: number;
  direction: "expense" | "received";
  description: string | null;
  date: string; // display string e.g. "May 3"
  isAutoPayment: boolean;
};

export type FixedExpenseItem = {
  id: string;
  name: string;
  type: FixedExpenseType;
  budget: number; // monthly amount
  paid: number; // paid so far this month
  remaining: number; // budget - paid
  progressPct: number; // (paid / budget) * 100, capped display at 100
  progressClass: string; // e.g. "basis-[82%]" — for TrackerProgress valueClass
  status: FixedExpenseStatus;
  // Recurring-specific
  paymentStatus: PaymentStatus;
  nextPaymentDate: string | null; // display string e.g. "May 15"
  // Installment-specific
  installmentsTotal: number | null;
  installmentsPaid: number | null;
  installmentsRemaining: number | null;
  installmentProgressClass: string | null; // e.g. "basis-[33%]" — lifecycle bar
  endDate: string | null; // display string e.g. "Dec 2026"
  // Transaction history (for detail sheet)
  transactions: FixedTransaction[];
};

export type FixedTrackerSummary = {
  totalBudgeted: number;
  totalPaid: number;
  totalRemaining: number;
  paidProgressClass: string; // e.g. "basis-[58%]"
  overallStatus: FixedExpenseStatus;
};

// Installment section mini-overview (computed from installment items)
export type InstallmentOverview = {
  monthlyObligation: number; // sum of all installment budgets
  totalPaidAllTime: number; // installmentsPaid * budget per item, summed
  totalRemainingAllTime: number; // installmentsRemaining * budget per item, summed
};

// ─── Major expense (major tab unchanged) ─────────────────────────────────────

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
