import { cn } from "@/lib/utils"

type MobileCanvasProps = {
  children: React.ReactNode
  className?: string
}

export function MobileCanvas({ children, className }: MobileCanvasProps) {
  return (
    <div className="min-h-svh bg-background">
      <div className={cn("mx-auto min-h-svh w-full max-w-sm", className)}>{children}</div>
    </div>
  )
}
