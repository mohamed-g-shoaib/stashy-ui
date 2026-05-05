import { useTranslations } from "next-intl";

type TrackerTab = "fixed" | "major";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  segmentedWellClass,
  surfacePanelClass,
} from "@/lib/design-system-classes";
import { cn } from "@/lib/utils";

const tabs: TrackerTab[] = ["fixed", "major"];

export function TrackerTabBar() {
  const t = useTranslations("Tracker");

  return (
    <div className={surfacePanelClass}>
      <TabsList className={cn(segmentedWellClass, "grid-cols-2")}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="rounded-xs text-xs">
            {t(`tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
