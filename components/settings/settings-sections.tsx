"use client"

import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Globe02Icon,
  Invoice03Icon,
  Logout01Icon,
  BankIcon,
  BookOpen01Icon,
  Calendar03Icon,
  CreditCardIcon,
  MoneyBag02Icon,
  PaintBrush02Icon,
  StarIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale, useTranslations } from "next-intl"

import { APP_NAME, APP_VERSION, CURRENCY, PLAN, THEME_OPTIONS } from "@/components/settings/data"
import type {
  BudgetBoost,
  LanguageValue,
  PaymentMethod,
  ProfileState,
  ThemeValue,
} from "@/components/settings/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SegmentedChoice } from "@/components/ui/segmented-choice"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function ProfileCard({
  profile,
  onEdit,
}: {
  profile: ProfileState
  onEdit: () => void
}) {
  const t = useTranslations("Settings")
  return (
    <SettingsCard
      actionLabel={t("profile.edit")}
      icon={UserCircleIcon}
      subtitle={t("profile.subtitle")}
      title={t("profile.title")}
      onAction={onEdit}
    >
      <Separator className="bg-border-subtle" />
      <div className="space-y-4">
        <DetailBlock label={t("profile.username")}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[1.25rem] font-semibold leading-[1.15] text-foreground">
              {profile.username}
            </p>
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.6875rem] font-medium shadow-ring",
                profile.status === "Active"
                  ? "bg-success-subtle text-success dark:bg-success-subtle-dark dark:text-success-dark"
                  : "bg-surface-offset text-text-secondary",
              )}
            >
              {profile.status === "Active" ? t("profile.active") : t("profile.inactive")}
            </Badge>
          </div>
        </DetailBlock>

        <DetailBlock label={t("profile.email")}>
          <p className="text-sm leading-[1.6] text-foreground">{profile.email}</p>
        </DetailBlock>

        <DetailBlock icon={StarIcon} label={t("profile.memberSince")}>
          <p className="text-sm leading-[1.6] text-foreground">{profile.memberSince}</p>
        </DetailBlock>
      </div>
    </SettingsCard>
  )
}

export function MonthlyBudgetCard({
  amount,
  onChange,
}: {
  amount: number
  onChange: () => void
}) {
  const locale = useLocale()
  const t = useTranslations("Settings")

  return (
    <SettingsCard
      actionLabel={t("budget.change")}
      icon={Calendar03Icon}
      subtitle={t("budget.subtitle")}
      title={t("budget.title")}
      onAction={onChange}
    >
      <InfoRow icon={Calendar03Icon} label={`${formatCurrency(locale, amount)} ${CURRENCY}`} />
    </SettingsCard>
  )
}

export function BudgetManagementCard({
  boosts,
  onAdd,
}: {
  boosts: BudgetBoost[]
  onAdd: () => void
}) {
  const locale = useLocale()
  const t = useTranslations("Settings")

  return (
    <SettingsCard
      actionLabel={t("boosts.add")}
      icon={MoneyBag02Icon}
      subtitle={t("boosts.subtitle")}
      title={t("boosts.title")}
      onAction={onAdd}
    >
      {boosts.length === 0 ? (
        <p className="rounded-sm bg-surface-offset px-4 py-5 text-center text-sm leading-[1.6] text-text-secondary shadow-ring">
          {t("boosts.empty")}
        </p>
      ) : (
        <div className="space-y-3">
          {boosts.map((boost) => (
            <div key={boost.id} className="rounded-sm bg-surface-offset p-3 shadow-ring">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{boost.label}</p>
                <p dir="ltr" className="text-sm font-semibold text-foreground tabular-nums">
                  {formatCurrency(locale, boost.amount)}
                </p>
              </div>
              <p className="mt-1 text-sm leading-[1.5] text-text-secondary">
                {t("boosts.expires", { date: boost.expiresOn })}
              </p>
            </div>
          ))}
        </div>
      )}
    </SettingsCard>
  )
}

export function PaymentMethodsCard({
  methods,
  deleteCandidateId,
  onSetDefault,
  onEdit,
  onDeleteTap,
  onConfirmDelete,
  onCancelDelete,
  onAdd,
}: {
  methods: PaymentMethod[]
  deleteCandidateId: string | null
  onSetDefault: (methodId: string) => void
  onEdit: (methodId: string) => void
  onDeleteTap: (methodId: string) => void
  onConfirmDelete: (methodId: string) => void
  onCancelDelete: () => void
  onAdd: () => void
}) {
  const t = useTranslations("Settings")
  return (
    <SettingsCard
      icon={CreditCardIcon}
      subtitle={t("methods.subtitle")}
      title={t("methods.title")}
    >
      <div className="space-y-3">
        {methods.map((method) =>
          deleteCandidateId === method.id ? (
            <div
              key={method.id}
              className="rounded-sm bg-danger-subtle p-3 shadow-ring dark:bg-danger-subtle-dark"
            >
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-danger dark:text-danger-dark">
                  {t("methods.confirmDelete", { name: method.name })}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="xs"
                    onClick={() => onConfirmDelete(method.id)}
                  >
                    {t("methods.confirm")}
                  </Button>
                  <Button type="button" variant="ghost" size="xs" onClick={onCancelDelete}>
                    {t("drawer.cancel")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div key={method.id} className="rounded-sm bg-surface-offset p-3 shadow-ring">
              <div className="flex items-center gap-3">
                <MethodIcon icon={method.icon} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{method.name}</p>
                    {method.isDefault ? (
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-brand-subtle px-2.5 py-1 text-[0.6875rem] font-medium text-brand shadow-ring dark:bg-brand-subtle-dark dark:text-coral"
                      >
                        {t("methods.default")}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="flex min-h-10 items-center gap-2 rounded-full px-2 text-sm font-medium text-text-secondary transition-colors hover:text-brand"
                  onClick={() => onSetDefault(method.id)}
                >
                  <HugeiconsIcon
                    icon={StarIcon}
                    aria-hidden="true"
                    size={18}
                    className={cn(
                      method.isDefault ? "fill-current text-brand" : "text-text-tertiary",
                    )}
                  />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="min-h-10 rounded-full px-2 text-sm font-medium text-brand transition-colors hover:text-brand-hover"
                    onClick={() => onEdit(method.id)}
                  >
                    {t("methods.edit")}
                  </button>
                  <button
                    type="button"
                    className="min-h-10 rounded-full px-2 text-sm font-medium text-danger transition-colors hover:text-danger-hover dark:text-danger-dark"
                    onClick={() => onDeleteTap(method.id)}
                  >
                    {t("methods.delete")}
                  </button>
                </div>
              </div>
            </div>
          ),
        )}

        <Button type="button" variant="outline" className="w-full" onClick={onAdd}>
          {t("methods.add")}
        </Button>
      </div>
    </SettingsCard>
  )
}

export function GuideCard() {
  const t = useTranslations("Settings")
  return (
    <SettingsCard icon={BookOpen01Icon} subtitle={t("guide.subtitle")} title={t("guide.title")}>
      <Button type="button" variant="outline" className="w-full">
        {t("guide.view")}
      </Button>
    </SettingsCard>
  )
}

export function AppearanceCard({
  theme,
  language,
  onThemeChange,
  onToggleLanguage,
}: {
  theme: ThemeValue
  language: LanguageValue
  onThemeChange: (theme: ThemeValue) => void
  onToggleLanguage: () => void
}) {
  const t = useTranslations("Settings")
  const themeOptions = THEME_OPTIONS.map((option) => ({
    label: t(`appearance.${option}`),
    value: option,
  }))

  return (
    <SettingsCard
      icon={PaintBrush02Icon}
      subtitle={t("appearance.subtitle")}
      title={t("appearance.title")}
    >
      <div className="space-y-3">
        <div className="rounded-sm bg-surface-offset p-3 shadow-ring">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">{t("appearance.theme")}</p>
            <SegmentedChoice
              value={theme}
              onValueChange={(value) => onThemeChange(value as ThemeValue)}
              options={themeOptions}
              className="grid-cols-3"
              optionClassName="min-h-10 rounded-full"
            />
          </div>
        </div>

        <div className="rounded-sm bg-surface-offset p-3 shadow-ring">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Globe02Icon}
                aria-hidden="true"
                size={18}
                className="text-text-secondary"
              />
              <p className="text-sm font-semibold text-foreground">{t("appearance.language")}</p>
            </div>
            <button
              type="button"
              className="flex min-h-10 items-center gap-2 rounded-full bg-card px-3 text-sm font-medium text-foreground shadow-ring"
              onClick={onToggleLanguage}
            >
              <span>{language}</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                aria-hidden="true"
                size={16}
                className="text-text-secondary"
              />
            </button>
          </div>
        </div>

        <div className="rounded-sm bg-surface-offset p-3 shadow-ring">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Invoice03Icon}
                aria-hidden="true"
                size={18}
                className="text-text-secondary"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">{t("appearance.monthlyReports")}</p>
                <p className="mt-1 text-sm leading-[1.5] text-text-secondary">
                  {t("appearance.monthlyReportsValue")}
                </p>
              </div>
            </div>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              aria-hidden="true"
              size={18}
              className="text-text-tertiary"
            />
          </div>
        </div>

        <Button type="button" variant="destructive" className="w-full">
          <HugeiconsIcon icon={Logout01Icon} data-icon="inline-start" aria-hidden="true" />
          {t("appearance.logout")}
        </Button>
      </div>
    </SettingsCard>
  )
}

export function AboutBlock() {
  const t = useTranslations("Settings")
  return (
    <div className="px-1 py-2 text-center">
      <p className="text-xs font-medium tracking-[0.1em] text-text-tertiary uppercase">
        {t("about.pwa", { app: APP_NAME })}
      </p>
      <p className="mt-2 text-sm font-medium text-text-secondary">
        {t("about.version", { version: APP_VERSION })}
      </p>
      <p className="mt-2 text-sm leading-[1.6] text-text-secondary text-pretty">
        {t("about.description")}
      </p>
      {PLAN === "pro" ? (
        <p className="mt-3 text-[0.6875rem] font-medium text-brand">{t("about.pro")}</p>
      ) : null}
    </div>
  )
}

function SettingsCard({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  title: string
  subtitle: string
  actionLabel?: string
  onAction?: () => void
  children: React.ReactNode
}) {
  return (
    <Card size="sm" className="rounded-md border border-border bg-card py-4 shadow-soft">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={icon}
                aria-hidden="true"
                size={18}
                className="text-text-secondary"
              />
              <h2 className="text-[1.0625rem] font-semibold text-foreground">{title}</h2>
            </div>
            <p className="mt-2 text-sm leading-[1.5] text-text-secondary text-pretty">{subtitle}</p>
          </div>

          {actionLabel ? (
            <Button type="button" variant="outline" size="xs" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </div>

        {children}
      </CardContent>
    </Card>
  )
}

function DetailBlock({
  label,
  icon,
  children,
}: {
  label: string
  icon?: Parameters<typeof HugeiconsIcon>[0]["icon"]
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon ? (
          <HugeiconsIcon icon={icon} aria-hidden="true" size={14} className="text-text-tertiary" />
        ) : null}
        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-text-tertiary uppercase">
          {label}
        </p>
      </div>
      {children}
    </div>
  )
}

function InfoRow({
  icon,
  label,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
  label: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-sm bg-surface-offset p-3 shadow-ring">
      <span className="flex size-10 items-center justify-center rounded-full bg-card text-text-secondary shadow-ring">
        <HugeiconsIcon icon={icon} aria-hidden="true" size={18} />
      </span>
      <p dir="ltr" className="text-sm font-medium text-foreground tabular-nums">
        {label}
      </p>
    </div>
  )
}

function MethodIcon({ icon }: { icon: PaymentMethod["icon"] }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-text-secondary shadow-ring">
      <MethodGlyph icon={icon} />
    </span>
  )
}

function MethodGlyph({ icon }: { icon: PaymentMethod["icon"] }) {
  const glyphIcon = icon === "cash" ? MoneyBag02Icon : icon === "card" ? CreditCardIcon : BankIcon

  return <HugeiconsIcon icon={glyphIcon} aria-hidden="true" size={18} />
}

function formatCurrency(locale: string, value: number) {
  return `${new Intl.NumberFormat(locale).format(value)}`
}
