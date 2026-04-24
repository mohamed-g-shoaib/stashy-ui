import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import type { NavItem } from "@/components/home/types"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type AppBottomNavigationProps = {
  activeValue: string
  items: NavItem[]
  onSelect?: (value: string) => void
}

export function AppBottomNavigation({ activeValue, items, onSelect }: AppBottomNavigationProps) {
  const t = useTranslations("Home")

  return (
    <nav className="fixed bottom-0 start-0 end-0 z-30 mx-auto w-full max-w-sm rounded-t-[1.5rem] border-t border-border-subtle bg-card px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-8px_24px_rgba(20,20,19,0.04)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.2)]">
      <div className="grid w-full grid-cols-4 gap-0 rounded-none bg-transparent p-0">
        {items.map((item) => {
          const active = item.value === activeValue
          const href = getNavHref(item.value)
          const className = cn(
            "group relative flex h-auto flex-col items-center justify-center gap-1.5 rounded-none bg-transparent p-1 text-[0.625rem] font-medium text-text-tertiary transition-colors after:hidden hover:bg-transparent",
            active && "text-brand",
          )
          const content = (
            <>
              <HugeiconsIcon
                icon={item.icon}
                aria-hidden="true"
                size={24}
                className={cn("text-text-tertiary", active && "text-brand")}
              />
              <span className="leading-none">{t(item.labelKey)}</span>
            </>
          )

          if (href) {
            return (
              <Link
                key={item.value}
                href={href}
                className={className}
                aria-current={active ? "page" : undefined}
              >
                {content}
              </Link>
            )
          }

          return (
            <button
              key={item.value}
              type="button"
              className={className}
              aria-current={active ? "page" : undefined}
              onClick={() => onSelect?.(item.value)}
            >
              {content}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function getNavHref(value: string) {
  if (value === "home") {
    return "/"
  }

  if (value === "tracker") {
    return "/tracker"
  }

  return null
}
