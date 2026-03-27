import { publications } from "@/content/publications"

interface PublicationReaderProps {
  slug: string
}

const pdfModules = import.meta.glob("@/content/pdfs/publications/*.pdf", {
  eager: true,
  import: "default",
}) as Record<string, string>

function getPdfUrl(pdfPath: string): string | null {
  const suffix = pdfPath
  const match = Object.entries(pdfModules).find(([modulePath]) => modulePath.endsWith(suffix))
  return match?.[1] ?? null
}

export function PublicationReader({ slug }: PublicationReaderProps) {
  const publication = publications.find((item) => item.slug === slug)
  if (!publication) return null

  const pdfUrl = getPdfUrl(publication.pdfPath)

  if (!pdfUrl) {
    return <p className="text-muted-foreground">PDF not found for this publication.</p>
  }

  const pdfViewerUrl = `${pdfUrl}#pagemode=none&navpanes=0&toolbar=1`

  return (
    <article className="h-full">
      <iframe src={pdfViewerUrl} title={`${publication.title} PDF`} className="w-full h-full border-0" />
    </article>
  )
}
