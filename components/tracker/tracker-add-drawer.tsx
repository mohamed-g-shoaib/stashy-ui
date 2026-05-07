"use client"

import {
  Calendar03Icon,
  Layers01Icon,
  RepeatIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { dateFieldClass, inputFieldClass } from "@/lib/design-system-classes"
import { semanticSurfaceClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"
import { getDirectionForLocale } from "@/lib/i18n"
import type { Locale } from "@/i18n/routing"

// ─── Types ────────────────────────────────────────────────────────────────────

type AddType = "budget" | "recurring" | "installment"

type TrackerAddDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function getTodayString(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setMonth(d.getMonth() + months)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function monthsBetween(startStr: string, endStr: string): number {
  const start = new Date(`${startStr}T00:00:00`)
  const end = new Date(`${endStr}T00:00:00`)
  return Math.max(
    0,
    (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()),
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TrackerAddDrawer({ open, onOpenChange }: TrackerAddDrawerProps) {
  const t = useTranslations("Tracker.add")
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)

  const [addType, setAddType] = React.useState<AddType>("budget")
  const [name, setName] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [startDate, setStartDate] = React.useState(getTodayString)
  const [endDate, setEndDate] = React.useState("")
  const [totalInstallments, setTotalInstallments] = React.useState("")
  const [lastInstField, setLastInstField] = React.useState<"endDate" | "count">("endDate")

  const reset = React.useCallback(() => {
    setAddType("budget")
    setName("")
    setAmount("")
    setStartDate(getTodayString())
    setEndDate("")
    setTotalInstallments("")
    setLastInstField("endDate")
  }, [])

  React.useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  function handleTotalInstallmentsChange(value: string) {
    setTotalInstallments(value)
    setLastInstField("count")
    const n = parseInt(value)
    if (!isNaN(n) && n > 0 && startDate) {
      setEndDate(addMonths(startDate, n))
    }
  }

  function handleEndDateChange(value: string) {
    setEndDate(value)
    setLastInstField("endDate")
    if (startDate && value) {
      const months = monthsBetween(startDate, value)
      if (months > 0) setTotalInstallments(String(months))
    }
  }

  function handleStartDateChange(value: string) {
    setStartDate(value)
    if (lastInstField === "count") {
      const n = parseInt(totalInstallments)
      if (!isNaN(n) && n > 0) setEndDate(addMonths(value, n))
    } else if (endDate) {
      const months = monthsBetween(value, endDate)
      if (months > 0) setTotalInstallments(String(months))
    }
  }

  const typeConfig: { key: AddType; icon: typeof Wallet02Icon }[] = [
    { key: "budget", icon: Wallet02Icon },
    { key: "recurring", icon: RepeatIcon },
    { key: "installment", icon: Layers01Icon },
  ]

  const syncReady = addType === "installment" && totalInstallments !== "" && endDate !== ""

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent dir={direction} className="mx-auto max-w-sm">
        <DrawerHeader className="text-start">
          <DrawerTitle>{t("title")}</DrawerTitle>
          <DrawerDescription>{t(`description.${addType}`)}</DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 pb-2">
          {/* Type selector */}
          <div className="flex gap-1.5 rounded-full bg-surface-offset p-1">
            {typeConfig.map(({ key, icon }) => (
              <button
                key={key}
                type="button"
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-semibold transition-all duration-150",
                  addType === key
                    ? "bg-card shadow-ring text-foreground"
                    : "text-text-secondary",
                )}
                onClick={() => setAddType(key)}
              >
                <HugeiconsIcon icon={icon} size={12} aria-hidden="true" />
                {t(`types.${key}`)}
              </button>
            ))}
          </div>

          {/* Name */}
          <FormField label={t("fields.name")}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t(`fields.namePlaceholder.${addType}`)}
              className={inputFieldClass}
            />
          </FormField>

          {/* Amount */}
          <FormField
            label={
              addType === "budget"
                ? t("fields.monthlyBudget")
                : t("fields.monthlyAmount")
            }
          >
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className={cn(inputFieldClass, "pe-14")}
              />
              <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-tertiary">
                EGP
              </span>
            </div>
          </FormField>

          {/* Recurring: start date */}
          {addType === "recurring" && (
            <FormField
              label={t("fields.startDate")}
              hint={t("fields.recurringStartHint")}
            >
              <DateInput
                value={startDate}
                onChange={setStartDate}
              />
            </FormField>
          )}

          {/* Installment: start date + bidirectional fields */}
          {addType === "installment" && (
            <>
              <FormField label={t("fields.startDate")}>
                <DateInput
                  value={startDate}
                  onChange={(v) => handleStartDateChange(v)}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label={t("fields.totalInstallments")}
                  hint={t("fields.totalInstallmentsHint")}
                >
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={totalInstallments}
                    onChange={(e) => handleTotalInstallmentsChange(e.target.value)}
                    placeholder="12"
                    className={inputFieldClass}
                  />
                </FormField>

                <FormField
                  label={t("fields.endDate")}
                  hint={t("fields.endDateHint")}
                >
                  <DateInput
                    value={endDate}
                    min={startDate}
                    onChange={(v) => handleEndDateChange(v)}
                  />
                </FormField>
              </div>

              {/* Sync indicator */}
              {syncReady && (
                <div
                  className={cn(
                    "rounded-[var(--radius-sm)] px-3 py-2.5 shadow-ring",
                    semanticSurfaceClass.fixed,
                  )}
                >
                  <p className="text-xs leading-[1.5]">
                    {t("fields.installmentSyncHint", {
                      count: totalInstallments,
                      endDate,
                    })}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <DrawerFooter>
          <div className="grid grid-cols-2 gap-2">
            <DrawerClose asChild>
              <Button type="button" variant="secondary">
                {t("cancel")}
              </Button>
            </DrawerClose>
            <button
              type="button"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-sm)] bg-fixed px-4 text-[1.0625rem] font-semibold text-primary-foreground shadow-soft transition-[background-color,transform] duration-200 ease-[var(--ease-stashy)] active:scale-[0.96] hover:opacity-90"
              onClick={() => onOpenChange(false)}
            >
              {t("save")}
            </button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// ─── Shared form primitives ───────────────────────────────────────────────────

function FormField({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
        {label}
      </span>
      {hint && (
        <span className="block text-xs leading-[1.5] text-text-secondary">
          {hint}
        </span>
      )}
      {children}
    </label>
  )
}

function DateInput({
  value,
  min,
  onChange,
}: {
  value: string
  min?: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className={cn(dateFieldClass, "pe-10")}
      />
      <HugeiconsIcon
        icon={Calendar03Icon}
        size={17}
        aria-hidden="true"
        className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-text-secondary"
      />
    </div>
  )
}
