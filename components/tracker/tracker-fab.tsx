import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import type { TrackerTab } from "@/components/tracker/types"
import { Button } from "@/components/ui/button"

type TrackerFabProps = {
  activeTab: TrackerTab
  onClick: () => void
}

export function TrackerFab({ activeTab, onClick }: TrackerFabProps) {
  const t = useTranslations("Tracker")

  if (activeTab === "history") {
    return null
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      className="fixed bottom-24 end-[max(1rem,calc((100vw-24rem)/2+1rem))] z-40 rounded-full bg-surface-2 shadow-card"
      aria-label={activeTab === "fixed" ? t("fab.fixed") : t("fab.major")}
      onClick={onClick}
    >
      <HugeiconsIcon icon={Add01Icon} aria-hidden="true" />
    </Button>
  )
}
