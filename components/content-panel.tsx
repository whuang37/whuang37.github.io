import { X } from "lucide-react"
import type React from "react"

interface ContentPanelProps {
  closeHref: string
  children: React.ReactNode
}

export function ContentPanel({ closeHref, children }: ContentPanelProps) {
  return (
    <main className="flex-1 p-8 md:p-16 max-w-3xl overflow-y-auto max-md:pt-20 relative">
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
