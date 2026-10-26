import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Footer } from "./footer"

interface ListPaneLayoutProps {
  children: ReactNode
  header: ReactNode
  open: boolean
  selectedItem: boolean
}

export function ListPaneLayout({
  children,
  header,
  open,
  selectedItem,
}: ListPaneLayoutProps) {
  return (
    <div
      id="list-drawer"
      hidden={selectedItem && !open}
      className={cn(
        "relative h-full w-full shrink-0 overflow-y-auto overflow-x-hidden border-r border-border bg-background publication-scroll md:w-[600px] md:max-w-[calc(100vw-172px)]",
        selectedItem && "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-30 max-md:w-[calc(100%-2rem)] md:max-w-[40vw]",
      )}
    >
      <div className="flex min-h-full min-w-0 max-w-3xl flex-col justify-between px-6 pb-0 md:px-16">
        <div className="min-w-0">
          <div className="sticky top-0 z-10 bg-background pt-28 pb-8 md:pt-16">
            {header}
          </div>
          {children}
        </div>

        <Footer />
      </div>
    </div>
  )
}
