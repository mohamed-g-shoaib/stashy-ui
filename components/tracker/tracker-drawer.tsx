"use client";

import {
  Add01Icon,
  BankIcon,
  CreditCardIcon,
  MoneyBag02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import * as React from "react";

import type { TrackerTab } from "@/components/tracker/types";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SegmentedChoice } from "@/components/ui/segmented-choice";
import {
  elevatedPanelClass,
  inputFieldClass,
  textAreaFieldClass,
} from "@/lib/design-system-classes";
import { semanticSurfaceClass } from "@/lib/semantic-styles";
import { cn } from "@/lib/utils";

export type TrackerDrawerKind = "add";
export type TrackerAddAction =
  | {
      kind: "monthlyPayment";
      name: string;
      amount: number;
      dueDay: string;
      method: "cash" | "card" | "bank";
    }
  | {
      kind: "budgetTransaction";
      category: "coffee" | "gas" | "groceries" | "eatingOut" | "transport";
      amount: number;
      method: "cash" | "card" | "bank";
      note: string;
    }
  | {
      kind: "majorExpense";
      name: string;
      amount: number;
      method: "cash" | "card" | "bank";
      scale: "regular" | "large";
    };
type TrackerDrawerProps = {
  kind: TrackerDrawerKind | null;
  activeTab: TrackerTab;
  direction: "ltr" | "rtl";
  onSaveAddAction: (action: TrackerAddAction) => void;
  onOpenChange: (open: boolean) => void;
};

export function TrackerDrawer({
  kind,
  activeTab,
  direction,
  onSaveAddAction,
  onOpenChange,
}: TrackerDrawerProps) {
  const t = useTranslations("Tracker.drawer");
  const open = kind !== null;
  const title = t(`add.${activeTab}.title`);
  const description = t(`add.${activeTab}.description`);
  const [fixedKind, setFixedKind] = React.useState<
    "monthlyPayment" | "budgetTransaction"
  >("monthlyPayment");
  const [step, setStep] = React.useState<"choose" | "details">("choose");
  const [name, setName] = React.useState("Water bill");
  const [amount, setAmount] = React.useState(
    activeTab === "major" ? "1800" : "260",
  );
  const [dueDay, setDueDay] = React.useState("27");
  const [method, setMethod] = React.useState<"cash" | "card" | "bank">("card");
  const [category, setCategory] = React.useState<
    "coffee" | "gas" | "groceries" | "eatingOut" | "transport"
  >("groceries");
  const [note, setNote] = React.useState("");
  const [scale, setScale] = React.useState<"regular" | "large">("large");

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setStep(activeTab === "fixed" ? "choose" : "details");
    setFixedKind("monthlyPayment");
    setName(activeTab === "major" ? "Phone upgrade" : "Water bill");
    setAmount(activeTab === "major" ? "1800" : "260");
    setDueDay("27");
    setMethod("card");
    setCategory("groceries");
    setNote("");
    setScale("large");
  }, [activeTab, open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent dir={direction} className="mx-auto max-w-sm">
        <DrawerHeader className="text-start">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2">
          <AddFlow
            amount={amount}
            activeTab={activeTab}
            category={category}
            dueDay={dueDay}
            fixedKind={fixedKind}
            method={method}
            name={name}
            note={note}
            onAmountChange={setAmount}
            onCategoryChange={setCategory}
            onDueDayChange={setDueDay}
            onFixedKindChange={setFixedKind}
            onMethodChange={setMethod}
            onNameChange={setName}
            onNoteChange={setNote}
            onScaleChange={setScale}
            scale={scale}
            step={step}
          />
        </div>
        <DrawerFooter>
          <AddFooter
            activeTab={activeTab}
            onBack={() => {
              if (activeTab === "fixed" && step === "details") {
                setStep("choose");
                return;
              }

              onOpenChange(false);
            }}
            onContinue={() => setStep("details")}
            onSave={() => {
              const parsedAmount = Number(amount) || 0;

              if (activeTab === "major") {
                onSaveAddAction({
                  kind: "majorExpense",
                  name,
                  amount: parsedAmount,
                  method,
                  scale,
                });
                onOpenChange(false);
                return;
              }

              if (fixedKind === "monthlyPayment") {
                onSaveAddAction({
                  kind: "monthlyPayment",
                  name,
                  amount: parsedAmount,
                  dueDay,
                  method,
                });
                onOpenChange(false);
                return;
              }

              onSaveAddAction({
                kind: "budgetTransaction",
                category,
                amount: parsedAmount,
                method,
                note,
              });
              onOpenChange(false);
            }}
            step={step}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function AddFlow({
  amount,
  activeTab,
  category,
  dueDay,
  fixedKind,
  method,
  name,
  note,
  onAmountChange,
  onCategoryChange,
  onDueDayChange,
  onFixedKindChange,
  onMethodChange,
  onNameChange,
  onNoteChange,
  onScaleChange,
  scale,
  step,
}: {
  amount: string;
  activeTab: TrackerTab;
  category: "coffee" | "gas" | "groceries" | "eatingOut" | "transport";
  dueDay: string;
  fixedKind: "monthlyPayment" | "budgetTransaction";
  method: "cash" | "card" | "bank";
  name: string;
  note: string;
  onAmountChange: (value: string) => void;
  onCategoryChange: (
    value: "coffee" | "gas" | "groceries" | "eatingOut" | "transport",
  ) => void;
  onDueDayChange: (value: string) => void;
  onFixedKindChange: (value: "monthlyPayment" | "budgetTransaction") => void;
  onMethodChange: (value: "cash" | "card" | "bank") => void;
  onNameChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onScaleChange: (value: "regular" | "large") => void;
  scale: "regular" | "large";
  step: "choose" | "details";
}) {
  const t = useTranslations("Tracker.drawer.add");
  const parsedAmount = Number(amount) || 0;

  const paymentOptions = [
    {
      value: "cash" as const,
      label: t("methods.cash"),
      icon: (
        <HugeiconsIcon icon={MoneyBag02Icon} aria-hidden="true" size={16} />
      ),
    },
    {
      value: "card" as const,
      label: t("methods.card"),
      icon: (
        <HugeiconsIcon icon={CreditCardIcon} aria-hidden="true" size={16} />
      ),
    },
    {
      value: "bank" as const,
      label: t("methods.bank"),
      icon: <HugeiconsIcon icon={BankIcon} aria-hidden="true" size={16} />,
    },
  ] as const;

  const categoryOptions = (
    ["coffee", "gas", "groceries", "eatingOut", "transport"] as const
  ).map((value) => ({
    value,
    label: t(`categories.${value}`),
  }));

  const fixedOptions = [
    { key: "monthlyPayment", icon: CreditCardIcon },
    { key: "budgetTransaction", icon: MoneyBag02Icon },
  ] as const;

  if (activeTab === "fixed" && step === "choose") {
    return (
      <div className="grid gap-3">
        {fixedOptions.map((option) => {
          const selected = option.key === fixedKind;

          return (
            <button
              key={option.key}
              type="button"
              className={cn(
                "flex min-h-16 items-start gap-3 rounded-md p-3 text-start shadow-ring transition-[transform,background-color,box-shadow] duration-200 ease-[var(--ease-stashy)] active:scale-[0.96]",
                selected ? "bg-card shadow-soft" : "bg-surface-offset",
              )}
              onClick={() => {
                onFixedKindChange(option.key);
                onAmountChange(option.key === "monthlyPayment" ? "260" : "180");
                onNameChange(
                  option.key === "monthlyPayment"
                    ? "Water bill"
                    : "Groceries top-up",
                );
                onNoteChange("");
              }}
            >
              <PreviewIcon icon={option.icon} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {t(`fixed.${option.key}`)}
                </p>
                <p className="mt-1 text-sm leading-[1.5] text-text-secondary text-pretty">
                  {t(`fixed.${option.key}Description`)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className={elevatedPanelClass}>
        <p className="text-sm font-semibold text-foreground">
          {t("effectTitle")}
        </p>
        <p className="mt-1 text-sm leading-[1.5] text-text-secondary text-pretty">
          {getOutcomeCopy(
            t,
            activeTab,
            fixedKind,
            parsedAmount,
            dueDay,
            category,
            scale,
          )}
        </p>
      </div>

      {activeTab === "major" ? (
        <FormField label={t("fields.name")} hint={t("major.nameHint")}>
          <input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            className={inputFieldClass}
          />
        </FormField>
      ) : fixedKind === "monthlyPayment" ? (
        <FormField
          label={t("fields.name")}
          hint={t("fixed.monthlyPaymentNameHint")}
        >
          <input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            className={inputFieldClass}
          />
        </FormField>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
            {t("fields.category")}
          </p>
          <SegmentedChoice
            value={category}
            onValueChange={onCategoryChange}
            options={categoryOptions}
            className="grid-cols-2"
            optionClassName="min-h-11 rounded-sm"
          />
        </div>
      )}

      <FormField
        label={t("fields.amount")}
        hint={
          activeTab === "major"
            ? t("major.amountHint")
            : fixedKind === "monthlyPayment"
              ? t("fixed.monthlyPaymentAmountHint")
              : t("fixed.budgetTransactionAmountHint")
        }
      >
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          className={inputFieldClass}
        />
      </FormField>

      {activeTab === "fixed" && fixedKind === "monthlyPayment" ? (
        <FormField
          label={t("fields.dueDay")}
          hint={t("fixed.monthlyPaymentDueHint")}
        >
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="31"
            value={dueDay}
            onChange={(event) => onDueDayChange(event.target.value)}
            className={inputFieldClass}
          />
        </FormField>
      ) : null}

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
          {t("fields.method")}
        </p>
        <SegmentedChoice
          value={method}
          onValueChange={onMethodChange}
          options={paymentOptions}
          className="grid-cols-3"
        />
      </div>

      {activeTab === "major" ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
            {t("major.scaleLabel")}
          </p>
          <SegmentedChoice
            value={scale}
            onValueChange={onScaleChange}
            options={[
              { value: "regular", label: t("major.regular") },
              { value: "large", label: t("major.large") },
            ]}
            className="grid-cols-2"
          />
        </div>
      ) : fixedKind === "budgetTransaction" ? (
        <FormField
          label={t("fields.note")}
          hint={t("fixed.budgetTransactionNoteHint")}
        >
          <textarea
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder={t("fixed.budgetTransactionPlaceholder")}
            className={textAreaFieldClass}
          />
        </FormField>
      ) : null}
    </div>
  );
}

function AddFooter({
  activeTab,
  step,
  onBack,
  onContinue,
  onSave,
}: {
  activeTab: TrackerTab;
  step: "choose" | "details";
  onBack: () => void;
  onContinue: () => void;
  onSave: () => void;
}) {
  const t = useTranslations("Tracker.drawer.add");

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button type="button" variant="secondary" onClick={onBack}>
        {activeTab === "fixed" && step === "details" ? t("back") : t("cancel")}
      </Button>
      <Button
        type="button"
        onClick={
          activeTab === "fixed" && step === "choose" ? onContinue : onSave
        }
      >
        {activeTab === "fixed" && step === "choose" ? t("continue") : t("save")}
      </Button>
    </div>
  );
}

function PreviewIcon({ icon }: { icon: typeof Add01Icon }) {
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full shadow-ring",
        semanticSurfaceClass.brand,
      )}
    >
      <HugeiconsIcon icon={icon} size={22} aria-hidden="true" />
    </span>
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

function getOutcomeCopy(
  t: ReturnType<typeof useTranslations<"Tracker.drawer.add">>,
  activeTab: TrackerTab,
  fixedKind: "monthlyPayment" | "budgetTransaction",
  amount: number,
  dueDay: string,
  category: "coffee" | "gas" | "groceries" | "eatingOut" | "transport",
  scale: "regular" | "large",
) {
  if (activeTab === "major") {
    return t(scale === "large" ? "major.effectLarge" : "major.effectRegular", {
      amount: formatAmount(amount),
    });
  }

  if (fixedKind === "monthlyPayment") {
    return t("fixed.monthlyPaymentEffect", {
      amount: formatAmount(amount),
      dueDay,
    });
  }

  return t("fixed.budgetTransactionEffect", {
    amount: formatAmount(amount),
    category: t(`categories.${category}`),
  });
}

function formatAmount(value: number) {
  return `${new Intl.NumberFormat("en").format(value)} EGP`;
}
