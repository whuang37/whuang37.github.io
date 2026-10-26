import { lazy, Suspense } from "react"
import type { ReactNode } from "react"

interface PdfReaderProps {
  src: string
  title: string
  filename: string
  section: string
  menuControl: ReactNode
}

const PdfDocument = lazy(() => import("./pdf-document"))

export function PdfReader(props: PdfReaderProps) {
  return (
    <Suspense fallback={<div className="flex h-full flex-col"><div className="flex h-14 shrink-0 items-center px-2 md:hidden">{props.menuControl}</div><div className="flex flex-1 items-center justify-center"><p role="status" className="text-xs text-muted-foreground">Loading PDF…</p></div></div>}>
      <PdfDocument key={props.src} {...props} />
    </Suspense>
  )
}
