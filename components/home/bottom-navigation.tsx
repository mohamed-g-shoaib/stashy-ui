import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import type { NavItem } from "@/components/home/types"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

type BottomNavigationProps = {
  items: NavItem[]
}

export function BottomNavigation({ items }: BottomNavigationProps) {
  const t = useTranslations("Home")

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-sm border-t border-border-subtle bg-card/95 px-2 pb-3 pt-2 shadow-soft backdrop-blur">
      <TabsList className="grid h-auto w-full grid-cols-4 gap-1 rounded-none bg-transparent p-0">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="min-h-12 flex-col gap-1 rounded-sm px-1 py-1.5 text-[0.6875rem] data-active:bg-brand-subtle data-active:text-brand dark:data-active:bg-brand-subtle-dark dark:data-active:text-coral"
          >
            <HugeiconsIcon icon={item.icon} aria-hidden="true" />
            {t(item.labelKey)}
          </TabsTrigger>
        ))}
      </TabsList>
    </nav>
  )
}
