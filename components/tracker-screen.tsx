"use client";

import { useTranslations } from "next-intl";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { navItems } from "@/components/home/home-data";
import { TrackerFixedTab } from "@/components/tracker/tracker-fixed-tab";
import { Separator } from "@/components/ui/separator";

export function TrackerScreen() {
  const t = useTranslations("Tracker");

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="bg-background px-screen pt-5">
        <h1 className="text-[1.5rem] font-semibold leading-[1.2] text-foreground">
          {t("title")}
        </h1>
        <Separator className="mt-4 bg-border-subtle" />
      </header>

      <main className="flex-1 px-screen pb-32 pt-6">
        <TrackerFixedTab />
      </main>

      <AppBottomNavigation activeValue="tracker" items={navItems} />
    </div>
  );
}
