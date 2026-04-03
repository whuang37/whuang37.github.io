import { publications } from "@/content/publications"
import { cn } from "@/lib/utils"
import { ListPaneLayout } from "./list-pane-layout"

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
    <ListPaneLayout
      width={width}
      selectedItem={Boolean(selectedPublication)}
      isDragging={isDragging}
      onMouseDown={onMouseDown}
      header={<h1 className="text-4xl font-serif">Publications</h1>}
    >
      <div className="space-y-8 pb-2 pr-2">
        {groupedPublications.map(([year, entries]) => (
          <div key={year} className="min-w-0">
            <h2 className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">{year}</h2>
            <ol className="space-y-8">
              {entries.map((publication) => {
                const links = Object.entries(publication.links).filter(([, url]) => Boolean(url))
                const isSelected = selectedPublication === publication.slug

                return (
                  <li key={publication.slug} className="relative min-w-0 text-foreground">
                    <button
                      onClick={() => onSelectPublication(publication.slug)}
                      className="group relative w-full min-w-0 cursor-pointer space-y-1 py-1 text-left transition-colors"
                    >
                      <span
                        className={cn(
                          "pointer-events-none absolute -left-4 top-1 text-sm leading-6 text-[oklch(0.42_0.18_25)] transition-opacity",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      >
                        &gt;
                      </span>
                      <div className="flex min-w-0 items-start gap-2">
                        <div
                          className={cn(
                            "min-w-0 break-words text-base font-medium text-foreground opacity-100 transition-opacity [overflow-wrap:anywhere] group-hover:opacity-45",
                            isSelected && "group-hover:opacity-65",
                          )}
                        >
                          {publication.title}
                        </div>
                        <span className="shrink-0 text-sm text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          ↗
                        </span>
                      </div>
                      <p className="break-words text-xs text-muted-foreground transition-opacity [overflow-wrap:anywhere] group-hover:opacity-70">
                        {publication.authors}
                      </p>
                      <p className="break-words text-xs italic text-muted-foreground transition-opacity [overflow-wrap:anywhere] group-hover:opacity-70">
                        {publication.proceeding || "Proceeding not specified"}
                      </p>
                    </button>
                    {links.length > 0 && (
                      <div className="flex min-w-0 flex-wrap items-center gap-3 pt-1 font-mono text-xs uppercase tracking-widest">
                        {links.map(([name, url]) => (
                          <a
                            key={`${publication.slug}-${name}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-words text-muted-foreground transition-colors [overflow-wrap:anywhere] hover:text-foreground"
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
    </ListPaneLayout>
  )
}
