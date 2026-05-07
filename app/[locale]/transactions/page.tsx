import { setRequestLocale } from "next-intl/server";
import { use, Suspense } from "react";

import { HistoryScreen } from "@/components/history-screen";

export default function TransactionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <Suspense>
      <HistoryScreen />
    </Suspense>
  );
}
