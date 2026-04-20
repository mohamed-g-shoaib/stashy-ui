"use client";

import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { BottomNavigation } from "@/components/home/bottom-navigation";
import { FloatingAddButton } from "@/components/home/floating-add-button";
import {
  HomeContent,
  SecondaryTabPanels,
} from "@/components/home/home-content";
import { navItems } from "@/components/home/home-data";
import { HomeDrawer } from "@/components/home/home-drawer";
import { HomeHeader } from "@/components/home/home-header";
import type {
  DailyRate,
  DailyScenario,
  DrawerKind,
} from "@/components/home/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { type Locale } from "@/i18n/routing";
import { getDirectionForLocale } from "@/lib/i18n";

export function HomeScreen() {
  const t = useTranslations("Home");
  const locale = useLocale() as Locale;
  const direction = getDirectionForLocale(locale);
  const [drawer, setDrawer] = React.useState<DrawerKind | null>(null);
  const [dailyScenario, setDailyScenario] =
    React.useState<DailyScenario>("track");
  const [majorScenario, setMajorScenario] = React.useState<"active" | "none">(
    "active",
  );
  const dailyRate = getDailyRate(dailyScenario, t);

  return (
    <Tabs defaultValue="home" className="min-h-svh gap-0 bg-background">
      <div className="flex min-h-svh flex-col">
        <HomeHeader onOpenDrawer={setDrawer} />
        <TabsContent value="home" className="flex-1">
          <HomeContent
            dailyRate={dailyRate}
            majorScenario={majorScenario}
            onOpenDrawer={setDrawer}
          />
        </TabsContent>
        <SecondaryTabPanels />
        <FloatingAddButton onClick={() => setDrawer("add")} />
        <BottomNavigation items={navItems} />
      </div>

      <HomeDrawer
        kind={drawer}
        dailyScenario={dailyScenario}
        majorScenario={majorScenario}
        direction={direction}
        onDailyScenarioChange={setDailyScenario}
        onMajorScenarioChange={setMajorScenario}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null);
          }
        }}
      />
    </Tabs>
  );
}

function getDailyRate(
  scenario: DailyScenario,
  t: ReturnType<typeof useTranslations<"Home">>,
): DailyRate {
  if (scenario === "track") {
    return {
      remaining: "615.38 EGP",
      allowance: "815.38 EGP",
      spent: "200 EGP",
      tomorrow: "860 EGP",
      status: t("daily.statusTrack"),
      statusTone: "success",
      fill: "basis-[75%]",
      spentFill: "basis-[25%]",
    };
  }

  return {
    remaining: "-84.62 EGP",
    allowance: "815.38 EGP",
    spent: "900 EGP",
    tomorrow: "742 EGP",
    status: t("daily.statusOverspent"),
    statusTone: "danger",
    fill: "basis-[8%]",
    spentFill: "basis-[92%]",
  };
}
