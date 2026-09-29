import { X } from "lucide-react"
import type React from "react"
import { cn } from "@/lib/utils"

interface ContentPanelProps {
  closeHref: string
  children: React.ReactNode
  wide?: boolean
}

export function ContentPanel({ closeHref, children, wide = false }: ContentPanelProps) {
  return (
    <main
      className={cn(
        "relative min-w-0 flex-1 overflow-y-auto max-md:pt-20",
        wide ? "px-4 pb-4 md:px-6 md:pt-16 md:pb-6" : "max-w-3xl p-8 md:p-16",
      )}
    >
      <div className="absolute top-4 right-4">
        <a
          href={closeHref}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close reading panel"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </a>
      </div>
      {children}
    </main>
  )
}
