"use client"

import {
  BankIcon,
  CreditCardIcon,
  MoneyBag02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"

import type { DrawerKind, PaymentMethod } from "@/components/settings/types"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { SegmentedChoice } from "@/components/ui/segmented-choice"
import { inputFieldClass } from "@/lib/design-system-classes"
import { semanticInteractiveTextClass } from "@/lib/semantic-styles"
import { cn } from "@/lib/utils"

type SettingsDrawerProps = {
  boostDraft: { label: string; amount: string }
  budgetDraft: string
  direction: "ltr" | "rtl"
  drawer: DrawerKind
  editingMethod: PaymentMethod | null
  methodDraft: { id: string | null; name: string; icon: PaymentMethod["icon"] }
  profileDraft: { username: string; email: string }
  onBoostDraftChange: React.Dispatch<
    React.SetStateAction<{ label: string; amount: string }>
  >
  onBudgetDraftChange: React.Dispatch<React.SetStateAction<string>>
  onMethodDraftChange: React.Dispatch<
    React.SetStateAction<{ id: string | null; name: string; icon: PaymentMethod["icon"] }>
  >
  onOpenChange: (open: boolean) => void
  onProfileDraftChange: React.Dispatch<
    React.SetStateAction<{ username: string; email: string }>
  >
  onSave: () => void
}

export function SettingsDrawer({
  boostDraft,
  budgetDraft,
  direction,
  drawer,
  editingMethod,
  methodDraft,
  profileDraft,
  onBoostDraftChange,
  onBudgetDraftChange,
  onMethodDraftChange,
  onOpenChange,
  onProfileDraftChange,
  onSave,
}: SettingsDrawerProps) {
  const t = useTranslations("Settings")
  const open = drawer !== null
  const drawerTitle =
    drawer === "profile"
      ? t("drawer.editProfileTitle")
      : drawer === "budget"
        ? t("drawer.changeBudgetTitle")
        : drawer === "boost"
          ? t("drawer.addBoostTitle")
          : editingMethod
            ? t("drawer.editMethodTitle")
            : t("drawer.addMethodTitle")

  const drawerDescription =
    drawer === "profile"
      ? t("drawer.editProfileDescription")
      : drawer === "budget"
        ? t("drawer.changeBudgetDescription")
        : drawer === "boost"
          ? t("drawer.addBoostDescription")
          : t("drawer.methodDescription")

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent dir={direction} className="mx-auto max-w-sm">
        <DrawerHeader className="text-start">
          <DrawerTitle>{drawerTitle}</DrawerTitle>
          <p className="text-sm leading-[1.6] text-text-secondary">{drawerDescription}</p>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain space-y-4 px-4 pb-2">
          {drawer === "profile" ? (
            <div className="space-y-4">
              <InputField
                label={t("profile.username")}
                value={profileDraft.username}
                onValueChange={(value) =>
                  onProfileDraftChange((current) => ({ ...current, username: value }))
                }
              />
              <InputField
                label={t("profile.email")}
                type="email"
                value={profileDraft.email}
                onValueChange={(value) =>
                  onProfileDraftChange((current) => ({ ...current, email: value }))
                }
              />
            </div>
          ) : drawer === "budget" ? (
            <InputField
              label={t("budget.amountLabel")}
              type="number"
              value={budgetDraft}
              onValueChange={onBudgetDraftChange}
            />
          ) : drawer === "boost" ? (
            <div className="space-y-4">
              <InputField
                label={t("boosts.label")}
                value={boostDraft.label}
                onValueChange={(value) =>
                  onBoostDraftChange((current) => ({ ...current, label: value }))
                }
              />
              <InputField
                label={t("boosts.amount")}
                type="number"
                value={boostDraft.amount}
                onValueChange={(value) =>
                  onBoostDraftChange((current) => ({ ...current, amount: value }))
                }
              />
            </div>
          ) : (
            <MethodForm draft={methodDraft} onDraftChange={onMethodDraftChange} />
          )}
        </div>

        <DrawerFooter>
          <Button type="button" onClick={onSave}>
            {drawer === "boost" ? t("boosts.addPrimary") : t("drawer.save")}
          </Button>
          <DrawerClose asChild>
            <button
              type="button"
              className={cn("min-h-11 text-sm font-medium", semanticInteractiveTextClass.brand)}
            >
              {t("drawer.cancel")}
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function MethodForm({
  draft,
  onDraftChange,
}: {
  draft: { id: string | null; name: string; icon: PaymentMethod["icon"] }
  onDraftChange: React.Dispatch<
    React.SetStateAction<{ id: string | null; name: string; icon: PaymentMethod["icon"] }>
  >
}) {
  const t = useTranslations("Settings")
  const options = [
    {
      label: t("methods.cash"),
      value: "cash" as const,
      icon: <MethodGlyph icon="cash" />,
    },
    {
      label: t("methods.card"),
      value: "card" as const,
      icon: <MethodGlyph icon="card" />,
    },
    {
      label: t("methods.bank"),
      value: "bank" as const,
      icon: <MethodGlyph icon="bank" />,
    },
  ] as const

  return (
    <div className="space-y-4">
      <InputField
        label={t("methods.nameLabel")}
        value={draft.name}
        onValueChange={(value) => onDraftChange((current) => ({ ...current, name: value }))}
      />
      <div className="space-y-2">
        <div className="text-xs font-semibold tracking-[0.12em] text-text-tertiary uppercase">
          {t("methods.icon")}
        </div>
        <SegmentedChoice
          value={draft.icon}
          onValueChange={(value) =>
            onDraftChange((current) => ({
              ...current,
              icon: value as PaymentMethod["icon"],
            }))
          }
          options={options}
          className="grid-cols-3"
        />
      </div>
    </div>
  )
}

function InputField({
  label,
  value,
  onValueChange,
  type = "text",
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  type?: React.HTMLInputTypeAttribute
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold tracking-[0.12em] text-text-tertiary uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={inputFieldClass}
      />
    </label>
  )
}


function MethodGlyph({ icon }: { icon: PaymentMethod["icon"] }) {
  const glyphIcon = icon === "cash" ? MoneyBag02Icon : icon === "card" ? CreditCardIcon : BankIcon

  return <HugeiconsIcon icon={glyphIcon} aria-hidden="true" size={18} />
}
