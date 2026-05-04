import { Card, CardContent } from "@/components/ui/card"
import { statTileClass } from "@/lib/design-system-classes"
import { cn } from "@/lib/utils"

type PaymentRowProps = {
  name: string
  due: string
  amount: string
  date: string
}

export function PaymentRow({ name, due, amount, date }: PaymentRowProps) {
  return (
    <Card size="sm" className="py-3 shadow-ring">
      <CardContent className="flex items-center justify-between gap-4 px-4">
        <div className="min-w-0 flex-1 text-start">
          <p className="truncate text-[1.0625rem] font-semibold text-foreground">{name}</p>
          <p className="mt-1 text-sm text-text-secondary">{due}</p>
        </div>
        <div className={cn("shrink-0 text-end", statTileClass)}>
          <p dir="ltr" className="text-[1.0625rem] font-semibold text-foreground tabular-nums">
            {amount}
          </p>
          <p className="mt-1 text-[0.6875rem] font-semibold tracking-[0.14em] text-text-tertiary uppercase">
            {date}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
