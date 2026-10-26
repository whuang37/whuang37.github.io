import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import type { ReactNode, Ref } from "react"
import { cn } from "@/lib/utils"

interface ScrollAreaProps {
  children: ReactNode
  className?: string
  viewportRef?: Ref<HTMLDivElement>
  viewportClassName?: string
  label?: string
  horizontal?: boolean
}

export function ScrollArea({ children, className, viewportRef, viewportClassName, label, horizontal = true }: ScrollAreaProps) {
  const thumbClass = "relative flex-1 rounded-full bg-foreground/15 hover:bg-foreground/25"

  return (
    <ScrollAreaPrimitive.Root type="auto" className={cn("relative min-h-0 min-w-0 overflow-hidden", className)}>
      <ScrollAreaPrimitive.Viewport ref={viewportRef} tabIndex={0} role={label ? "region" : undefined} aria-label={label} className={cn("h-full w-full overscroll-contain [&>div]:min-h-full", viewportClassName)}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation="vertical" className="z-30 flex w-1.5 touch-none select-none">
        <ScrollAreaPrimitive.Thumb className={thumbClass} />
      </ScrollAreaPrimitive.Scrollbar>
      {horizontal && (
        <>
          <ScrollAreaPrimitive.Scrollbar orientation="horizontal" className="z-30 flex h-1.5 touch-none select-none flex-col">
            <ScrollAreaPrimitive.Thumb className={thumbClass} />
          </ScrollAreaPrimitive.Scrollbar>
          <ScrollAreaPrimitive.Corner className="bg-background" />
        </>
      )}
    </ScrollAreaPrimitive.Root>
  )
}
