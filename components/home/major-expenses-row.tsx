"use client";

import { useTranslations } from "next-intl";

import type { MajorExpensesRow } from "@/components/home/types";

type MajorExpensesRowProps = {
  data: MajorExpensesRow;
  onView: () => void;
};

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("en")} EGP`;
}

export function MajorExpensesRowCard({ data, onView }: MajorExpensesRowProps) {
  const t = useTranslations("Home");

  if (data === null) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-warning bg-warning-subtle px-4 py-3">
      <p className="text-sm text-foreground truncate">
        <span className="font-medium">{t("major.rowLabel")}:</span>{" "}
        <span dir="ltr">{formatCurrency(data.totalAmount)}</span>{" "}
        <span className="text-text-secondary">
          · {t("major.ofVariableRow", { percent: data.percentOfVariable })}
        </span>
      </p>
      <button
        type="button"
        onClick={onView}
        className="ms-3 min-h-11 min-w-11 text-sm font-medium text-warning-hover shrink-0"
      >
        {t("major.viewAction")} →
      </button>
    </div>
  );
}
