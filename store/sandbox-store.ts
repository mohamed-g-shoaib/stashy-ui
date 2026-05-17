import { create } from "zustand"

type MonthlyBudgetState = "onTrack" | "atRisk" | "over"
type DailyRateState = "underRate" | "overRate"
type MajorScenario = "active" | "none"
type Plan = "free" | "pro"

interface SandboxStore {
  monthlyBudgetState: MonthlyBudgetState
  dailyRateState: DailyRateState
  majorScenario: MajorScenario
  plan: Plan
  introCardVisible: boolean
  setMonthlyBudgetState: (v: MonthlyBudgetState) => void
  setDailyRateState: (v: DailyRateState) => void
  setMajorScenario: (v: MajorScenario) => void
  setPlan: (v: Plan) => void
  setIntroCardVisible: (v: boolean) => void
}

export const useSandboxStore = create<SandboxStore>((set) => ({
  monthlyBudgetState: "onTrack",
  dailyRateState: "underRate",
  majorScenario: "active",
  plan: "pro",
  introCardVisible: true,
  setMonthlyBudgetState: (v) => set({ monthlyBudgetState: v }),
  setDailyRateState: (v) => set({ dailyRateState: v }),
  setMajorScenario: (v) => set({ majorScenario: v }),
  setPlan: (v) => set({ plan: v }),
  setIntroCardVisible: (v) => set({ introCardVisible: v }),
}))
