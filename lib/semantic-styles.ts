export const semanticSurfaceClass = {
  brand: "bg-brand-subtle text-brand",
  neutral: "bg-surface-offset text-text-secondary",
  muted: "bg-card text-text-secondary",
  stability: "bg-success-subtle text-success",
  pressure: "bg-warning-subtle text-warning",
  critical: "bg-danger-subtle text-danger",
  recovery: "bg-info-subtle text-info",
} as const

export const semanticTextClass = {
  brand: "text-brand",
  neutral: "text-foreground",
  muted: "text-text-secondary",
  stability: "text-success",
  pressure: "text-warning",
  critical: "text-danger",
  recovery: "text-info",
} as const

export const semanticInteractiveTextClass = {
  brand: "text-brand transition-colors hover:text-brand-hover",
  critical: "text-danger transition-colors hover:text-danger-hover",
} as const

export const semanticProgressClass = {
  brand: "bg-brand",
  neutral: "bg-text-secondary",
  stability: "bg-success",
  pressure: "bg-warning",
  critical: "bg-danger",
  recovery: "bg-info",
} as const

export const semanticColorToken = {
  brand: "var(--color-brand)",
  neutral: "var(--color-surface-offset)",
  stability: "var(--color-success)",
  pressure: "var(--color-warning)",
  critical: "var(--color-danger)",
  recovery: "var(--color-info)",
} as const

export const paymentStatusSemantic = {
  paid: "stability",
  pending: "pressure",
  overdue: "critical",
} as const

export const transactionToneSemantic = {
  variable: "neutral",
  fixed: "stability",
  received: "recovery",
} as const
