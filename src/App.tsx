import { useEffect, useRef, useState } from "react"
import type { MouseEvent, TouchEvent } from "react"
import { PanelLeftOpen } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { AboutSection } from "@/components/about-section"
import { PhotographyList } from "@/components/photography-list"
import { PublicationsList } from "@/components/publications-list"
import { PhotographyReader } from "@/components/photography-reader"
import { PublicationReader } from "@/components/publication-reader"
import { ContentPanel } from "@/components/content-panel"
import { PdfReader } from "@/components/pdf-reader"
import { ListDrawer } from "@/components/list-drawer"
import { ScrollArea } from "@/components/scroll-area"
import { photography } from "@/content/photography"
import { publications } from "@/content/publications"
import { useDrawerInteraction } from "@/hooks/use-drawer-interaction"

type Tab = "about" | "cv" | "publications" | "photography"
const SIDEBAR_WIDTH = 200

function getRoute(pathname: string): { tab: Tab; slug: string | null } | null {
  const parts = pathname.split("/").filter(Boolean)

  if (parts.length === 0) return { tab: "about", slug: null }
  if (parts.length === 1 && parts[0] === "cv") return { tab: "cv", slug: null }
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
  const drawer = useDrawerInteraction(route && (route.tab === "publications" || route.tab === "photography") && !route.slug ? route.tab : null)
  const swipeRef = useRef<{ x: number; y: number; time: number; menuOpen: boolean; drawerOpen: boolean } | null>(null)

  useEffect(() => {
    const onPopState = () => {
      const nextRoute = getRoute(window.location.pathname)
      setPathname(window.location.pathname)
      drawer.reset(nextRoute && (nextRoute.tab === "publications" || nextRoute.tab === "photography") && !nextRoute.slug ? nextRoute.tab : null)
      setMobileMenuOpen(false)
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [drawer.reset])

  useEffect(() => {
    const item = route?.slug && (route.tab === "publications" ? publications : photography).find((entry) => entry.slug === route.slug)
    const title = route?.tab === "cv" ? "Curriculum Vitae | William Huang" : item ? `${item.title} | William Huang` : route?.tab === "publications" ? "Publications | William Huang" : route?.tab === "photography" ? "Photography | William Huang" : "William Huang | HCI, Accessibility, and AI Researcher at UCLA"
    const description = route?.tab === "cv"
      ? "Curriculum vitae of William Huang, a UCLA researcher in HCI, AI, sensing, and accessibility."
      : route?.tab === "publications"
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
    const nextRoute = getRoute(url.pathname)
    drawer.reset(nextRoute && (nextRoute.tab === "publications" || nextRoute.tab === "photography") && !nextRoute.slug ? nextRoute.tab : null)
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    swipeRef.current = null
    if (!window.matchMedia("(max-width: 767px)").matches || event.touches.length !== 1) return
    if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable='true']")) return
    const touch = event.touches[0]
    if (!mobileMenuOpen && !drawer.tab && touch.clientX > 32) return
    swipeRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: performance.now(),
      menuOpen: mobileMenuOpen,
      drawerOpen: drawer.tab !== null,
    }
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start || event.changedTouches.length !== 1 || event.touches.length) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (performance.now() - start.time > 800 || Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx > 0 && start.x <= 32 && !start.menuOpen) {
      setMobileMenuOpen(true)
    } else if (dx < 0) {
      if (start.menuOpen) setMobileMenuOpen(false)
      else if (start.drawerOpen) drawer.close()
    }
  }

  const menuControl = (
    <button
      type="button"
      onClick={() => setMobileMenuOpen(true)}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-foreground/10 hover:text-foreground md:hidden"
      aria-label="Open menu"
      aria-expanded={mobileMenuOpen}
      aria-controls="site-sidebar"
    >
      <PanelLeftOpen className="h-6 w-6" />
    </button>
  )
  const mobileHeader = <header role="toolbar" aria-label="Navigation" className="flex h-14 shrink-0 items-center bg-background px-2 md:hidden">{menuControl}</header>

  return (
    <div
      onClick={handleInternalClick}
      onTouchStartCapture={handleTouchStart}
      onTouchEndCapture={handleTouchEnd}
      onTouchCancel={() => { swipeRef.current = null }}
      className="flex min-h-screen overflow-x-clip md:h-screen md:overflow-hidden"
    >
      <Sidebar
        activeTab={activeTab}
        width={SIDEBAR_WIDTH}
        mobileMenuOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        drawerTab={drawer.tab}
        onOpenDrawer={drawer.hover.enter}
        onCloseDrawer={drawer.hover.leave}
        onEnterDrawerButtons={drawer.hover.retain}
        onLeaveDrawerButtons={drawer.hover.leave}
        onCancelDrawerOpen={drawer.hover.cancelEnter}
        onToggleDrawer={(tab) => {
          drawer.toggle(tab)
          setMobileMenuOpen(false)
        }}
      />

      {!route ? (
        <main className="flex min-w-0 flex-1 flex-col">
          {mobileHeader}
          <div className="p-8 pt-14 md:p-16">
            <h1 className="text-4xl font-serif">Page not found</h1>
            <a href="/" className="mt-6 inline-block underline">Return home</a>
          </div>
        </main>
      ) : activeTab === "cv" ? (
        <ContentPanel document>
          <PdfReader src="/CV_WilliamHuang.pdf" title="William Huang — Curriculum Vitae" filename="William-Huang-CV.pdf" section="Curriculum Vitae" menuControl={menuControl} />
        </ContentPanel>
      ) : selectedPhoto ? (
        <ContentPanel key={selectedPhoto} menuControl={menuControl}>
          <PhotographyReader slug={selectedPhoto} />
        </ContentPanel>
      ) : selectedPublication ? (
        <ContentPanel key={selectedPublication} document>
          <PublicationReader slug={selectedPublication} menuControl={menuControl} />
        </ContentPanel>
      ) : activeTab !== "about" ? (
        <main className="flex min-w-0 flex-1 flex-col">
          {mobileHeader}
          <div className="p-8 pt-14 md:p-16">
            <h1 className="text-4xl font-serif">{activeTab === "publications" ? "Publications" : "Photography"}</h1>
            <button type="button" onClick={() => drawer.open(activeTab)} className="mt-6 underline underline-offset-4">
              Browse {activeTab}
            </button>
          </div>
        </main>
      ) : (
        <main className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col">
          {mobileHeader}
          <ScrollArea className="min-h-0 flex-1" label="About">
            <div className="flex min-h-full w-full max-w-3xl flex-col px-6 pt-14 pb-0 md:px-16 md:pt-16">
              <AboutSection />
            </div>
          </ScrollArea>
        </main>
      )}

      <ListDrawer
        menuControl={menuControl}
        sidebarWidth={SIDEBAR_WIDTH}
        title={drawer.tab === "photography" ? "Photography" : "Publications"}
        open={drawer.tab !== null}
        onClose={drawer.close}
        onHoverEnter={drawer.hover.retain}
        onHoverLeave={drawer.hover.leave}
        onHoverOutside={drawer.hover.leave}
      >
        {drawer.tab === "photography" ? (
          <PhotographyList selectedPhoto={selectedPhoto} />
        ) : (
          <PublicationsList selectedPublication={selectedPublication} />
        )}
      </ListDrawer>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-45 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  )
}
