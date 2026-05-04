import {
  Analytics01Icon,
  Calendar03Icon,
  Home01Icon,
  Invoice03Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import type { NavItem } from "@/components/home/types";
export const fixedPayments = [
  {
    nameKey: "fixedPayments.rent",
    dueKey: "fixedPayments.oneDay",
    amount: "3000 EGP",
    date: "Mon, 20/Apr",
  },
  {
    nameKey: "fixedPayments.internet",
    dueKey: "fixedPayments.twoDays",
    amount: "260 EGP",
    date: "Tue, 21/Apr",
  },
];

export const navItems: NavItem[] = [
  { value: "home", labelKey: "nav.home", icon: Home01Icon },
  { value: "tracker", labelKey: "nav.tracker", icon: Invoice03Icon },
  { value: "history", labelKey: "nav.history", icon: Calendar03Icon },
  { value: "analytics", labelKey: "nav.analytics", icon: Analytics01Icon },
  { value: "settings", labelKey: "nav.settings", icon: Settings02Icon },
];
