import type { AnalyticsMonth } from "@/components/analytics/types"

export function formatAnalyticsCurrency(locale: string, value: number) {
  return `${new Intl.NumberFormat(locale).format(value)} EGP`
}

export function formatAnalyticsPercent(value: number) {
  return `${value}%`
}

export function formatAnalyticsSignedPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`
}

export function formatAnalyticsMonthLabel(locale: string, isoDate: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`))
}

export function getPreviousAnalyticsMonth(months: AnalyticsMonth[], monthId: string) {
  const currentIndex = months.findIndex((month) => month.id === monthId)
  return currentIndex > 0 ? months[currentIndex] ? months[currentIndex - 1] ?? null : null : null
}
