"use client"

import { FallbackScreen } from "@/components/fallback-screen"

type ErrorViewProps = {
  title?: string
  description?: string
  action?: React.ReactNode
}

export function ErrorView({
  title = "Something went wrong.",
  description = "An unexpected error occurred. Please try again.",
  action,
}: ErrorViewProps) {
  return <FallbackScreen title={title} description={description} action={action} />
}
