import type { MajorExpense } from "@/components/tracker/types";

export const majorExpenses: MajorExpense[] = [
  {
    nameKey: "majorItems.laptop",
    amount: "3,000 EGP",
    date: "Apr 7",
    methodKey: "methods.cash",
    percent: "15%",
    isLarge: true,
  },
  {
    nameKey: "majorItems.dentist",
    amount: "800 EGP",
    date: "Apr 10",
    methodKey: "methods.card",
    percent: "4%",
    isLarge: false,
  },
  {
    nameKey: "majorItems.furniture",
    amount: "2,000 EGP",
    date: "Apr 15",
    methodKey: "methods.card",
    percent: "10%",
    isLarge: true,
  },
];
