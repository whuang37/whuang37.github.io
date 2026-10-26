import type React from "react"
import { ScrollArea } from "./scroll-area"

interface ContentPanelProps {
  document?: boolean
  children: React.ReactNode
  menuControl?: React.ReactNode
}

export function ContentPanel({ document = false, children, menuControl }: ContentPanelProps) {
  return (
    <main className="relative flex h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {document ? children : (
        <>
          <header className="flex h-14 shrink-0 items-center px-2 md:hidden">{menuControl}</header>
          <ScrollArea className="min-h-0 flex-1" label="Photography">
            <div className="p-8 max-md:pt-6 md:p-16">{children}</div>
          </ScrollArea>
        </>
      )}
    </main>
  )
}
