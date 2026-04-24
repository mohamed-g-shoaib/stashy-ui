import { useTranslations } from "next-intl"

import type { TrackerTab } from "@/components/tracker/types"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs: TrackerTab[] = ["fixed", "major", "history"]

export function TrackerTabBar() {
  const t = useTranslations("Tracker")

  return (
    <div className="rounded-md bg-surface-offset p-3 shadow-ring">
      <TabsList className="grid h-11 w-full grid-cols-3 rounded-sm bg-card p-1">
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="rounded-xs text-xs">
            {t(`tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )
}
