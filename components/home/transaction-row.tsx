import { DollarCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Card, CardContent } from "@/components/ui/card"

type TransactionRowProps = {
  amount: string
  date: string
}

export function TransactionRow({ amount, date }: TransactionRowProps) {
  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-3 shadow-ring">
      <CardContent className="flex items-center gap-3 px-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-offset text-text-secondary shadow-ring">
          <HugeiconsIcon icon={DollarCircleIcon} size={22} aria-hidden="true" />
        </span>
        <p className="min-w-0 flex-1 text-start text-[1.0625rem] font-semibold text-danger tabular-nums">
          {amount}
        </p>
        <p className="shrink-0 text-end text-sm text-text-tertiary">{date}</p>
      </CardContent>
    </Card>
  )
}
