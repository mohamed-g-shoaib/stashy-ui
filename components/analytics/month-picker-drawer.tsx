"use client"

import { useLocale, useTranslations } from "next-intl"

import { analyticsMonths } from "@/components/analytics/data"
import { formatAnalyticsMonthLabel } from "@/components/analytics/formatters"
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
import { cn } from "@/lib/utils"

type MonthPickerDrawerProps = {
  direction: "ltr" | "rtl"
  open: boolean
  selectedMonthId: string
  onOpenChange: (open: boolean) => void
  onSelectMonth: (monthId: string) => void
}

export function MonthPickerDrawer({
  direction,
  open,
  selectedMonthId,
  onOpenChange,
  onSelectMonth,
}: MonthPickerDrawerProps) {
  const locale = useLocale()
  const t = useTranslations("Analytics")

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent dir={direction} className="mx-auto max-w-sm">
        <DrawerHeader className="text-start">
          <DrawerTitle>{t("month.select")}</DrawerTitle>
          <DrawerDescription>{t("month.description")}</DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2">
          <div className="grid gap-2">
            {analyticsMonths.map((month) => {
              const selected = month.id === selectedMonthId

              return (
                <DrawerClose asChild key={month.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex min-h-14 items-center justify-between rounded-md border border-border bg-surface-offset px-4 py-3 text-start shadow-ring transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-stashy)] active:scale-[0.96]",
                      selected && "bg-card text-foreground",
                    )}
                    onClick={() => onSelectMonth(month.id)}
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {formatAnalyticsMonthLabel(locale, month.isoDate)}
                      </p>
                      <p className="mt-1 text-xs font-medium text-text-secondary">
                        {month.status === "inProgress" ? t("month.inProgress") : t("month.closed")}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        month.status === "inProgress" ? "bg-brand" : "bg-text-tertiary",
                      )}
                    />
                  </button>
                </DrawerClose>
              )
            })}
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              {t("month.close")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
