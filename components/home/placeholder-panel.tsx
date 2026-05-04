import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Card, CardContent } from "@/components/ui/card"
import { semanticSurfaceClass } from "@/lib/semantic-styles"

type PlaceholderPanelProps = {
  title: string
  description: string
  icon: IconSvgElement
}

export function PlaceholderPanel({ title, description, icon }: PlaceholderPanelProps) {
  return (
    <div className="flex min-h-[calc(100svh-9rem)] items-center justify-center text-center">
      <Card className="rounded-md border border-border bg-card shadow-soft">
        <CardContent className="flex flex-col items-center gap-3 px-4">
          <span
            className={`flex size-12 items-center justify-center rounded-full ${semanticSurfaceClass.brand}`}
          >
            <HugeiconsIcon icon={icon} size={24} aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <p className="text-sm leading-[1.5] text-text-secondary">{description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
