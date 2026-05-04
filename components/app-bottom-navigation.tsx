import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

import type { NavItem } from "@/components/home/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AppBottomNavigationProps = {
  activeValue: string;
  items: NavItem[];
  onSelect?: (value: string) => void;
};

export function AppBottomNavigation({
  activeValue,
  items,
  onSelect,
}: AppBottomNavigationProps) {
  const t = useTranslations("Home");

  return (
    <nav className="fixed bottom-0 start-0 end-0 z-30 mx-auto w-full max-w-sm rounded-t-[var(--radius-xl)] border-t border-border-subtle bg-card px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-card">
      <div
        className={cn(
          "grid w-full gap-0 rounded-none bg-transparent p-0",
          items.length === 5 ? "grid-cols-5" : "grid-cols-4",
        )}
      >
        {items.map((item) => {
          const active = item.value === activeValue;
          const href = getNavHref(item.value);
          const className = cn(
            "group relative flex h-auto min-h-14 flex-col items-center justify-center gap-1.5 rounded-md px-1 py-2 text-[0.625rem] font-medium text-text-tertiary transition-[background-color,color,transform] duration-200 ease-[var(--ease-stashy)] after:hidden active:scale-[0.97]",
            active
              ? "bg-brand-subtle text-brand shadow-ring"
              : "hover:bg-surface-offset/70",
          );
          const content = (
            <>
              <HugeiconsIcon
                icon={item.icon}
                aria-hidden="true"
                size={24}
                className={cn(active ? "text-brand" : "text-text-tertiary")}
              />
              <span className="leading-none">{t(item.labelKey)}</span>
            </>
          );

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
            );
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
          );
        })}
      </div>
    </nav>
  );
}

function getNavHref(value: string) {
  if (value === "home") {
    return "/";
  }

  if (value === "tracker") {
    return "/tracker";
  }

  if (value === "analytics") {
    return "/analytics";
  }

  if (value === "history") {
    return "/transactions";
  }

  if (value === "settings") {
    return "/settings";
  }

  return null;
}
