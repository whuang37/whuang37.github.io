import { notes } from "@/content/notes"
import { cn } from "@/lib/utils"
import { ResizeHandle } from "./resize-handle"
import { Footer } from "./footer"

interface NotesListProps {
  selectedNote: string | null
  onSelectNote: (slug: string) => void
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
function sortNotesByDate() {
  return [...notes].sort((a, b) => parseNoteDate(b.date) - parseNoteDate(a.date))
}

export function NotesList({ selectedNote, onSelectNote, width, isDragging, onMouseDown }: NotesListProps) {
  const sortedNotes = sortNotesByDate()
  return (
    <div
      style={{ width: `${width}px` }}
      className={cn(
        "relative shrink-0 border-r border-border h-full overflow-y-auto publication-scroll",
        selectedNote && "max-md:hidden",
      )}
    >
      <div className="px-8 md:px-16 pb-0 max-w-3xl flex flex-col justify-between min-h-full">
        <div>
          <div className="sticky top-0 z-10 bg-background pt-28 md:pt-16 pb-8">
            <h1 className="text-4xl font-serif">Notes</h1>
            <p className="text-muted-foreground mt-2">Field observations & works-in-progress.</p>
          </div>

          <ol className="space-y-8 pr-2 pb-2">
            {sortedNotes.map((note) => (
              <li key={note.slug} className="relative text-foreground">
                <button
                  onClick={() => onSelectNote(note.slug)}
                  className="w-full text-left space-y-1 py-1 transition-colors group cursor-pointer relative"
                >
                  <span
                    className={cn(
                      "absolute -left-4 top-1 text-sm leading-6 text-[oklch(0.42_0.18_25)] transition-opacity pointer-events-none",
                      selectedNote === note.slug ? "opacity-100" : "opacity-0",
                    )}
                  >
                    &gt;
                  </span>
                  <div className="flex items-start gap-2">
                    <h2
                      className={cn(
                        "text-base font-medium text-foreground transition-opacity opacity-100 group-hover:opacity-45",
                        selectedNote === note.slug && "group-hover:opacity-65",
                      )}
                    >
                      {note.title}
                    </h2>
                    <span className="text-muted-foreground text-sm transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest transition-opacity group-hover:opacity-70">{note.date}</p>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <Footer />
      </div>

      {selectedNote && <ResizeHandle onMouseDown={onMouseDown} isDragging={isDragging} />}
    </div>
  )
}
