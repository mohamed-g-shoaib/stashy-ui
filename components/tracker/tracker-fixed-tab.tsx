"use client"

import * as React from "react"

import { FixedDetailSheet } from "@/components/tracker/fixed-detail-sheet"
import { FixedSummaryCard } from "@/components/tracker/fixed-summary-card"
import { BudgetsSection } from "@/components/tracker/sections/budgets-section"
import { InstallmentsSection } from "@/components/tracker/sections/installments-section"
import { SubscriptionsSection } from "@/components/tracker/sections/subscriptions-section"
import { TrackerAddDrawer } from "@/components/tracker/tracker-add-drawer"
import { TrackerTransferDrawer } from "@/components/tracker/tracker-transfer-drawer"
import type { FixedExpenseItem } from "@/components/tracker/types"
import {
  fixedItems,
  mockInstallmentOverview,
  mockSummary,
} from "@/data/fixed-tracker-mock"

export function TrackerFixedTab() {
  const [selectedItem, setSelectedItem] = React.useState<FixedExpenseItem | null>(null)
  const [editingItem, setEditingItem] = React.useState<FixedExpenseItem | null>(null)
  const [editOpen, setEditOpen] = React.useState(false)
  const [transferItem, setTransferItem] = React.useState<FixedExpenseItem | null>(null)
  const [transferOpen, setTransferOpen] = React.useState(false)

  const recurringItems = fixedItems.filter((item) => item.type === "recurring")
  const installmentItems = fixedItems.filter((item) => item.type === "installment")
  const manualItems = fixedItems.filter((item) => item.type === "manual")

  function handleEdit(item: FixedExpenseItem) {
    setSelectedItem(null)
    setEditingItem(item)
    setEditOpen(true)
  }

  function handleTransfer(item: FixedExpenseItem) {
    setSelectedItem(null)
    setTransferItem(item)
    setTransferOpen(true)
  }

  return (
    <div className="flex flex-col gap-8">
      <FixedSummaryCard summary={mockSummary} />
      <BudgetsSection items={manualItems} onCardTap={setSelectedItem} />
      <SubscriptionsSection items={recurringItems} onCardTap={setSelectedItem} />
      <InstallmentsSection
        items={installmentItems}
        overview={mockInstallmentOverview}
        onCardTap={setSelectedItem}
      />
      <FixedDetailSheet
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={handleEdit}
        onTransfer={handleTransfer}
      />
      <TrackerAddDrawer
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingItem(null)
        }}
        editItem={editingItem}
      />
      <TrackerTransferDrawer
        open={transferOpen}
        sourceItem={transferItem}
        onOpenChange={(open) => {
          setTransferOpen(open)
          if (!open) setTransferItem(null)
        }}
      />
    </div>
  )
}
