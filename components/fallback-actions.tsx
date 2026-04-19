"use client"

import { Button } from "@/components/ui/button"
import { useUiSound } from "@/hooks/use-ui-sound"
import { useRouter } from "@/i18n/navigation"

type FallbackActionsProps = {
  homeHref: string
  homeLabel: string
  retryLabel?: string
  onRetry?: () => void
}

export function FallbackActions({
  homeHref,
  homeLabel,
  retryLabel,
  onRetry,
}: FallbackActionsProps) {
  const router = useRouter()
  const { playSound } = useUiSound()

  return (
    <>
      {onRetry && retryLabel ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-full px-3"
          onClick={() => {
            playSound("click-soft")
            onRetry()
          }}
        >
          {retryLabel}
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-full px-3"
        onClick={() => {
          playSound("click-soft")
          window.setTimeout(() => router.push(homeHref), 100)
        }}
      >
        {homeLabel}
      </Button>
    </>
  )
}
