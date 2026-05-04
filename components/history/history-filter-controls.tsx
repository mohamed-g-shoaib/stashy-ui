import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import * as React from "react";

import type { HistoryFilterState } from "@/components/history/types";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  dateFieldClass,
  segmentedWellClass,
  surfacePanelClass,
} from "@/lib/design-system-classes";
import { cn } from "@/lib/utils";

export const defaultHistoryFilterState: HistoryFilterState = {
  type: "all",
  direction: "all",
  method: "all",
  preset: "thisMonth",
  from: "",
  to: "",
};

const filterOptions = {
  type: ["all", "variable", "monthly", "budget", "major"],
  direction: ["all", "expense", "received"],
  method: ["all", "cash", "card", "bank"],
};

const filterGridClass = {
  type: "grid-cols-2",
  direction: "grid-cols-3",
  method: "grid-cols-2",
};

const datePresetOptions = ["thisMonth", "thisWeek", "today"];

export function getActiveHistoryFilterCount(filters: HistoryFilterState) {
  return Object.entries(filters).filter(
    ([key, value]) =>
      value !== defaultHistoryFilterState[key as keyof HistoryFilterState],
  ).length;
}

export function HistoryFilterControls({
  filterState,
  onApplyFilters,
}: {
  filterState: HistoryFilterState;
  onApplyFilters: (filters: HistoryFilterState) => void;
}) {
  const t = useTranslations("History.drawer.filter");
  const [filters, setFilters] = React.useState<HistoryFilterState>(filterState);

  React.useEffect(() => {
    setFilters(filterState);
  }, [filterState]);

  const activeCount = getActiveHistoryFilterCount(filters);

  return (
    <div className="flex flex-col gap-4">
      <FilterGroup
        label={t("type")}
        kind="type"
        value={filters.type}
        onValueChange={(value) =>
          setFilters((current) => ({ ...current, type: value }))
        }
      />
      <FilterGroup
        label={t("direction")}
        kind="direction"
        value={filters.direction}
        onValueChange={(value) =>
          setFilters((current) => ({ ...current, direction: value }))
        }
      />
      <FilterGroup
        label={t("method")}
        kind="method"
        value={filters.method}
        onValueChange={(value) =>
          setFilters((current) => ({ ...current, method: value }))
        }
      />
      <div className={cn("text-start", surfacePanelClass)}>
        <p className="mb-2 text-sm font-semibold text-foreground">
          {t("preset")}
        </p>
        <Tabs
          value={filters.preset}
          onValueChange={(value) =>
            setFilters((current) => ({ ...current, preset: value }))
          }
          className="gap-0"
        >
          <TabsList className={cn(segmentedWellClass, "grid-cols-3")}>
            {datePresetOptions.map((option) => (
              <TabsTrigger
                key={option}
                value={option}
                className="min-h-10 rounded-xs text-xs"
              >
                {t(`dateOptions.${option}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className={cn("text-start", surfacePanelClass)}>
        <p className="mb-2 text-sm font-semibold text-foreground">
          {t("customRange")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <DateInput
            label={t("from")}
            value={filters.from}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                from: value,
                preset: "custom",
              }))
            }
          />
          <DateInput
            label={t("to")}
            value={filters.to}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                to: value,
                preset: "custom",
              }))
            }
          />
        </div>
      </div>
      <FilterActions
        onClear={() => {
          setFilters(defaultHistoryFilterState);
          onApplyFilters(defaultHistoryFilterState);
        }}
        onApply={() => onApplyFilters(filters)}
        activeCount={activeCount}
      />
    </div>
  );
}

function FilterGroup({
  label,
  kind,
  value,
  onValueChange,
}: {
  label: string;
  kind: "type" | "direction" | "method";
  value: string;
  onValueChange: (value: string) => void;
}) {
  const t = useTranslations("History.drawer.filter");
  const options = filterOptions[kind];
  const gridClass = filterGridClass[kind];

  return (
    <div className={cn("text-start", surfacePanelClass)}>
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      <Tabs value={value} onValueChange={onValueChange} className="gap-0">
        <TabsList
          className={cn(
            segmentedWellClass,
            "!h-auto auto-rows-[2.5rem]",
            gridClass,
          )}
        >
          {options.map((option) => (
            <TabsTrigger
              key={option}
              value={option}
              className="min-h-10 rounded-xs text-xs"
            >
              {t(`${kind}Options.${option}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

function FilterActions({
  activeCount,
  onClear,
  onApply,
}: {
  activeCount: number;
  onClear: () => void;
  onApply: () => void;
}) {
  const t = useTranslations("History.drawer.filter");

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button type="button" variant="secondary" onClick={onClear}>
        {t("clear")}
      </Button>
      <DrawerClose asChild>
        <Button type="button" onClick={onApply}>
          {activeCount > 0
            ? t("applyCount", { count: activeCount })
            : t("apply")}
        </Button>
      </DrawerClose>
    </div>
  );
}

function DateInput({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
        {label}
      </span>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className={dateFieldClass}
        />
        <HugeiconsIcon
          icon={Calendar03Icon}
          aria-hidden="true"
          size={16}
          className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
      </div>
    </label>
  );
}
