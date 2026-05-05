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

type Tab = "about" | "publications" | "photography"
const SIDEBAR_WIDTH = 172

export default function PersonalWebsite() {
  const [activeTab, setActiveTab] = useState<Tab>("about")
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [selectedPublication, setSelectedPublication] = useState<string | null>(null)
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

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
    setSelectedPhoto(null)
    setSelectedPublication(null)
  }

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
        onTabChange={handleTabChange}
        width={SIDEBAR_WIDTH}
        mobileMenuOpen={mobileMenuOpen}
      />

      {activeTab === "photography" ? (
        <>
          <PhotographyList
            selectedPhoto={selectedPhoto}
            onSelectPhoto={setSelectedPhoto}
            width={photographyList.width}
            isDragging={photographyList.isDragging}
            onMouseDown={photographyList.handleMouseDown}
          />
          {selectedPhoto && (
            <ContentPanel onClose={() => setSelectedPhoto(null)}>
              <PhotographyReader slug={selectedPhoto} />
            </ContentPanel>
          )}
        </>
      ) : activeTab === "publications" ? (
        <>
          <PublicationsList
            selectedPublication={selectedPublication}
            onSelectPublication={setSelectedPublication}
            width={publicationList.width}
            isDragging={publicationList.isDragging}
            onMouseDown={publicationList.handleMouseDown}
          />
          {selectedPublication && (
            <ContentPanel onClose={() => setSelectedPublication(null)}>
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
