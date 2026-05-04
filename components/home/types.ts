import type { IconSvgElement } from "@hugeicons/react";

export type DrawerKind = "add" | "filter" | "help" | "settings" | "fixed";
export type DailyScenario = "track" | "overspent";
export type AddActionKind = "spend" | "receive" | "injection" | "major";

export type DailyRate = {
  remaining: string;
  allowance: string;
  spent: string;
  explanation: string;
  tomorrow: string | null;
  status: string;
  statusTone: "fixed" | "expense";
  fill: string;
  spentFill: string;
};

export type NavItem = {
  value: string;
  labelKey: string;
  icon: IconSvgElement;
};
