"use client";

import { useTranslations } from "next-intl";

import type { HistoryFilterState } from "@/components/history/types";
import { HistoryFilterControls } from "@/components/history/history-filter-controls";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type HistoryFilterDrawerProps = {
  open: boolean;
  direction: "ltr" | "rtl";
  filterState: HistoryFilterState;
  onApplyFilters: (filters: HistoryFilterState) => void;
  onOpenChange: (open: boolean) => void;
};

export function HistoryFilterDrawer({
  open,
  direction,
  filterState,
  onApplyFilters,
  onOpenChange,
}: HistoryFilterDrawerProps) {
  const t = useTranslations("History.drawer.filter");

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent dir={direction} className="mx-auto max-w-sm">
        <DrawerHeader className="text-start">
          <DrawerTitle>{t("title")}</DrawerTitle>
          <DrawerDescription>{t("description")}</DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
          <HistoryFilterControls
            filterState={filterState}
            onApplyFilters={onApplyFilters}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
