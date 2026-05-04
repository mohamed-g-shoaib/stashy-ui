import { HugeiconsIcon } from "@hugeicons/react"

import type { Transaction, TransactionTone } from "@/components/home/types"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type TransactionRowProps = Transaction & {
  title: string
}

export function TransactionRow({ title, amount, date, tone, methodIcon }: TransactionRowProps) {
  return (
    <Card size="sm" className="py-3 shadow-ring">
      <CardContent className="flex items-center gap-3 px-4">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full shadow-ring",
            getIconToneClassName(tone),
          )}
        >
          <HugeiconsIcon icon={methodIcon} size={22} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 text-start">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <p
              dir="ltr"
              className={cn(
                "min-w-0 flex-1 break-words text-[1.0625rem] font-semibold leading-[1.25] tabular-nums",
                getAmountClassName(tone),
              )}
            >
              {amount}
            </p>
            <p className="shrink-0 text-end text-sm text-text-secondary">{date}</p>
          </div>
          <p className="mt-0.5 truncate text-sm text-text-secondary">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function getIconToneClassName(tone: TransactionTone) {
  if (tone === "fixed") {
    return "bg-success-subtle text-success"
  }

  if (tone === "received") {
    return "bg-info-subtle text-info"
  }

  return "bg-surface-offset text-text-secondary"
}

function getAmountClassName(tone: TransactionTone) {
  if (tone === "received") {
    return "text-info"
  }
  if (tone === "fixed") {
    return "text-success"
  }

  return "text-brand"
}
