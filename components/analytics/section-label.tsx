"use client"

interface SectionLabelProps {
  label: string
}

export function SectionLabel({ label }: SectionLabelProps) {
  return (
    <p className="px-1 pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
      {label}
    </p>
  )
}
