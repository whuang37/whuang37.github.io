import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Footer } from "./footer"
import { ResizeHandle } from "./resize-handle"

interface ListPaneLayoutProps {
  children: ReactNode
  header: ReactNode
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
  selectedItem: boolean
  width: number
}

export function ListPaneLayout({
  children,
  header,
  isDragging,
  onMouseDown,
  selectedItem,
  width,
}: ListPaneLayoutProps) {
  return (
    <div
      style={{ width: `min(100vw, ${width}px)` }}
      className={cn(
        "relative h-full shrink-0 overflow-y-auto overflow-x-hidden border-r border-border publication-scroll",
        selectedItem && "max-md:hidden",
      )}
    >
      <div className="flex min-h-full min-w-0 max-w-3xl flex-col justify-between px-6 pb-0 md:px-16">
        <div className="min-w-0">
          <div className="sticky top-0 z-10 bg-background pt-28 pb-8 md:pt-16">{header}</div>
          {children}
        </div>

        <Footer />
      </div>

      {selectedItem && <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />}
    </div>
  )
}
