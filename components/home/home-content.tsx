import { useTranslations } from "next-intl"

import { BudgetOverviewCard } from "@/components/home/budget-overview-card"
import { DailyRateCard } from "@/components/home/daily-rate-card"
import { fixedPayments, navItems, transactions } from "@/components/home/home-data"
import { PaymentRow } from "@/components/home/payment-row"
import { PlaceholderPanel } from "@/components/home/placeholder-panel"
import { SectionHeader } from "@/components/home/section-header"
import { TransactionRow } from "@/components/home/transaction-row"
import type { DailyRate, DrawerKind } from "@/components/home/types"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { Link } from "@/i18n/navigation"

type HomeContentProps = {
  dailyRate: DailyRate
  majorScenario: "active" | "none"
  onOpenDrawer: (kind: DrawerKind) => void
}

export function HomeContent({ dailyRate, majorScenario, onOpenDrawer }: HomeContentProps) {
  const t = useTranslations("Home")

  return (
    <main className="flex flex-col gap-section px-screen pb-28 pt-5">
      <h1 className="sr-only">{t("nav.home")}</h1>
      <BudgetOverviewSection majorScenario={majorScenario} />
      <DailyRateSection rate={dailyRate} />
      <FixedPaymentsSection onViewAll={() => onOpenDrawer("fixed")} />
      <HistorySection />
    </main>
  )
}

export function SecondaryTabPanels() {
  const t = useTranslations("Home")

  return (
    <>
      {navItems.slice(1).map((item) => (
        <TabsContent key={item.value} value={item.value} className="flex-1 px-screen pb-28 pt-5">
          <PlaceholderPanel
            title={t(item.labelKey)}
            description={t(`navPlaceholders.${item.value}`)}
            icon={item.icon}
          />
        </TabsContent>
      ))}
    </>
  )
}

function DailyRateSection({ rate }: { rate: DailyRate }) {
  const t = useTranslations("Home")

  return (
    <section className="flex flex-col gap-card-gap">
      <SectionHeader title={t("daily.title")} />
      <DailyRateCard rate={rate} />
    </section>
  )
}

function BudgetOverviewSection({ majorScenario }: { majorScenario: "active" | "none" }) {
  const t = useTranslations("Home")

  return (
    <section className="flex flex-col gap-card-gap">
      <SectionHeader title={t("budget.title")} />
      <BudgetOverviewCard majorScenario={majorScenario} />
    </section>
  )
}

function FixedPaymentsSection({ onViewAll }: { onViewAll: () => void }) {
  const t = useTranslations("Home")

  return (
    <section className="flex flex-col gap-card-gap">
      <SectionHeader title={t("fixed.title")} action={t("actions.viewAll")} onAction={onViewAll} />
      <div className="flex flex-col gap-3">
        {fixedPayments.map((payment) => (
          <PaymentRow
            key={payment.nameKey}
            name={t(payment.nameKey)}
            due={t(payment.dueKey)}
            amount={payment.amount}
            date={payment.date}
          />
        ))}
      </div>
    </section>
  )
}

function HistorySection() {
  const t = useTranslations("Home")

  return (
    <section className="flex flex-col gap-card-gap">
      <SectionHeader title={t("history.title")} actions={<HistoryActions />} />
      <div className="flex flex-col gap-3">
        {transactions.map((transaction) => (
          <TransactionRow
            key={transaction.titleKey}
            {...transaction}
            title={t(transaction.titleKey)}
          />
        ))}
      </div>
    </section>
  )
}

function HistoryActions() {
  const t = useTranslations("Home")

  return (
    <Button asChild variant="outline" size="xs" className="h-11 min-h-11 rounded-full px-3">
      <Link href="/tracker?tab=history">{t("actions.viewAll")}</Link>
    </Button>
  )
}
