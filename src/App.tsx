import { useEffect, useState } from "react"
import type { MouseEvent } from "react"
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

function getRoute(pathname: string): { tab: Tab; slug: string | null } | null {
  const parts = pathname.split("/").filter(Boolean)

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
  const [pathname, setPathname] = useState(window.location.pathname)
  const route = getRoute(pathname)
  const activeTab = route?.tab ?? "about"
  const selectedPhoto = route?.tab === "photography" ? route.slug : null
  const selectedPublication = route?.tab === "publications" ? route.slug : null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    const item = route?.slug && (route.tab === "publications" ? publications : photography).find((entry) => entry.slug === route.slug)
    const title = item ? `${item.title} | William Huang` : route?.tab === "publications" ? "Publications | William Huang" : route?.tab === "photography" ? "Photography | William Huang" : "William Huang | HCI, Accessibility, and AI Researcher at UCLA"
    const description = route?.tab === "publications"
      ? item && "authors" in item
        ? `${item.title} by ${item.authors}. ${item.proceeding}, ${item.year}.`
        : "Publications by William Huang, a UCLA researcher in HCI, AI, sensing, and accessibility."
      : route?.tab === "photography"
        ? item ? `Photography by William Huang: ${item.title}.` : "Photography by William Huang."
        : "William Huang is a UCLA PhD candidate researching human-computer interaction, AI, sensing, accessibility, and personalization."
    const canonicalUrl = new URL(pathname, window.location.origin).href
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute("content", description)
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl)
    document.querySelector('meta[property="og:type"]')?.setAttribute("content", route?.tab === "about" ? "profile" : "website")
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title)
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description)
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl)
  }, [pathname, route?.slug, route?.tab])

  function handleInternalClick(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (!(event.target instanceof Element)) return
    const anchor = event.target.closest("a[href]") as HTMLAnchorElement | null
    if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return
    const url = new URL(anchor.href)
    if (url.origin !== window.location.origin || url.search || url.hash || !getRoute(url.pathname)) return
    event.preventDefault()
    if (url.pathname !== window.location.pathname) {
      window.history.pushState(null, "", url.pathname)
      setPathname(url.pathname)
    }
    setMobileMenuOpen(false)
  }

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
    <div onClick={handleInternalClick} className="flex min-h-screen overflow-x-clip md:h-screen md:overflow-hidden">
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
            <ContentPanel key={selectedPhoto} closeHref="/photography/">
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
            <ContentPanel key={selectedPublication} closeHref="/publications/">
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
