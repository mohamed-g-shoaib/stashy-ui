"use client"

import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { AppBottomNavigation } from "@/components/app-bottom-navigation"
import { FloatingAddButton } from "@/components/home/floating-add-button"
import { HomeContent, SecondaryTabPanels } from "@/components/home/home-content"
import { navItems } from "@/components/home/home-data"
import { HomeDrawer } from "@/components/home/home-drawer"
import { HomeHeader } from "@/components/home/home-header"
import type { DailyRate, DailyScenario, DrawerKind } from "@/components/home/types"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { type Locale } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"

export function HomeScreen() {
  const t = useTranslations("Home")
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)
  const [drawer, setDrawer] = React.useState<DrawerKind | null>(null)
  const [activeNav, setActiveNav] = React.useState("home")
  const [dailyScenario, setDailyScenario] = React.useState<DailyScenario>("track")
  const [majorScenario, setMajorScenario] = React.useState<"active" | "none">("active")
  const [introCardVisible, setIntroCardVisible] = React.useState(true)
  const dailyRate = getDailyRate(dailyScenario, t)

  React.useEffect(() => {
    const dismissed = window.localStorage.getItem("stashy-home-intro-dismissed")

    if (dismissed === "true") {
      setIntroCardVisible(false)
    }
  }, [])

  const handleIntroCardVisibleChange = React.useCallback((visible: boolean) => {
    window.localStorage.setItem("stashy-home-intro-dismissed", visible ? "false" : "true")
    setIntroCardVisible(visible)
  }, [])

  return (
    <Tabs value={activeNav} onValueChange={setActiveNav} className="min-h-svh gap-0 bg-background">
      <div className="flex min-h-svh flex-col">
        <HomeHeader onOpenDrawer={setDrawer} />
        <TabsContent value="home" className="flex-1">
          <HomeContent
            dailyRate={dailyRate}
            introCardVisible={introCardVisible}
            majorScenario={majorScenario}
            onDismissIntroCard={() => handleIntroCardVisibleChange(false)}
            onOpenDrawer={setDrawer}
          />
        </TabsContent>
        <SecondaryTabPanels />
        <FloatingAddButton onClick={() => setDrawer("add")} />
        <AppBottomNavigation activeValue={activeNav} items={navItems} onSelect={setActiveNav} />
      </div>

      <HomeDrawer
        kind={drawer}
        dailyScenario={dailyScenario}
        introCardVisible={introCardVisible}
        majorScenario={majorScenario}
        direction={direction}
        onDailyScenarioChange={setDailyScenario}
        onIntroCardVisibleChange={handleIntroCardVisibleChange}
        onMajorScenarioChange={setMajorScenario}
        onPreviewAddAction={(action, amount) => {
          if (action === "major") {
            setMajorScenario("active")
            return
          }

          if (action === "receive" || action === "injection") {
            setDailyScenario("track")
            return
          }

          setDailyScenario(amount > 615.38 ? "overspent" : "track")
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
  scenario: DailyScenario,
  t: ReturnType<typeof useTranslations<"Home">>,
): DailyRate {
  if (scenario === "track") {
    return {
      remaining: "615.38 EGP",
      allowance: "815.38 EGP",
      spent: "200 EGP",
      explanation: t("daily.explanationTrack"),
      tomorrow: null,
      status: t("daily.statusTrack"),
      statusTone: "success",
      fill: "basis-[75%]",
      spentFill: "basis-[25%]",
    }
  }

  return {
    remaining: "-84.62 EGP",
    allowance: "815.38 EGP",
    spent: "900 EGP",
    explanation: t("daily.explanationOverspent"),
    tomorrow: "742 EGP",
    status: t("daily.statusOverspent"),
    statusTone: "danger",
    fill: "basis-[8%]",
    spentFill: "basis-[92%]",
  }
}
