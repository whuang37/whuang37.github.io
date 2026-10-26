import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DrawerToggleProps {
  open: boolean
  onToggle: () => void
}

export function DrawerToggle({ open, onToggle }: DrawerToggleProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-0 shrink-0 md:relative md:inset-auto md:z-20 md:self-stretch",
        open && "max-md:left-[calc(100%-2rem)]",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="absolute left-0 top-1/2 flex h-12 w-6 -translate-y-1/2 items-center justify-center rounded-r-lg border border-l-0 border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label={open ? "Close list drawer" : "Open list drawer"}
        aria-expanded={open}
        aria-controls="list-drawer"
      >
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </div>
  )
}
