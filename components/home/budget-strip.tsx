"use client";

import { useTranslations } from "next-intl";

import type { BudgetStrip } from "@/components/home/types";

type BudgetStripProps = {
  data: BudgetStrip;
};

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("en")} EGP`;
}

export function BudgetStripCard({ data }: BudgetStripProps) {
  const t = useTranslations("Home");
  const { fixedLeft, variableLeft, daysRemaining, fixedTotal, variableTotal } =
    data;

  const total = fixedTotal + variableTotal;
  const fixedPct = total > 0 ? (fixedTotal / total) * 100 : 50;
  const variablePct = 100 - fixedPct;

  return (
    <div className="rounded-lg bg-surface-offset px-4 py-3">
      {/* Segmented composition bar */}
      <div
        className="mb-3 flex h-1.5 overflow-hidden rounded-full"
        aria-label="Budget composition"
      >
        <div
          className="bg-fixed rounded-s-full"
          style={{ flexBasis: `${fixedPct}%` }}
        />
        <div
          className="bg-warning rounded-e-full"
          style={{ flexBasis: `${variablePct}%` }}
        />
      </div>

      {/* Three-item row */}
      <div className="flex justify-between gap-2">
        {/* Fixed left */}
        <div>
          <p className="text-xs text-text-secondary">
            {t("strip.fixedLeft")}
          </p>
          <p dir="ltr" className="text-sm font-medium text-foreground">
            {formatCurrency(fixedLeft)}
          </p>
        </div>

        {/* Variable left — centered */}
        <div className="text-center">
          <p className="text-xs text-text-secondary text-center">
            {t("strip.variableLeft")}
          </p>
          <p dir="ltr" className="text-sm font-medium text-foreground text-center">
            {formatCurrency(variableLeft)}
          </p>
        </div>

        {/* Days remaining — right-aligned */}
        <div className="text-end">
          <p className="text-xs text-text-secondary text-end">
            {t("strip.daysRemaining", { count: daysRemaining })}
          </p>
        </div>
      </div>
    </div>
  );
}
