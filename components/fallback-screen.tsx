import type * as React from "react"
import { type Direction } from "@/lib/i18n"
import { heroSurfaceClass, statTileClass } from "@/lib/design-system-classes"
import { cn } from "@/lib/utils"

type FallbackScreenProps = {
  eyebrow?: string
  locale?: string
  direction?: Direction
  title: string
  description: string
  action?: React.ReactNode
}

export function FallbackScreen({
  eyebrow = "Stashy",
  locale,
  direction,
  title,
  description,
  action,
}: FallbackScreenProps) {
  return (
    <main lang={locale} dir={direction} className="flex min-h-svh items-center px-4 py-10">
      <section className="w-full">
        <div className={cn("flex flex-col gap-6 p-4", heroSurfaceClass)}>
          <div className="flex flex-col gap-2 text-start">
            <p className="inline-flex w-fit items-center rounded-full bg-brand-subtle px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-brand shadow-ring">
              {eyebrow}
            </p>
            <h1 className="text-balance text-2xl font-semibold leading-[1.2] text-foreground">
              {title}
            </h1>
            <p className="text-pretty text-[1.0625rem] leading-[1.5] text-text-secondary">
              {description}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2" aria-hidden="true">
            {[0, 1, 2].map((item) => (
              <div key={item} className={cn("flex flex-col gap-2", statTileClass)}>
                <div className="h-2 w-8 rounded-full bg-text-tertiary/25" />
                <div
                  className={cn(
                    "h-2 rounded-full",
                    item === 0 && "w-10 bg-brand/55",
                    item === 1 && "w-12 bg-injection/45",
                    item === 2 && "w-9 bg-warning/55",
                  )}
                />
              </div>
            ))}
          </div>

          {action ? (
            <div className="flex flex-wrap items-center justify-start gap-2">{action}</div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
