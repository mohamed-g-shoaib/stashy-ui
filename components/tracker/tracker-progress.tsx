import { cn } from "@/lib/utils"

type TrackerProgressProps = {
  valueClass: string
  tone?: "brand" | "warning" | "danger" | "success"
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
  brand: "bg-brand",
  warning: "bg-warning dark:bg-warning-dark",
  danger: "bg-danger dark:bg-danger-dark",
  success: "bg-success dark:bg-success-dark",
}
