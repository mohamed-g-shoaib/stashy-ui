"use client";

import { AddSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { AppBottomNavigation } from "@/components/app-bottom-navigation";
import { navItems } from "@/components/home/home-data";
import { TrackerAddDrawer } from "@/components/tracker/tracker-add-drawer";
import { TrackerFixedTab } from "@/components/tracker/tracker-fixed-tab";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { floatingActionButtonClass } from "@/lib/design-system-classes";
import { cn } from "@/lib/utils";

export function TrackerScreen() {
  const t = useTranslations("Tracker");
  const [addOpen, setAddOpen] = React.useState(false);

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

      {/* Tracker FAB — Teal Ledger, square-add icon, distinct from homepage Clay FAB */}
      <Button
        type="button"
        size="icon-lg"
        aria-label={t("add.fab")}
        className={cn(
          floatingActionButtonClass,
          "end-[max(1rem,calc((100vw-24rem)/2+1rem))] border-fixed/20 bg-fixed text-primary-foreground shadow-soft hover:bg-fixed/85",
        )}
        onClick={() => setAddOpen(true)}
      >
        <HugeiconsIcon icon={AddSquareIcon} aria-hidden="true" />
      </Button>

      <TrackerAddDrawer open={addOpen} onOpenChange={setAddOpen} />

      <AppBottomNavigation activeValue="tracker" items={navItems} />
    </div>
  );
}
