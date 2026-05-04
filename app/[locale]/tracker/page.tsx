import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { TrackerScreen } from "@/components/tracker-screen";
import type { TrackerTab } from "@/components/tracker/types";

export default function TrackerPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = use(params);
  const { tab } = use(searchParams);
  setRequestLocale(locale);

  return <TrackerScreen initialTab={getInitialTab(tab)} />;
}

function getInitialTab(tab: string | undefined): TrackerTab {
  if (tab === "major") {
    return tab;
  }

  return "fixed";
}
