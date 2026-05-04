import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  ChartAverageIcon,
  ChartLineData01Icon,
  HelpCircleIcon,
  Invoice03Icon,
  MoneyBag02Icon,
  Note03Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import * as React from "react";

import type {
  AddActionKind,
  DailyScenario,
  DrawerKind,
} from "@/components/home/types";
import { LanguageToggle } from "@/components/language-toggle";
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
import { SegmentedChoice } from "@/components/ui/segmented-choice";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  elevatedPanelClass,
  inputFieldClass,
  segmentedWellClass,
  surfacePanelClass,
  textAreaFieldClass,
} from "@/lib/design-system-classes";
import { semanticSurfaceClass, semanticTextClass } from "@/lib/semantic-styles";
import { cn } from "@/lib/utils";

type HomeDrawerProps = {
  kind: DrawerKind | null;
  dailyScenario: DailyScenario;
  introCardVisible: boolean;
  majorScenario: "active" | "none";
  direction: "ltr" | "rtl";
  onDailyScenarioChange: (value: DailyScenario) => void;
  onIntroCardVisibleChange: (value: boolean) => void;
  onMajorScenarioChange: (value: "active" | "none") => void;
  onPreviewAddAction: (action: AddActionKind, amount: number) => void;
  onOpenChange: (open: boolean) => void;
};

export function HomeDrawer({
  kind,
  dailyScenario,
  introCardVisible,
  majorScenario,
  direction,
  onDailyScenarioChange,
  onIntroCardVisibleChange,
  onMajorScenarioChange,
  onPreviewAddAction,
  onOpenChange,
}: HomeDrawerProps) {
  const t = useTranslations("Home.drawer");
  const open = kind !== null;
  const title = kind ? t(`${kind}.title`) : t("add.title");
  const description = kind ? t(`${kind}.description`) : t("add.description");
  const [selectedAction, setSelectedAction] =
    React.useState<AddActionKind>("spend");
  const [step, setStep] = React.useState<"choose" | "details">("choose");
  const [amount, setAmount] = React.useState("700");
  const [method, setMethod] = React.useState<"cash" | "card" | "bank">("cash");
  const [note, setNote] = React.useState("");

  const resetAddFlow = React.useCallback(() => {
    setStep("choose");
    setAmount(defaultAmounts[selectedAction]);
    setNote("");
  }, [selectedAction]);

  const closeAddFlow = React.useCallback(() => {
    resetAddFlow();
    onOpenChange(false);
  }, [onOpenChange, resetAddFlow]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent dir={direction} className="mx-auto max-w-sm">
        <DrawerHeader className="text-start">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2">
          {kind === "settings" ? (
            <SettingsControls
              value={dailyScenario}
              onValueChange={onDailyScenarioChange}
              introCardVisible={introCardVisible}
              onIntroCardVisibleChange={onIntroCardVisibleChange}
              majorScenario={majorScenario}
              onMajorChange={onMajorScenarioChange}
            />
          ) : kind === "add" ? (
            <AddOptions
              amount={amount}
              method={method}
              note={note}
              selectedAction={selectedAction}
              step={step}
              onAmountChange={setAmount}
              onMethodChange={setMethod}
              onNoteChange={setNote}
              onSelectedActionChange={(action) => {
                setSelectedAction(action);
                setAmount(defaultAmounts[action]);
                setNote("");
              }}
            />
          ) : kind === "help" ? (
            <HelpContent dailyScenario={dailyScenario} />
          ) : (
            <DrawerPreview kind={kind} />
          )}
        </div>
        {kind === "add" ? (
          <DrawerFooter>
            <AddFooter
              step={step}
              onBack={() => {
                if (step === "choose") {
                  closeAddFlow();
                  return;
                }

                setStep("choose");
              }}
              onContinue={() => setStep("details")}
              onSave={() => {
                onPreviewAddAction(selectedAction, Number(amount) || 0);
                closeAddFlow();
              }}
            />
          </DrawerFooter>
        ) : (
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="button" variant="secondary">
                {t("close")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function AddOptions({
  amount,
  method,
  note,
  selectedAction,
  step,
  onAmountChange,
  onMethodChange,
  onNoteChange,
  onSelectedActionChange,
}: {
  amount: string;
  method: "cash" | "card" | "bank";
  note: string;
  selectedAction: AddActionKind;
  step: "choose" | "details";
  onAmountChange: (value: string) => void;
  onMethodChange: (value: "cash" | "card" | "bank") => void;
  onNoteChange: (value: string) => void;
  onSelectedActionChange: (action: AddActionKind) => void;
}) {
  const t = useTranslations("Home.drawer.add");
  const options = [
    { key: "spend", icon: MoneyBag02Icon, tone: semanticSurfaceClass.expense },
    {
      key: "receive",
      icon: ArrowDown01Icon,
      tone: semanticSurfaceClass.income,
    },
    { key: "injection", icon: Note03Icon, tone: semanticSurfaceClass.injection },
    { key: "major", icon: Invoice03Icon, tone: semanticSurfaceClass.warning },
  ] as const;
  const parsedAmount = Number(amount) || 0;
  const responseTone =
    selectedAction === "spend" && parsedAmount > 615.38
      ? semanticTextClass.expense
      : selectedAction === "receive"
        ? semanticTextClass.income
        : selectedAction === "injection"
          ? semanticTextClass.injection
        : "text-foreground";

  const methodOptions = (["cash", "card", "bank"] as const).map((option) => ({
    value: option,
    label: t(`methods.${option}`),
  }));

  return (
    <div className="grid gap-3">
      {step === "choose" ? (
        <>
          {options.map((item) => {
            const selected = item.key === selectedAction;

            return (
              <button
                key={item.key}
                type="button"
                className={`flex min-h-16 items-start gap-3 rounded-md p-3 text-start shadow-ring transition-[transform,background-color,box-shadow] duration-200 ease-[var(--ease-stashy)] active:scale-[0.96] ${
                  selected ? "bg-card shadow-soft" : "bg-surface-offset"
                }`}
                onClick={() => onSelectedActionChange(item.key)}
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full shadow-ring ${item.tone}`}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    aria-hidden="true"
                    size={20}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {t(`${item.key}.label`)}
                  </p>
                  <p className="mt-1 text-sm leading-[1.5] text-text-secondary text-pretty">
                    {t(`${item.key}.description`)}
                  </p>
                </div>
              </button>
            );
          })}
        </>
      ) : null}
      {step === "details" ? (
        <>
          <div className={elevatedPanelClass}>
            <p className={`text-sm font-semibold ${responseTone}`}>
              {t("impactTitle")}
            </p>
            <p
              className={`mt-1 text-sm leading-[1.5] text-pretty ${responseTone}`}
            >
              {getOutcomePreview(t, selectedAction, parsedAmount)}
            </p>
            <p className="mt-2 text-xs leading-[1.5] text-text-secondary text-pretty">
              {t("previewMeta", { method: t(`methods.${method}`) })}
            </p>
          </div>
          <FormField
            label={t("fields.amount")}
            hint={t(`${selectedAction}.amountHint`)}
          >
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              className={inputFieldClass}
            />
          </FormField>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              {t("fields.method")}
            </p>
            <SegmentedChoice
              value={method}
              onValueChange={onMethodChange}
              options={methodOptions}
              className="grid-cols-3"
            />
          </div>
          <FormField label={t("fields.note")}>
            <textarea
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder={t(`${selectedAction}.notePlaceholder`)}
              className={textAreaFieldClass}
            />
          </FormField>
        </>
      ) : null}
    </div>
  );
}

function AddFooter({
  step,
  onBack,
  onContinue,
  onSave,
}: {
  step: "choose" | "details";
  onBack: () => void;
  onContinue: () => void;
  onSave: () => void;
}) {
  const t = useTranslations("Home.drawer.add");

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button type="button" variant="secondary" onClick={onBack}>
        {step === "choose" ? t("cancel") : t("back")}
      </Button>
      <Button type="button" onClick={step === "choose" ? onContinue : onSave}>
        {step === "choose" ? t("continue") : t("savePreview")}
      </Button>
    </div>
  );
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
        {label}
      </span>
      {hint ? (
        <span className="block text-sm leading-[1.5] text-text-secondary">
          {hint}
        </span>
      ) : null}
      {children}
    </label>
  );
}

function getOutcomePreview(
  t: ReturnType<typeof useTranslations<"Home.drawer.add">>,
  action: AddActionKind,
  amount: number,
) {
  if (action === "spend") {
    return amount > 615.38
      ? t("spend.previewOverspent", { amount: formatAmount(amount) })
      : t("spend.previewTrack", { amount: formatAmount(amount) });
  }

  if (action === "receive") {
    return t("receive.preview", { amount: formatAmount(amount) });
  }

  if (action === "injection") {
    return t("injection.preview", { amount: formatAmount(amount) });
  }

  return t("major.preview", { amount: formatAmount(amount) });
}

function formatAmount(value: number) {
  return `${new Intl.NumberFormat("en").format(value)} EGP`;
}

const defaultAmounts: Record<AddActionKind, string> = {
  spend: "700",
  receive: "500",
  injection: "1200",
  major: "1800",
};

function HelpContent({ dailyScenario }: { dailyScenario: DailyScenario }) {
  const t = useTranslations("Home.drawer.help");

  return (
    <div className="grid gap-3">
      <div className={surfacePanelClass}>
        <div className="flex items-start gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-ring ${semanticTextClass.brand}`}
          >
            <HugeiconsIcon
              icon={ChartAverageIcon}
              aria-hidden="true"
              size={20}
            />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {t("todayRate.title")}
            </p>
            <p className="mt-1 text-sm leading-[1.5] text-text-secondary text-pretty">
              {t("todayRate.description")}
            </p>
          </div>
        </div>
      </div>

      <div className={surfacePanelClass}>
        <div className="flex items-start gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-ring ${semanticTextClass.income}`}
          >
            <HugeiconsIcon icon={ArrowUp01Icon} aria-hidden="true" size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {t("remaining.title")}
            </p>
            <p className="mt-1 text-sm leading-[1.5] text-text-secondary text-pretty">
              {t("remaining.description")}
            </p>
          </div>
        </div>
      </div>

      <div className={surfacePanelClass}>
        <div className="flex items-start gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-ring ${semanticTextClass.warning}`}
          >
            <HugeiconsIcon icon={Invoice03Icon} aria-hidden="true" size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {t("major.title")}
            </p>
            <p className="mt-1 text-sm leading-[1.5] text-text-secondary text-pretty">
              {t("major.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-3 shadow-ring">
        <p className="text-sm font-semibold text-foreground">
          {t("tomorrow.title")}
        </p>
        <p className="mt-1 text-sm leading-[1.5] text-text-secondary text-pretty">
          {dailyScenario === "overspent"
            ? t("tomorrow.overspent")
            : t("tomorrow.onTrack")}
        </p>
      </div>
    </div>
  );
}

function SettingsControls({
  value,
  onValueChange,
  introCardVisible,
  onIntroCardVisibleChange,
  majorScenario,
  onMajorChange,
}: {
  value: DailyScenario;
  onValueChange: (value: DailyScenario) => void;
  introCardVisible: boolean;
  onIntroCardVisibleChange: (value: boolean) => void;
  majorScenario: "active" | "none";
  onMajorChange: (value: "active" | "none") => void;
}) {
  const t = useTranslations("Home.drawer");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <LanguageToggle />
      </div>
      <div className={cn("flex flex-col gap-2 text-start", surfacePanelClass)}>
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
          <TabsList className={cn(segmentedWellClass, "grid-cols-2")}>
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
          {t("settings.introLabel")}
        </p>
        <Tabs
          value={introCardVisible ? "visible" : "hidden"}
          onValueChange={(nextValue) =>
            onIntroCardVisibleChange(nextValue === "visible")
          }
          className="gap-3"
        >
          <TabsList className={cn(segmentedWellClass, "grid-cols-2")}>
            <TabsTrigger value="visible" className="rounded-xs text-xs">
              {t("settings.show")}
            </TabsTrigger>
            <TabsTrigger value="hidden" className="rounded-xs text-xs">
              {t("settings.hide")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-xs leading-[1.5] text-text-secondary text-pretty">
          {t("settings.introHint")}
        </p>
        <div className="mt-2 h-px bg-border-subtle" />
        <p className="mt-1 text-sm font-semibold text-foreground">
          {t("settings.majorLabel")}
        </p>
        <Tabs
          value={majorScenario}
          onValueChange={(nextValue) =>
            onMajorChange(nextValue as "active" | "none")
          }
          className="gap-3"
        >
          <TabsList className={cn(segmentedWellClass, "grid-cols-2")}>
            <TabsTrigger value="active" className="rounded-xs text-xs">
              {t("settings.show")}
            </TabsTrigger>
            <TabsTrigger value="none" className="rounded-xs text-xs">
              {t("settings.hide")}
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
    <div
      className={cn("flex items-center gap-3 text-start", surfacePanelClass)}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-ring ${semanticTextClass.brand}`}
      >
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

  return ChartLineData01Icon;
}
