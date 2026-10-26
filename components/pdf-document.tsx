import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { CSSProperties, ReactNode, RefObject } from "react"
import { ArrowDown, ArrowUp, Download, ExternalLink, Minus, Plus } from "lucide-react"
import { getDocument, GlobalWorkerOptions, TextLayer } from "pdfjs-dist"
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist"
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"
import { ScrollArea } from "./scroll-area"

GlobalWorkerOptions.workerSrc = workerUrl

const decoderFiles = import.meta.glob("/node_modules/pdfjs-dist/wasm/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>
const decoderUrl = Object.entries(decoderFiles).find(([path]) => path.endsWith("/jbig2.wasm"))![1]
const wasmUrl = new URL(".", new URL(decoderUrl, window.location.href)).href

interface PdfDocumentProps {
  src: string
  title: string
  filename: string
  section: string
  menuControl: ReactNode
}

interface PdfPageProps {
  pdf: PDFDocumentProxy
  number: number
  width: number
  aspectRatio: number
  scrollRoot: RefObject<HTMLDivElement | null>
}

function PdfPage({ pdf, number, width, aspectRatio, scrollRoot }: PdfPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const displayedCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const textHostRef = useRef<HTMLDivElement>(null)
  const [textWidth, setTextWidth] = useState(0)
  const [nearViewport, setNearViewport] = useState(false)
  const [ratio, setRatio] = useState(aspectRatio)
  const [hasRendered, setHasRendered] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new IntersectionObserver(([entry]) => setNearViewport(entry.isIntersecting), {
      root: scrollRoot.current,
      rootMargin: "600px 0px",
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [scrollRoot])

  useEffect(() => {
    if (!nearViewport) {
      const canvas = displayedCanvasRef.current
      if (canvas) {
        canvas.width = 0
        canvas.height = 0
        displayedCanvasRef.current = null
      }
      setHasRendered(false)
      return
    }
    const host = canvasHostRef.current
    if (!host || !width) return
    const canvas = document.createElement("canvas")
    canvas.className = "block h-full w-full"
    canvas.setAttribute("role", "img")
    canvas.setAttribute("aria-label", `PDF page ${number}`)
    let disposed = false
    let task: RenderTask | undefined
    setError(false)

    async function render(canvas: HTMLCanvasElement, host: HTMLDivElement) {
      const page = await pdf.getPage(number)
      if (disposed) return
      const baseViewport = page.getViewport({ scale: 1 })
      setRatio(baseViewport.width / baseViewport.height)
      const viewport = page.getViewport({ scale: width / baseViewport.width })
      const outputScale = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4_000_000 / (viewport.width * viewport.height)))
      canvas.width = Math.floor(viewport.width * outputScale)
      canvas.height = Math.floor(viewport.height * outputScale)
      task = page.render({
        canvas,
        viewport,
        transform: [outputScale, 0, 0, outputScale, 0, 0],
      })
      await task.promise
      if (disposed) return
      const previousCanvas = displayedCanvasRef.current
      host.replaceChildren(canvas)
      displayedCanvasRef.current = canvas
      if (previousCanvas) {
        previousCanvas.width = 0
        previousCanvas.height = 0
      }
      setHasRendered(true)
    }

    render(canvas, host).catch(() => {
      if (!disposed) {
        setError(true)
      }
    })
    return () => {
      disposed = true
      task?.cancel()
      if (displayedCanvasRef.current !== canvas) {
        canvas.width = 0
        canvas.height = 0
      }
    }
  }, [pdf, number, width, nearViewport])

  useEffect(() => () => {
    const canvas = displayedCanvasRef.current
    if (canvas) {
      canvas.width = 0
      canvas.height = 0
    }
  }, [])

  useEffect(() => {
    const host = textHostRef.current
    if (!nearViewport || !host) return
    let disposed = false
    let layer: TextLayer | undefined

    async function renderText(host: HTMLDivElement) {
      const page = await pdf.getPage(number)
      if (disposed) return
      const viewport = page.getViewport({ scale: 1 })
      const container = document.createElement("div")
      container.className = "pdf-text-layer"
      container.style.setProperty("--total-scale-factor", String(page.userUnit))
      layer = new TextLayer({ container, viewport, textContentSource: page.streamTextContent() })
      await layer.render()
      if (disposed) return
      setTextWidth(viewport.width)
      host.replaceChildren(container)
    }

    renderText(host).catch(() => {
      if (!disposed) host.replaceChildren()
    })
    return () => {
      disposed = true
      layer?.cancel()
    }
  }, [pdf, number, nearViewport])

  return (
    <div ref={containerRef} data-pdf-page={number} role="group" aria-label={`Page ${number}`} style={{ aspectRatio: ratio }} className="relative w-full bg-white shadow-sm">
      {nearViewport && (
        <>
          {!hasRendered && (
            <p role={error ? "alert" : "status"} className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-neutral-500">
              {error ? `Unable to display page ${number}. Download the PDF to view the original file.` : `Loading page ${number}…`}
            </p>
          )}
          <div ref={canvasHostRef} className="h-full w-full select-none" />
          <div ref={textHostRef} className="pdf-text-host absolute inset-0 overflow-hidden" style={{ "--pdf-text-scale": textWidth ? width / textWidth : 1 } as CSSProperties} />
        </>
      )}
    </div>
  )
}

export default function PdfDocument({ src, title, filename, section, menuControl }: PdfDocumentProps) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [pageSize, setPageSize] = useState({ width: 612, height: 792 })
  const [zoom, setZoom] = useState<number | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0, top: 0 })
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageInput, setPageInput] = useState("1")
  const viewportRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef(1)
  const zoomAnchorRef = useRef<{ page: number; x: number; y: number; clientX: number; clientY: number } | null>(null)
  const fitScale = Math.min(size.width / pageSize.width, size.height / pageSize.height)
  const scale = zoom ?? fitScale
  const pageWidth = Math.max(1, Math.floor(zoom === null ? Math.min(pageSize.width * scale, size.width) : pageSize.width * scale))

  function zoomTo(next: number, point?: { x: number; y: number }) {
    const viewport = viewportRef.current
    const pages = pagesRef.current
    if (!pdf || !viewport || !pages) return
    const nextScale = Math.min(2.5, Math.max(0.25, next))
    if (nextScale === scaleRef.current) return
    const bounds = viewport.getBoundingClientRect()
    const top = toolbarRef.current?.getBoundingClientRect().bottom ?? bounds.top
    const clientX = point?.x ?? bounds.left + bounds.width / 2
    const clientY = point?.y ?? (top + bounds.bottom) / 2
    let closest: HTMLElement | null = null
    let distance = Infinity
    for (const child of Array.from(pages.children)) {
      const page = child as HTMLElement
      const rect = page.getBoundingClientRect()
      const nextDistance = Math.max(rect.top - clientY, clientY - rect.bottom, 0)
      if (nextDistance < distance) {
        closest = page
        distance = nextDistance
      }
    }
    if (closest) {
      const rect = closest.getBoundingClientRect()
      zoomAnchorRef.current = {
        page: Number(closest.dataset.pdfPage),
        x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
        clientX,
        clientY,
      }
    }
    scaleRef.current = nextScale
    setZoom(nextScale)
  }

  useLayoutEffect(() => {
    scaleRef.current = scale
    const anchor = zoomAnchorRef.current
    const viewport = viewportRef.current
    if (!anchor || !viewport) return
    zoomAnchorRef.current = null
    const page = pagesRef.current?.querySelector<HTMLElement>(`[data-pdf-page="${anchor.page}"]`)
    if (!page) return
    const rect = page.getBoundingClientRect()
    viewport.scrollLeft += rect.left + rect.width * anchor.x - anchor.clientX
    viewport.scrollTop += rect.top + rect.height * anchor.y - anchor.clientY
  }, [scale, pageWidth, size.top])

  useEffect(() => {
    setPageInput(String(currentPage))
  }, [currentPage])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || !pdf) return
    let frame = 0
    const update = () => {
      frame = 0
      const top = viewport.getBoundingClientRect().top + 1
      for (const child of Array.from(pagesRef.current?.children ?? [])) {
        const page = child as HTMLElement
        if (page.getBoundingClientRect().bottom > top) {
          setCurrentPage(Number(page.dataset.pdfPage))
          break
        }
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    viewport.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener("scroll", onScroll)
    }
  }, [pdf, pageWidth, size.top])

  function goToPage(value: number) {
    const viewport = viewportRef.current
    if (!pdf || !viewport) return
    const number = Math.min(pdf.numPages, Math.max(1, Math.trunc(value) || currentPage))
    const page = pagesRef.current?.querySelector<HTMLElement>(`[data-pdf-page="${number}"]`)
    if (!page) return
    viewport.scrollTop += page.getBoundingClientRect().top - viewport.getBoundingClientRect().top
    setCurrentPage(number)
    setPageInput(String(number))
  }

  useEffect(() => {
    let disposed = false
    const task = getDocument({ url: src, wasmUrl })
    task.promise.then(async (document) => {
      const page = await document.getPage(1)
      if (disposed) return
      const viewport = page.getViewport({ scale: 1 })
      setPageSize({ width: viewport.width, height: viewport.height })
      setPdf(document)
    }).catch(() => {
      if (!disposed) setError(true)
    })
    return () => {
      disposed = true
      void task.destroy()
    }
  }, [src])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const observer = new ResizeObserver(() => {
      const pages = pagesRef.current
      if (!pages) return
      const style = getComputedStyle(pages)
      const top = toolbarRef.current?.offsetHeight ?? 0
      const nextSize = {
        width: Math.max(1, Math.floor(Math.min(viewport.clientWidth, viewport.getBoundingClientRect().width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight))),
        height: Math.max(1, viewport.clientHeight - parseFloat(style.paddingBottom)),
        top,
      }
      setSize((current) => current.width === nextSize.width && current.height === nextSize.height && current.top === nextSize.top ? current : nextSize)
    })
    observer.observe(viewport)
    if (pagesRef.current) observer.observe(pagesRef.current)
    if (toolbarRef.current) observer.observe(toolbarRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return
      event.preventDefault()
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1)
      zoomTo(Math.round(scaleRef.current * Math.exp(-delta * 0.002) * 100) / 100, { x: event.clientX, y: event.clientY })
    }
    viewport.addEventListener("wheel", onWheel, { passive: false })
    return () => viewport.removeEventListener("wheel", onWheel)
  }, [fitScale, pdf])

  const buttonClass = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 disabled:opacity-30 md:h-6 md:w-6"

  return (
    <article aria-label={title} className="relative flex h-full min-h-0 flex-col">
      <div ref={toolbarRef} role="toolbar" aria-label="PDF controls" className="relative z-20 grid shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] grid-rows-[56px] items-center gap-x-3 bg-background px-2 text-[11px] md:min-h-11 md:grid-rows-1 md:border-b md:border-border/50 md:px-4 md:py-2 md:text-xs">
        <div className="col-start-1 row-start-1 md:hidden">{menuControl}</div>
        <span className="col-start-2 row-start-1 text-center text-sm font-medium text-foreground md:hidden">{section}</span>
        <div className="hidden items-center gap-0.5 whitespace-nowrap md:col-start-1 md:row-start-1 md:flex md:justify-self-start">
          <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={!pdf || currentPage <= 1} className={buttonClass} aria-label="Previous page" title="Previous page">
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={!pdf || currentPage >= pdf.numPages} className={buttonClass} aria-label="Next page" title="Next page">
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <input
            aria-label="Page number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pageInput}
            disabled={!pdf}
            onChange={(event) => setPageInput(event.target.value.replace(/[^0-9]/g, ""))}
            onBlur={() => goToPage(Number(pageInput))}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                goToPage(Number(pageInput))
              }
            }}
            className="h-6 w-7 rounded bg-white text-center text-neutral-900 outline-none ring-1 ring-border focus:ring-foreground/40"
          />
          <span className="ml-0.5 text-muted-foreground">of {pdf?.numPages ?? "—"} pages</span>
        </div>
        <div className="col-start-2 row-start-1 hidden items-center justify-self-center gap-0.5 md:flex">
          <button type="button" onClick={() => zoomTo(scale - 0.25)} disabled={!pdf || scale <= 0.25} className={buttonClass} aria-label="Zoom out" title="Zoom out">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-9 text-center text-muted-foreground">{pdf && size.width ? `${Math.round(scale * 100)}%` : "—"}</span>
          <button type="button" onClick={() => zoomTo(scale + 0.25)} disabled={!pdf || scale >= 2.5} className={buttonClass} aria-label="Zoom in" title="Zoom in">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="col-start-3 row-start-1 flex items-center justify-self-end gap-0.5">
          <a href={src} target="_blank" rel="noopener noreferrer" className={buttonClass} aria-label="Open PDF in new window" title="Open in new window">
            <ExternalLink className="h-6 w-6 md:h-3.5 md:w-3.5" />
          </a>
          <a href={src} download={filename} className={buttonClass} aria-label="Download PDF" title="Download">
            <Download className="h-6 w-6 md:h-3.5 md:w-3.5" />
          </a>
        </div>
      </div>
      {(!pdf || error) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center px-8 text-center text-xs text-muted-foreground" style={{ top: size.top }}>
          <p role={error ? "alert" : "status"}>{error ? "Unable to display this PDF. Download the PDF to view the original file." : "Loading PDF…"}</p>
        </div>
      )}
      <ScrollArea className="min-h-0 flex-1" viewportRef={viewportRef} viewportClassName="[overflow-anchor:none]" label={`${title} pages`} horizontal={zoom !== null}>
        <div ref={pagesRef} className="mx-auto box-content flex flex-col gap-4 px-8 pb-8 [--pdf-page-gutter:4rem] md:px-16 md:pb-16 md:[--pdf-page-gutter:8rem]" style={{ width: pageWidth, maxWidth: zoom === null ? "calc(100% - var(--pdf-page-gutter))" : undefined }}>
          {pdf && size.width > 0 && Array.from({ length: pdf.numPages }, (_, index) => (
            <PdfPage key={index + 1} pdf={pdf} number={index + 1} width={pageWidth} aspectRatio={pageSize.width / pageSize.height} scrollRoot={viewportRef} />
          ))}
        </div>
      </ScrollArea>
    </article>
  )
}
