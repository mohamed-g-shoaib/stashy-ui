import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { floatingActionButtonClass } from "@/lib/design-system-classes";
import { cn } from "@/lib/utils";

type FloatingAddButtonProps = {
  onClick: () => void;
};

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  const t = useTranslations("Home");

  return (
    <Button
      type="button"
      size="icon-lg"
      aria-label={t("fab.label")}
      className={cn(
        floatingActionButtonClass,
        "end-[max(1rem,calc((100vw-24rem)/2+1rem))] bg-brand text-primary-foreground shadow-ring-brand hover:bg-brand-hover",
      )}
      onClick={onClick}
    >
      <HugeiconsIcon icon={Add01Icon} aria-hidden="true" />
    </Button>
  );
}
