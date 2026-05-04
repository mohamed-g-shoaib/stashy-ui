import { semanticProgressClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

type TrackerProgressProps = {
  valueClass: string
  tone?: "brand" | "variable" | "warning" | "expense" | "fixed" | "major" | "income" | "injection" | "transfer" | "quiet"
  className?: string
}

export function TrackerProgress({ valueClass, tone = "brand", className }: TrackerProgressProps) {
  return (
    <div className={cn("flex h-1.5 overflow-hidden rounded-full bg-surface-offset", className)}>
      <div className={cn("rounded-full", valueClass, progressToneClass[tone])} />
    </div>
  )
}

const progressToneClass = {
  brand: semanticProgressClass.brand,
  variable: semanticProgressClass.variable,
  warning: semanticProgressClass.warning,
  expense: semanticProgressClass.expense,
  fixed: semanticProgressClass.fixed,
  major: semanticProgressClass.major,
  income: semanticProgressClass.income,
  injection: semanticProgressClass.injection,
  transfer: semanticProgressClass.transfer,
  quiet: semanticProgressClass.quiet,
}
