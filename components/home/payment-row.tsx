import { Card, CardContent } from "@/components/ui/card"

type PaymentRowProps = {
  name: string
  due: string
  amount: string
  date: string
}

export function PaymentRow({ name, due, amount, date }: PaymentRowProps) {
  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-3 shadow-ring">
      <CardContent className="flex items-center justify-between gap-4 px-4">
        <div className="min-w-0 text-start">
          <p className="truncate text-[1.0625rem] font-semibold text-foreground">{name}</p>
          <p className="text-sm text-text-secondary">{due}</p>
        </div>
        <div className="shrink-0 text-end">
          <p className="text-[1.0625rem] font-semibold text-foreground tabular-nums">{amount}</p>
          <p className="text-sm text-text-secondary">{date}</p>
        </div>
      </CardContent>
    </Card>
  )
}
