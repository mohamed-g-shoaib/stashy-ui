"use client";

import { ArrowRight01Icon, Package01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

import type { MajorExpensesRow } from "@/components/home/types";
import { Link } from "@/i18n/navigation";
import { semanticSurfaceClass, semanticTextClass } from "@/lib/semantic-styles";
import { cn } from "@/lib/utils";

type MajorExpensesRowProps = {
  data: MajorExpensesRow;
};

export function MajorExpensesRowCard({ data }: MajorExpensesRowProps) {
  const t = useTranslations("Home");

  if (data === null) return null;

  return (
    <Link
      href="/transactions?filter=major"
      className={cn(
        "flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-major/25 px-3 py-3 text-start transition-opacity active:opacity-70",
        semanticSurfaceClass.major,
      )}
    >
      {/* Icon well */}
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-major/15 shadow-ring">
        <HugeiconsIcon
          icon={Package01Icon}
          size={17}
          aria-hidden="true"
          className={semanticTextClass.major}
        />
      </span>

      {/* Text stack */}
      <div className="min-w-0 flex-1">
        <p className={cn("text-[0.6875rem] font-semibold uppercase tracking-[0.08em]", semanticTextClass.major)}>
          {t("major.rowLabel")}
        </p>
        <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground" dir="ltr">
          {formatCurrency(data.totalAmount)}{" "}
          <span className="text-xs font-medium text-text-secondary">
            · {t("major.ofVariableRow", { percent: data.percentOfVariable })}
          </span>
        </p>
      </div>

      {/* Chevron */}
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        aria-hidden="true"
        className={cn("shrink-0", semanticTextClass.major)}
      />
    </Link>
  );
}

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("en")} EGP`;
}
