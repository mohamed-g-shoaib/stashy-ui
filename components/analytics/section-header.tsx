"use client"

interface SectionHeaderProps {
  title: string
  subtitle: string
  showDivider?: boolean
}

export function SectionHeader({ title, subtitle, showDivider = true }: SectionHeaderProps) {
  return (
    <div className="px-1 pt-4 pb-1">
      {showDivider ? <div className="mb-3 h-px bg-border-subtle" /> : null}
      <h2 className="text-[1.35rem] font-semibold leading-[1.25] text-foreground">{title}</h2>
      <p className="mt-1 max-w-[36ch] text-sm leading-[1.5] text-text-secondary text-pretty">
        {subtitle}
      </p>
    </div>
  )
}
