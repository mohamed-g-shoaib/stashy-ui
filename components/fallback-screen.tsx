import type * as React from "react"
import { type Direction } from "@/lib/i18n"

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
        <div className="flex flex-col gap-6 rounded-md border border-border-subtle bg-card p-4 shadow-soft">
          <div className="flex flex-col gap-2 text-start">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
              {eyebrow}
            </p>
            <h1 className="text-balance text-2xl font-semibold leading-[1.2] text-foreground">
              {title}
            </h1>
            <p className="text-pretty text-[1.0625rem] leading-[1.5] text-text-secondary">
              {description}
            </p>
          </div>

          {action ? (
            <div className="flex flex-wrap items-center justify-start gap-2">{action}</div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
