import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCardTint(tone: "success" | "warning" | "danger" | "none" | string) {
  switch (tone) {
    case "warning":
      return "bg-warning-subtle/40 border border-warning/30"
    case "danger":
      return "bg-danger-subtle/40 border border-danger/30"
    default:
      return ""
  }
}
