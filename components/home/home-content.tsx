"use client";

import { useTranslations } from "next-intl";

import { BudgetOverviewCard } from "@/components/home/budget-overview-card";
import { DailyRateCard } from "@/components/home/daily-rate-card";
import { fixedPayments, navItems } from "@/components/home/home-data";
import { PaymentRow } from "@/components/home/payment-row";
import { PlaceholderPanel } from "@/components/home/placeholder-panel";
import { SectionHeader } from "@/components/home/section-header";
import type { DailyRate, DrawerKind } from "@/components/home/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

type HomeContentProps = {
  dailyRate: DailyRate;
  introCardVisible: boolean;
  majorScenario: "active" | "none";
  onDismissIntroCard: () => void;
  onOpenDrawer: (kind: DrawerKind) => void;
};

export function HomeContent({
  dailyRate,
  introCardVisible,
  majorScenario,
  onDismissIntroCard,
  onOpenDrawer,
}: HomeContentProps) {
  const t = useTranslations("Home");

  return (
    <main className="flex flex-col gap-section px-screen pb-28 pt-5">
      <h1 className="sr-only">{t("nav.home")}</h1>
      <BudgetOverviewSection majorScenario={majorScenario} />
      <DailyRateSection
        introCardVisible={introCardVisible}
        onDismissIntroCard={onDismissIntroCard}
        rate={dailyRate}
        onOpenDrawer={onOpenDrawer}
      />
      <FixedPaymentsSection onViewAll={() => onOpenDrawer("fixed")} />
    </main>
  );
}

export function SecondaryTabPanels() {
  const t = useTranslations("Home");

  return (
    <>
      {navItems.slice(1).map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          className="flex-1 px-screen pb-28 pt-5"
        >
          <PlaceholderPanel
            title={t(item.labelKey)}
            description={t(`navPlaceholders.${item.value}`)}
            icon={item.icon}
          />
        </TabsContent>
      ))}
    </>
  );
}

function DailyRateSection({
  introCardVisible,
  onDismissIntroCard,
  rate,
  onOpenDrawer,
}: {
  introCardVisible: boolean;
  onDismissIntroCard: () => void;
  rate: DailyRate;
  onOpenDrawer: (kind: DrawerKind) => void;
}) {
  const t = useTranslations("Home");

  return (
    <section className="flex flex-col gap-card-gap">
      {introCardVisible ? (
        <IntroCard onDismiss={onDismissIntroCard} onOpenDrawer={onOpenDrawer} />
      ) : null}
      <SectionHeader title={t("daily.title")} />
      <DailyRateCard rate={rate} />
    </section>
  );
}

function BudgetOverviewSection({
  majorScenario,
}: {
  majorScenario: "active" | "none";
}) {
  const t = useTranslations("Home");

  return (
    <section className="flex flex-col gap-card-gap">
      <SectionHeader title={t("budget.title")} />
      <BudgetOverviewCard majorScenario={majorScenario} />
    </section>
  );
}

function FixedPaymentsSection({ onViewAll }: { onViewAll: () => void }) {
  const t = useTranslations("Home");

  return (
    <section className="flex flex-col gap-card-gap">
      <SectionHeader
        title={t("fixed.title")}
        action={t("actions.viewAll")}
        onAction={onViewAll}
      />
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
  );
}

function IntroCard({
  onDismiss,
  onOpenDrawer,
}: {
  onDismiss: () => void;
  onOpenDrawer: (kind: DrawerKind) => void;
}) {
  const t = useTranslations("Home");

  return (
    <Card size="sm" className="border-brand/25 bg-card py-4 shadow-card">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              {t("intro.eyebrow")}
            </p>
            <h2 className="max-w-[14ch] text-[1.75rem] font-semibold leading-[1.05] text-foreground text-balance">
              {t("intro.title")}
            </h2>
            <p className="max-w-[28ch] text-sm leading-[1.6] text-text-secondary text-pretty">
              {t("intro.description")}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 rounded-full text-text-secondary transition-colors hover:text-brand"
            onClick={onDismiss}
          >
            <span className="sr-only">{t("intro.dismiss")}</span>
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            className="w-full"
            onClick={() => onOpenDrawer("add")}
          >
            {t("intro.logAction")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => onOpenDrawer("help")}
          >
            {t("intro.learnAction")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
