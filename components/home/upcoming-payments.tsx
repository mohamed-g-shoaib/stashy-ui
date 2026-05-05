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
    <div className="flex flex-col gap-1.5">
      <p className="ms-1 text-[11px] font-medium uppercase tracking-[0.03em] text-text-secondary">
        {t("payments.sectionLabel")}
      </p>
      <Card size="sm" className="overflow-hidden p-3 pb-2.5">
        {/* Internal header */}
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-foreground">
            {t("payments.title")}
          </p>
          <button
            type="button"
            onClick={onViewAll}
            className="text-[10px] text-text-secondary"
          >
            {t("payments.viewAll")} →
          </button>
        </div>

        {/* Payment rows */}
        <CardContent className="p-0">
          {payments.map((payment) => {
            const { text: urgencyText, className: urgencyClass } = urgencyLabel(
              payment.urgency,
              t,
            );

            return (
              <div
                key={payment.id}
                className="flex items-center justify-between border-t border-border-subtle py-1.5"
              >
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {t(payment.nameKey as "payments.title")}
                  </p>
                  {urgencyText ? (
                    <p className={cn("text-[10px]", urgencyClass)}>{urgencyText}</p>
                  ) : (
                    <p className="text-[10px] text-text-secondary">&nbsp;</p>
                  )}
                </div>
                <div className="text-end">
                  <p
                    dir="ltr"
                    className="text-xs font-medium text-foreground tabular-nums text-end"
                  >
                    {payment.amount}
                  </p>
                  <p className="text-[10px] text-text-secondary text-end">{payment.date}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
