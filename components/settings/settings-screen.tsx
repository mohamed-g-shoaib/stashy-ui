"use client"

import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { AppBottomNavigation } from "@/components/app-bottom-navigation"
import { navItems } from "@/components/home/home-data"
import {
  INITIAL_BUDGET_BOOSTS,
  INITIAL_PAYMENT_METHODS,
  LANGUAGE,
  MONTHLY_BUDGET,
  PROFILE_EMAIL,
  PROFILE_MEMBER_SINCE,
  PROFILE_STATUS,
  PROFILE_USERNAME,
} from "@/components/settings/data"
import { SettingsDrawer } from "@/components/settings/settings-drawer"
import {
  AboutBlock,
  BudgetSection,
  DangerSection,
  DataSection,
  LogoutButton,
  PreferencesGroupCard,
  ProfileHeroBlock,
  SupportGroupCard,
} from "@/components/settings/settings-sections"
import type { DrawerKind, LanguageValue, PaymentMethod } from "@/components/settings/types"
import { type Locale } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"

export function SettingsScreen() {
  const locale = useLocale() as Locale
  const t = useTranslations("Settings")
  const direction = getDirectionForLocale(locale)
  const [drawer, setDrawer] = React.useState<DrawerKind>(null)
  const [language, setLanguage] = React.useState<LanguageValue>(LANGUAGE)
  const [profile, setProfile] = React.useState({
    username: PROFILE_USERNAME,
    status: PROFILE_STATUS,
    email: PROFILE_EMAIL,
    memberSince: PROFILE_MEMBER_SINCE,
  })
  const [monthlyBudget, setMonthlyBudget] = React.useState(MONTHLY_BUDGET)
  const [budgetBoosts, setBudgetBoosts] = React.useState(INITIAL_BUDGET_BOOSTS)
  const [paymentMethods, setPaymentMethods] = React.useState(INITIAL_PAYMENT_METHODS)
  const [deleteCandidateId, setDeleteCandidateId] = React.useState<string | null>(null)
  const [profileDraft, setProfileDraft] = React.useState({
    username: PROFILE_USERNAME,
    email: PROFILE_EMAIL,
  })
  const [budgetDraft, setBudgetDraft] = React.useState(String(MONTHLY_BUDGET))
  const [boostDraft, setBoostDraft] = React.useState({
    label: "",
    amount: "",
  })
  const [methodDraft, setMethodDraft] = React.useState<{
    id: string | null
    name: string
    icon: PaymentMethod["icon"]
  }>({
    id: null,
    name: "",
    icon: "cash",
  })

  React.useEffect(() => {
    if (drawer === "profile") {
      setProfileDraft({ username: profile.username, email: profile.email })
      return
    }

    if (drawer === "budget") {
      setBudgetDraft(String(monthlyBudget))
      return
    }

    if (drawer === "boost") {
      setBoostDraft({ label: "", amount: "" })
      return
    }

    if (drawer === "methodAdd") {
      setMethodDraft({ id: null, name: "", icon: "cash" })
      return
    }

    if (drawer && typeof drawer === "object" && drawer.kind === "methodEdit") {
      const method = paymentMethods.find((item) => item.id === drawer.methodId)

      if (method) {
        setMethodDraft({
          id: method.id,
          name: method.name,
          icon: method.icon,
        })
      }
    }
  }, [drawer, monthlyBudget, paymentMethods, profile])

  const editingMethod =
    drawer && typeof drawer === "object" && drawer.kind === "methodEdit"
      ? (paymentMethods.find((method) => method.id === drawer.methodId) ?? null)
      : null

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="bg-background px-screen pt-5">
        <h1 className="text-[1.5rem] font-semibold leading-[1.2] text-foreground">{t("title")}</h1>
        <p className="mt-2 max-w-[28ch] text-sm leading-[1.6] text-text-secondary text-pretty">
          {t("subtitle")}
        </p>
      </header>

      <main className="flex-1 px-screen pb-32 pt-5">
        <div className="flex flex-col gap-6">
          <ProfileHeroBlock profile={profile} onEdit={() => setDrawer("profile")} />

          <BudgetSection
            monthlyBudget={monthlyBudget}
            boosts={budgetBoosts}
            methods={paymentMethods}
            deleteCandidateId={deleteCandidateId}
            onChangeBudget={() => setDrawer("budget")}
            onAddBoost={() => setDrawer("boost")}
            onAddMethod={() => setDrawer("methodAdd")}
            onEditMethod={(methodId) => setDrawer({ kind: "methodEdit", methodId })}
            onDeleteTap={setDeleteCandidateId}
            onConfirmDelete={(methodId) => {
              setDeleteCandidateId(null)
              setPaymentMethods((current) => {
                const next = current.filter((method) => method.id !== methodId)
                if (!next.some((method) => method.isDefault) && next[0]) {
                  next[0] = { ...next[0], isDefault: true }
                }
                return next
              })
            }}
            onCancelDelete={() => setDeleteCandidateId(null)}
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

          <PreferencesGroupCard
            language={language}
            onToggleLanguage={() =>
              setLanguage((current) => (current === "English" ? "Arabic" : "English"))
            }
          />

          <DataSection />

          <SupportGroupCard />

          <DangerSection />

          <AboutBlock />

          <LogoutButton />
        </div>
      </main>

      <SettingsDrawer
        boostDraft={boostDraft}
        budgetDraft={budgetDraft}
        direction={direction}
        drawer={drawer}
        editingMethod={editingMethod}
        methodDraft={methodDraft}
        profileDraft={profileDraft}
        onBoostDraftChange={setBoostDraft}
        onBudgetDraftChange={setBudgetDraft}
        onMethodDraftChange={setMethodDraft}
        onOpenChange={(open) => {
          if (!open) {
            setDrawer(null)
          }
        }}
        onProfileDraftChange={setProfileDraft}
        onSave={() => {
          if (drawer === "profile") {
            setProfile((current) => ({
              ...current,
              username: profileDraft.username || current.username,
              email: profileDraft.email || current.email,
            }))
          } else if (drawer === "budget") {
            setMonthlyBudget(Number(budgetDraft) || monthlyBudget)
          } else if (drawer === "boost") {
            const nextAmount = Number(boostDraft.amount) || 0

            if (boostDraft.label && nextAmount > 0) {
              setBudgetBoosts((current) => [
                {
                  id: `boost-${current.length + 1}`,
                  label: boostDraft.label,
                  amount: nextAmount,
                },
                ...current,
              ])
            }
          } else if (drawer === "methodAdd" || editingMethod) {
            if (!methodDraft.name) {
              setDrawer(null)
              return
            }

            if (editingMethod) {
              setPaymentMethods((current) =>
                current.map((method) =>
                  method.id === editingMethod.id
                    ? { ...method, name: methodDraft.name, icon: methodDraft.icon }
                    : method,
                ),
              )
            } else {
              setPaymentMethods((current) => [
                ...current,
                {
                  id: `method-${current.length + 1}`,
                  name: methodDraft.name,
                  icon: methodDraft.icon,
                  isDefault: current.length === 0,
                },
              ])
            }
          }

          setDrawer(null)
        }}
      />

      <AppBottomNavigation activeValue="settings" items={navItems} />
    </div>
  )
}

