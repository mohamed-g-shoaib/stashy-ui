import { HelpCircleIcon, Settings02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import type { DrawerKind } from "@/components/home/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { iconWellClass } from "@/lib/design-system-classes"
import { cn } from "@/lib/utils"

type HomeHeaderProps = {
  onOpenDrawer: (kind: DrawerKind) => void
}

export function HomeHeader({ onOpenDrawer }: HomeHeaderProps) {
  const t = useTranslations("Home")

  return (
    <header className="shrink-0 px-screen pt-6">
      <div className="flex items-center gap-3">
        <Avatar size="lg" className="size-12 bg-brand-subtle text-brand shadow-ring">
          <AvatarFallback className="text-[0.9375rem] font-semibold text-foreground">
            M
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 text-start">
          <p className="truncate text-[1.0625rem] font-semibold leading-[1.3] text-foreground">
            {t("header.greeting")}
          </p>
          <p className="truncate text-xs font-medium leading-[1.4] text-text-secondary">
            {t("header.date")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <HeaderIconButton label={t("header.help")} onClick={() => onOpenDrawer("help")}>
            <HugeiconsIcon icon={HelpCircleIcon} aria-hidden="true" />
          </HeaderIconButton>
          <HeaderIconButton label={t("header.settings")} onClick={() => onOpenDrawer("settings")}>
            <HugeiconsIcon icon={Settings02Icon} aria-hidden="true" />
          </HeaderIconButton>
        </div>
      </div>
      <Separator className="mt-4 bg-border-subtle" />
    </header>
  )
}

function HeaderIconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={cn(iconWellClass, "rounded-full bg-surface")}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
