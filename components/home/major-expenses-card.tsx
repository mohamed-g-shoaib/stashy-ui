import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function MajorExpensesCard() {
  const t = useTranslations("Home")
  const majorAmount = 3000
  const variableBudget = 7960
  const percentage = Math.round((majorAmount / variableBudget) * 100)

  return (
    <Card
      size="sm"
      className="rounded-md border border-warning bg-warning-subtle py-4 shadow-ring dark:border-warning-dark dark:bg-warning-subtle-dark"
    >
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground tabular-nums">
            {majorAmount.toLocaleString()} EGP{" "}
            <span className="font-normal text-text-secondary">
              {t("major.ofVariable", { amount: `${variableBudget.toLocaleString()} EGP` })}
            </span>
          </p>
          <Badge className="rounded-full bg-warning text-foreground dark:bg-warning-dark dark:text-bg text-xs font-bold px-2 py-0.5">
            {percentage}%
          </Badge>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-offset shadow-ring">
          <div
            className="h-full rounded-full bg-warning dark:bg-warning-dark"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm font-semibold text-foreground">{t("major.warning")}</p>
      </CardContent>
    </Card>
  )
}
