"use client"

interface SectionHeaderProps {
  index: number
  eyebrow: string
  title: string
  subtitle: string
}

export function SectionHeader({ index, eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-1 px-1 pt-4 pb-1">
      <p
        dir="ltr"
        className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-text-tertiary tabular-nums"
      >
        {eyebrow} {String(index).padStart(2, "0")}
      </p>
      <h2 className="text-[1.25rem] font-semibold leading-[1.25] text-foreground">{title}</h2>
      <p className="max-w-[36ch] text-sm leading-[1.5] text-text-secondary text-pretty">
        {subtitle}
      </p>
    </div>
  )
}
