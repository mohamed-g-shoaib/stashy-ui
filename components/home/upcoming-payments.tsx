"use client";

import { useTranslations } from "next-intl";

import type { UpcomingPayment } from "@/components/home/home-data";
import type { PaymentUrgency } from "@/components/home/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type UpcomingPaymentsProps = {
  payments: UpcomingPayment[];
  onViewAll: () => void;
};

function urgencyLabel(
  urgency: PaymentUrgency,
  t: ReturnType<typeof useTranslations<"Home">>,
): { text: string; className: string } {
  switch (urgency) {
    case "today":
      return { text: t("payments.urgencyToday"), className: "text-danger" };
    case "tomorrow":
      return {
        text: t("payments.urgencyTomorrow"),
        className: "text-warning-hover",
      };
    case "soon":
      return { text: "", className: "text-text-secondary" };
  }
}

export function UpcomingPayments({ payments, onViewAll }: UpcomingPaymentsProps) {
  const t = useTranslations("Home");

  return (
    <Card size="sm" className="overflow-hidden py-0">
      {/* Internal header */}
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <p className="text-sm font-medium text-foreground">
          {t("payments.title")}
        </p>
        <button
          type="button"
          onClick={onViewAll}
          className="min-h-11 min-w-11 text-xs text-text-secondary"
        >
          {t("payments.viewAll")} →
        </button>
      </div>

      {/* Payment rows */}
      <CardContent className="px-0 pb-0">
        {payments.map((payment) => {
          const { text: urgencyText, className: urgencyClass } = urgencyLabel(
            payment.urgency,
            t,
          );

          return (
            <div
              key={payment.id}
              className="flex items-center justify-between border-t border-border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t(payment.nameKey as "payments.title")}
                </p>
                {urgencyText ? (
                  <p className={cn("text-xs", urgencyClass)}>{urgencyText}</p>
                ) : (
                  <p className="text-xs text-text-secondary">&nbsp;</p>
                )}
              </div>
              <div className="text-end">
                <p
                  dir="ltr"
                  className="text-sm font-medium text-foreground tabular-nums"
                >
                  {payment.amount}
                </p>
                <p className="text-xs text-text-secondary">{payment.date}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
