"use client"

import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale, useTranslations } from "next-intl"

import { formatAnalyticsCurrency } from "@/components/analytics/formatters"
import type { LiveMonthAnalysis, PaymentMethodBreakdown } from "@/components/analytics/types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentMethodCardProps {
  month: LiveMonthAnalysis
  prevPaymentMethods?: PaymentMethodBreakdown[] | null
}

// ─── Split item config ────────────────────────────────────────────────────────

const SPLIT_ITEMS = [
  {
    key: "fixed" as const,
    chipClass: "bg-fixed-subtle text-fixed",
    labelKey: "methods.fixedLabel",
  },
  {
    key: "variable" as const,
    chipClass: "bg-variable-subtle text-variable",
    labelKey: "methods.variableLabel",
  },
  {
    key: "major" as const,
    chipClass: "bg-major-subtle text-major",
    labelKey: "methods.majorLabel",
  },
] as const

// ─── Delta pill ───────────────────────────────────────────────────────────────

interface DeltaPillProps {
  delta: number
  locale: string
  labelNoChange: string
  labelVsLastMonth: string
}

function DeltaPill({ delta, locale, labelNoChange, labelVsLastMonth }: DeltaPillProps) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-surface-offset px-2.5 py-0.5 text-xs font-medium text-text-tertiary">
        {labelNoChange}
      </span>
    )
  }

  const isIncrease = delta > 0
  const absAmount = formatAnalyticsCurrency(locale, Math.abs(delta))

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
          isIncrease ? "bg-expense-subtle text-expense" : "bg-income-subtle text-income",
        )}
      >
        <HugeiconsIcon
          icon={isIncrease ? ArrowUp01Icon : ArrowDown01Icon}
          size={11}
          className="shrink-0 rtl:rotate-180"
        />
        <span dir="ltr" className="tabular-nums">
          {absAmount}
        </span>
      </span>
      <span className="text-xs text-text-tertiary">{labelVsLastMonth}</span>
    </span>
  )
}

// ─── Method row ───────────────────────────────────────────────────────────────

interface MethodRowProps {
  method: PaymentMethodBreakdown
  prevMethod: PaymentMethodBreakdown | null
  locale: string
  t: ReturnType<typeof useTranslations<"Analytics">>
}

function MethodRow({ method, prevMethod, locale, t }: MethodRowProps) {
  const delta = prevMethod !== null ? method.total - prevMethod.total : null

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-surface px-3 py-3">
      <div className="flex flex-col gap-2">
        {/* Layer 1 — Method name + total */}
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[0.9375rem] font-medium text-foreground">{method.name}</span>
          <span dir="ltr" className="shrink-0 text-[1.0625rem] font-semibold tabular-nums text-foreground">
            {formatAnalyticsCurrency(locale, method.total)}
          </span>
        </div>

        {/* Layer 2 — Identity chips (only non-zero) */}
        <div className="flex flex-wrap gap-1.5">
          {SPLIT_ITEMS.map(({ key, chipClass, labelKey }) => {
            const amount = method[key]
            if (amount <= 0) return null
            return (
              <span
                key={key}
                className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", chipClass)}
              >
                {t(labelKey as Parameters<typeof t>[0])}
                <span dir="ltr" className="tabular-nums">
                  {formatAnalyticsCurrency(locale, amount)}
                </span>
              </span>
            )
          })}
        </div>

        {/* Layer 3 — Delta pill (only when prev data exists for this method) */}
        {delta !== null && (
          <div className="flex items-center">
            <DeltaPill
              delta={delta}
              locale={locale}
              labelNoChange={t("methods.deltaNoChange")}
              labelVsLastMonth={t("methods.deltaVsLastMonth")}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function PaymentMethodCard({ month, prevPaymentMethods }: PaymentMethodCardProps) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  const activeMethods = month.paymentMethods.filter((m) => m.total > 0)
  const grandTotal = activeMethods.reduce((sum, m) => sum + m.total, 0)
  const heroNumber = new Intl.NumberFormat(locale).format(grandTotal)

  return (
    <Card size="sm" className="bg-white py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        {/* Header */}
        <div>
          {/* Row 1: title + subtitle */}
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[1.0625rem] font-medium text-foreground">{t("methods.title")}</h2>
            <span className="text-sm text-text-tertiary">{t("methods.subtitle")}</span>
          </div>

          {/* Row 2: hero number + currency */}
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              dir="ltr"
              className="text-[2rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-foreground"
            >
              {heroNumber}
            </span>
            <span className="text-[0.9375rem] font-medium text-text-tertiary">EGP</span>
          </div>

          {/* Row 3: footer label */}
          <p className="mt-1 text-xs text-text-tertiary">{t("methods.totalLabel")}</p>
        </div>

        {/* Divider */}
        <div className="-mx-4 border-t border-border" />

        {/* Method tiles */}
        <div className="flex flex-col gap-1.5">
          {activeMethods.map((method) => {
            const prevMethod = prevPaymentMethods?.find((m) => m.id === method.id) ?? null
            return (
              <MethodRow
                key={method.id}
                method={method}
                prevMethod={prevMethod}
                locale={locale}
                t={t}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
