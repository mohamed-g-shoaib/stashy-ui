"use client"

import {
  Add01Icon,
  Calendar03Icon,
  CreditCardIcon,
  Invoice03Icon,
  MoneyBag02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import * as React from "react"

import type { FilterKind, TrackerTab } from "@/components/tracker/types"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type TrackerDrawerKind = "add" | "detailsFilter" | "dateFilter"

type TrackerDrawerProps = {
  kind: TrackerDrawerKind | null
  activeTab: TrackerTab
  direction: "ltr" | "rtl"
  onApplyDetailsFilters: (count: number) => void
  onApplyDateFilters: (count: number) => void
  onOpenChange: (open: boolean) => void
}

export function TrackerDrawer({
  kind,
  activeTab,
  direction,
  onApplyDetailsFilters,
  onApplyDateFilters,
  onOpenChange,
}: TrackerDrawerProps) {
  const t = useTranslations("Tracker.drawer")
  const open = kind !== null
  const isDetailsFilter = kind === "detailsFilter"
  const isDateFilter = kind === "dateFilter"
  const isFilter = isDetailsFilter || isDateFilter

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent dir={direction} className="mx-auto max-w-sm">
        <DrawerHeader className="text-start">
          <DrawerTitle>
            {isDetailsFilter
              ? t("filter.detailsTitle")
              : isDateFilter
                ? t("filter.dateTitle")
                : t(`add.${activeTab}.title`)}
          </DrawerTitle>
          <DrawerDescription>
            {isDetailsFilter
              ? t("filter.detailsDescription")
              : isDateFilter
                ? t("filter.dateDescription")
                : t(`add.${activeTab}.description`)}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2">
          {isDetailsFilter ? (
            <DetailsFilterControls onApplyFilters={onApplyDetailsFilters} />
          ) : isDateFilter ? (
            <DateFilterControls onApplyFilters={onApplyDateFilters} />
          ) : (
            <AddPreview activeTab={activeTab} />
          )}
        </div>
        <DrawerFooter>
          {isFilter ? null : (
            <DrawerClose asChild>
              <Button type="button" variant="secondary">
                {t("close")}
              </Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DetailsFilterControls({ onApplyFilters }: { onApplyFilters: (count: number) => void }) {
  const t = useTranslations("Tracker.drawer.filter")
  const [type, setType] = React.useState("all")
  const [direction, setDirection] = React.useState("all")
  const [method, setMethod] = React.useState("all")
  const activeCount = [type, direction, method].filter((value) => value !== "all").length

  return (
    <div className="flex flex-col gap-4">
      <FilterGroup label={t("type")} kind="type" value={type} onValueChange={setType} />
      <FilterGroup
        label={t("direction")}
        kind="direction"
        value={direction}
        onValueChange={setDirection}
      />
      <FilterGroup label={t("method")} kind="method" value={method} onValueChange={setMethod} />
      <FilterActions
        onClear={() => {
          setType("all")
          setDirection("all")
          setMethod("all")
          onApplyFilters(0)
        }}
        onApply={() => onApplyFilters(activeCount)}
      />
    </div>
  )
}

function DateFilterControls({ onApplyFilters }: { onApplyFilters: (count: number) => void }) {
  const t = useTranslations("Tracker.drawer.filter")
  const [preset, setPreset] = React.useState("thisMonth")
  const activeCount = preset === "thisMonth" ? 0 : 1

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md bg-surface-offset p-3 text-start shadow-ring">
        <p className="mb-2 text-sm font-semibold text-foreground">{t("preset")}</p>
        <Tabs value={preset} onValueChange={setPreset} className="gap-0">
          <TabsList className="grid h-11 w-full grid-cols-3 rounded-sm bg-card p-1">
            {datePresetOptions.map((option) => (
              <TabsTrigger key={option} value={option} className="min-h-10 rounded-xs text-xs">
                {t(`dateOptions.${option}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="rounded-md bg-surface-offset p-3 text-start shadow-ring">
        <p className="mb-2 text-sm font-semibold text-foreground">{t("customRange")}</p>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" size="xs" className="h-11">
            <HugeiconsIcon icon={Calendar03Icon} data-icon="inline-start" aria-hidden="true" />
            {t("from")}
          </Button>
          <Button type="button" variant="outline" size="xs" className="h-11">
            <HugeiconsIcon icon={Calendar03Icon} data-icon="inline-start" aria-hidden="true" />
            {t("to")}
          </Button>
        </div>
      </div>
      <FilterActions
        onClear={() => {
          setPreset("thisMonth")
          onApplyFilters(0)
        }}
        onApply={() => onApplyFilters(activeCount)}
      />
    </div>
  )
}

function FilterGroup({
  label,
  kind,
  value,
  onValueChange,
}: {
  label: string
  kind: FilterKind
  value: string
  onValueChange: (value: string) => void
}) {
  const t = useTranslations("Tracker.drawer.filter")
  const options = filterOptions[kind]
  const gridClass = filterGridClass[kind]

  return (
    <div className="rounded-md bg-surface-offset p-3 text-start shadow-ring">
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      <Tabs value={value} onValueChange={onValueChange} className="gap-0">
        <TabsList
          className={cn("grid !h-auto w-full auto-rows-[2.5rem] rounded-sm bg-card p-1", gridClass)}
        >
          {options.map((option) => (
            <TabsTrigger key={option} value={option} className="min-h-10 rounded-xs text-xs">
              {t(`${kind}Options.${option}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

function FilterActions({ onClear, onApply }: { onClear: () => void; onApply: () => void }) {
  const t = useTranslations("Tracker.drawer.filter")

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button type="button" variant="secondary" onClick={onClear}>
        {t("clear")}
      </Button>
      <DrawerClose asChild>
        <Button type="button" onClick={onApply}>
          {t("apply")}
        </Button>
      </DrawerClose>
    </div>
  )
}

function AddPreview({ activeTab }: { activeTab: TrackerTab }) {
  const t = useTranslations("Tracker.drawer.add")

  if (activeTab === "major") {
    return (
      <div className="flex items-center gap-3 rounded-md bg-surface-offset p-3 text-start shadow-ring">
        <PreviewIcon icon={Invoice03Icon} />
        <p className="text-sm leading-[1.5] text-text-secondary">{t("major.preview")}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        className="flex min-h-14 items-center gap-3 rounded-md bg-surface-offset p-3 text-start shadow-ring"
      >
        <PreviewIcon icon={CreditCardIcon} />
        <span className="text-sm font-semibold text-foreground">{t("fixed.monthlyPayment")}</span>
      </button>
      <button
        type="button"
        className="flex min-h-14 items-center gap-3 rounded-md bg-surface-offset p-3 text-start shadow-ring"
      >
        <PreviewIcon icon={MoneyBag02Icon} />
        <span className="text-sm font-semibold text-foreground">
          {t("fixed.budgetTransaction")}
        </span>
      </button>
    </div>
  )
}

function PreviewIcon({ icon }: { icon: typeof Add01Icon }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-brand shadow-ring">
      <HugeiconsIcon icon={icon} size={22} aria-hidden="true" />
    </span>
  )
}

const filterOptions = {
  type: ["all", "variable", "monthly", "budget", "major"],
  direction: ["all", "expense", "received"],
  method: ["all", "cash", "card", "bank"],
}

const filterGridClass = {
  type: "grid-cols-2",
  direction: "grid-cols-3",
  method: "grid-cols-2",
}

const datePresetOptions = ["thisMonth", "thisWeek", "today"]
