import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function MajorExpensesCard() {
  const t = useTranslations("Home")

  return (
    <Card size="sm" className="rounded-md border border-warning bg-warning-subtle py-4 shadow-ring">
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground tabular-nums">
            3000 EGP <span className="font-normal text-text-secondary">{t("major.ofBudget")}</span>
          </p>
          <Badge className="rounded-full bg-warning text-text-on-brand">30%</Badge>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-offset shadow-ring">
          <div className="h-full w-[30%] rounded-full bg-warning" />
        </div>
        <p className="text-sm font-medium text-warning">{t("major.warning")}</p>
      </CardContent>
    </Card>
  )
}
