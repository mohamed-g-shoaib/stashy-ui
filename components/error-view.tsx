"use client"

import { FallbackScreen } from "@/components/fallback-screen"

type ErrorViewProps = {
  eyebrow?: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export function ErrorView({
  eyebrow,
  title = "Something went wrong.",
  description = "An unexpected error occurred. Please try again.",
  action,
}: ErrorViewProps) {
  return (
    <FallbackScreen eyebrow={eyebrow} title={title} description={description} action={action} />
  )
}
