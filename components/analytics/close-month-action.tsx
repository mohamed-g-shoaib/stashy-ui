"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"

interface CloseMonthActionProps {
  monthLabel: string
  disabled?: boolean
  onClose?: () => void
}

export function CloseMonthAction({ monthLabel, disabled, onClose }: CloseMonthActionProps) {
  const t = useTranslations("Analytics")
  return (
    <Button type="button" size="sm" className="w-fit" disabled={disabled} onClick={onClose}>
      {t("trends.closeMonthCta", { month: monthLabel })}
    </Button>
  )
}
