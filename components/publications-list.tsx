import { publications } from "@/content/publications"
import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"
import { Footer } from "./footer"

interface PublicationsListProps {
  selectedPublication: string | null
  onSelectPublication: (slug: string) => void
  width: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

const linkLabels: Record<string, string> = {
  doi: "DOI",
  arxiv: "arXiv",
  code: "Code",
}

function groupPublicationsByYear() {
  const grouped = new Map<string, typeof publications>()

  for (const publication of publications) {
    const key = publication.year ? String(publication.year) : "Unknown"
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(publication)
  }

  return Array.from(grouped.entries()).sort((a, b) => {
    if (a[0] === "Unknown" && b[0] === "Unknown") return 0
    if (a[0] === "Unknown") return 1
    if (b[0] === "Unknown") return -1
    return Number(b[0]) - Number(a[0])
  })
}

export function PublicationsList({
  selectedPublication,
  onSelectPublication,
  width,
  isDragging,
  onMouseDown,
}: PublicationsListProps) {
  const groupedPublications = groupPublicationsByYear()

  return (
    <div
      style={{ width: `${width}px` }}
      className={cn(
        "relative shrink-0 border-r border-border h-full overflow-y-auto publication-scroll",
        selectedPublication && "max-md:hidden",
      )}
    >
      <div className="px-8 md:px-16 pb-0 max-w-3xl flex flex-col justify-between min-h-full">
        <div>
          <div className="sticky top-0 z-10 bg-background pt-28 md:pt-16 pb-8">
            <h1 className="text-4xl font-serif">Publications</h1>
          </div>

          <div className="space-y-8 pr-2 pb-2">
            {groupedPublications.map(([year, entries]) => (
              <div key={year}>
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{year}</h2>
                <ol className="space-y-8">
                  {entries.map((publication) => {
                    const links = Object.entries(publication.links).filter(([, url]) => Boolean(url))
                    const isSelected = selectedPublication === publication.slug

                    return (
                      <li key={publication.slug} className="text-foreground relative">
                        <button
                          onClick={() => onSelectPublication(publication.slug)}
                          className="w-full text-left space-y-1 py-1 transition-colors group cursor-pointer relative"
                        >
                          <span
                            className={cn(
                              "absolute -left-4 top-1 text-sm leading-6 text-[oklch(0.42_0.18_25)] transition-opacity pointer-events-none",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          >
                            &gt;
                          </span>
                          <div className="flex items-start gap-2">
                            <div
                              className={cn(
                                "text-base font-medium text-foreground transition-opacity opacity-100 group-hover:opacity-45",
                                isSelected && "group-hover:opacity-65",
                              )}
                            >
                              {publication.title}
                            </div>
                            <span className="text-muted-foreground text-sm transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                              ↗
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground transition-opacity group-hover:opacity-70">
                            {publication.authors}
                          </p>
                          <p className="text-xs italic text-muted-foreground transition-opacity group-hover:opacity-70">
                            {publication.proceeding || "Proceeding not specified"}
                          </p>
                        </button>
                        {links.length > 0 && (
                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest pt-1">
                            {links.map(([name, url]) => (
                              <a
                                key={`${publication.slug}-${name}`}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {linkLabels[name] ?? name}
                              </a>
                            ))}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>

      {selectedPublication && <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />}
    </div>
  )
}
