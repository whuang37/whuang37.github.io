import { publications } from "@/content/publications"
import { PdfReader } from "./pdf-reader"
import type { ReactNode } from "react"

interface PublicationReaderProps {
  slug: string
  menuControl: ReactNode
}

const pdfModules = import.meta.glob("@/.tmp/optimized-pdfs/*.pdf", {
  eager: true,
  import: "default",
}) as Record<string, string>

function getPdfUrl(pdfPath: string): string | null {
  const suffix = pdfPath.replace("/content/pdfs/publications/", "/.tmp/optimized-pdfs/")
  const match = Object.entries(pdfModules).find(([modulePath]) => modulePath.endsWith(suffix))
  return match?.[1] ?? null
}

export function PublicationReader({ slug, menuControl }: PublicationReaderProps) {
  const publication = publications.find((item) => item.slug === slug)
  if (!publication) return null

  const pdfUrl = getPdfUrl(publication.pdfPath)

  if (!pdfUrl) {
    return <p className="text-muted-foreground">PDF not found for this publication.</p>
  }

  return <PdfReader src={pdfUrl} title={publication.title} filename={`${publication.slug}.pdf`} section="Publications" menuControl={menuControl} />
}
