"use client"

import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { AppBottomNavigation } from "@/components/app-bottom-navigation"
import { FloatingAddButton } from "@/components/home/floating-add-button"
import { HomeContent, SecondaryTabPanels } from "@/components/home/home-content"
import { navItems } from "@/components/home/home-data"
import { HomeDrawer } from "@/components/home/home-drawer"
import { HomeHeader } from "@/components/home/home-header"
import type { DailyRate, DrawerKind } from "@/components/home/types"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { type Locale } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"
import { useSandboxStore } from "@/store/sandbox-store"

export function HomeScreen() {
  const t = useTranslations("Home")
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)
  const [drawer, setDrawer] = React.useState<DrawerKind | null>(null)
  const [activeNav, setActiveNav] = React.useState("home")

  const {
    monthlyBudgetState,
    dailyRateState,
    majorScenario,
    introCardVisible,
    setIntroCardVisible,
  } = useSandboxStore()

  const dailyRate = getDailyRate(monthlyBudgetState, dailyRateState, t)

  return (
    <Tabs value={activeNav} onValueChange={setActiveNav} className="min-h-svh gap-0 bg-background">
      <div className="flex min-h-svh flex-col">
        <HomeHeader onOpenDrawer={setDrawer} />
        <TabsContent value="home" className="flex-1">
          <HomeContent
            dailyRate={dailyRate}
            introCardVisible={introCardVisible}
            majorScenario={monthlyBudgetState === "over" ? "active" : majorScenario}
            onDismissIntroCard={() => setIntroCardVisible(false)}
            onOpenDrawer={setDrawer}
          />
        </TabsContent>
        <SecondaryTabPanels />
        <FloatingAddButton onClick={() => setDrawer("add")} />
        <AppBottomNavigation activeValue={activeNav} items={navItems} onSelect={setActiveNav} />
      </div>

      <HomeDrawer
        kind={drawer}
        direction={direction}
        onPreviewAddAction={() => {
          // Drawer-local preview only — does not write to sandbox store
        }}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
          }
        }}
      />
    </Tabs>
  )
}


function getDailyRate(
  monthlyBudgetState: "onTrack" | "atRisk" | "over",
  dailyRateState: "underRate" | "overRate",
  t: ReturnType<typeof useTranslations<"Home">>,
): DailyRate {
  if (monthlyBudgetState === "over") {
    return {
      remaining: "−1,240 EGP",
      remainingAmount: -1240,
      allowance: "815.38 EGP",
      allowanceAmount: 815.38,
      spent: "2,055.38 EGP",
      spentAmount: 2055.38,
      explanation: "",
      tomorrow: null,
      tomorrowAmount: null,
      status: t("daily.statusEmergency"),
      statusTone: "expense",
      overByAmount: 1240,
    }
  }

  if (dailyRateState === "overRate") {
    return {
      remaining: "-84.62 EGP",
      remainingAmount: -84.62,
      allowance: "815.38 EGP",
      allowanceAmount: 815.38,
      spent: "900 EGP",
      spentAmount: 900,
      explanation: t("daily.explanationOverspent"),
      tomorrow: "742 EGP",
      tomorrowAmount: 742,
      status: t("daily.statusOverspent"),
      statusTone: "expense",
      overByAmount: null,
    }
  }

  // on-track default
  return {
    remaining: "615.38 EGP",
    remainingAmount: 615.38,
    allowance: "815.38 EGP",
    allowanceAmount: 815.38,
    spent: "200 EGP",
    spentAmount: 200,
    explanation: t("daily.explanationTrack"),
    tomorrow: "871.32 EGP",
    tomorrowAmount: 871.32,
    status: t("daily.statusTrack"),
    statusTone: "fixed",
    overByAmount: null,
  }
}
