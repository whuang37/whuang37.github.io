import * as Dialog from "@radix-ui/react-dialog"
import type { CSSProperties, ReactNode } from "react"

interface ListDrawerProps {
  sidebarWidth: number
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
  menuControl: ReactNode
  onHoverEnter: () => void
  onHoverLeave: () => void
  onHoverOutside: () => void
}

export function ListDrawer({ sidebarWidth, title, open, onClose, children, menuControl, onHoverEnter, onHoverLeave, onHoverOutside }: ListDrawerProps) {
  const style = { "--sidebar-width": `${sidebarWidth}px` } as CSSProperties

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }} modal={false}>
      <Dialog.Portal>
        <button
          type="button"
          onClick={onClose}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") onHoverOutside()
          }}
          style={style}
          className="fixed inset-0 z-30 bg-black/20 md:left-[var(--sidebar-width)]"
          aria-label={`Close ${title.toLowerCase()} drawer`}
          tabIndex={-1}
        />
        <Dialog.Content
          id="list-drawer"
          style={style}
          aria-describedby={undefined}
          onInteractOutside={(event) => event.preventDefault()}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") onHoverEnter()
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") onHoverLeave()
          }}
          className="list-drawer fixed inset-y-0 left-0 z-40 flex w-full flex-col border-r border-border bg-background shadow-xl outline-none md:left-[var(--sidebar-width)] md:w-[600px] md:max-w-[calc(100vw-var(--sidebar-width))]"
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <header className="flex h-14 shrink-0 items-center px-2 md:hidden">{menuControl}</header>
          <div className="min-h-0 flex-1">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
