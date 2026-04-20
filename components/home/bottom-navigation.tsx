import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

import type { NavItem } from "@/components/home/types";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type BottomNavigationProps = {
  items: NavItem[];
};

export function BottomNavigation({ items }: BottomNavigationProps) {
  const t = useTranslations("Home");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-sm rounded-t-[1.5rem] border-t border-border-subtle bg-card px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-8px_24px_rgba(20,20,19,0.04)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.2)]">
      <TabsList className="grid w-full grid-cols-4 gap-0 rounded-none bg-transparent p-0">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="group relative flex h-auto flex-col items-center justify-center gap-1.5 rounded-none bg-transparent p-1 text-[0.625rem] font-medium text-text-tertiary transition-colors after:hidden hover:bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-brand data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-brand-dark"
          >
            <HugeiconsIcon
              icon={item.icon}
              aria-hidden="true"
              size={24}
              className="text-text-tertiary transition-colors group-data-[state=active]:text-brand dark:group-data-[state=active]:text-brand-dark"
            />
            <span className="leading-none">{t(item.labelKey)}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </nav>
  );
}
