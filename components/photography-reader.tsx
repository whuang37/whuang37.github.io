import { photography } from "@/content/photography"

interface PhotographyReaderProps {
  slug: string
}

const imageModules = import.meta.glob("@/content/images/**/*.{png,jpg,jpeg,webp,gif,svg,JPG,JPEG,WEBP,GIF,SVG}", {
  eager: true,
  import: "default",
}) as Record<string, string>

function resolveContentImageSources(html: string): string {
  return html.replace(/src="(\/content\/images\/[^"]+)"/g, (_full, sourcePath: string) => {
    const targetSuffix = sourcePath.slice(1)
    const matched = Object.entries(imageModules).find(([modulePath]) => modulePath.endsWith(targetSuffix))
    return `src="${matched?.[1] ?? sourcePath}"`
  })
}

export function PhotographyReader({ slug }: PhotographyReaderProps) {
  const photo = photography.find((n) => n.slug === slug)

  if (!photo) return null

  const resolvedContent = resolveContentImageSources(photo.content)

  return (
    <article className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-muted-foreground photography-prose">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">{photo.date}</p>
      <h1 className="text-4xl font-serif mt-1 mb-8 text-foreground">{photo.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: resolvedContent }} />
    </article>
  )
}
