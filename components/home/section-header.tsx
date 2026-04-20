import { Button } from "@/components/ui/button"

type SectionHeaderProps = {
  title: string
  action?: string
  onAction?: () => void
  actions?: React.ReactNode
}

export function SectionHeader({ title, action, onAction, actions }: SectionHeaderProps) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-3">
      <h2 className="text-start text-xl font-semibold leading-[1.25] text-foreground">{title}</h2>
      {actions ? (
        <div className="flex items-center gap-1">{actions}</div>
      ) : action ? (
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="h-11 min-h-11 rounded-full px-3"
          onClick={onAction}
        >
          {action}
        </Button>
      ) : null}
    </div>
  )
}
