import { photography } from "@/content/photography"
import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"
import { Footer } from "./footer"

interface PhotographyListProps {
  selectedPhoto: string | null
  onSelectPhoto: (slug: string) => void
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

// Helper function to parse date string (MM-DD-YYYY) and return comparable timestamp
function parseNoteDate(dateString: string): number {
  const [month, day, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day).getTime()
}

// Sort notes in reverse chronological order (newest first)
function sortPhotosByDate() {
  return [...photography].sort((a, b) => parseNoteDate(b.date) - parseNoteDate(a.date))
}

export function PhotographyList({ selectedPhoto, onSelectPhoto, width, isDragging, onMouseDown }: PhotographyListProps) {
  const sortedPhotos = sortPhotosByDate()
  return (
    <div
      style={{ width: `min(100vw, ${width}px)` }}
      className={cn(
        "relative h-full shrink-0 overflow-y-auto overflow-x-hidden border-r border-border publication-scroll",
        selectedPhoto && "max-md:hidden",
      )}
    >
      <div className="flex min-h-full min-w-0 max-w-3xl flex-col justify-between px-6 pb-0 md:px-16">
        <div className="min-w-0">
          <div className="sticky top-0 z-10 bg-background pt-28 md:pt-16 pb-8">
            <h1 className="text-4xl font-serif">Photography</h1>
            <p className="text-muted-foreground mt-2">Snapshots of my PhD.</p>
          </div>

          <ol className="space-y-8 pb-2 pr-2">
            {sortedPhotos.map((photo) => (
              <li key={photo.slug} className="relative min-w-0 text-foreground">
                <button
                  onClick={() => onSelectPhoto(photo.slug)}
                  className="group relative w-full min-w-0 cursor-pointer space-y-1 py-1 text-left transition-colors"
                >
                  <span
                    className={cn(
                      "absolute -left-4 top-1 text-sm leading-6 text-[oklch(0.42_0.18_25)] transition-opacity pointer-events-none",
                      selectedPhoto === photo.slug ? "opacity-100" : "opacity-0",
                    )}
                  >
                    &gt;
                  </span>
                  <div className="flex min-w-0 items-start gap-2">
                    <h2
                      className={cn(
                        "min-w-0 break-words text-base font-medium text-foreground opacity-100 transition-opacity [overflow-wrap:anywhere] group-hover:opacity-45",
                        selectedPhoto === photo.slug && "group-hover:opacity-65",
                      )}
                    >
                      {photo.title}
                    </h2>
                    <span className="shrink-0 text-sm text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </div>
                  <p className="break-words font-mono text-xs uppercase tracking-widest text-muted-foreground transition-opacity [overflow-wrap:anywhere] group-hover:opacity-70">{photo.date}</p>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <Footer />
      </div>

      {selectedPhoto && <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />}
    </div>
  )
}
