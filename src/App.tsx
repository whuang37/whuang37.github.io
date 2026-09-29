import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useResizable } from "@/hooks/use-resizable"
import { Sidebar } from "@/components/sidebar"
import { AboutSection } from "@/components/about-section"
import { PhotographyList } from "@/components/photography-list"
import { PublicationsList } from "@/components/publications-list"
import { PhotographyReader } from "@/components/photography-reader"
import { PublicationReader } from "@/components/publication-reader"
import { ContentPanel } from "@/components/content-panel"
import { photography } from "@/content/photography"
import { publications } from "@/content/publications"

type Tab = "about" | "publications" | "photography"
const SIDEBAR_WIDTH = 172

function getRoute(): { tab: Tab; slug: string | null } | null {
  const parts = window.location.pathname.split("/").filter(Boolean)

  if (parts.length === 0) return { tab: "about", slug: null }
  if (parts.length > 2 || (parts[0] !== "publications" && parts[0] !== "photography")) return null

  const tab = parts[0]
  const slug = parts[1] ?? null
  if (slug && !(tab === "publications" ? publications : photography).some((item) => item.slug === slug)) {
    return null
  }

  return { tab, slug }
}

export default function PersonalWebsite() {
  const route = getRoute()
  const activeTab = route?.tab ?? "about"
  const selectedPhoto = route?.tab === "photography" ? route.slug : null
  const selectedPublication = route?.tab === "publications" ? route.slug : null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const photographyList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
    offsetX: SIDEBAR_WIDTH,
  })
  const publicationList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
    offsetX: SIDEBAR_WIDTH,
  })

  return (
    <div className="flex min-h-screen overflow-x-clip md:h-screen md:overflow-hidden">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-6 left-6 z-50 md:hidden bg-background border border-border rounded-lg p-2.5 hover:bg-muted shadow-sm"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <Sidebar
        activeTab={activeTab}
        width={SIDEBAR_WIDTH}
        mobileMenuOpen={mobileMenuOpen}
      />

      {!route ? (
        <main className="min-w-0 flex-1 p-8 pt-28 md:p-16">
          <h1 className="text-4xl font-serif">Page not found</h1>
          <a href="/" className="mt-6 inline-block underline">Return home</a>
        </main>
      ) : activeTab === "photography" ? (
        <>
          <PhotographyList
            selectedPhoto={selectedPhoto}
            width={photographyList.width}
            isDragging={photographyList.isDragging}
            onMouseDown={photographyList.handleMouseDown}
          />
          {selectedPhoto && (
            <ContentPanel closeHref="/photography/">
              <PhotographyReader slug={selectedPhoto} />
            </ContentPanel>
          )}
        </>
      ) : activeTab === "publications" ? (
        <>
          <PublicationsList
            selectedPublication={selectedPublication}
            width={publicationList.width}
            isDragging={publicationList.isDragging}
            onMouseDown={publicationList.handleMouseDown}
          />
          {selectedPublication && (
            <ContentPanel closeHref="/publications/">
              <PublicationReader slug={selectedPublication} />
            </ContentPanel>
          )}
        </>
      ) : (
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden publication-scroll">
          <div className="flex min-h-full w-full max-w-3xl flex-col px-6 pt-28 pb-0 md:px-16 md:pt-16">
            <AboutSection />
          </div>
        </main>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  )
}
