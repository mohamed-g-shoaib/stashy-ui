"use client";

import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import {
  BankIcon,
  CreditCardIcon,
  MoneyBag02Icon,
} from "@hugeicons/core-free-icons";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { navItems } from "@/components/home/home-data";
import {
  TrackerDrawer,
  type TrackerAddAction,
  type TrackerDrawerKind,
} from "@/components/tracker/tracker-drawer";
import { TrackerFab } from "@/components/tracker/tracker-fab";
import { TrackerFixedTab } from "@/components/tracker/tracker-fixed-tab";
import { TrackerMajorTab } from "@/components/tracker/tracker-major-tab";
import { TrackerOverview } from "@/components/tracker/tracker-overview";
import { TrackerTabBar } from "@/components/tracker/tracker-tab-bar";
import {
  budgetBuckets as initialBudgetBuckets,
  majorExpenses as initialMajorExpenses,
  monthlyPayments as initialMonthlyPayments,
} from "@/components/tracker/tracker-data";
import type { TrackerTab } from "@/components/tracker/types";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { type Locale } from "@/i18n/routing";
import { getDirectionForLocale } from "@/lib/i18n";

type TrackerScreenProps = {
  initialTab?: TrackerTab;
};

export function TrackerScreen({ initialTab = "fixed" }: TrackerScreenProps) {
  const t = useTranslations("Tracker");
  const locale = useLocale() as Locale;
  const direction = getDirectionForLocale(locale);
  const [activeTab, setActiveTab] = React.useState<TrackerTab>(initialTab);
  const [drawer, setDrawer] = React.useState<TrackerDrawerKind | null>(null);
  const [monthlyItems, setMonthlyItems] = React.useState(
    initialMonthlyPayments,
  );
  const [budgetItems, setBudgetItems] = React.useState(initialBudgetBuckets);
  const [majorItems, setMajorItems] = React.useState(initialMajorExpenses);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TrackerTab)}
      className="min-h-svh gap-0 bg-background"
    >
      <div className="flex min-h-svh flex-col">
        <header className="bg-background px-screen pt-5">
          <h1 className="text-[1.5rem] font-semibold leading-[1.2] text-foreground">
            {t("title")}
          </h1>
          <Separator className="mt-4 bg-border-subtle" />
        </header>

        <div className="sticky top-0 z-10 bg-background px-screen pb-3 pt-4">
          <TrackerOverview />
          <div className="mt-4">
            <TrackerTabBar />
          </div>
        </div>

        <main className="flex-1 px-screen pb-32 pt-4">
          <TabsContent value="fixed">
            <TrackerFixedTab items={monthlyItems} buckets={budgetItems} />
          </TabsContent>
          <TabsContent value="major">
            <TrackerMajorTab items={majorItems} />
          </TabsContent>
        </main>

        <TrackerFab activeTab={activeTab} onClick={() => setDrawer("add")} />
        <AppBottomNavigation activeValue="tracker" items={navItems} />
      </div>

      <TrackerDrawer
        kind={drawer}
        activeTab={activeTab}
        direction={direction}
        onSaveAddAction={(action) => {
          applyTrackerAction({
            action,
            t,
            setActiveTab,
            setBudgetItems,
            setDrawer,
            setMajorItems,
            setMonthlyItems,
          });
        }}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null);
          }
        }}
      />
    </Tabs>
  );
}

function applyTrackerAction({
  action,
  t,
  setActiveTab,
  setBudgetItems,
  setDrawer,
  setMajorItems,
  setMonthlyItems,
}: {
  action: TrackerAddAction;
  t: ReturnType<typeof useTranslations<"Tracker">>;
  setActiveTab: React.Dispatch<React.SetStateAction<TrackerTab>>;
  setBudgetItems: React.Dispatch<
    React.SetStateAction<typeof initialBudgetBuckets>
  >;
  setDrawer: React.Dispatch<React.SetStateAction<TrackerDrawerKind | null>>;
  setMajorItems: React.Dispatch<
    React.SetStateAction<typeof initialMajorExpenses>
  >;
  setMonthlyItems: React.Dispatch<
    React.SetStateAction<typeof initialMonthlyPayments>
  >;
}) {
  if (action.kind === "monthlyPayment") {
    const methodTone = action.method;
    setMonthlyItems((current) => [
      {
        nameLabel: action.name,
        amount: formatAmount(action.amount),
        status: "pending",
        date: `Apr ${action.dueDay}`,
      },
      ...current,
    ]);
    setActiveTab("fixed");
    setDrawer(null);
    return;
  }

  if (action.kind === "budgetTransaction") {
    const categoryKey = `budgets.${action.category}` as const;
    setBudgetItems((current) =>
      current.map((bucket) => {
        if (bucket.nameKey !== categoryKey) {
          return bucket;
        }

        const spent = extractAmount(bucket.spent) + action.amount;
        const budgeted = extractAmount(bucket.budgeted);
        const percent = Math.round((spent / budgeted) * 100);

        return {
          ...bucket,
          spent: formatAmount(spent),
          percent,
          percentClass: `basis-[${Math.min(percent, 100)}%]`,
          transactionCount: bucket.transactionCount + 1,
        };
      }),
    );
    setActiveTab("fixed");
    setDrawer(null);
    return;
  }

  setMajorItems((current) => [
    {
      nameLabel: action.name,
      amount: formatAmount(action.amount),
      date: t("history.today"),
      methodKey: `methods.${action.method}`,
      percent: `${Math.max(1, Math.round((action.amount / 20000) * 100))}%`,
      isLarge: action.scale === "large",
    },
    ...current,
  ]);
  setActiveTab("major");
  setDrawer(null);
}

function getMethodIcon(method: "cash" | "card" | "bank") {
  if (method === "cash") {
    return MoneyBag02Icon;
  }

  return method === "card" ? CreditCardIcon : BankIcon;
}

function formatAmount(value: number) {
  return `${formatNumber(value)} EGP`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function extractAmount(value: string) {
  return Number(value.replaceAll(/[^\d]/g, "")) || 0;
}
