import { semanticProgressClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

type TrackerProgressProps = {
  /** Numeric percentage 0–100 (or higher for over-budget). Takes priority over valueClass when provided. */
  value?: number
  /** Legacy Tailwind basis class string. Only used when value is not provided. */
  valueClass?: string
  /** When true, renders the percentage label to the end of the bar. */
  showPercent?: boolean
  tone?: "brand" | "variable" | "warning" | "expense" | "fixed" | "major" | "income" | "injection" | "transfer" | "quiet"
  className?: string
}

export function TrackerProgress({
  value,
  valueClass,
  showPercent,
  tone = "brand",
  className,
}: TrackerProgressProps) {
  const fillStyle =
    value !== undefined
      ? { flexBasis: `${Math.min(Math.max(value, 0), 100)}%` }
      : undefined

  // Display the raw value (can exceed 100 for over-budget items)
  const displayPct = value !== undefined ? Math.round(value) : null

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-border-subtle">
        <div
          className={cn("rounded-full", !fillStyle && valueClass, progressToneClass[tone])}
          style={fillStyle}
        />
      </div>

      {showPercent && displayPct !== null && (
        <span className="min-w-[2.5ch] shrink-0 text-end text-[0.625rem] font-semibold tabular-nums text-text-secondary">
          {displayPct}%
        </span>
      )}
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
