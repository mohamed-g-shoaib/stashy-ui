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
  { key: "fixed" as const, dotClass: "bg-fixed", labelKey: "methods.fixedLabel" },
  { key: "variable" as const, dotClass: "bg-variable", labelKey: "methods.variableLabel" },
  { key: "major" as const, dotClass: "bg-major", labelKey: "methods.majorLabel" },
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
  // Layer 3: delta — only when a previous month entry exists for this method
  const delta = prevMethod !== null ? method.total - prevMethod.total : null

  return (
    <div className="flex flex-col gap-1.5">
      {/* Layer 1 — Method name + total */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.9375rem] font-medium text-foreground">{method.name}</span>
        <span dir="ltr" className="shrink-0 text-[1.0625rem] font-semibold tabular-nums text-foreground">
          {formatAnalyticsCurrency(locale, method.total)}
        </span>
      </div>

      {/* Layer 2 — Split items (only non-zero) */}
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {SPLIT_ITEMS.map(({ key, dotClass, labelKey }) => {
          const amount = method[key]
          if (amount <= 0) return null
          return (
            <span key={key} className="inline-flex items-center gap-1.5">
              <span className={cn("size-[7px] shrink-0 rounded-full", dotClass)} aria-hidden />
              <span className="text-xs text-text-secondary">{t(labelKey as Parameters<typeof t>[0])}</span>
              <span dir="ltr" className="text-xs tabular-nums text-text-secondary">
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
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function PaymentMethodCard({ month, prevPaymentMethods }: PaymentMethodCardProps) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  const activeMethods = month.paymentMethods.filter((m) => m.total > 0)
  const grandTotal = activeMethods.reduce((sum, m) => sum + m.total, 0)

  return (
    <Card size="sm" className="py-4">
      <CardContent className="flex flex-col gap-4 px-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[1.0625rem] font-semibold text-foreground">{t("methods.title")}</h2>
            <p className="mt-0.5 text-sm text-text-secondary">{t("methods.subtitle")}</p>
          </div>
          <div className="shrink-0 text-end">
            <p dir="ltr" className="text-[1.125rem] font-semibold tabular-nums text-foreground">
              {formatAnalyticsCurrency(locale, grandTotal)}
            </p>
            <p className="text-xs text-text-tertiary">{t("methods.totalLabel")}</p>
          </div>
        </div>

        {/* Method rows */}
        <div className="flex flex-col gap-4">
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
