import type { ReactNode } from "react"

import { ScrollArea } from "./scroll-area"

interface ListPaneLayoutProps {
  children: ReactNode
  header: ReactNode
}

export function ListPaneLayout({
  children,
  header,
}: ListPaneLayoutProps) {
  return (
    <section className="flex h-full min-h-0 w-full flex-col bg-background">
      <div className="shrink-0 px-6 pt-14 pb-8 md:px-16 md:pt-16">
        {header}
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="min-w-0 max-w-3xl px-6 pb-8 md:px-16">
          {children}
        </div>
      </ScrollArea>
    </section>
  )
}
