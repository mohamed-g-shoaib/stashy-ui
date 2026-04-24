"use client"

import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { AppBottomNavigation } from "@/components/app-bottom-navigation"
import { navItems } from "@/components/home/home-data"
import { TrackerDrawer, type TrackerDrawerKind } from "@/components/tracker/tracker-drawer"
import { TrackerFab } from "@/components/tracker/tracker-fab"
import { TrackerFixedTab } from "@/components/tracker/tracker-fixed-tab"
import { TrackerHistoryTab } from "@/components/tracker/tracker-history-tab"
import { TrackerMajorTab } from "@/components/tracker/tracker-major-tab"
import { TrackerOverview } from "@/components/tracker/tracker-overview"
import { TrackerTabBar } from "@/components/tracker/tracker-tab-bar"
import type { TrackerTab } from "@/components/tracker/types"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { type Locale } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"

type TrackerScreenProps = {
  initialTab?: TrackerTab
}

export function TrackerScreen({ initialTab = "fixed" }: TrackerScreenProps) {
  const t = useTranslations("Tracker")
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)
  const [activeTab, setActiveTab] = React.useState<TrackerTab>(initialTab)
  const [drawer, setDrawer] = React.useState<TrackerDrawerKind | null>(null)
  const [detailsFilterCount, setDetailsFilterCount] = React.useState(0)
  const [dateFilterCount, setDateFilterCount] = React.useState(0)

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
            <TrackerFixedTab />
          </TabsContent>
          <TabsContent value="major">
            <TrackerMajorTab />
          </TabsContent>
          <TabsContent value="history">
            <TrackerHistoryTab
              detailsFilterCount={detailsFilterCount}
              dateFilterCount={dateFilterCount}
              onOpenDetailsFilter={() => setDrawer("detailsFilter")}
              onOpenDateFilter={() => setDrawer("dateFilter")}
            />
          </TabsContent>
        </main>

        <TrackerFab activeTab={activeTab} onClick={() => setDrawer("add")} />
        <AppBottomNavigation activeValue="tracker" items={navItems} />
      </div>

      <TrackerDrawer
        kind={drawer}
        activeTab={activeTab}
        direction={direction}
        onApplyDetailsFilters={setDetailsFilterCount}
        onApplyDateFilters={setDateFilterCount}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
          }
        }}
      />
    </Tabs>
  )
}
