"use client"

import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  BankIcon,
  BookOpen01Icon,
  Calendar03Icon,
  CreditCardIcon,
  Globe02Icon,
  Invoice03Icon,
  Logout01Icon,
  MoneyBag02Icon,
  PaintBrush02Icon,
  StarIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useLocale } from "next-intl"
import * as React from "react"

import { AppBottomNavigation } from "@/components/app-bottom-navigation"
import { navItems } from "@/components/home/home-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { type Locale } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// Profile
const PROFILE_USERNAME = "Mohamed Gamal"
const PROFILE_STATUS: "Active" | "Inactive" = "Active"
const PROFILE_EMAIL = "mohamed.g.shoaib@gmail.com"
const PROFILE_MEMBER_SINCE = "12/9/2025"

// Monthly Budget
const MONTHLY_BUDGET = 10000
const CURRENCY = "EGP"

// Budget Management (temporary increases)
const BUDGET_BOOSTS: { label: string; amount: number; expiresOn: string }[] = []

// Payment Methods
const PAYMENT_METHODS: {
  id: string
  name: string
  icon: "cash" | "card" | "bank"
  isDefault: boolean
}[] = [
  { id: "1", name: "Cash", icon: "cash", isDefault: true },
  { id: "2", name: "Instapay", icon: "card", isDefault: false },
]

// Appearance
const THEME: "dark" | "light" | "system" = "dark"
const LANGUAGE: "English" | "Arabic" = "English"

// Plan
const PLAN: "free" | "pro" = "pro"

// App Info
const APP_NAME = "Stashy"
const APP_VERSION = "1.1.0"
const APP_DESCRIPTION = "Track spending, fixed costs, and goals across devices."

const SETTINGS_TITLE = "Settings"
const SETTINGS_SUBTITLE = "Manage your profile, security, and budgeting defaults."
const PROFILE_TITLE = "Profile"
const PROFILE_SUBTITLE = "Username, email, and member info"
const MONTHLY_BUDGET_TITLE = "Monthly Budget"
const MONTHLY_BUDGET_SUBTITLE = "Set your target budget for the month"
const BUDGET_MANAGEMENT_TITLE = "Budget Management"
const BUDGET_MANAGEMENT_SUBTITLE = "Temporarily increase your monthly budget"
const PAYMENT_METHODS_TITLE = "Payment Methods"
const PAYMENT_METHODS_SUBTITLE = "Manage how you pay expenses"
const GUIDE_TITLE = "How to Use Stashy"
const GUIDE_SUBTITLE = "Learn about budgeting with daily rates"
const APPEARANCE_TITLE = "Appearance & Account"
const APPEARANCE_SUBTITLE = "Customize your app experience"
const VIEW_GUIDE_LABEL = "View Guide"
const ADD_PAYMENT_METHOD_LABEL = "Add Payment Method"
const EMPTY_BOOSTS_LABEL = "No active boosts. Tap Add to create one."
const PROFILE_EDIT_LABEL = "Edit"
const BUDGET_CHANGE_LABEL = "Change"
const BOOST_ADD_LABEL = "Add"
const PAYMENT_EDIT_LABEL = "Edit"
const PAYMENT_DELETE_LABEL = "Delete"
const DEFAULT_BADGE_LABEL = "Default"
const ACTIVE_STATUS_LABEL = "Active"
const INACTIVE_STATUS_LABEL = "Inactive"
const USERNAME_LABEL = "Username"
const EMAIL_LABEL = "Email"
const MEMBER_SINCE_LABEL = "Member Since"
const SAVE_LABEL = "Save"
const CANCEL_LABEL = "Cancel"
const ADD_BOOST_PRIMARY_LABEL = "Add Boost"
const UPGRADE_LABEL = "Upgrade to Pro"
const LOGOUT_LABEL = "Logout"
const THEME_LABEL = "Theme"
const LANGUAGE_LABEL = "Language"
const MONTHLY_REPORTS_LABEL = "Monthly Reports"
const MONTHLY_REPORTS_VALUE = "Coming Soon"
const ADD_METHOD_TITLE = "Add Payment Method"
const EDIT_METHOD_TITLE = "Edit Payment Method"
const EDIT_PROFILE_TITLE = "Edit Profile"
const CHANGE_BUDGET_TITLE = "Change Monthly Budget"
const ADD_BOOST_TITLE = "Add Budget Boost"
const PROFILE_DRAWER_SUBTITLE = "Update the profile details that show across your account."
const BUDGET_DRAWER_SUBTITLE = "Adjust the monthly budget target used across the app."
const BOOST_DRAWER_SUBTITLE = "Create a temporary increase with a clear expiry date."
const METHOD_DRAWER_SUBTITLE = "Choose the label and icon that best match this payment method."
const BOOST_EXPIRES_ON_LABEL = "Expires On"
const BOOST_EXPIRES_PLACEHOLDER = "May 31, 2026"
const METHOD_NAME_LABEL = "Method Name"
const BUDGET_AMOUNT_LABEL = "Monthly Budget"
const BOOST_LABEL_FIELD = "Label"
const BOOST_AMOUNT_LABEL = "Amount"
const LIGHT_LABEL = "Light"
const DARK_LABEL = "Dark"
const SYSTEM_LABEL = "System"
const ENGLISH_LABEL = "English"
const ARABIC_LABEL = "Arabic"

const THEME_OPTIONS = [LIGHT_LABEL, DARK_LABEL, SYSTEM_LABEL] as const

type ThemeValue = (typeof THEME_OPTIONS)[number]
type LanguageValue = "English" | "Arabic"
type DrawerKind =
  | null
  | "profile"
  | "budget"
  | "boost"
  | "methodAdd"
  | { kind: "methodEdit"; methodId: string }

export function SettingsScreen() {
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)
  const [drawer, setDrawer] = React.useState<DrawerKind>(null)
  const [theme, setTheme] = React.useState<ThemeValue>(mapThemeToOption(THEME))
  const [language, setLanguage] = React.useState<LanguageValue>(LANGUAGE)
  const [paymentMethods, setPaymentMethods] = React.useState(PAYMENT_METHODS)
  const [deleteCandidateId, setDeleteCandidateId] = React.useState<string | null>(null)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="bg-background px-screen pt-5">
        <h1 className="text-[1.5rem] font-semibold leading-[1.2] text-foreground">
          {SETTINGS_TITLE}
        </h1>
        <p className="mt-2 max-w-[28ch] text-sm leading-[1.6] text-text-secondary text-pretty">
          {SETTINGS_SUBTITLE}
        </p>
      </header>

      <main className="flex-1 px-screen pb-32 pt-5">
        <div className="flex flex-col gap-3">
          <ProfileCard onEdit={() => setDrawer("profile")} />
          <MonthlyBudgetCard onChange={() => setDrawer("budget")} />
          <BudgetManagementCard onAdd={() => setDrawer("boost")} />
          <PaymentMethodsCard
            deleteCandidateId={deleteCandidateId}
            methods={paymentMethods}
            onAdd={() => setDrawer("methodAdd")}
            onCancelDelete={() => setDeleteCandidateId(null)}
            onDeleteTap={setDeleteCandidateId}
            onEdit={(methodId) => setDrawer({ kind: "methodEdit", methodId })}
            onSetDefault={(methodId) => {
              setDeleteCandidateId(null)
              setPaymentMethods((current) =>
                current.map((method) => ({
                  ...method,
                  isDefault: method.id === methodId,
                })),
              )
            }}
          />
          <GuideCard />
          <AppearanceCard
            language={language}
            theme={theme}
            onToggleLanguage={() =>
              setLanguage((current) => (current === ENGLISH_LABEL ? ARABIC_LABEL : ENGLISH_LABEL))
            }
            onThemeChange={setTheme}
          />
          <AboutBlock />
        </div>
      </main>

      <SettingsDrawer
        direction={direction}
        drawer={drawer}
        methods={paymentMethods}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
          }
        }}
      />

      <AppBottomNavigation activeValue="settings" items={navItems} />
    </div>
  )
}

function ProfileCard({ onEdit }: { onEdit: () => void }) {
  return (
    <SettingsCard
      actionLabel={PROFILE_EDIT_LABEL}
      icon={UserCircleIcon}
      subtitle={PROFILE_SUBTITLE}
      title={PROFILE_TITLE}
      onAction={onEdit}
    >
      <Separator className="bg-border-subtle" />
      <div className="space-y-4">
        <DetailBlock label={USERNAME_LABEL}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[1.25rem] font-semibold leading-[1.15] text-foreground">
              {PROFILE_USERNAME}
            </p>
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.6875rem] font-medium shadow-ring",
                PROFILE_STATUS === ACTIVE_STATUS_LABEL
                  ? "bg-success-subtle text-success dark:bg-success-subtle-dark dark:text-success-dark"
                  : "bg-surface-offset text-text-secondary",
              )}
            >
              {PROFILE_STATUS === ACTIVE_STATUS_LABEL ? ACTIVE_STATUS_LABEL : INACTIVE_STATUS_LABEL}
            </Badge>
          </div>
        </DetailBlock>

        <DetailBlock label={EMAIL_LABEL}>
          <p className="text-sm leading-[1.6] text-foreground">{PROFILE_EMAIL}</p>
        </DetailBlock>

        <DetailBlock icon={StarIcon} label={MEMBER_SINCE_LABEL}>
          <p className="text-sm leading-[1.6] text-foreground">{PROFILE_MEMBER_SINCE}</p>
        </DetailBlock>
      </div>
    </SettingsCard>
  )
}

function MonthlyBudgetCard({ onChange }: { onChange: () => void }) {
  const locale = useLocale()

  return (
    <SettingsCard
      actionLabel={BUDGET_CHANGE_LABEL}
      icon={Calendar03Icon}
      subtitle={MONTHLY_BUDGET_SUBTITLE}
      title={MONTHLY_BUDGET_TITLE}
      onAction={onChange}
    >
      <InfoRow
        icon={Calendar03Icon}
        label={`${formatCurrency(locale, MONTHLY_BUDGET)} ${CURRENCY}`}
      />
    </SettingsCard>
  )
}

function BudgetManagementCard({ onAdd }: { onAdd: () => void }) {
  const locale = useLocale()

  return (
    <SettingsCard
      actionLabel={BOOST_ADD_LABEL}
      icon={MoneyBag02Icon}
      subtitle={BUDGET_MANAGEMENT_SUBTITLE}
      title={BUDGET_MANAGEMENT_TITLE}
      onAction={onAdd}
    >
      {BUDGET_BOOSTS.length === 0 ? (
        <p className="rounded-sm bg-surface-offset px-4 py-5 text-center text-sm leading-[1.6] text-text-secondary shadow-ring">
          {EMPTY_BOOSTS_LABEL}
        </p>
      ) : (
        <div className="space-y-3">
          {BUDGET_BOOSTS.map((boost) => (
            <div
              key={`${boost.label}-${boost.expiresOn}`}
              className="rounded-sm bg-surface-offset p-3 shadow-ring"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{boost.label}</p>
                <p dir="ltr" className="text-sm font-semibold text-foreground tabular-nums">
                  {formatCurrency(locale, boost.amount)}
                </p>
              </div>
              <p className="mt-1 text-sm leading-[1.5] text-text-secondary">{`Expires ${boost.expiresOn}`}</p>
            </div>
          ))}
        </div>
      )}
    </SettingsCard>
  )
}

function PaymentMethodsCard({
  methods,
  deleteCandidateId,
  onSetDefault,
  onEdit,
  onDeleteTap,
  onCancelDelete,
  onAdd,
}: {
  methods: typeof PAYMENT_METHODS
  deleteCandidateId: string | null
  onSetDefault: (methodId: string) => void
  onEdit: (methodId: string) => void
  onDeleteTap: (methodId: string) => void
  onCancelDelete: () => void
  onAdd: () => void
}) {
  return (
    <SettingsCard
      icon={CreditCardIcon}
      subtitle={PAYMENT_METHODS_SUBTITLE}
      title={PAYMENT_METHODS_TITLE}
    >
      <div className="space-y-3">
        {methods.map((method) =>
          deleteCandidateId === method.id ? (
            <div
              key={method.id}
              className="rounded-sm bg-danger-subtle p-3 shadow-ring dark:bg-danger-subtle-dark"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-danger dark:text-danger-dark">{`Delete ${method.name}?`}</p>
                <div className="flex gap-2">
                  <Button type="button" variant="destructive" size="xs">
                    Confirm
                  </Button>
                  <Button type="button" variant="ghost" size="xs" onClick={onCancelDelete}>
                    {CANCEL_LABEL}
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
                        {DEFAULT_BADGE_LABEL}
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
                    {PAYMENT_EDIT_LABEL}
                  </button>
                  <button
                    type="button"
                    className="min-h-10 rounded-full px-2 text-sm font-medium text-danger transition-colors hover:text-danger-hover dark:text-danger-dark"
                    onClick={() => onDeleteTap(method.id)}
                  >
                    {PAYMENT_DELETE_LABEL}
                  </button>
                </div>
              </div>
            </div>
          ),
        )}

        <Button type="button" variant="outline" className="w-full" onClick={onAdd}>
          {ADD_PAYMENT_METHOD_LABEL}
        </Button>
      </div>
    </SettingsCard>
  )
}

function GuideCard() {
  return (
    <SettingsCard icon={BookOpen01Icon} subtitle={GUIDE_SUBTITLE} title={GUIDE_TITLE}>
      <Button type="button" variant="outline" className="w-full">
        {VIEW_GUIDE_LABEL}
      </Button>
    </SettingsCard>
  )
}

function AppearanceCard({
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
  return (
    <SettingsCard icon={PaintBrush02Icon} subtitle={APPEARANCE_SUBTITLE} title={APPEARANCE_TITLE}>
      <div className="space-y-3">
        <div className="rounded-sm bg-surface-offset p-3 shadow-ring">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">{THEME_LABEL}</p>
              <div className="grid grid-cols-3 rounded-full bg-card p-1 shadow-ring">
                {THEME_OPTIONS.map((option) => {
                  const selected = option === theme

                  return (
                    <button
                      key={option}
                      type="button"
                      className={cn(
                        "min-h-9 rounded-full px-2 text-[0.6875rem] font-medium transition-colors",
                        selected
                          ? "bg-secondary text-foreground shadow-ring"
                          : "text-text-secondary",
                      )}
                      onClick={() => onThemeChange(option)}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
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
              <p className="text-sm font-semibold text-foreground">{LANGUAGE_LABEL}</p>
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
                <p className="text-sm font-semibold text-foreground">{MONTHLY_REPORTS_LABEL}</p>
                <p className="mt-1 text-sm leading-[1.5] text-text-secondary">
                  {MONTHLY_REPORTS_VALUE}
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
          {LOGOUT_LABEL}
        </Button>
      </div>
    </SettingsCard>
  )
}

function AboutBlock() {
  return (
    <div className="px-1 py-2 text-center">
      <p className="text-xs font-medium tracking-[0.1em] text-text-tertiary uppercase">{`${APP_NAME} PWA`}</p>
      <p className="mt-2 text-sm font-medium text-text-secondary">{`Version ${APP_VERSION}`}</p>
      <p className="mt-2 text-sm leading-[1.6] text-text-secondary text-pretty">
        {APP_DESCRIPTION}
      </p>
      {PLAN === "pro" ? (
        <p className="mt-3 text-[0.6875rem] font-medium text-brand">
          {UPGRADE_LABEL.replace("Upgrade to ", "")}
        </p>
      ) : null}
    </div>
  )
}

function SettingsDrawer({
  drawer,
  methods,
  direction,
  onOpenChange,
}: {
  drawer: DrawerKind
  methods: typeof PAYMENT_METHODS
  direction: "ltr" | "rtl"
  onOpenChange: (open: boolean) => void
}) {
  const open = drawer !== null
  const editingMethod =
    drawer && typeof drawer === "object" && drawer.kind === "methodEdit"
      ? (methods.find((method) => method.id === drawer.methodId) ?? null)
      : null
  const drawerTitle =
    drawer === "profile"
      ? EDIT_PROFILE_TITLE
      : drawer === "budget"
        ? CHANGE_BUDGET_TITLE
        : drawer === "boost"
          ? ADD_BOOST_TITLE
          : editingMethod
            ? EDIT_METHOD_TITLE
            : ADD_METHOD_TITLE
  const drawerDescription =
    drawer === "profile"
      ? PROFILE_DRAWER_SUBTITLE
      : drawer === "budget"
        ? BUDGET_DRAWER_SUBTITLE
        : drawer === "boost"
          ? BOOST_DRAWER_SUBTITLE
          : METHOD_DRAWER_SUBTITLE

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent dir={direction} className="mx-auto max-w-sm">
        <DrawerHeader className="text-start">
          <DrawerTitle>{drawerTitle}</DrawerTitle>
          <DrawerDescription>{drawerDescription}</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 px-4 pb-2">
          {drawer === "profile" ? (
            <div className="space-y-4">
              <InputField label={USERNAME_LABEL} value={PROFILE_USERNAME} />
              <InputField label={EMAIL_LABEL} type="email" value={PROFILE_EMAIL} />
            </div>
          ) : drawer === "budget" ? (
            <div className="space-y-4">
              <InputField
                label={BUDGET_AMOUNT_LABEL}
                type="number"
                value={String(MONTHLY_BUDGET)}
              />
            </div>
          ) : drawer === "boost" ? (
            <div className="space-y-4">
              <InputField label={BOOST_LABEL_FIELD} value="" />
              <InputField label={BOOST_AMOUNT_LABEL} type="number" value="" />
              <DateField label={BOOST_EXPIRES_ON_LABEL} value={BOOST_EXPIRES_PLACEHOLDER} />
            </div>
          ) : (
            <MethodForm method={editingMethod} />
          )}
        </div>

        <DrawerFooter>
          <Button type="button">{drawer === "boost" ? ADD_BOOST_PRIMARY_LABEL : SAVE_LABEL}</Button>
          <DrawerClose asChild>
            <button type="button" className="min-h-11 text-sm font-medium text-brand">
              {CANCEL_LABEL}
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function MethodForm({ method }: { method: (typeof PAYMENT_METHODS)[number] | null }) {
  const [selectedIcon, setSelectedIcon] = React.useState(
    method?.icon ?? PAYMENT_METHODS[0]?.icon ?? "cash",
  )

  return (
    <div className="space-y-4">
      <InputField label={METHOD_NAME_LABEL} value={method?.name ?? ""} />
      <div className="space-y-2">
        <div className="text-xs font-semibold tracking-[0.12em] text-text-tertiary uppercase">
          Icon
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: PAYMENT_METHODS[0]?.name ?? "Cash", value: "cash" as const },
            { label: PAYMENT_METHODS[1]?.name ?? "Card", value: "card" as const },
            { label: "Bank", value: "bank" as const },
          ].map((option) => {
            const selected = option.value === selectedIcon

            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface-offset px-3 text-sm font-medium shadow-ring transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-stashy)] active:scale-[0.96]",
                  selected && "bg-card text-foreground",
                )}
                onClick={() => setSelectedIcon(option.value)}
              >
                <MethodGlyph icon={option.value} />
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>
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

function InputField({
  label,
  value,
  type = "text",
}: {
  label: string
  value: string
  type?: React.HTMLInputTypeAttribute
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold tracking-[0.12em] text-text-tertiary uppercase">
        {label}
      </span>
      <input
        type={type}
        defaultValue={value}
        className="h-[3.25rem] w-full rounded-sm border border-border bg-surface-offset px-4 text-[1.0625rem] font-medium text-foreground shadow-ring outline-none placeholder:text-text-tertiary"
      />
    </label>
  )
}

function DateField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-[0.12em] text-text-tertiary uppercase">
        {label}
      </p>
      <button
        type="button"
        className="flex h-[3.25rem] w-full items-center justify-between rounded-sm border border-border bg-surface-offset px-4 text-[1.0625rem] font-medium text-foreground shadow-ring"
      >
        <span>{value}</span>
        <HugeiconsIcon
          icon={Calendar03Icon}
          aria-hidden="true"
          size={18}
          className="text-text-secondary"
        />
      </button>
    </div>
  )
}

function MethodIcon({ icon }: { icon: "cash" | "card" | "bank" }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-text-secondary shadow-ring">
      <MethodGlyph icon={icon} />
    </span>
  )
}

function MethodGlyph({ icon }: { icon: "cash" | "card" | "bank" }) {
  const glyphIcon = icon === "cash" ? MoneyBag02Icon : icon === "card" ? CreditCardIcon : BankIcon

  return <HugeiconsIcon icon={glyphIcon} aria-hidden="true" size={18} />
}

function mapThemeToOption(theme: typeof THEME): ThemeValue {
  if (theme === "light") {
    return LIGHT_LABEL
  }

  if (theme === "system") {
    return SYSTEM_LABEL
  }

  return DARK_LABEL
}

function formatCurrency(locale: string, value: number) {
  return `${new Intl.NumberFormat(locale).format(value)}`
}
