import { cn } from "@/lib/utils"
import { PanelLeftClose } from "lucide-react"

type Tab = "about" | "cv" | "publications" | "photography"

interface SidebarProps {
  activeTab: Tab
  width: number
  mobileMenuOpen: boolean
  onClose: () => void
  drawerTab: "publications" | "photography" | null
  onToggleDrawer: (tab: "publications" | "photography") => void
  onOpenDrawer: (tab: "publications" | "photography") => void
  onCloseDrawer: () => void
  onEnterDrawerButtons: () => void
  onLeaveDrawerButtons: () => void
  onCancelDrawerOpen: () => void
}

export function Sidebar({ activeTab, width, mobileMenuOpen, onClose, drawerTab, onToggleDrawer, onOpenDrawer, onCloseDrawer, onEnterDrawerButtons, onLeaveDrawerButtons, onCancelDrawerOpen }: SidebarProps) {
  const pageTabs = ["about", "cv"] as const
  const drawerTabs = ["publications", "photography"] as const

  function tabClassName(tab: Tab) {
    return cn(
      "text-left py-1 transition-colors uppercase tracking-widest text-xs",
      (drawerTab ?? activeTab) === tab ? "text-foreground" : "text-foreground/40 hover:text-foreground/70",
    )
  }

  return (
    <aside
      id="site-sidebar"
      style={{ width: `${width}px`, borderRight: '3px double var(--border)' }}
      className={cn(
        "relative z-50 shrink-0 bg-background md:sticky md:top-0 md:h-screen",
        "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:touch-pan-y max-md:shadow-lg",
        "max-md:transition-transform max-md:duration-150",
        mobileMenuOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
      )}
    >
      {mobileMenuOpen && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-1.5 flex h-11 w-11 items-center justify-center rounded text-muted-foreground hover:bg-foreground/10 hover:text-foreground md:hidden"
          aria-label="Close menu"
          aria-expanded={true}
          aria-controls="site-sidebar"
        >
          <PanelLeftClose className="h-6 w-6" />
        </button>
      )}
      {/* Ribbon Bookmark */}
      <div className="absolute top-0 left-8 w-8 h-40 z-10 group">
        <div
          className="w-full h-full relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, oklch(0.42 0.18 25), oklch(0.52 0.18 25) 50%, oklch(0.42 0.18 25))',
            border: '1px solid oklch(0.42 0.18 25)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 12px), 0 100%)',
            boxShadow: '2px 2px 6px rgba(0,0,0,0.3), inset -1px -1px 2px rgba(0,0,0,0.2)',
          }}
        >
        </div>
      </div>
      <nav className="flex flex-col gap-2 px-6 py-8 pt-54">
        {pageTabs.map((tab) => (
          <a
            key={tab}
            href={tab === "about" ? "/" : "/cv/"}
            aria-current={activeTab === tab ? "page" : undefined}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") onCloseDrawer()
            }}
            className={tabClassName(tab)}
          >
            {tab === "about" ? "About" : "Curriculum Vitae"}
          </a>
        ))}
        <div
          className="flex flex-col gap-2"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") onEnterDrawerButtons()
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") onLeaveDrawerButtons()
          }}
        >
          {drawerTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onToggleDrawer(tab)}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") onOpenDrawer(tab)
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") onCancelDrawerOpen()
              }}
              aria-expanded={drawerTab === tab}
              aria-controls="list-drawer"
              className={tabClassName(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

    </aside>
  )
}
