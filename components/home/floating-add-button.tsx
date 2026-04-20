import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"

type FloatingAddButtonProps = {
  onClick: () => void
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  const t = useTranslations("Home")

  return (
    <Button
      type="button"
      size="icon-lg"
      variant="outline"
      aria-label={t("fab.label")}
      className="fixed bottom-24 end-[max(1rem,calc((100vw-24rem)/2+1rem))] z-40 rounded-full bg-surface-2 shadow-card"
      onClick={onClick}
    >
      <HugeiconsIcon icon={Add01Icon} aria-hidden="true" />
    </Button>
  )
}
