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

export default function PersonalWebsite() {
  const [activeTab, setActiveTab] = useState<Tab>("about")
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [selectedPublication, setSelectedPublication] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sidebar = useResizable({ initialWidth: 192, minWidth: 150, maxWidth: 400 })
  const photographyList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
    offsetX: sidebar.width,
  })
  const publicationList = useResizable({
    initialWidth: 600,
    minWidth: 200,
    maxWidth: 600,
    offsetX: sidebar.width,
  })

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
    setSelectedPhoto(null)
    setSelectedPublication(null)
  }

  return (
    <div className="flex h-screen overflow-hidden">
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
        width={sidebar.width}
        isDragging={sidebar.isDragging}
        onMouseDown={sidebar.handleMouseDown}
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
        <main className="flex-1 h-full overflow-y-auto publication-scroll">
          <div className="px-8 md:px-16 max-w-3xl pt-28 md:pt-16 flex h-full flex-col min-h-full pb-0">
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
