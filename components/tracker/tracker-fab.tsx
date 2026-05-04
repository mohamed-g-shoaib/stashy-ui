import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

import type { TrackerTab } from "@/components/tracker/types";
import { Button } from "@/components/ui/button";
import { floatingActionButtonClass } from "@/lib/design-system-classes";
import { cn } from "@/lib/utils";

type TrackerFabProps = {
  activeTab: TrackerTab;
  onClick: () => void;
};

export function TrackerFab({ activeTab, onClick }: TrackerFabProps) {
  const t = useTranslations("Tracker");

  return (
    <Button
      type="button"
      size="icon-lg"
      className={cn(
        floatingActionButtonClass,
        "end-[max(1rem,calc((100vw-24rem)/2+1rem))] bg-brand text-primary-foreground shadow-ring-brand hover:bg-brand-hover",
      )}
      aria-label={activeTab === "fixed" ? t("fab.fixed") : t("fab.major")}
      onClick={onClick}
    >
      <HugeiconsIcon icon={Add01Icon} aria-hidden="true" />
    </Button>
  );
}
