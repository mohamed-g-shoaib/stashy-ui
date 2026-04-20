import {
  Add01Icon,
  ChartLineData01Icon,
  CreditCardIcon,
  HelpCircleIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useTranslations } from "next-intl";

import type { DailyScenario, DrawerKind } from "@/components/home/types";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type HomeDrawerProps = {
  kind: DrawerKind | null;
  dailyScenario: DailyScenario;
  majorScenario: "active" | "none";
  direction: "ltr" | "rtl";
  onDailyScenarioChange: (value: DailyScenario) => void;
  onMajorScenarioChange: (value: "active" | "none") => void;
  onOpenChange: (open: boolean) => void;
};

export function HomeDrawer({
  kind,
  dailyScenario,
  majorScenario,
  direction,
  onDailyScenarioChange,
  onMajorScenarioChange,
  onOpenChange,
}: HomeDrawerProps) {
  const t = useTranslations("Home.drawer");
  const open = kind !== null;
  const title = kind ? t(`${kind}.title`) : t("add.title");
  const description = kind ? t(`${kind}.description`) : t("add.description");

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent dir={direction} className="mx-auto max-w-sm">
        <DrawerHeader className="text-start">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-3 px-4 pb-2">
          {kind === "settings" ? (
            <SettingsControls
              value={dailyScenario}
              onValueChange={onDailyScenarioChange}
              majorScenario={majorScenario}
              onMajorChange={onMajorScenarioChange}
            />
          ) : (
            <DrawerPreview kind={kind} />
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              {t("close")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function SettingsControls({
  value,
  onValueChange,
  majorScenario,
  onMajorChange,
}: {
  value: DailyScenario;
  onValueChange: (value: DailyScenario) => void;
  majorScenario: "active" | "none";
  onMajorChange: (value: "active" | "none") => void;
}) {
  const t = useTranslations("Home.drawer");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>
      <div className="flex flex-col gap-2 rounded-md bg-surface-offset p-3 text-start shadow-ring">
        <p className="text-sm font-semibold text-foreground">
          {t("settings.previewLabel")}
        </p>
        <Tabs
          value={value}
          onValueChange={(nextValue) =>
            onValueChange(nextValue as DailyScenario)
          }
          className="gap-3"
        >
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-sm bg-card p-1">
            <TabsTrigger value="track" className="rounded-xs text-xs">
              {t("settings.trackPreview")}
            </TabsTrigger>
            <TabsTrigger value="overspent" className="rounded-xs text-xs">
              {t("settings.overspentPreview")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-2 h-px bg-border-subtle" />
        <p className="mt-1 text-sm font-semibold text-foreground">
          Major Expense
        </p>
        <Tabs
          value={majorScenario}
          onValueChange={(nextValue) =>
            onMajorChange(nextValue as "active" | "none")
          }
          className="gap-3"
        >
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-sm bg-card p-1">
            <TabsTrigger value="active" className="rounded-xs text-xs">
              Show
            </TabsTrigger>
            <TabsTrigger value="none" className="rounded-xs text-xs">
              Hide
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

function DrawerPreview({ kind }: { kind: DrawerKind | null }) {
  const t = useTranslations("Home.drawer");

  if (kind === "filter") {
    return <FilterTabs />;
  }

  return (
    <div className="flex items-center gap-3 rounded-md bg-surface-offset p-3 text-start shadow-ring">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-brand shadow-ring">
        <HugeiconsIcon
          icon={getDrawerPreviewIcon(kind)}
          size={22}
          aria-hidden="true"
        />
      </span>
      <p className="text-sm leading-[1.5] text-text-secondary">
        {t("preview")}
      </p>
    </div>
  );
}

function FilterTabs() {
  const t = useTranslations("Home.drawer");

  return (
    <Tabs defaultValue="all" className="gap-3">
      <TabsList className="grid h-11 w-full grid-cols-3 rounded-sm bg-surface-offset p-1">
        <TabsTrigger value="all" className="rounded-xs text-xs">
          {t("filter.all")}
        </TabsTrigger>
        <TabsTrigger value="spent" className="rounded-xs text-xs">
          {t("filter.spent")}
        </TabsTrigger>
        <TabsTrigger value="received" className="rounded-xs text-xs">
          {t("filter.received")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function getDrawerPreviewIcon(kind: DrawerKind | null): IconSvgElement {
  if (kind === "add") {
    return Add01Icon;
  }

  if (kind === "help") {
    return HelpCircleIcon;
  }

  if (kind === "fixed") {
    return Wallet02Icon;
  }

  if (kind === "history") {
    return CreditCardIcon;
  }

  return ChartLineData01Icon;
}
