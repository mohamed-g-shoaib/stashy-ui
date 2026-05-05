"use client";

import { useTranslations } from "next-intl";

import type { DailyRate } from "@/components/home/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DailyRateCardProps = {
  rate: DailyRate;
  onInject: () => void;
};

function formatCurrency(amount: number): string {
  return `${Math.abs(amount).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EGP`;
}

export function DailyRateCard({ rate, onInject }: DailyRateCardProps) {
  const isEmergency = rate.overByAmount !== null;
  const isOverspent = rate.remainingAmount < 0 && rate.overByAmount === null;

  if (isEmergency) {
    return <EmergencyState rate={rate} onInject={onInject} />;
  }

  if (isOverspent) {
    return <OverspentState rate={rate} />;
  }

  return <OnTrackState rate={rate} />;
}

// ─── State badge ─────────────────────────────────────────────────────────────

function StateBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "warning" | "danger";
}) {
  const classes = {
    success: "bg-success-subtle text-success",
    warning: "bg-warning-subtle text-warning-hover",
    danger: "bg-danger-subtle text-danger",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center self-start rounded-full px-2.5 py-0.5 text-xs font-medium",
        classes[tone],
      )}
    >
      {label}
    </span>
  );
}

// ─── Shared Card Tint ──────────────────────────────────────────────────────────

function getCardTint(tone: "success" | "warning" | "danger") {
  switch (tone) {
    case "warning":
      return "bg-warning-subtle/40 border-warning/30";
    case "danger":
      return "bg-danger-subtle/40 border-danger/30";
    default:
      return "";
  }
}

// ─── On-track state ──────────────────────────────────────────────────────────

function OnTrackState({ rate }: { rate: DailyRate }) {
  const t = useTranslations("Home");
  const fillPct = Math.min(
    100,
    Math.max(0, (rate.remainingAmount / rate.allowanceAmount) * 100),
  );

  return (
    <Card size="sm" className={cn("py-4", getCardTint("success"))}>
      <CardContent className="flex flex-col gap-0 px-4">
        <StateBadge label={t("daily.statusTrack")} tone="success" />

        <p className="mt-3 text-xs text-text-secondary">
          {t("daily.remainingLabel")}
        </p>
        <p
          dir="ltr"
          className="text-4xl font-semibold leading-tight text-foreground tabular-nums"
        >
          {formatCurrency(rate.remainingAmount)}
        </p>

        {/* Progress bar */}
        <div className="mt-3 mb-3 h-1.5 overflow-hidden rounded-full bg-surface-offset">
          <div
            className="h-full rounded-full bg-income"
            style={{ width: `${fillPct}%` }}
          />
        </div>

        {/* Secondary row */}
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-text-secondary">{t("daily.allowanceLabel")}</p>
            <p className="text-sm font-medium text-foreground tabular-nums" dir="ltr">
              {formatCurrency(rate.allowanceAmount)}
            </p>
          </div>
          <div className="text-end">
            <p className="text-xs text-text-secondary">{t("daily.spentLabel")}</p>
            <p className="text-sm font-medium text-foreground tabular-nums" dir="ltr">
              {formatCurrency(rate.spentAmount)}
            </p>
          </div>
        </div>

        {/* Tomorrow row */}
        <div className="mt-3 border-t border-border pt-3" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {t("daily.tomorrowLabel")}
          </span>
          <span
            dir="ltr"
            className="font-medium text-foreground tabular-nums"
          >
            {formatCurrency(rate.tomorrowAmount ?? 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Overspent state ─────────────────────────────────────────────────────────

function OverspentState({ rate }: { rate: DailyRate }) {
  const t = useTranslations("Home");

  return (
    <Card size="sm" className={cn("py-4", getCardTint("danger"))}>
      <CardContent className="flex flex-col gap-0 px-4">
        <StateBadge label={t("daily.statusOverspent")} tone="danger" />

        <p className="mt-3 text-xs text-text-secondary">
          {t("daily.remainingLabel")}
        </p>
        <p
          dir="ltr"
          className="text-4xl font-semibold leading-tight text-danger tabular-nums"
        >
          −{formatCurrency(Math.abs(rate.remainingAmount))}
        </p>

        {/* Progress bar — capped at full */}
        <div className="mt-3 mb-3 h-1.5 overflow-hidden rounded-full bg-surface-offset">
          <div className="h-full w-full rounded-full bg-danger" />
        </div>

        {/* Secondary row */}
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-text-secondary">{t("daily.allowanceLabel")}</p>
            <p className="text-sm font-medium text-foreground tabular-nums" dir="ltr">
              {formatCurrency(rate.allowanceAmount)}
            </p>
          </div>
          <div className="text-end">
            <p className="text-xs text-text-secondary">{t("daily.spentLabel")}</p>
            <p className="text-sm font-medium text-foreground tabular-nums" dir="ltr">
              {formatCurrency(rate.spentAmount)}
            </p>
          </div>
        </div>

        {/* Tomorrow row */}
        <div className="mt-3 border-t border-border pt-3" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-warning-hover">
            {t("daily.tomorrowDropLabel")}
          </span>
          <span
            dir="ltr"
            className="font-semibold text-danger tabular-nums"
          >
            {formatCurrency(rate.tomorrowAmount ?? 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Emergency state ─────────────────────────────────────────────────────────

function EmergencyState({
  rate,
  onInject,
}: {
  rate: DailyRate;
  onInject: () => void;
}) {
  const t = useTranslations("Home");

  return (
    <Card size="sm" className={cn("py-4", getCardTint("danger"))}>
      <CardContent className="flex flex-col gap-0 px-4">
        <StateBadge label={t("daily.statusEmergency")} tone="danger" />

        <p className="mt-3 text-xs text-text-secondary">
          {t("daily.overByLabel")}
        </p>
        <p
          dir="ltr"
          className="text-4xl font-semibold leading-tight text-danger tabular-nums"
        >
          {rate.overByAmount !== null
            ? formatCurrency(rate.overByAmount)
            : null}
        </p>
        <p className="mt-1 mb-4 text-xs text-text-secondary">
          {t("daily.overBySubtext")}
        </p>

        {/* Inject button — wired to onInject */}
        {/* TODO: wire to dedicated inject drawer */}
        <Button
          type="button"
          variant="destructive"
          className="w-full"
          onClick={onInject}
        >
          {t("daily.injectAction")}
        </Button>
      </CardContent>
    </Card>
  );
}
